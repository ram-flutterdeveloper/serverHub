'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.addColumn(
      'booking_status_logs',
      'updatedByRole',
      {
        type: Sequelize.ENUM(
          'CUSTOMER',
          'PROVIDER',
          'ADMIN',
          'SYSTEM'
        ),
        allowNull: true,
        defaultValue: 'SYSTEM',
      }
    );

  },

  async down(queryInterface) {

    await queryInterface.removeColumn(
      'booking_status_logs',
      'updatedByRole'
    );

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_booking_status_logs_updatedByRole";'
    );

  },
};