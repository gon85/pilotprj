import {Server} from 'http';
import {default as request, Response} from 'supertest';
import {ServerOptions} from '../src/config/server';
import PilotServer from '../src/server';

let server: PilotServer;
let app: Server;

const getDI = () => server.di;

const beforeAll = async () => {
  server = new PilotServer(ServerOptions);
  await server.init();
  app = server.di.graphQL!.createHttpServer({});
};

const afterAll = async () => {
  await server.teardown();
};

const beforeEach = async () => {
  await getDI().mysqlConn!.dropDatabase();
  await getDI().mysqlConn!.synchronize();
};

const afterEach = async () => {};

export const tester = {
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
};

export const doGQLQuery = async (query: string, variables: object = {}) => {
  const req = request(app).post('/').set('Accept', 'application/json');
  const res = await req.send({query, variables});
  return res;
};
