const express = require('express');
const CustomerController = require('./controllers/customerController');
const CreditController = require('./controllers/creditController');

module.exports = (customerService, creditService) => {
    const router = express.Router();

    // Instantiate controllers with injected services
    const customerController = new CustomerController(customerService);
    const creditController = new CreditController(creditService);

    // Customer routes
    router.get('/customers', customerController.listCustomersSortedByCredit.bind(customerController));
    router.get('/customers/:id', customerController.getCustomerById.bind(customerController));
    router.patch('/customers/:id', customerController.updateCustomer.bind(customerController));
    router.delete('/customers/:id', customerController.deleteCustomer.bind(customerController));
    router.put('/customers/:id/restore', customerController.restoreCustomer.bind(customerController));
    router.post('/customers', customerController.createCustomer.bind(customerController));

    // Credit routes
    router.post('/customers/:customerId/credit', creditController.addCredit.bind(creditController));
    router.get('/customers/:customerId/credits', creditController.getCreditsByCustomer.bind(creditController));

    return router;
};
