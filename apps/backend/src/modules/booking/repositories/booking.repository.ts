import { Transaction } from "sequelize";

import {
  Booking,
  BookingItem,
  BookingRequirement,
  BookingStatusLog,
} from "../models";
import Package from "../../master-data/models/Package.model";
import Provider from "../../provider/models/Provider.model";
import { BookingStatus } from "../../../constants/booking-status";

class BookingRepository {
  /*
   |--------------------------------------------------------------------------
   | Booking Number
   |--------------------------------------------------------------------------
   */
  async findBookingById(id: string) {
  return Booking.findByPk(id, {
    include: [
      {
        association: "items",
      },
      {
        association: "requirements",
      },
      {
        association: "statusLogs",
      },
    ],
  });
}

  async generateBookingNumber() {
    const count = await Booking.count();

    return `BK${new Date().getFullYear()}${String(
      count + 1
    ).padStart(6, "0")}`;
  }

  /*
   |--------------------------------------------------------------------------
   | Create Booking
   |--------------------------------------------------------------------------
   */

  async createBooking(
    data: Partial<Booking>,
    transaction?: Transaction
  ) {
    return Booking.create(data as any, {
      transaction,
    });
  }

  /*
   |--------------------------------------------------------------------------
   | Create Booking Item
   |--------------------------------------------------------------------------
   */

  async createBookingItem(
    data: Partial<BookingItem>,
    transaction?: Transaction
  ) {
    return BookingItem.create(data as any, {
      transaction,
    });
  }

  /*
   |--------------------------------------------------------------------------
   | Create Booking Requirements
   |--------------------------------------------------------------------------
   */

  async createBookingRequirements(
    data: Partial<BookingRequirement>[],
    transaction?: Transaction
  ) {
    return BookingRequirement.bulkCreate(
      data as any,
      {
        transaction,
      }
    );
  }

  /*
   |--------------------------------------------------------------------------
   | Create Status Log
   |--------------------------------------------------------------------------
   */
  async getBookingById(
  bookingId: string,
  userId: string
) {
  return Booking.findOne({
    where: {
      id: bookingId,
      userId,
    },

    include: [
      {
        association: "items",

        include: [
          {
            association: "package",
          },
        ],
      },

      {
        association: "requirements",
      },

      {
        association: "statusLogs",
      },

      {
        association: "provider",
      },

      {
        association: "address",
      },
    ],
  });
}

  async createStatusLog(
    data: Partial<BookingStatusLog>,
    transaction?: Transaction
  ) {
    return BookingStatusLog.create(data as any, {
      transaction,
    });
  }

  /*
   |--------------------------------------------------------------------------
   | Booking By ID
   |--------------------------------------------------------------------------
   */

  async findById(id: string) {
    return Booking.findByPk(id, {
      include: [
        {
          association: "items",
        },
        {
          association: "requirements",
        },
        {
          association: "statusLogs",
        },
      ],
    });
  }

  /*
   |--------------------------------------------------------------------------
   | User Booking History
   |--------------------------------------------------------------------------
   */

  async getUserBookings(userId: string) {
    return Booking.findAll({
      where: {
        userId,
      },
      include: [
        {
          association: "items",
        },
      ],
      order: [
        ["createdAt", "DESC"],
      ],
    });
  }

  /*
   |--------------------------------------------------------------------------
   | Provider Bookings
   |--------------------------------------------------------------------------
   */

  async getProviderBookings(
    providerId: string
  ) {
    return Booking.findAll({
      where: {
        providerId,
      },
      include: [
        {
          association: "items",
        },
      ],
      order: [
        ["createdAt", "DESC"],
      ],
    });
  }

  /*
   |--------------------------------------------------------------------------
   | Update Booking
   |--------------------------------------------------------------------------
   */

  async updateBooking(
    id: string,
    data: Partial<Booking>,
    transaction?: Transaction
  ) {
    await Booking.update(data, {
      where: {
        id,
      },
      transaction,
    });

    return this.findById(id);
  }

  /*
   |--------------------------------------------------------------------------
   | Delete Booking
   |--------------------------------------------------------------------------
   */

  async deleteBooking(id: string) {
    return Booking.destroy({
      where: {
        id,
      },
    });
  }

  /*
   |--------------------------------------------------------------------------
   | Booking Count
   |--------------------------------------------------------------------------
   */

  async countUserBookings(
    userId: string
  ) {
    return Booking.count({
      where: {
        userId,
      },
    });
  }

  /*
   |--------------------------------------------------------------------------
   | Provider Booking Count
   |--------------------------------------------------------------------------
   */

  async countProviderBookings(
    providerId: string
  ) {
    return Booking.count({
      where: {
        providerId,
      },
    });
  }

  /*
   |--------------------------------------------------------------------------
   | Pending Bookings
   |--------------------------------------------------------------------------
   */

  async getPendingBookings() {
    return Booking.findAll({
      where: {
        status: "PENDING",
      },
      include: [
        {
          association: "items",
        },
      ],
    });
  }

  /*
   |--------------------------------------------------------------------------
   | Status History
   |--------------------------------------------------------------------------
   */

  async getStatusLogs(
    bookingId: string
  ) {
    return BookingStatusLog.findAll({
      where: {
        bookingId,
      },
      order: [
        ["createdAt", "ASC"],
      ],
    });
  }





  async getBookingDetails(id: string) {
    return Booking.findByPk(id, {
      include: [
        {
          model: BookingItem,
          as: "items",
        },
        {
          model: BookingRequirement,
          as: "requirements",
        },
        {
          model: BookingStatusLog,
          as: "statusLogs",
        },
      ],
    });
  }

  async updateBookingStatus(
    id: string,
    status: string
  ) {
    await Booking.update(
      {
        status,
      },
      {
        where: {
          id,
        },
      }
    );

    return this.getBookingDetails(id);
  }
  async getBookingHistory(userId: string) {
    return Booking.findAll({
      where: {
        userId,
      },

      include: [
        {
          model: BookingItem,
          as: "items",

          include: [
            {
              model: Package,
              as: "package",
            },
          ],
        },

        {
          model: Provider,
          as: "provider",
          required: false,
        },
      ],

      order: [["createdAt", "DESC"]],
    });
  }

  async cancelBooking(
    id: string,
    transaction?: any
) {

    await Booking.update(
        {
            status: BookingStatus.CANCELLED,
        },
        {
            where: {
                id,
            },
            transaction,
        }
    );

    return this.findBookingById(id);

}

async addStatusLog(
    bookingId: string,
    status: BookingStatus,
    remarks: string,
    transaction?: any
) {

    return BookingStatusLog.create(
        {
            bookingId,
            status,
            remarks,
        },
        {
            transaction,
        }
    );


}

}

export default new BookingRepository();