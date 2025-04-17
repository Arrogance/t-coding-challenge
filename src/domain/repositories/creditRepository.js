class CreditRepository {
    /**
     * Adds a credit transaction.
     * @param {Credit} credit - The credit entity.
     * @returns {Promise<Credit>}
     */
    async addCredit(credit) {
        this._credit = credit;
        throw new Error("Method not implemented");
    }

    /**
     * Lists all credit transactions for a specific customer.
     * @param {string} customerId - The customer ID.
     * @returns {Promise<Credit[]>}
     */
    async listByCustomerId(customerId) {
        this._customerId = customerId;
        throw new Error("Method not implemented");
    }
}

module.exports = CreditRepository;
