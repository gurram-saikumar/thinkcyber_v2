import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('Database Configuration:');
console.log('Host:', process.env.MYSQL_HOST || 'localhost');
console.log('Database:', process.env.MYSQL_DATABASE || 'lms_db');
console.log('User:', process.env.MYSQL_USER || 'root');

// Database configuration
const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE || 'lms_db',
    process.env.MYSQL_USER || 'root',
    process.env.MYSQL_PASSWORD || '',
    {
        host: process.env.MYSQL_HOST || 'localhost',
        dialect: 'mysql',
        // Enable logging in development
        logging: process.env.NODE_ENV === 'production' ? false : console.log,
        // Connection pool configuration
        pool: {
            max: 5, // Maximum number of connection in pool
            min: 0, // Minimum number of connection in pool
            acquire: 30000, // Maximum time in ms to get a connection
            idle: 10000 // Maximum time in ms that a connection can be idle
        },
        // Additional MySQL options
        dialectOptions: {
            // Enable SSL in production
            ssl: process.env.NODE_ENV === 'production' ? {
                require: true,
                rejectUnauthorized: false
            } : false,
            // Add support for larger JSON fields
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci',
            // Increase max allowed packet size
            maxAllowedPacket: 16777216 // 16MB
        }
    }
);

// Test database connection
export const connectDB = async () => {
    try {
        console.log('\nAttempting to connect to database...');
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');

        // Sync all models
        console.log('\nSynchronizing database models...');
        if (process.env.NODE_ENV === 'development') {
            // Use alter in development to preserve data
            await sequelize.sync({ alter: true });
            console.log('Database tables have been synchronized (preserving data).');
        } else {
            // Safe sync in production
            await sequelize.sync();
            console.log('Database tables have been synchronized.');
        }
        console.log('All models were synchronized successfully.');
    } catch (error: any) {
        console.error('Unable to connect to the database:', error.message);
        console.log('\nPlease check:');
        console.log('1. MySQL server is running');
        console.log('2. Database credentials are correct');
        console.log('3. Database exists');
        console.log('4. User has proper permissions');
        process.exit(1);
    }
};

export { sequelize }; 