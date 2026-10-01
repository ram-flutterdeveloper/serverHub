"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_bookings_paymentMethod"
      ADD VALUE IF NOT EXISTS 'ONLINE';
    `);
  },

  async down() {
    // PostgreSQL does not directly support
    // removing an ENUM value safely.
  },
};