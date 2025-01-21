import { User } from 'src/modules/users/entities/user.entity';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  database: 'learn-nestjs',
  entities: [User],
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
