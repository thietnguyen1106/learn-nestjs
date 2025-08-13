const CONSTANTS = {
  DEFAULT: {
    APP_PORT: 3333,
    DATABASE_TYPE: 'mysql',
    DATABASE_HOST: 'mysql',
    DATABASE_PORT: 3306,
    DATABASE_NAME: 'learn_nestjs',
    DATABASE_USER: 'root',
    DATABASE_PASSWORD: 'root',
  },
  SENSITIVE_FIELDS: [
    'password',
    'salt',
    'resetPasswordToken',
    'xToken',
    'xRefetchToken',
    'xRefetchTokenExpirationTime',
  ],
};

export { CONSTANTS };
