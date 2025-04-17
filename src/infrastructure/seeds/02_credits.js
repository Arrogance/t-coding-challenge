const { v4: uuidv4 } = require('uuid');
const CreditType = require('../../domain/enums/creditType');

exports.seed = async function (knex) {
    // Deletes ALL existing entries
    await knex('credits').del();

    // Inserts seed entries
    await knex('credits').insert([
        { id: uuidv4(), customer_id: '550e8400-e29b-41d4-a716-446655440000', amount: 100, type: CreditType.DEPOSIT, created_at: new Date() },
        { id: uuidv4(), customer_id: '550e8400-e29b-41d4-a716-446655440000', amount: -50, type: CreditType.PURCHASE, created_at: new Date() },
        { id: uuidv4(), customer_id: '550e8400-e29b-41d4-a716-446655440001', amount: 200, type: CreditType.DEPOSIT, created_at: new Date() },
        { id: uuidv4(), customer_id: '550e8400-e29b-41d4-a716-446655440001', amount: -100, type: CreditType.PURCHASE, created_at: new Date() },
        { id: uuidv4(), customer_id: '550e8400-e29b-41d4-a716-446655440002', amount: 50, type: CreditType.DEPOSIT, created_at: new Date() }
    ]);
};
