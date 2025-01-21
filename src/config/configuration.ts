import { CONSTANTS } from 'src/config/constants';
import { databaseConfig } from 'src/config/database';

export default () => ({
  autoLoadEntities: true,
  database: databaseConfig,
  port: parseInt(process.env.PORT, 10) ?? CONSTANTS.DEFAULT.APP_PORT,
});
