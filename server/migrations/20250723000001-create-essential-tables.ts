import { Sequelize } from 'sequelize';
import { setupModels } from './sequelize-models';

export async function up(sequelize: Sequelize) {
  try {
    console.log('Starting migration...');
    
    // Force disable foreign key checks temporarily
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // Set up models
    const models = await setupModels(sequelize);
    
    // Sync all models with force: true to drop existing tables
    console.log('Syncing database models...');
    await sequelize.sync({ force: true });
    
    console.log('All tables created successfully');
    
    // Re-enable foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    
    return true;
  } catch (error) {
    console.error('Error in migration:', error);
    // Always re-enable foreign key checks even if there's an error
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    throw error;
  }
}

export async function down(sequelize: Sequelize) {
  try {
    console.log('Rolling back migration...');
    
    // Disable foreign key checks temporarily
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // Set up models (need this to know which tables to drop)
    await setupModels(sequelize);
    
    // Drop all tables
    await sequelize.drop();
    console.log('All tables dropped');
    
    // Re-enable foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('Migration rolled back successfully');
    return true;
  } catch (error) {
    console.error('Error rolling back migration:', error);
    // Always re-enable foreign key checks even if there's an error
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    throw error;
  }
}
