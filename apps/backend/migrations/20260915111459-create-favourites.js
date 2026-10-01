"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // ==========================================
    // CREATE FAVOURITES TABLE
    // ==========================================

    await queryInterface.createTable("favourites", {
      // ==========================================
      // ID
      // ==========================================

      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
      },

      // ==========================================
      // USER ID
      // ==========================================

      userId: {
        type: Sequelize.UUID,
        allowNull: false,

        references: {
          model: "users",
          key: "id",
        },

        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      // ==========================================
      // PACKAGE ID
      // ==========================================

      packageId: {
        type: Sequelize.UUID,
        allowNull: false,

        references: {
          model: "packages",
          key: "id",
        },

        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      // ==========================================
      // CREATED AT
      // ==========================================

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      // ==========================================
      // UPDATED AT
      // ==========================================

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      // ==========================================
      // DELETED AT
      // ==========================================

      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // ==========================================
    // UNIQUE USER + PACKAGE
    // ==========================================

    await queryInterface.addConstraint("favourites", {
      fields: ["userId", "packageId"],

      type: "unique",

      name: "unique_user_package_favourite",
    });
  },

  async down(queryInterface) {
    // ==========================================
    // DROP FAVOURITES TABLE
    // ==========================================

    await queryInterface.dropTable("favourites");
  },
};