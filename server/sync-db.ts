import { sequelize } from './utils/database';
import { setupModels } from './migrations/sequelize-models';

// Synchronize all models with the database
async function sync() {
  try {
    console.log('Starting synchronization...');
    
    // Disable foreign key checks temporarily
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // Set up the models
    await setupModels(sequelize);
    
    // Sync all models with force: true to drop existing tables
    console.log('Dropping and recreating all tables...');
    await sequelize.sync({ force: true });
    
    // Re-enable foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('Database synchronization completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error synchronizing database:', error);
    
    // Always re-enable foreign key checks even if there's an error
    try {
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    } catch (e) {
      console.error('Error re-enabling foreign key checks:', e);
    }
    
    process.exit(1);
  }
}

// Run the synchronization
sync();
