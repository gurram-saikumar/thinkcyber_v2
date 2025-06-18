'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add subcategories field to the layouts table
    await queryInterface.addColumn('layouts', 'subcategories', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: '[]',
    });

    // Add subcategories field to the courses table
    await queryInterface.addColumn('courses', 'subcategories', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the columns when rolling back
    await queryInterface.removeColumn('layouts', 'subcategories');
    await queryInterface.removeColumn('courses', 'subcategories');
  }
};
