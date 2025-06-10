'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Layouts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      faq: {
        type: Sequelize.JSON,
        defaultValue: []
      },
      categories: {
        type: Sequelize.JSON,
        defaultValue: []
      },
      banner: {
        type: Sequelize.JSON,
        defaultValue: {
          image: { public_id: "", url: "" },
          title: "",
          subTitle: ""
        }
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

    // Add index for better query performance
    await queryInterface.addIndex('Layouts', ['type']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Layouts');
  }
}; 