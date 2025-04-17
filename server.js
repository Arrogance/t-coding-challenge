require('dotenv').config();
const serverless = require('serverless-http')
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const pino = require('pino-http')();

// Import repository implementations
const CustomerRepositoryImpl = require('./src/infrastructure/persistence/customerRepositoryImpl');
const CreditRepositoryImpl = require('./src/infrastructure/persistence/creditRepositoryImpl');

// Import services
const CustomerService = require('./src/application/services/customerService');
const CreditService = require('./src/application/services/creditService');

// Instantiate repository implementations
const customerRepository = new CustomerRepositoryImpl();
const creditRepository = new CreditRepositoryImpl();

// Inject repositories into services
const customerService = new CustomerService(customerRepository);
const creditService = new CreditService(creditRepository, customerRepository);

// Import API routes and inject services
const routes = require('./src/infrastructure/routes')(customerService, creditService);

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(pino);

app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);

    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ message: 'Invalid JSON payload' });
    }

    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    res.status(status).json({ message });
});

// Register routes
app.use('/api', routes);

app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res) => {
    // eslint-disable-next-line no-console
    console.error(err.stack);
    res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

// Start server

if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        // eslint-disable-next-line no-console
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports.handler = serverless(app)
