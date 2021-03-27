import 'reflect-metadata';
import CookieParser from 'cookie-parser';
import cors from 'cors';
import {GraphQLSchema} from 'graphql';
import {GraphQLServer, Options} from 'graphql-yoga';
import {ContextParameters} from 'graphql-yoga/dist/types';
import 'reflect-metadata';
import * as TypeGraphQL from 'type-graphql';
import * as TypeORM from 'typeorm';
import {Container} from 'typeorm-typedi-extensions';
import {MySQLOptions} from './config/mysql';
import {DangleServerOptions} from './config/server';
import {CouponResolver} from './resolvers/coupon/CouponResolver';

export interface ServerDI {
  options: DangleServerOptions;
  graphQL?: GraphQLServer;
  mysqlConn?: TypeORM.Connection;
}

export interface PilotContext extends ContextParameters {
  di: ServerDI;
  adminId?: number;
  // admin?: Admin
}

export type ContextCreator = (ctx: ContextParameters) => Promise<PilotContext>;

const createContext = (di: ServerDI) => async (ctx: ContextParameters) => {
  const c = ctx as PilotContext;
  c.di = di;
  return c;
};

export default class Server {
  private _schema?: GraphQLSchema;

  di: ServerDI;

  constructor(options: DangleServerOptions) {
    this.di = {
      options,
    };
  }

  async buildGraphQLSchema() {
    this._schema = await TypeGraphQL.buildSchema({
      emitSchemaFile: true,
      validate: false,
      resolvers: [CouponResolver],
      container: Container,
      // authChecker: createAuthChecker(),
      authMode: 'null',
      // globalMiddlewares: [ErrorLoggerMiddleware],
    });
  }

  async createMySQLConnection() {
    TypeORM.useContainer(Container);
    this.di.mysqlConn = await TypeORM.createConnection(MySQLOptions);
  }

  async init() {
    await this.buildGraphQLSchema();
    await this.createMySQLConnection();

    const contextCreator: (ctx: ContextParameters) => Promise<PilotContext> = createContext(this.di);

    this.di.graphQL = new GraphQLServer({
      schema: this._schema as any,
      context: contextCreator,
      middlewares: [],
    });

    this.di.graphQL.express.use(
      cors({
        credentials: true,
        origin: this.di.options.CORS_ORIGIN,
      }),
    );

    this.di.graphQL.express.use(CookieParser());

    //
    // Rest API 형태로 제공해야 하는 것들을 마운트한다.
    //
    // this.di.graphQL.express.get(urlOnly(RESTUrl.exportAdvertiserCampaignList()), exportCampaignList(contextCreator));
  }

  async listen(options: Options = {}) {
    if (!this.di.graphQL) await this.init();
    return this.di.graphQL!.start(
      {
        ...options,
      },
      ({port}) => console.log(`Server started, listening on port ${port} for incoming requests.`),
    );
  }

  async teardown() {
    if (this.di.mysqlConn) await this.di.mysqlConn.close();
  }
}
