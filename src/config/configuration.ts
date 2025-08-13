import { CONSTANTS } from 'src/config/constants';
import { databaseConfig } from 'src/config/database';

export default () => ({
  autoLoadEntities: true,
  database: databaseConfig,
  port: parseInt(process.env.PORT ?? `${CONSTANTS.DEFAULT.APP_PORT}`, 10),
});
