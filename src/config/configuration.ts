import databaseConfig from './database.config';

console.log('databaseConfig', databaseConfig);

export default () => ({
  port: parseInt(process.env.PORT),
  nodeEnv: process.env.NODE_ENV,
  database: databaseConfig,
  jwtSecret: process.env.JWT_SECRET,
});
