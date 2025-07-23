'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, we need to drop foreign key constraints
    await queryInterface.removeConstraint('SubCategories', 'SubCategories_categoryId_fkey');
    await queryInterface.removeConstraint('Topics', 'Topics_categoryId_fkey');
    await queryInterface.removeConstraint('Topics', 'Topics_subcategoryId_fkey');
    
    try {
      await queryInterface.removeConstraint('Notifications', 'Notifications_userId_fkey');
      await queryInterface.removeConstraint('Orders', 'Orders_userId_fkey');
      await queryInterface.removeConstraint('Orders', 'Orders_topicId_fkey');
    } catch (error) {
      console.log('Some constraints might not exist yet, continuing with migration...');
    }

    // Create temporary tables with integer IDs
    await queryInterface.createTable('Categories_temp', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        defaultValue: 'active'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      old_id: {
        type: Sequelize.UUID
      }
    });

    await queryInterface.createTable('Users_temp', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      avatar: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      role: {
        type: Sequelize.STRING,
        defaultValue: 'user'
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      enrolledCourses: {
        type: Sequelize.TEXT,
        defaultValue: '[]'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      old_id: {
        type: Sequelize.UUID
      }
    });

    await queryInterface.createTable('Topics_temp', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      subcategoryId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      languageId: {
        type: Sequelize.UUID,
        allowNull: true
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      estimatedPrice: {
        type: Sequelize.STRING,
        allowNull: true
      },
      thumbnail: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      tags: {
        type: Sequelize.STRING,
        allowNull: false
      },
      level: {
        type: Sequelize.STRING,
        allowNull: false
      },
      demoUrl: {
        type: Sequelize.STRING,
        allowNull: true
      },
      benefits: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      prerequisites: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('draft', 'published'),
        defaultValue: 'draft'
      },
      reviews: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      topicData: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      ratings: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      purchased: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      old_id: {
        type: Sequelize.UUID
      }
    });

    await queryInterface.createTable('Orders_temp', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      topicId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      payment_info: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      old_id: {
        type: Sequelize.UUID
      }
    });

    await queryInterface.createTable('SubCategories_temp', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        defaultValue: 'active'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      old_id: {
        type: Sequelize.UUID
      }
    });

    // Copy data from old tables to temp tables
    await queryInterface.sequelize.query(`
      INSERT INTO "Categories_temp" (title, description, status, "createdAt", "updatedAt", old_id)
      SELECT title, description, status, "createdAt", "updatedAt", id FROM "Categories"
    `);

    // Copy User data
    await queryInterface.sequelize.query(`
      INSERT INTO "Users_temp" (name, email, password, avatar, role, "isVerified", "enrolledCourses", "createdAt", "updatedAt", old_id)
      SELECT name, email, password, avatar, role, "isVerified", "enrolledCourses", "createdAt", "updatedAt", id FROM "Users"
    `);

    // Get mapping of old UUID to new IDs for users
    const userMapping = await queryInterface.sequelize.query(`
      SELECT id, old_id FROM "Users_temp"
    `, { type: queryInterface.sequelize.QueryTypes.SELECT });

    // Create user mapping object
    const userMap = {};
    userMapping.forEach(item => {
      userMap[item.old_id] = item.id;
    });

    // Get mapping of old UUID to new IDs
    const categoryMapping = await queryInterface.sequelize.query(`
      SELECT id, old_id FROM "Categories_temp"
    `, { type: queryInterface.sequelize.QueryTypes.SELECT });

    // Create mapping object
    const categoryMap = {};
    categoryMapping.forEach(item => {
      categoryMap[item.old_id] = item.id;
    });

    // Copy SubCategories with mapped category IDs
    for (const category of Object.entries(categoryMap)) {
      const [oldId, newId] = category;
      await queryInterface.sequelize.query(`
        INSERT INTO "SubCategories_temp" (title, "categoryId", description, status, "createdAt", "updatedAt", old_id)
        SELECT title, ${newId}, description, status, "createdAt", "updatedAt", id 
        FROM "SubCategories" 
        WHERE "categoryId" = '${oldId}'
      `);
    }

    // Drop old tables
    await queryInterface.dropTable('SubCategories');
    await queryInterface.dropTable('Categories');
    await queryInterface.dropTable('Users');
    
    try {
      // Migrate Topics
      // Copy Topic data with mapped user and category IDs
      for (const user of Object.entries(userMap)) {
        const [oldUserId, newUserId] = user;
        for (const category of Object.entries(categoryMap)) {
          const [oldCatId, newCatId] = category;
          
          await queryInterface.sequelize.query(`
            INSERT INTO "Topics_temp" (
              "userId", name, description, "categoryId", "subcategoryId", 
              "languageId", price, "estimatedPrice", thumbnail, tags, 
              level, "demoUrl", benefits, prerequisites, status, 
              reviews, "topicData", ratings, purchased, "createdAt", "updatedAt", old_id
            )
            SELECT 
              ${newUserId}, name, description, ${newCatId}, null, 
              "languageId", price, "estimatedPrice", thumbnail, tags, 
              level, "demoUrl", benefits, prerequisites, status, 
              reviews, "topicData", ratings, purchased, "createdAt", "updatedAt", id
            FROM "Topics" 
            WHERE "userId" = '${oldUserId}' AND "categoryId" = '${oldCatId}'
          `);
        }
      }
      
      // Get mapping of old UUID to new IDs for topics
      const topicMapping = await queryInterface.sequelize.query(`
        SELECT id, old_id FROM "Topics_temp"
      `, { type: queryInterface.sequelize.QueryTypes.SELECT });
      
      // Create topic mapping object
      const topicMap = {};
      topicMapping.forEach(item => {
        topicMap[item.old_id] = item.id;
      });
      
      // Migrate Orders
      for (const user of Object.entries(userMap)) {
        const [oldUserId, newUserId] = user;
        for (const topic of Object.entries(topicMap)) {
          const [oldTopicId, newTopicId] = topic;
          
          await queryInterface.sequelize.query(`
            INSERT INTO "Orders_temp" (
              "userId", "topicId", payment_info, "createdAt", "updatedAt", old_id
            )
            SELECT 
              ${newUserId}, ${newTopicId}, payment_info, "createdAt", "updatedAt", id
            FROM "Orders" 
            WHERE "userId" = '${oldUserId}' AND "topicId" = '${oldTopicId}'
          `);
        }
      }
      
      await queryInterface.dropTable('Topics');
      await queryInterface.dropTable('Orders');
      
      await queryInterface.renameTable('Topics_temp', 'Topics');
      await queryInterface.renameTable('Orders_temp', 'Orders');
    } catch (error) {
      console.log('Error migrating Topics or Orders:', error);
      // Continue with the migration even if there's an error with Topics or Orders
    }

    // Rename temp tables to original names
    await queryInterface.renameTable('Categories_temp', 'Categories');
    await queryInterface.renameTable('SubCategories_temp', 'SubCategories');
    await queryInterface.renameTable('Users_temp', 'Users');

    // Add indexes and constraints
    await queryInterface.addIndex('SubCategories', ['title', 'categoryId'], {
      unique: true
    });

    await queryInterface.addConstraint('SubCategories', {
      fields: ['categoryId'],
      type: 'foreign key',
      name: 'SubCategories_categoryId_fkey',
      references: {
        table: 'Categories',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // This is a complex migration that permanently transforms UUIDs to integers
    // A complete reversal would require storing all the original UUIDs
    // This down migration will create new tables with UUID but with new IDs
    console.log('Warning: Down migration cannot restore original UUID values');
    
    // Create tables with UUID again
    await queryInterface.removeConstraint('SubCategories', 'SubCategories_categoryId_fkey');

    await queryInterface.createTable('Categories_uuid', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        defaultValue: 'active'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    await queryInterface.createTable('SubCategories_uuid', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      categoryId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        defaultValue: 'active'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Copy data from integer tables to UUID tables
    // This will generate new UUIDs
    await queryInterface.sequelize.query(`
      INSERT INTO "Categories_uuid" (title, description, status, "createdAt", "updatedAt")
      SELECT title, description, status, "createdAt", "updatedAt" FROM "Categories"
    `);

    // Copy User data
    await queryInterface.sequelize.query(`
      INSERT INTO "Users_uuid" (name, email, password, avatar, role, "isVerified", "enrolledCourses", "createdAt", "updatedAt")
      SELECT name, email, password, avatar, role, "isVerified", "enrolledCourses", "createdAt", "updatedAt" FROM "Users"
    `);

    // Create a mapping of old integer IDs to new UUIDs
    const categoryMapping = await queryInterface.sequelize.query(`
      SELECT c1.id as old_id, c2.id as new_id 
      FROM "Categories" c1
      JOIN "Categories_uuid" c2 ON c1.title = c2.title
    `, { type: queryInterface.sequelize.QueryTypes.SELECT });
    
    // Create mapping object
    const categoryMap = {};
    categoryMapping.forEach(item => {
      categoryMap[item.old_id] = item.new_id;
    });
    
    // Copy SubCategories with mapped category IDs
    for (const category of Object.entries(categoryMap)) {
      const [oldId, newId] = category;
      await queryInterface.sequelize.query(`
        INSERT INTO "SubCategories_uuid" (title, "categoryId", description, status, "createdAt", "updatedAt")
        SELECT title, '${newId}', description, status, "createdAt", "updatedAt"
        FROM "SubCategories" 
        WHERE "categoryId" = ${oldId}
      `);
    }

    // Drop integer tables
    await queryInterface.dropTable('SubCategories');
    await queryInterface.dropTable('Categories');
    await queryInterface.dropTable('Users');

    // Rename UUID tables to original names
    await queryInterface.renameTable('Categories_uuid', 'Categories');
    await queryInterface.renameTable('SubCategories_uuid', 'SubCategories');
    await queryInterface.renameTable('Users_uuid', 'Users');

    // Add indexes and constraints
    await queryInterface.addIndex('SubCategories', ['title', 'categoryId'], {
      unique: true
    });

    await queryInterface.addConstraint('SubCategories', {
      fields: ['categoryId'],
      type: 'foreign key',
      name: 'SubCategories_categoryId_fkey',
      references: {
        table: 'Categories',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  }
};
