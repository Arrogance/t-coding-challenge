const { validate: isValidUUID } = require('uuid');

class CustomerController {
    constructor(customerService) {
        this.customerService = customerService;
    }

    async getCustomerById(req, res) {
        try {
            if (!isValidUUID(req.params.id)) {
                return res.status(400).json({ error: "Invalid customer ID format" });
            }

            const customer = await this.customerService.getCustomerById(req.params.id);

            if (!customer) {
                return res.status(404).json({ message: 'Customer not found' });
            }

            res.json(customer);
        } catch (error) {
            res.status(error.status || 500).json({ error: error.message });
        }
    }

    async createCustomer(req, res) {
        try {
            const customer = await this.customerService.createCustomer(req.body);
            res.status(201).json(customer);
        } catch (error) {
            res.status(error.status || 500).json({ error: error.message });
        }
    }

    async updateCustomer(req, res) {
        try {
            if (!isValidUUID(req.params.id)) {
                return res.status(400).json({ error: "Invalid customer ID format" });
            }

            await this.customerService.updateCustomer(req.params.id, req.body);
            res.status(200).json();
        } catch (error) {
            res.status(error.status || 500).json({ error: error.message });
        }
    }

    async deleteCustomer(req, res) {
        try {
            if (!isValidUUID(req.params.id)) {
                return res.status(400).json({ error: "Invalid customer ID format" });
            }

            await this.customerService.deleteCustomer(req.params.id);
            res.status(204).json();
        } catch (error) {
            res.status(error.status || 500).json({ error: error.message });
        }
    }

    async restoreCustomer(req, res) {
        try {
            if (!isValidUUID(req.params.id)) {
                return res.status(400).json({ error: "Invalid customer ID format" });
            }

            await this.customerService.restoreCustomer(req.params.id);
            res.status(204).json();
        } catch (error) {
            res.status(error.status || 500).json({ error: error.message });
        }
    }

    async listCustomersSortedByCredit(req, res) {
        try {
            const customers = await this.customerService.listCustomersSortedByCredit();
            res.json(customers);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = CustomerController;
