const CreditService = require('../../../src/application/services/creditService');
const CreditType = require('../../../src/domain/enums/creditType');
const Credit = require('../../../src/domain/entities/credit');
const { validateUUID } = require('../../../src/common/validation');
const logger = require('../../../src/common/logger');

jest.mock('../../../src/common/logger');
jest.mock('../../../src/common/validation', () => ({
    validateUUID: jest.fn(),
}));

describe('CreditService', () => {
    let creditRepository;
    let customerRepository;
    let creditService;

    beforeEach(() => {
        creditRepository = {
            addCredit: jest.fn(),
            listByCustomerId: jest.fn(),
        };

        customerRepository = {
            findById: jest.fn(),
            updateCredit: jest.fn(),
        };

        creditService = new CreditService(creditRepository, customerRepository);
    });

    describe('addCredit', () => {
        const validCustomerId = '123e4567-e89b-12d3-a456-426614174000';

        beforeEach(() => {
            validateUUID.mockImplementation((uuid) => uuid === validCustomerId);
        });

        it('should add a credit for a valid deposit', async () => {
            customerRepository.findById.mockResolvedValue({ id: validCustomerId });
            creditRepository.addCredit.mockResolvedValue();

            const amount = 100;
            const result = await creditService.addCredit(validCustomerId, amount, CreditType.DEPOSIT);

            expect(customerRepository.findById).toHaveBeenCalledWith(validCustomerId);
            expect(customerRepository.updateCredit).toHaveBeenCalledWith(validCustomerId, amount);
            expect(creditRepository.addCredit).toHaveBeenCalledWith(expect.any(Credit));
            expect(result).toBeInstanceOf(Credit);
            expect(result.amount).toBe(amount);
            expect(result.type).toBe(CreditType.DEPOSIT);
        });

        it('should add a credit for a valid purchase', async () => {
            customerRepository.findById.mockResolvedValue({ id: validCustomerId });
            creditRepository.addCredit.mockResolvedValue();

            const amount = -50;
            const result = await creditService.addCredit(validCustomerId, amount, CreditType.PURCHASE);

            expect(customerRepository.updateCredit).toHaveBeenCalledWith(validCustomerId, -50);
            expect(result.amount).toBe(-50);
            expect(result.type).toBe(CreditType.PURCHASE);
        });

        it('should throw 400 for invalid UUID', async () => {
            validateUUID.mockReturnValue(false);
            await expect(
                creditService.addCredit('invalid-uuid', 100, CreditType.DEPOSIT)
            ).rejects.toEqual({ status: 400, message: 'Invalid customer ID format' });
        });

        it('should throw 400 for invalid amount', async () => {
            await expect(
                creditService.addCredit(validCustomerId, 0, CreditType.DEPOSIT)
            ).rejects.toEqual({ status: 400, message: 'Invalid credit amount' });
        });

        it('should throw 400 for invalid type', async () => {
            await expect(
                creditService.addCredit(validCustomerId, 100, 'INVALID')
            ).rejects.toEqual({ status: 400, message: 'Invalid credit type' });
        });

        it('should throw 400 for negative deposit', async () => {
            await expect(
                creditService.addCredit(validCustomerId, -100, CreditType.DEPOSIT)
            ).rejects.toEqual({ status: 400, message: 'Deposit amount must be positive' });
        });

        it('should throw 400 for positive purchase', async () => {
            await expect(
                creditService.addCredit(validCustomerId, 100, CreditType.PURCHASE)
            ).rejects.toEqual({ status: 400, message: 'Purchase amount must be negative' });
        });

        it('should throw 404 if customer not found', async () => {
            customerRepository.findById.mockResolvedValue(null);
            await expect(
                creditService.addCredit(validCustomerId, 100, CreditType.DEPOSIT)
            ).rejects.toEqual({ status: 404, message: 'Customer not found' });
        });

        it('should throw 500 if an unexpected error occurs', async () => {
            customerRepository.findById.mockRejectedValue(new Error('DB error'));
            await expect(
                creditService.addCredit(validCustomerId, 100, CreditType.DEPOSIT)
            ).rejects.toEqual({ status: 500, message: 'An unexpected error occurred' });
            expect(logger.error).toHaveBeenCalled();
        });
    });

    describe('getCreditsByCustomer', () => {
        const customerId = '123e4567-e89b-12d3-a456-426614174000';

        beforeEach(() => {
            validateUUID.mockImplementation((uuid) => uuid === customerId);
        });

        it('should return credits for valid customer', async () => {
            const credits = [{ amount: 100, type: CreditType.DEPOSIT }];
            creditRepository.listByCustomerId.mockResolvedValue(credits);

            const result = await creditService.getCreditsByCustomer(customerId);
            expect(creditRepository.listByCustomerId).toHaveBeenCalledWith(customerId);
            expect(result).toEqual(credits);
        });

        it('should throw 400 for invalid customerId', async () => {
            validateUUID.mockReturnValue(false);
            await expect(creditService.getCreditsByCustomer('bad-id')).rejects.toEqual({
                status: 400,
                message: 'Invalid customer ID format',
            });
        });

        it('should throw 500 if listByCustomerId fails', async () => {
            creditRepository.listByCustomerId.mockRejectedValue(new Error('DB failed'));
            await expect(creditService.getCreditsByCustomer(customerId)).rejects.toEqual({
                status: 500,
                message: 'An unexpected error occurred',
            });
            expect(logger.error).toHaveBeenCalled();
        });
    });
});
