import path from 'path';

export interface DangleServerOptions {
  PORT: number;
  SERVER_URL: string;
  CORS_ORIGIN: Array<string>;
}

export const ServerOptions: DangleServerOptions = (function (): DangleServerOptions {
  switch (process.env.ENV) {
    default:
      return {
        PORT: 8088,
        SERVER_URL: 'http://localhost:8088',
        CORS_ORIGIN: ['https://localhost:3000', 'http://localhost:3000'],
      };
  }
})();

export const TIME_ZONE = 'Asia/Seoul';
