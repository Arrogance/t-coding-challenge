const { validate: isValidUUID } = require('uuid');

class CreditController {
    constructor(creditService) {
        this.creditService = creditService;
    }

    async addCredit(req, res) {
        try {
            const { amount, type } = req.body;
            const { customerId } = req.params;

            if (!isValidUUID(customerId)) {
                return res.status(400).json({ error: "Invalid customer ID format" });
            }

            const credit = await this.creditService.addCredit(customerId, amount, type);
            res.status(201).json(credit);
        } catch (error) {
            res.status(error.status || 500).json({ error: error.message });
        }
    }

    async getCreditsByCustomer(req, res) {
        try {
            const { customerId } = req.params;
            if (!isValidUUID(customerId)) {
                return res.status(400).json({ error: "Invalid customer ID format" });
            }

            const credits = await this.creditService.getCreditsByCustomer(customerId);
            res.status(200).json(credits);
        } catch (error) {
            res.status(error.status || 500).json({ error: error.message });
        }
    }
}

module.exports = CreditController;
