export default () => {
  return {
    production: false,
    port: parseInt(process.env.PORT, 10) || 3000,
    refreshTokenExpireTime: process.env.REFRESH_TOKEN_EXPIRE_TIME,
    jwtTokenExpireTime: process.env.JWT_TOKEN_EXPIRE_TIME,
    secrets: {
      password: process.env.PASSWORD_SECRET,
      jwt: process.env.JWT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN_SECRET,
      cookie: process.env.COOKIE_SECRET,
    },
    database: {
      type: process.env.DATABASE_TYPE,
      url: process.env.DATABASE_URL,
    },
  };
};
