"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("bookings", "arrivalOtp", {
      type: Sequelize.STRING(6),
      allowNull: true,
    });

    await queryInterface.addColumn(
      "bookings",
      "arrivalOtpVerifiedAt",
      {
        type: Sequelize.DATE,
        allowNull: true,
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.removeColumn(
      "bookings",
      "arrivalOtpVerifiedAt"
    );

    await queryInterface.removeColumn(
      "bookings",
      "arrivalOtp"
    );
  },
};