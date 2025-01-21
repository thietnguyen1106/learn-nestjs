import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CONSTANTS } from 'src/config/constants';
import { User } from 'src/modules/users/entities/user.entity';
import { Role } from 'src/modules/roles/entities/role.entity';
import { Permission } from 'src/modules/permissions/entities/permission.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  database: process.env.DATABASE_NAME ?? CONSTANTS.DEFAULT.DATABASE_NAME,
  entities: [User, Role, Permission],
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
