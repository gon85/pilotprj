import {ServerOptions} from './config/server';
import Server from './server';

const startServer = async () => {
  const s = new Server(ServerOptions);
  await s.init();
  return s.listen({
    cors: {
      credentials: true,
      origin: ServerOptions.CORS_ORIGIN,
    },
    port: ServerOptions.PORT,
    bodyParserOptions: {limit: '1mb'},
    formatError: (error: any) => {
      console.warn(error);
      return error;
    },
    formatResponse: (response: any, query: any) => {
      console.log('GraphQL query and variables', {
        query: query.query,
        vars: query.variables,
      });
      return response;
    },
  });
};

startServer().catch((e) => {
  console.error(e);
  process.exit(1);
});
