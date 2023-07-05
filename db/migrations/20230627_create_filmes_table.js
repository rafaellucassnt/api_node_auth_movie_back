exports.up = function (knex) {
    return knex.schema.createTable('filmes', function (table) {
        table.increments('id').primary();
        table.text('title', 200).notNullable();
        table.text('debut', 10).notNullable();
        table.text('genre', 200).notNullable();
        table.integer('duration').notNullable();
        table.text('origin', 200).notNullable();
        table.text('direction', 100).notNullable();
        table.text('script', 200).notNullable();
        table.text('distributor', 200).notNullable();
        table.integer('classification').notNullable();
        table.integer('year').notNullable();
        table.text('synopsis', 3000).notNullable();
        table.text('img').notNullable();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('filmes');
};