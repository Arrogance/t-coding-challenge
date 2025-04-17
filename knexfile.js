require('dotenv').config();

module.exports = {
    development: {
        client: 'pg',
        connection: {
            host: process.env.DB_HOST || 'db',
            port: 5432,
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'secret',
            database: process.env.DB_NAME || 'mydb',
        },
        migrations: {
            directory: './src/infrastructure/migrations'
        },
        seeds: {
            directory: './src/infrastructure/seeds'
        }
    },
    production: {
        client: 'pg',
        connection: process.env.DATABASE_URL, // Uses full URL for production deployments
        migrations: {
            directory: './src/infrastructure/migrations'
        },
        seeds: {
            directory: './src/infrastructure/seeds'
        }
    }
};
