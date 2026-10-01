import { Transaction } from "sequelize";

import {
  BookingItem,
} from "../models";

class BookingItemRepository {
  /**
   * Create Booking Item
   */
  async create(
    payload: BookingItem,
    transaction?: Transaction
  ) {
    return BookingItem.create(payload,
      {
        transaction,
      });
  }

  /**
   * Bulk Create Booking Items
   */
  async bulkCreate(
    payload: BookingItem[],
    transaction?: Transaction
  ) {
    return BookingItem.bulkCreate(payload, {
      transaction,
    });
  }

  /**
   * Find Items By Booking
   */
  async findByBookingId(bookingId: string) {
    return BookingItem.findAll({
      where: {
        bookingId,
      },
      order: [["createdAt", "ASC"]],
    });
  }

  /**
   * Delete Booking Items
   */
  async deleteByBookingId(
    bookingId: string,
    transaction?: Transaction
  ) {
    return BookingItem.destroy({
      where: {
        bookingId,
      },
      transaction,
    });
  }
}

export default new BookingItemRepository();