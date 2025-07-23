import { sequelize } from './utils/database';

// Script to check existing constraints and tables
async function checkDatabase() {
  try {
    console.log('Checking database structure...');
    
    // List all tables in the database
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE()
    `);
    
    console.log('Existing tables in the database:');
    console.log(tables);
    
    // Check for foreign key constraints
    const [constraints] = await sequelize.query(`
      SELECT 
        table_name,
        column_name,
        constraint_name,
        referenced_table_name,
        referenced_column_name
      FROM
        information_schema.key_column_usage
      WHERE
        referenced_table_name IS NOT NULL
        AND table_schema = DATABASE()
    `);
    
    console.log('\nForeign key constraints in the database:');
    console.log(constraints);
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking database:', error);
    process.exit(1);
  }
}

// Run the check
checkDatabase();
