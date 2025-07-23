import * as migrations from './20250723000001-create-essential-tables';
import { sequelize, testConnection } from '../utils/database';

// Function to run migrations
async function runMigrations() {
    try {
        // Test database connection
        const connected = await testConnection();
        if (!connected) {
            console.error('Failed to connect to the database. Check your connection settings.');
            process.exit(1);
        }

        // Get the migration direction from command line arguments
        const args = process.argv.slice(2);
        const direction = args[0] || 'up';

        if (direction === 'up') {
            console.log('Running migrations up...');
            await migrations.up(sequelize);
            console.log('Migrations completed successfully.');
        } else if (direction === 'down') {
            console.log('Running migrations down...');
            await migrations.down(sequelize);
            console.log('Migrations rolled back successfully.');
        } else {
            console.error('Invalid migration direction. Use "up" or "down".');
            process.exit(1);
        }

        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

// Run the migrations
runMigrations();
