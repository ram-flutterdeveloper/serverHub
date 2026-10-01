"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    // Delete existing table
    await queryInterface.dropTable("time_slots");

    // Create new table
    await queryInterface.createTable("time_slots", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },

      bookingTime: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },

      sortOrder: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      status: {
        type: Sequelize.ENUM(
          "ACTIVE",
          "INACTIVE"
        ),
        allowNull: false,
        defaultValue: "ACTIVE",
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },

      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

  },

  async down(queryInterface, Sequelize) {

    await queryInterface.dropTable(
      "time_slots"
    );

    // Remove PostgreSQL enum
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_time_slots_status";
    `);
  },
};