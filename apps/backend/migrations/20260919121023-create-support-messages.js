"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("support_messages", {

      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        allowNull: false,
        primaryKey: true,
      },

      conversationId: {
        type: Sequelize.UUID,
        allowNull: false,

        references: {
          model: "support_conversations",
          key: "id",
        },

        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      senderId: {
        type: Sequelize.UUID,
        allowNull: false,

        references: {
          model: "users",
          key: "id",
        },

        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      senderRole: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },

      message: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      messageType: {
        type: Sequelize.STRING(30),
        allowNull: false,
        defaultValue: "TEXT",
      },

      attachment: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      isRead: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      readAt: {
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
      "support_messages",
      ["conversationId"]
    );

    await queryInterface.addIndex(
      "support_messages",
      ["senderId"]
    );

    await queryInterface.addIndex(
      "support_messages",
      ["createdAt"]
    );

    await queryInterface.addIndex(
      "support_messages",
      ["isRead"]
    );
  },

  async down(queryInterface) {

    await queryInterface.dropTable(
      "support_messages"
    );

  },
};