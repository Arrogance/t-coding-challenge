const CustomerService = require('../../../src/application/services/customerService');
const Customer = require('../../../src/domain/entities/customer');
const { DB_ERRORS } = require('../../../src/infrastructure/errors/errorCodes');
const { validateUUID, validateEmail } = require('../../../src/common/validation');
const logger = require('../../../src/common/logger');

jest.mock('../../../src/common/logger');
jest.mock('../../../src/common/validation', () => ({
    validateUUID: jest.fn(),
    validateEmail: jest.fn(),
}));

describe('CustomerService', () => {
    let customerRepository;
    let customerService;

    const validId = '123e4567-e89b-12d3-a456-426614174000';
    const sampleCustomer = { id: validId, name: 'John Doe', email: 'john@example.com' };

    beforeEach(() => {
        customerRepository = {
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            restore: jest.fn(),
            listSortedByCredit: jest.fn(),
        };

        customerService = new CustomerService(customerRepository);
        validateUUID.mockImplementation(id => id === validId);
        validateEmail.mockImplementation(email => /@/.test(email));
    });

    describe('getCustomerById', () => {
        it('should return customer if valid ID and found', async () => {
            customerRepository.findById.mockResolvedValue(sampleCustomer);
            const result = await customerService.getCustomerById(validId);
            expect(result).toEqual(sampleCustomer);
        });

        it('should throw 400 for invalid UUID', async () => {
            validateUUID.mockReturnValue(false);
            await expect(customerService.getCustomerById('bad-id')).rejects.toEqual({
                status: 400,
                message: 'Invalid customer ID format',
            });
        });

        it('should throw 404 if not found', async () => {
            customerRepository.findById.mockResolvedValue(null);
            await expect(customerService.getCustomerById(validId)).rejects.toEqual({
                status: 404,
                message: 'Customer not found',
            });
        });
    });

    describe('createCustomer', () => {
        it('should create and return new customer', async () => {
            customerRepository.create.mockResolvedValue(sampleCustomer);
            const result = await customerService.createCustomer(sampleCustomer);
            expect(result).toEqual(sampleCustomer);
        });

        it('should throw 400 for missing fields', async () => {
            await expect(customerService.createCustomer({})).rejects.toEqual({
                status: 400,
                message: 'Name and email are required',
            });
        });

        it('should throw 400 for invalid email format', async () => {
            validateEmail.mockReturnValue(false);
            await expect(customerService.createCustomer({ name: 'X', email: 'bad' })).rejects.toEqual({
                status: 400,
                message: 'Invalid email format',
            });
        });

        it('should throw 400 if email already used', async () => {
            customerRepository.create.mockRejectedValue({ message: DB_ERRORS.UNIQUE_VIOLATION });
            await expect(customerService.createCustomer(sampleCustomer)).rejects.toEqual({
                status: 400,
                message: 'Email is already in use',
            });
        });

        it('should throw 500 on unknown error', async () => {
            customerRepository.create.mockRejectedValue(new Error('Other'));
            await expect(customerService.createCustomer(sampleCustomer)).rejects.toEqual({
                status: 500,
                message: 'An unexpected error occurred',
            });
        });
    });

    describe('updateCustomer', () => {
        it('should return null if not found or deleted', async () => {
            customerRepository.findById.mockResolvedValue({ is_deleted: true });
            const result = await customerService.updateCustomer(validId, {});
            expect(result).toBeNull();
        });

        it('should update and return customer', async () => {
            customerRepository.findById.mockResolvedValue(sampleCustomer);
            customerRepository.update.mockResolvedValue({ ...sampleCustomer, name: 'Jane' });
            const result = await customerService.updateCustomer(validId, { name: 'Jane' });
            expect(result.name).toBe('Jane');
        });

        it('should throw 400 for invalid email', async () => {
            validateEmail.mockReturnValue(false);
            customerRepository.findById.mockResolvedValue(sampleCustomer);
            await expect(customerService.updateCustomer(validId, { email: 'bad' })).rejects.toEqual({
                status: 400,
                message: 'Invalid email format',
            });
        });

        it('should throw 400 if email already used', async () => {
            customerRepository.findById.mockResolvedValue(sampleCustomer);
            customerRepository.update.mockRejectedValue({ code: '23505' });
            await expect(customerService.updateCustomer(validId, { email: 'x@x.com' })).rejects.toEqual({
                status: 400,
                message: 'Email is already in use',
            });
        });

        it('should throw 500 on unknown update error', async () => {
            customerRepository.findById.mockResolvedValue(sampleCustomer);
            customerRepository.update.mockRejectedValue(new Error('Fail'));
            await expect(customerService.updateCustomer(validId, { name: 'Err' })).rejects.toEqual({
                status: 500,
                message: 'An unexpected error occurred',
            });
        });
    });

    describe('deleteCustomer', () => {
        it('should delete customer if valid UUID', async () => {
            await customerService.deleteCustomer(validId);
            expect(customerRepository.delete).toHaveBeenCalledWith(validId);
        });

        it('should throw 404 if not found', async () => {
            customerRepository.delete.mockRejectedValue({ message: 'Customer not found' });
            await expect(customerService.deleteCustomer(validId)).rejects.toEqual({
                status: 404,
                message: 'Customer not found',
            });
        });

        it('should throw 500 on unexpected delete error', async () => {
            customerRepository.delete.mockRejectedValue(new Error('Fail'));
            await expect(customerService.deleteCustomer(validId)).rejects.toEqual({
                status: 500,
                message: 'An unexpected error occurred',
            });
        });
    });

    describe('restoreCustomer', () => {
        it('should restore customer if valid', async () => {
            customerRepository.restore.mockResolvedValue(sampleCustomer);
            const result = await customerService.restoreCustomer(validId);
            expect(result).toEqual(sampleCustomer);
        });

        it('should throw 404 if customer not found or active', async () => {
            customerRepository.restore.mockRejectedValue({ message: 'Customer not found or already active' });
            await expect(customerService.restoreCustomer(validId)).rejects.toEqual({
                status: 404,
                message: 'Customer not found or already active',
            });
        });
    });

    describe('listCustomersSortedByCredit', () => {
        it('should return sorted customers', async () => {
            const list = [sampleCustomer];
            customerRepository.listSortedByCredit.mockResolvedValue(list);
            const result = await customerService.listCustomersSortedByCredit();
            expect(result).toEqual(list);
        });
    });
});
