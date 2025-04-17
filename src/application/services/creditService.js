const Credit = require('../../domain/entities/credit');
const CreditType = require('../../domain/enums/creditType');
const { validateUUID } = require('../../common/validation');
const logger = require('../../common/logger');

class CreditService {
    constructor(creditRepository, customerRepository) {
        this.creditRepository = creditRepository;
        this.customerRepository = customerRepository;
    }

    async addCredit(customerId, amount, type) {
        if (!validateUUID(customerId)) {
            throw { status: 400, message: "Invalid customer ID format" };
        }

        if (typeof amount !== "number" || isNaN(amount) || amount === 0) {
            throw { status: 400, message: "Invalid credit amount" };
        }

        if (!Object.values(CreditType).includes(type)) {
            throw { status: 400, message: "Invalid credit type" };
        }

        if (type === CreditType.DEPOSIT && amount < 0) {
            throw { status: 400, message: "Deposit amount must be positive" };
        }

        if (type === CreditType.PURCHASE && amount > 0) {
            throw { status: 400, message: "Purchase amount must be negative" };
        }

        try {
            const customer = await this.customerRepository.findById(customerId);
            if (!customer) {
                throw { status: 404, message: "Customer not found" };
            }

            const finalAmount = type === CreditType.PURCHASE
                ? -Math.abs(amount)
                : Math.abs(amount);

            await this.customerRepository.updateCredit(customerId, finalAmount);

            const credit = new Credit({
                customerId,
                amount: finalAmount,
                type,
                createdAt: new Date()
            });

            await this.creditRepository.addCredit(credit);

            return credit;
        } catch (error) {
            logger.error(error);
            if (error.status && error.message) {throw error;}
            throw { status: 500, message: "An unexpected error occurred" };
        }
    }

    async getCreditsByCustomer(customerId) {
        if (!validateUUID(customerId)) {
            throw { status: 400, message: "Invalid customer ID format" };
        }

        try {
            return await this.creditRepository.listByCustomerId(customerId);
        } catch (error) {
            logger.error(error);
            throw { status: 500, message: "An unexpected error occurred" };
        }
    }
}

module.exports = CreditService;
