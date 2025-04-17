exports.up = async function(knex) {
    await knex.schema.createTable('customers', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        table.string('name').notNullable();
        table.string('email').notNullable().unique();
        table.string('phone').nullable();
        table.text('address').nullable();
        table.decimal('available_credit', 10, 2).notNullable().defaultTo(0);
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });

    await knex.schema.createTable('credits', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        table.uuid('customer_id').notNullable().references('id').inTable('customers').onDelete('CASCADE');
        table.decimal('amount', 10, 2).notNullable();
        table.enu('type', ['deposit', 'purchase', 'refund']).notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = async function(knex) {
    await knex.schema.dropTableIfExists('credits');
    await knex.schema.dropTableIfExists('customers');
};
