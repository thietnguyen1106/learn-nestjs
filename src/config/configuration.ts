import { CONSTANTS } from './constants';
import { databaseConfig } from './database';

export default () => ({
  database: databaseConfig,
  port: parseInt(process.env.PORT, 10) ?? CONSTANTS.DEFAULT.APP_PORT,
});
