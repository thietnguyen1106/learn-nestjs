const CONSTANTS = {
  DEFAULT: {
    APP_PORT: 3306,
    DATABASE_HOST: 'localhost',
    DATABASE_NAME: 'learn-nestjs',
    DATABASE_PASSWORD: '',
    DATABASE_PORT: 3306,
    DATABASE_TYPE: 'mysql',
    DATABASE_USER: 'root',
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
