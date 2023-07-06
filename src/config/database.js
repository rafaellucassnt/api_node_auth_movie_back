const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './db/nodeflix.db',
  },
  useNullAsDefault: true,
});

module.exports = knex;
