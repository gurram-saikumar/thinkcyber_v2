"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _20250723000000_create_tables_1 = require("./20250723000000-create-tables");
const database_1 = require("../utils/database");
// Function to run migrations
async function runMigrations() {
    try {
        // Test database connection
        const connected = await (0, database_1.testConnection)();
        if (!connected) {
            console.error('Failed to connect to the database. Check your connection settings.');
            process.exit(1);
        }
        // Get the migration direction from command line arguments
        const args = process.argv.slice(2);
        const direction = args[0] || 'up';
        if (direction === 'up') {
            console.log('Running migrations up...');
            await (0, _20250723000000_create_tables_1.up)();
            console.log('Migrations completed successfully.');
        }
        else if (direction === 'down') {
            console.log('Running migrations down...');
            await (0, _20250723000000_create_tables_1.down)();
            console.log('Migrations rolled back successfully.');
        }
        else {
            console.error('Invalid migration direction. Use "up" or "down".');
            process.exit(1);
        }
        process.exit(0);
    }
    catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}
// Run the migrations
runMigrations();
