const Customer = require('../../../src/domain/entities/customer');
const CustomerRepository = require('../../../src/domain/repositories/customerRepository');
const { v4: uuidv4 } = require('uuid');

class MockCustomerRepository extends CustomerRepository {
    constructor() {
        super();
        this.customers = new Map(); // Key: id, Value: Customer
    }

    async findById(id) {
        const customer = this.customers.get(id);
        return customer && !customer.is_deleted ? customer : null;
    }

    async create(data) {
        const id = data.id || uuidv4();
        if ([...this.customers.values()].some(c => c.email === data.email)) {
            const err = new Error("DB_UNIQUE_CONSTRAINT");
            err.code = "23505";
            throw err;
        }

        const customer = new Customer({ ...data, id, is_deleted: false });
        this.customers.set(id, customer);
        return customer;
    }

    async update(id, data) {
        const existing = await this.findById(id);
        if (!existing) {return null;}

        //  Add email uniqueness validation
        if (data.email) {
            const emailInUse = [...this.customers.values()].some(
                c => !!c && c.email === data.email && c.id !== id
            );

            if (emailInUse) {
                const err = new Error(DB_ERRORS.UNIQUE_VIOLATION);
                err.code = "23505";
                throw err;
            }
        }

        const updated = {
            ...existing,
            ...data,
            updated_at: new Date()
        };

        this.customers.set(id, updated);
        return updated;
    }

    async updateCredit(id, amount) {
        const existing = await this.findById(id);
        if (!existing) {throw new Error("Customer not found");}

        const updated = new Customer({
            ...existing,
            available_credit: existing.available_credit + amount,
            updated_at: new Date()
        });

        this.customers.set(id, updated);
        return updated;
    }

    async delete(id) {
        const customer = this.customers.get(id);
        if (!customer) {throw new Error("Customer not found");}

        customer.is_deleted = true;
        customer.updated_at = new Date();
        return customer;
    }

    async restore(id) {
        const customer = this.customers.get(id);
        if (!customer || !customer.is_deleted) {
            throw new Error("Customer not found or already active");
        }

        customer.is_deleted = false;
        customer.updated_at = new Date();
        return customer;
    }

    async listSortedByCredit() {
        return [...this.customers.values()]
            .filter(c => !c.is_deleted)
            .sort((a, b) => b.available_credit - a.available_credit);
    }
}

module.exports = MockCustomerRepository;
