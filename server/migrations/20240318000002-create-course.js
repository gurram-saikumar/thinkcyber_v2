'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Courses', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      categories: {
        type: Sequelize.STRING,
        allowNull: false
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      estimatedPrice: {
        type: Sequelize.FLOAT
      },
      thumbnail: {
        type: Sequelize.JSON,
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
        allowNull: false
      },
      benefits: {
        type: Sequelize.JSON,
        allowNull: false
      },
      prerequisites: {
        type: Sequelize.JSON,
        allowNull: false
      },
      reviews: {
        type: Sequelize.JSON,
        defaultValue: []
      },
      courseData: {
        type: Sequelize.JSON,
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
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Courses');
  }
}; 