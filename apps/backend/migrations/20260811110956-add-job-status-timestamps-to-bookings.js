"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      "bookings",
      "onTheWayAt",
      {
        type: Sequelize.DATE,
        allowNull: true,
      }
    );

    await queryInterface.addColumn(
      "bookings",
      "arrivedAt",
      {
        type: Sequelize.DATE,
        allowNull: true,
      }
    );

    await queryInterface.addColumn(
      "bookings",
      "completedAt",
      {
        type: Sequelize.DATE,
        allowNull: true,
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.removeColumn(
      "bookings",
      "completedAt"
    );

    await queryInterface.removeColumn(
      "bookings",
      "arrivedAt"
    );

    await queryInterface.removeColumn(
      "bookings",
      "onTheWayAt"
    );
  },
};