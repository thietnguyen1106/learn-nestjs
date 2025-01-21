import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CONSTANTS } from './constants';
import { User } from '../modules/users/entities/user.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  autoLoadEntities: true,
  database: process.env.DATABASE_NAME ?? CONSTANTS.DEFAULT.DATABASE_NAME,
  entities: [User],
  host: process.env.DATABASE_HOST ?? CONSTANTS.DEFAULT.DATABASE_HOST,
  migrations: [],
  password:
    process.env.DATABASE_PASSWORD ?? CONSTANTS.DEFAULT.DATABASE_PASSWORD,
  port:
    parseInt(process.env.DATABASE_PORT, 10) ?? CONSTANTS.DEFAULT.DATABASE_PORT,
  subscribers: [],
  synchronize: true,
  type: (process.env.DATABASE_TYPE ?? CONSTANTS.DEFAULT.DATABASE_TYPE) as any,
  username: process.env.DATABASE_USER ?? CONSTANTS.DEFAULT.DATABASE_USER,
};
