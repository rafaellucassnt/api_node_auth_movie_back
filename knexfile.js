module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './db/nodeflix.db',
    },
    migrations: {
      directory: './db/migrations',
    },
    useNullAsDefault: true,
  },
};
