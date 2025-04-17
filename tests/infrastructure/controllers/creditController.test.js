/* eslint-disable no-undef */
const request = require('supertest');
const express = require('express');
const CreditController = require('../../../src/infrastructure/controllers/creditController');
const CreditType = require('../../../src/domain/enums/creditType');
const { v4: uuidv4 } = require('uuid');

describe('CreditController', () => {
    let app;
    let mockCreditService;
    let creditController;

    beforeEach(() => {
        mockCreditService = {
            addCredit: jest.fn(),
            getCreditsByCustomer: jest.fn()
        };

        creditController = new CreditController(mockCreditService);
        app = express();
        app.use(express.json());
        app.post('/api/customers/:customerId/credit', (req, res) => creditController.addCredit(req, res));
        app.get('/api/customers/:customerId/credits', (req, res) => creditController.getCreditsByCustomer(req, res));

        jest.clearAllMocks();
    });

    // ✅ Test 1: Successfully adding a credit transaction
    test('should successfully add a credit transaction', async () => {
        const customerId = uuidv4();
        const requestBody = { amount: 50, type: CreditType.DEPOSIT };
        const mockCredit = { customerId, ...requestBody };

        mockCreditService.addCredit.mockResolvedValue(mockCredit);

        const response = await request(app).post(`/api/customers/${customerId}/credit`).send(requestBody);

        expect(response.status).toBe(201);
        expect(response.body).toEqual(mockCredit);
        expect(mockCreditService.addCredit).toHaveBeenCalledWith(customerId, requestBody.amount, requestBody.type);
    });

    // ✅ Test 2: Invalid UUID for Add Credit
    test('should return 400 for invalid customer ID format', async () => {
        const invalidCustomerId = 'invalid-id';
        const requestBody = { amount: 50, type: CreditType.DEPOSIT };

        const response = await request(app).post(`/api/customers/${invalidCustomerId}/credit`).send(requestBody);

        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({ error: "Invalid customer ID format" });
    });

    // ✅ Test 3: Customer Not Found when Adding Credit
    test('should return 404 if customer does not exist', async () => {
        const customerId = uuidv4();
        const requestBody = { amount: 50, type: CreditType.DEPOSIT };

        mockCreditService.addCredit.mockRejectedValue({ status: 404, message: "Customer not found" });

        const response = await request(app).post(`/api/customers/${customerId}/credit`).send(requestBody);

        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({ error: "Customer not found" });
    });

    // ✅ Test 4: Invalid Credit Type
    test('should return 400 for an invalid credit type', async () => {
        const customerId = uuidv4();
        const requestBody = { amount: 50, type: "INVALID_TYPE" };

        mockCreditService.addCredit.mockRejectedValue({ status: 400, message: "Invalid credit type" });

        const response = await request(app).post(`/api/customers/${customerId}/credit`).send(requestBody);

        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({ error: "Invalid credit type" });
    });

    // ✅ Test 5: Negative Deposit Amount
    test('should return 400 if deposit amount is negative', async () => {
        const customerId = uuidv4();
        const requestBody = { amount: -50, type: CreditType.DEPOSIT };

        mockCreditService.addCredit.mockRejectedValue({ status: 400, message: "Invalid negative amount" });

        const response = await request(app).post(`/api/customers/${customerId}/credit`).send(requestBody);

        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({ error: "Invalid negative amount" });
    });

    // ✅ Test 6: Successfully retrieving credits by customer
    test('should return all credits for a customer', async () => {
        const customerId = uuidv4();
        const mockCredits = [
            { customerId, amount: 50, type: CreditType.DEPOSIT },
            { customerId, amount: -30, type: CreditType.PURCHASE }
        ];

        mockCreditService.getCreditsByCustomer.mockResolvedValue(mockCredits);

        const response = await request(app).get(`/api/customers/${customerId}/credits`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockCredits);
    });

    // ✅ Test 7: Invalid UUID for Get Credits
    test('should return 400 if retrieving credits with invalid customer ID', async () => {
        const invalidCustomerId = 'invalid-id';

        const response = await request(app).get(`/api/customers/${invalidCustomerId}/credits`);

        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({ error: "Invalid customer ID format" });
    });

    // ✅ Test 8: Customer Not Found when Retrieving Credits
    test('should return 404 when retrieving credits for a non-existent customer', async () => {
        const customerId = uuidv4();

        mockCreditService.getCreditsByCustomer.mockRejectedValue({ status: 404, message: "Customer not found" });

        const response = await request(app).get(`/api/customers/${customerId}/credits`);

        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({ error: "Customer not found" });
    });

    // ✅ Test 9: No Credits Found for a Customer
    test('should return an empty array when no credits exist for a customer', async () => {
        const customerId = uuidv4();

        mockCreditService.getCreditsByCustomer.mockResolvedValue([]);

        const response = await request(app).get(`/api/customers/${customerId}/credits`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });
});
