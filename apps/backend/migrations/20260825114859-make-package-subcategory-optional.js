'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.sequelize.query(`
      ALTER TABLE "packages"
      ALTER COLUMN "subCategoryId" DROP NOT NULL;
    `);

  },

  async down(queryInterface, Sequelize) {

    await queryInterface.sequelize.query(`
      ALTER TABLE "packages"
      ALTER COLUMN "subCategoryId" SET NOT NULL;
    `);

  },
};