"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("support_conversations", {

      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        allowNull: false,
        primaryKey: true,
      },

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

      assignedAgentId: {
        type: Sequelize.UUID,
        allowNull: true,

        references: {
          model: "users",
          key: "id",
        },

        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      bookingId: {
        type: Sequelize.UUID,
        allowNull: true,

        references: {
          model: "bookings",
          key: "id",
        },

        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      subject: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      status: {
        type: Sequelize.STRING(30),
        allowNull: false,
        defaultValue: "WAITING",
      },

      lastMessageAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      closedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },

      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });

    // ==========================================
    // Indexes
    // ==========================================

    await queryInterface.addIndex(
      "support_conversations",
      ["userId"]
    );

    await queryInterface.addIndex(
      "support_conversations",
      ["assignedAgentId"]
    );

    await queryInterface.addIndex(
      "support_conversations",
      ["bookingId"]
    );

    await queryInterface.addIndex(
      "support_conversations",
      ["status"]
    );

    await queryInterface.addIndex(
      "support_conversations",
      ["lastMessageAt"]
    );
  },

  async down(queryInterface) {

    await queryInterface.dropTable(
      "support_conversations"
    );

  },
};