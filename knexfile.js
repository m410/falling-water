// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      host: '127.0.0.1',
      database: 'falling_water',
      user: 'fallingwater',
      password: 'Password$1'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      extension: 'ts'    
  }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'falling_water',
      user: 'fallingwater',
      password: 'Password$1'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      extension: 'ts'    
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'falling_water',
      user: 'fallingwater',
      password: 'Password$1'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      extension: 'ts'    
    }
  }

};
