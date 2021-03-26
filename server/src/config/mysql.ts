import {ConnectionOptions} from 'typeorm';
import {Coupon} from '../entities/coupon/Coupon';

const entities = [Coupon];

export const MySQLOptions: ConnectionOptions = (function (): ConnectionOptions {
  switch (process.env.ENV) {
    default:
      return {
        type: 'mysql',
        database: 'pilot',
        username: 'root',
        password: 'test',
        port: 3307,
        host: 'localhost',
        entities,
        logging: false,
        cache: true,
        dropSchema: process.env.NODE_ENV === 'test',
        synchronize: process.env.NODE_ENV !== 'test',
      };
  }
})();
