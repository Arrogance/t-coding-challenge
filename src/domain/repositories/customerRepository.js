class CustomerRepository {
    /**
     * Finds a customer by ID.
     * @param {string} id - The customer ID.
     * @returns {Promise<Customer|null>}
     */
    async findById(id) {
        this._id = id;
        throw new Error("Method not implemented");
    }

    /**
     * Creates a new customer.
     * @param {Customer} customer - The customer entity.
     * @returns {Promise<Customer>}
     */
    async create(customer) {
        this._customer = customer;
        throw new Error("Method not implemented");
    }

    /**
     * Updates customer fields.
     * @param {string} id - The customer ID.
     * @param {object} data - Fields to update.
     * @returns {Promise<Customer>}
     */
    async update(id, data) {
        this._id = id;
        this._data = data;
        throw new Error("Method not implemented");
    }

    /**
     * Updates a customer's available credit.
     * @param {string} id - The customer ID.
     * @param {number} amount - The new credit amount.
     * @returns {Promise<>}
     */
    async updateCredit(id, amount) {
        this._id = id;
        this._amount = amount;
        throw new Error("Method not implemented");
    }

    /**
     * Lists all customers, optionally sorted by available credit.
     * @returns {Promise<Customer[]>}
     */
    async listSortedByCredit() {
        throw new Error("Method not implemented");
    }

    /**
     * Soft-deletes a customer.
     * @param {string} id - The customer ID.
     * @returns {Promise<>}
     */
    async delete(id) {
        this._id = id;
        throw new Error("Method not implemented");
    }

    /**
     * Restores a soft-deleted customer.
     * @param {string} id - The customer ID.
     * @returns {Promise<>}
     */
    async restore(id) {
        this._id = id;
        throw new Error("Method not implemented");
    }
}

module.exports = CustomerRepository;
