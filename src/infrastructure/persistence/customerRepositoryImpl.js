const knex = require('../db');
const CustomerRepository = require('../../domain/repositories/customerRepository');
const Customer = require('../../domain/entities/customer');
const { DB_ERRORS } = require("../errors/errorCodes");

class CustomerRepositoryImpl extends CustomerRepository {
    formatCustomer(customer) {
        if (!customer) {return null;}
        return new Customer({
            id: customer.id,
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            address: customer.address,
            available_credit: parseFloat(customer.available_credit),
            created_at: customer.created_at,
            updated_at: customer.updated_at,
        });
    }

    async findById(id) {
        const customer = await knex('customers').where({ id, is_deleted: false }).first();
        return this.formatCustomer(customer);
    }

    async create(data) {
        return knex.transaction(async (trx) => {
            try {
                const [customer] = await trx('customers')
                    .insert(data)
                    .returning('*');

                return this.formatCustomer(customer);
            } catch (error) {
                if (error.code === "23505") {
                    throw new Error(DB_ERRORS.UNIQUE_VIOLATION);
                }
                throw error;
            }
        });
    }

    async update(id, data) {
        return knex.transaction(async (trx) => {
            try {
                await trx('customers')
                    .where({ id, is_deleted: false })
                    .update({ ...data, updated_at: knex.fn.now() });

                const updatedCustomer = await trx('customers').where({ id, is_deleted: false }).first();
                return this.formatCustomer(updatedCustomer);
            } catch (error) {
                if (error.code === "23505") {
                    throw new Error(DB_ERRORS.UNIQUE_VIOLATION);
                }
                throw error;
            }
        });
    }

    async updateCredit(id, amount) {
        if (!id) { throw new Error("Customer ID is required"); }
        if (amount === undefined || amount === null) { throw new Error("Amount is required"); }

        return knex.transaction(async (trx) => {
            const updatedRows = await trx('customers')
                .where({ id })
                .forUpdate()
                .update({
                    available_credit: knex.raw('available_credit + ?', [amount]),
                    updated_at: knex.fn.now(),
                });

            if (updatedRows === 0) { throw new Error('Customer not found'); }

            const updatedCustomer = await trx('customers').where({ id }).first();
            return this.formatCustomer(updatedCustomer);
        });
    }

    async listSortedByCredit() {
        const customers = await knex('customers').where({ is_deleted: false }).orderBy('available_credit', 'desc');
        return customers.map(this.formatCustomer);
    }

    async delete(id) {
        if (!id) { throw new Error("Customer ID is required"); }

        return knex.transaction(async (trx) => {
            const updatedRows = await trx('customers')
                .where({ id })
                .forUpdate()
                .update({
                    is_deleted: true,
                    updated_at: knex.fn.now()
                });

            if (updatedRows === 0) { throw new Error('Customer not found'); }

            const deletedCustomer = await trx('customers').where({ id }).first();
            return this.formatCustomer(deletedCustomer);
        });
    }

    async restore(id) {
        if (!id) { throw new Error("Customer ID is required"); }

        return knex.transaction(async (trx) => {
            const updatedRows = await trx('customers')
                .where({ id, is_deleted: true })
                .update({ is_deleted: false, updated_at: knex.fn.now() });

            if (updatedRows === 0) { throw new Error("Customer not found or already active"); }

            const restoredCustomer = await trx('customers').where({ id, is_deleted: false }).first();
            return this.formatCustomer(restoredCustomer);
        });
    }
}

module.exports = CustomerRepositoryImpl;
