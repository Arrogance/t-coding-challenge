/* eslint-disable no-undef */
const request = require('supertest');
const express = require('express');
const CustomerController = require('../../../src/infrastructure/controllers/customerController');
const { v4: uuidv4 } = require('uuid');

describe('CustomerController', () => {
    let app;
    let mockCustomerService;
    let customerController;

    beforeEach(() => {
        mockCustomerService = {
            getCustomerById: jest.fn(),
            createCustomer: jest.fn(),
            updateCustomer: jest.fn(),
            deleteCustomer: jest.fn(),
            restoreCustomer: jest.fn(),
            listCustomersSortedByCredit: jest.fn(),
        };

        customerController = new CustomerController(mockCustomerService);
        app = express();
        app.use(express.json());
        app.get('/api/customers/:id', (req, res) => customerController.getCustomerById(req, res));
        app.post('/api/customers', (req, res) => customerController.createCustomer(req, res));
        app.put('/api/customers/:id', (req, res) => customerController.updateCustomer(req, res));
        app.delete('/api/customers/:id', (req, res) => customerController.deleteCustomer(req, res));
        app.put('/api/customers/:id/restore', (req, res) => customerController.restoreCustomer(req, res));
        app.get('/api/customers', (req, res) => customerController.listCustomersSortedByCredit(req, res));

        jest.clearAllMocks();
    });

    test('should retrieve a customer by ID', async () => {
        const customerId = uuidv4();
        const mockCustomer = { id: customerId, name: 'John Doe', email: 'john.doe@example.com' };

        mockCustomerService.getCustomerById.mockResolvedValue(mockCustomer);

        const response = await request(app).get(`/api/customers/${customerId}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockCustomer);
        expect(mockCustomerService.getCustomerById).toHaveBeenCalledWith(customerId);
    });

    test('should return 400 for invalid customer ID format', async () => {
        const invalidCustomerId = 'invalid-id';

        const response = await request(app).get(`/api/customers/${invalidCustomerId}`);

        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({ error: "Invalid customer ID format" });
    });

    test('should return 404 if customer does not exist', async () => {
        const customerId = uuidv4();

        mockCustomerService.getCustomerById.mockRejectedValue({ status: 404, message: "Customer not found" });

        const response = await request(app).get(`/api/customers/${customerId}`);

        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({ error: "Customer not found" });
    });

    test('should create a new customer', async () => {
        const requestBody = { name: 'John Doe', email: 'john.doe@example.com' };
        const createdCustomer = { id: uuidv4(), ...requestBody };

        mockCustomerService.createCustomer.mockResolvedValue(createdCustomer);

        const response = await request(app).post(`/api/customers`).send(requestBody);

        expect(response.status).toBe(201);
        expect(response.body).toEqual(createdCustomer);
        expect(mockCustomerService.createCustomer).toHaveBeenCalledWith(requestBody);
    });

    test('should update an existing customer', async () => {
        const customerId = uuidv4();
        const updateData = { name: 'Updated Name', email: 'updated@example.com' };

        mockCustomerService.updateCustomer.mockResolvedValue();

        const response = await request(app).put(`/api/customers/${customerId}`).send(updateData);

        expect(response.status).toBe(200);
        expect(mockCustomerService.updateCustomer).toHaveBeenCalledWith(customerId, updateData);
    });

    test('should return 400 for invalid customer ID format on update', async () => {
        const invalidCustomerId = 'invalid-id';
        const updateData = { name: 'Updated Name', email: 'updated@example.com' };

        const response = await request(app).put(`/api/customers/${invalidCustomerId}`).send(updateData);

        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({ error: "Invalid customer ID format" });
    });

    test('should delete a customer', async () => {
        const customerId = uuidv4();

        mockCustomerService.deleteCustomer.mockResolvedValue();

        const response = await request(app).delete(`/api/customers/${customerId}`);

        expect(response.status).toBe(204);
        expect(response.body).toEqual({});
        expect(mockCustomerService.deleteCustomer).toHaveBeenCalledWith(customerId);
    });

    test('should restore a deleted customer', async () => {
        const customerId = uuidv4();

        mockCustomerService.restoreCustomer.mockResolvedValue();

        const response = await request(app).put(`/api/customers/${customerId}/restore`);

        expect(response.status).toBe(204);
        expect(mockCustomerService.restoreCustomer).toHaveBeenCalledWith(customerId);
    });

    test('should return 400 for invalid customer ID format on restore', async () => {
        const invalidCustomerId = 'invalid-id';

        const response = await request(app).put(`/api/customers/${invalidCustomerId}/restore`);

        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({ error: "Invalid customer ID format" });
    });

    test('should return a list of customers sorted by available credit', async () => {
        const mockCustomers = [
            { id: uuidv4(), name: 'Alice', availableCredit: 100 },
            { id: uuidv4(), name: 'Bob', availableCredit: 50 },
        ];

        mockCustomerService.listCustomersSortedByCredit.mockResolvedValue(mockCustomers);

        const response = await request(app).get(`/api/customers`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockCustomers);
    });
});
