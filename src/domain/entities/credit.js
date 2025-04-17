class Credit {
    constructor({ id, customerId, amount, type, createdAt }) {
        this.id = id;
        this.customerId = customerId;
        this.amount = amount;
        this.type = type;
        this.createdAt = createdAt || new Date();
    }

    static validateType(type) {
        const validTypes = ['deposit', 'purchase', 'refund'];
        if (!validTypes.includes(type)) {
            throw new Error(`Invalid credit type: ${type}`);
        }
    }
}

module.exports = Credit;
