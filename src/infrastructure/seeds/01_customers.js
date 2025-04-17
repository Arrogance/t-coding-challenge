exports.seed = async function (knex) {
    // Deletes ALL existing entries
    await knex('customers').del();

    // Inserts seed entries
    await knex('customers').insert([
        { id: '550e8400-e29b-41d4-a716-446655440000', name: 'John Doe', email: 'john@example.com', phone: '+123456789', address: '123 Main St, City', available_credit: 500, created_at: new Date(), updated_at: new Date() },
        { id: '550e8400-e29b-41d4-a716-446655440001', name: 'Jane Doe', email: 'jane@example.com', phone: '+987654321', address: '456 Elm St, Town', available_credit: 1000, created_at: new Date(), updated_at: new Date() },
        { id: '550e8400-e29b-41d4-a716-446655440002', name: 'Alice Smith', email: 'alice@example.com', phone: '+1122334455', address: '789 Oak St, Village', available_credit: 250, created_at: new Date(), updated_at: new Date() }
    ]);
};
