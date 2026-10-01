"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable(
      "booking_media",
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },

        bookingId: {
          type: Sequelize.UUID,
          allowNull: false,

          references: {
            model: "bookings",
            key: "id",
          },

          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },

        type: {
          type: Sequelize.ENUM(
            "IMAGE",
            "VIDEO"
          ),
          allowNull: false,
        },

        url: {
          type: Sequelize.TEXT,
          allowNull: false,
        },

        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },

        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      }
    );

  },

  async down(queryInterface) {

    await queryInterface.dropTable(
      "booking_media"
    );

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_booking_media_type";'
    );

  },
};