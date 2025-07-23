import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'lms_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
  }
);

const dropForeignKeys = async () => {
  try {
    // Connect to the database
    await sequelize.authenticate();
    console.log('Connected to the database successfully.');

    // Get all tables
    const [tables] = await sequelize.query(
      `SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = '${process.env.DB_NAME || 'lms_db'}'`
    );

    // Disable foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');

    console.log('Disabling foreign key checks...');

    // Get all foreign key constraints
    const [constraints] = await sequelize.query(`
      SELECT TABLE_NAME, CONSTRAINT_NAME
      FROM information_schema.TABLE_CONSTRAINTS
      WHERE CONSTRAINT_TYPE = 'FOREIGN KEY'
      AND CONSTRAINT_SCHEMA = '${process.env.DB_NAME || 'lms_db'}'
    `);

    console.log('Found the following foreign key constraints:');
    console.log(constraints);

    // Drop each foreign key constraint
    for (const constraint of constraints as any[]) {
      const tableName = constraint.TABLE_NAME;
      const constraintName = constraint.CONSTRAINT_NAME;
      
      console.log(`Dropping foreign key constraint ${constraintName} from table ${tableName}...`);
      
      try {
        await sequelize.query(`ALTER TABLE \`${tableName}\` DROP FOREIGN KEY \`${constraintName}\`;`);
        console.log(`Successfully dropped constraint ${constraintName} from table ${tableName}`);
      } catch (error) {
        console.error(`Error dropping constraint ${constraintName} from table ${tableName}:`, error);
      }
    }

    console.log('All foreign key constraints dropped successfully.');

    // Re-enable foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');
    console.log('Foreign key checks re-enabled.');

    console.log('Database cleaned successfully.');
  } catch (error) {
    console.error('Error cleaning database:', error);
  } finally {
    await sequelize.close();
  }
};

const dropAllTables = async () => {
  try {
    // Connect to the database
    await sequelize.authenticate();
    console.log('Connected to the database successfully.');

    // Disable foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');
    console.log('Disabling foreign key checks...');

    // Get all tables
    const [tables] = await sequelize.query(
      `SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = '${process.env.DB_NAME || 'lms_db'}'`
    );

    console.log('Found tables:', tables);

    // Drop each table
    for (const table of tables as any[]) {
      const tableName = table.TABLE_NAME;
      console.log(`Dropping table ${tableName}...`);
      
      try {
        await sequelize.query(`DROP TABLE IF EXISTS \`${tableName}\`;`);
        console.log(`Successfully dropped table ${tableName}`);
      } catch (error) {
        console.error(`Error dropping table ${tableName}:`, error);
      }
    }

    console.log('All tables dropped successfully.');

    // Re-enable foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');
    console.log('Foreign key checks re-enabled.');

    console.log('Database cleaned successfully.');
  } catch (error) {
    console.error('Error cleaning database:', error);
  } finally {
    await sequelize.close();
  }
};

// Handle command line arguments
const action = process.argv[2];

if (action === 'drop-fk') {
  dropForeignKeys();
} else if (action === 'drop-all') {
  dropAllTables();
} else {
  console.log('Please specify an action: "drop-fk" to drop foreign keys or "drop-all" to drop all tables');
  console.log('Example: ts-node clean-db.ts drop-fk');
}
