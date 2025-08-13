import { CONSTANTS } from 'src/config/constants';
import { DataSourceOptions } from 'typeorm';

const databaseConfig: DataSourceOptions = {
  database: process.env.DATABASE_NAME ?? CONSTANTS.DEFAULT.DATABASE_NAME,
  // entities: [],
  entities: [__dirname + '/../modules/**/entities/*.entity{.ts,.js}'],
  host: process.env.DATABASE_HOST ?? CONSTANTS.DEFAULT.DATABASE_HOST,
  // migrations: [],
  migrations: [__dirname + '/../**/migrations/*.migration{.ts,.js}'],
  password:
    process.env.DATABASE_PASSWORD ?? CONSTANTS.DEFAULT.DATABASE_PASSWORD,
  port:
    parseInt(process.env.DATABASE_PORT ?? `${CONSTANTS.DEFAULT.DATABASE_PORT}`, 10),
  // subscribers: [],
  subscribers: [__dirname + '/../**/subscribers/*.subscriber{.ts,.js}'],
  synchronize: false,
  type: (process.env.DATABASE_TYPE ?? CONSTANTS.DEFAULT.DATABASE_TYPE) as any,
  username: process.env.DATABASE_USER ?? CONSTANTS.DEFAULT.DATABASE_USER,
};

export { databaseConfig };
