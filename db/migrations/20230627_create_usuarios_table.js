exports.up = function (knex) {
    return knex.schema.createTable('usuarios', function (table) {
        table.increments('id');
        table.text('name', 100).notNullable();
        table.text('username', 25).unique().notNullable();
        table.text('email', 100).unique().notNullable();
        table.text('password', 200).notNullable();
        table.text('roles', 200).notNullable();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('usuarios');
};