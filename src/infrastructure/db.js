const knex = require('knex');
const config = require('../../knexfile');

// Initialize Knex with the correct environment config
const db = knex(config[process.env.NODE_ENV || 'development']);

module.exports = db;
