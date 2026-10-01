'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable(
      'time_slots',
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },

        startTime: {
          type: Sequelize.TIME,
          allowNull: false,
        },

        endTime: {
          type: Sequelize.TIME,
          allowNull: false,
        },

        label: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },

        sortOrder: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },

        status: {
          type: Sequelize.ENUM(
            'ACTIVE',
            'INACTIVE'
          ),
          allowNull: false,
          defaultValue: 'ACTIVE',
        },

        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },

        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },

        deletedAt: {
          type: Sequelize.DATE,
          allowNull: true,
        },
      }
    );

  },

  async down(queryInterface) {

    await queryInterface.dropTable(
      'time_slots'
    );

  },
};