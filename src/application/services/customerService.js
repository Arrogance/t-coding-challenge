const Customer = require("../../domain/entities/customer");
const { DB_ERRORS } = require("../../infrastructure/errors/errorCodes");
const { validateUUID, validateEmail } = require("../../common/validation");
const logger = require("../../common/logger");

class CustomerService {
    constructor(customerRepository) {
        this.customerRepository = customerRepository;
    }

    sanitizeData(data) {
        const allowedFields = Object.keys(new Customer({}));
        return Object.keys(data)
            .filter(key => allowedFields.includes(key))
            .reduce((obj, key) => {
                obj[key] = data[key];
                return obj;
            }, {});
    }

    async getCustomerById(id) {
        if (!validateUUID(id)) {
            throw { status: 400, message: "Invalid customer ID format" };
        }

        const customer = await this.customerRepository.findById(id);
        if (!customer) {
            throw { status: 404, message: "Customer not found" };
        }

        return customer;
    }

    async createCustomer(data) {
        const sanitizedData = this.sanitizeData(data);

        if (!sanitizedData.name || !sanitizedData.email) {
            throw { status: 400, message: "Name and email are required" };
        }

        if (!validateEmail(sanitizedData.email)) {
            throw { status: 400, message: "Invalid email format" };
        }

        try {
            return await this.customerRepository.create(sanitizedData);
        } catch (error) {
            logger.error(error);

            if (error.message === DB_ERRORS.UNIQUE_VIOLATION) {
                throw { status: 400, message: "Email is already in use" };
            }

            throw { status: 500, message: "An unexpected error occurred" };
        }
    }

    async updateCustomer(id, data) {
        if (!validateUUID(id)) {
            throw { status: 400, message: "Invalid customer ID format" };
        }

        const sanitizedData = this.sanitizeData(data);

        if (sanitizedData.email && !validateEmail(sanitizedData.email)) {
            throw { status: 400, message: "Invalid email format" };
        }

        const customer = await this.customerRepository.findById(id);
        if (!customer || customer.is_deleted) {
            return null;
        }

        try {
            return await this.customerRepository.update(id, sanitizedData);
        } catch (error) {
            if (error.code === "23505" || error.message === DB_ERRORS.UNIQUE_VIOLATION) {
                throw { status: 400, message: "Email is already in use" };
            }
            throw { status: 500, message: "An unexpected error occurred" };
        }
    }

    async deleteCustomer(id) {
        if (!validateUUID(id)) {
            throw { status: 400, message: "Invalid customer ID format" };
        }

        try {
            await this.customerRepository.delete(id);
        } catch (error) {
            logger.error(error);

            if (error.message === "Customer not found") {
                throw { status: 404, message: error.message };
            }

            throw { status: 500, message: "An unexpected error occurred" };
        }
    }

    async restoreCustomer(id) {
        if (!validateUUID(id)) {
            throw { status: 400, message: "Invalid customer ID format" };
        }

        try {
            return await this.customerRepository.restore(id);
        } catch (error) {
            logger.error(error);

            if (error.message === "Customer not found or already active") {
                throw { status: 404, message: error.message };
            }

            throw { status: 500, message: "An unexpected error occurred" };
        }
    }

    async listCustomersSortedByCredit() {
        return this.customerRepository.listSortedByCredit();
    }
}

module.exports = CustomerService;
