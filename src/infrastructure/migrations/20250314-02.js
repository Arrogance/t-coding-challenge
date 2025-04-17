exports.up = function (knex) {
    return knex.schema.alterTable('customers', (table) => {
        table.boolean('is_deleted').defaultTo(false);
    });
};

exports.down = function (knex) {
    return knex.schema.alterTable('customers', (table) => {
        table.dropColumn('is_deleted');
    });
};
