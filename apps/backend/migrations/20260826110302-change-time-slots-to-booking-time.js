"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {

  async up(queryInterface, Sequelize) {

    // Remove old columns if they exist
    await queryInterface.removeColumn(
      "time_slots",
      "startTime"
    );

    await queryInterface.removeColumn(
      "time_slots",
      "endTime"
    );

    await queryInterface.removeColumn(
      "time_slots",
      "label"
    );


    // Add new bookingTime column
    await queryInterface.addColumn(
      "time_slots",
      "bookingTime",
      {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: "9:00 AM",
      }
    );

  },


  async down(queryInterface, Sequelize) {

    await queryInterface.removeColumn(
      "time_slots",
      "bookingTime"
    );


    await queryInterface.addColumn(
      "time_slots",
      "startTime",
      {
        type: Sequelize.TIME,
        allowNull: true,
      }
    );


    await queryInterface.addColumn(
      "time_slots",
      "endTime",
      {
        type: Sequelize.TIME,
        allowNull: true,
      }
    );


    await queryInterface.addColumn(
      "time_slots",
      "label",
      {
        type: Sequelize.STRING(100),
        allowNull: true,
      }
    );

  },

};