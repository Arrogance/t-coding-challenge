const Credit = require('../../../src/domain/entities/credit');
const CreditRepository = require('../../../src/domain/repositories/creditRepository');
const { v4: uuidv4 } = require('uuid');

class MockCreditRepository extends CreditRepository {
    constructor() {
        super();
        this.credits = [];
    }

    async addCredit(credit) {
        const newCredit = new Credit({
            ...credit,
            id: credit.id || uuidv4(),
            createdAt: credit.createdAt || new Date()
        });

        this.credits.push(newCredit);
        return newCredit;
    }

    async listByCustomerId(customerId) {
        return this.credits
            .filter(c => c.customerId === customerId)
            .sort((a, b) => b.createdAt - a.createdAt);
    }
}

module.exports = MockCreditRepository;
