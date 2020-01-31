import { config } from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const { IS_IN_DOCKER } = process.env;

export const output = IS_IN_DOCKER === 'true' ? {} : config();

const { DB_PORT, DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME, DB_SYNC } = process.env;

export const typeOrmOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities: [ `${ __dirname }/**/*.entity{.ts,.js}` ],
  synchronize: DB_SYNC === 'true',
  uuidExtension: 'pgcrypto',
};
