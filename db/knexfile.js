const path = require('path');

/** @type {import('knex').Knex.Config} */
const base = {
  migrations: {
    directory: path.join(__dirname, 'migrations'),
    tableName:  'knex_migrations',
  },
  seeds: {
    directory: path.join(__dirname, 'seeds'),
  },
};

module.exports = {
  development: {
    ...base,
    client: 'better-sqlite3',
    connection: {
      filename: path.join(__dirname, '../data/miclean.sqlite3'),
    },
    useNullAsDefault: true,
  },

  production: {
    ...base,
    client: 'better-sqlite3',        // swap to 'pg' + connection string for PostgreSQL
    connection: {
      filename: path.join(__dirname, '../data/miclean.sqlite3'),
    },
    useNullAsDefault: true,
    pool: { min: 1, max: 1 },        // SQLite is single-writer; increase for pg
  },
};
