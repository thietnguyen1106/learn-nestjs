const COMPARE_TYPES = {
  AND: 'and',
  OR: 'or',
};

const SKIP_AUTH_META_DATA_KEY = 'skip_auth';
const PERMISSION_META_DATA_KEY = 'permissions';

const PERMISSION_AUTH = {
  ALL: 'ALL',
  MOVIE: {
    CREATE: 'MOVIE.CREATE',
    DELETE: 'MOVIE.DELETE',
    UPDATE: 'MOVIE.UPDATE',
    VIEW: {
      ALL: 'MOVIE.VIEW.ALL',
      MULTIPLE: 'MOVIE.VIEW.MULTIPLE',
    },
  },
  PERMISSION: {
    CREATE: 'PERMISSION.CREATE',
    DELETE: 'PERMISSION.DELETE',
    UPDATE: 'PERMISSION.UPDATE',
    VIEW: {
      ALL: 'PERMISSION.VIEW.ALL',
      MULTIPLE: 'PERMISSION.VIEW.MULTIPLE',
    },
  },
  ROLE: {
    CREATE: 'ROLE.CREATE',
    DELETE: 'ROLE.DELETE',
    UPDATE: 'ROLE.UPDATE',
    VIEW: {
      ALL: 'ROLE.VIEW.ALL',
      MULTIPLE: 'ROLE.VIEW.MULTIPLE',
    },
  },
  USER: {
    CREATE: 'USER.CREATE',
    DELETE: 'USER.DELETE',
    UPDATE: 'USER.UPDATE',
    VIEW: {
      ALL: 'USER.VIEW.ALL',
      MULTIPLE: 'USER.VIEW.MULTIPLE',
    },
  },
};

export {
  COMPARE_TYPES,
  SKIP_AUTH_META_DATA_KEY,
  PERMISSION_META_DATA_KEY,
  PERMISSION_AUTH,
};
