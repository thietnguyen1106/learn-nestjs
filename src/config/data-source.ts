import { DataSource } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Role } from 'src/modules/roles/entities/role.entity';
import { Permission } from 'src/modules/permissions/entities/permission.entity';

export const AppDataSource = new DataSource({
  database: 'learn-nestjs',
  entities: [User, Role, Permission],
  host: 'localhost',
  logging: true,
  migrations: ['src/migration/*.ts'],
  password: '',
  port: 3306,
  subscribers: [],
  synchronize: true,
  type: 'mysql',
  username: 'root',
});
