require('babel-register');
require('dotenv').config({ path: __dirname + '/../.env' });

/**
 * Database configuration.
 */
module.exports = {
  client: process.env.DB_CLIENT,
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSEORD,
    database: process.env.DB_NAME
  },
  useNullAsDefault: true,
  migrations: {
    tableName: 'migrations',
    directory: './migrations',
    stub: './stubs/migration.stub'
  },
  seeds: {
    directory: './seeds',
    stub: './stubs/seed.stub'
  }
};
