'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('booking_items', 'categoryId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });

    await queryInterface.addColumn('booking_items', 'subCategoryId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'sub_categories',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });

    await queryInterface.addColumn('booking_items', 'serviceId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'services',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });

    await queryInterface.addColumn('booking_items', 'packageDescription', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn('booking_items', 'discount', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    });

    await queryInterface.addColumn('booking_items', 'tax', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('booking_items', 'tax');
    await queryInterface.removeColumn('booking_items', 'discount');
    await queryInterface.removeColumn('booking_items', 'packageDescription');
    await queryInterface.removeColumn('booking_items', 'serviceId');
    await queryInterface.removeColumn('booking_items', 'subCategoryId');
    await queryInterface.removeColumn('booking_items', 'categoryId');
  },
};