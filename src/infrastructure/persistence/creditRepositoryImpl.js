const knex = require('../db');
const CreditRepository = require('../../domain/repositories/creditRepository');
const Credit = require('../../domain/entities/credit');

class CreditRepositoryImpl extends CreditRepository {
    static formatCredit(credit) {
        if (!credit) {return null;}

        return new Credit({
            id: credit.id,
            customerId: credit.customer_id,
            amount: parseFloat(credit.amount),
            type: credit.type,
            createdAt: credit.created_at,
        });
    }

    async addCredit(credit) {
        return knex.transaction(async (trx) => {
            const [newCredit] = await trx('credits')
                .insert({
                    id: credit.id,
                    customer_id: credit.customerId,
                    amount: parseFloat(credit.amount),
                    type: credit.type,
                    created_at: credit.createdAt,
                })
                .returning('*');

            if (!newCredit) {
                throw new Error("Failed to insert credit");
            }

            return CreditRepositoryImpl.formatCredit(newCredit);
        });
    }

    async listByCustomerId(customerId) {
        const credits = await knex('credits')
            .where({ customer_id: customerId })
            .orderBy('created_at', 'desc');

        return credits.map(CreditRepositoryImpl.formatCredit);
    }
}

module.exports = CreditRepositoryImpl;
