import { Op, Transaction } from "sequelize";

import { BookingStatus } from "../../../../constants/booking-status";

import Booking from "../../../booking/models/booking.model";
import BookingStatusLog from "../../../booking/models/BookingStatusLog.model";
import BookingMedia from "../../../booking/models/BookingMedia.model";

class AcceptBookingRepository {

  async getAssignedBookings(providerId: string) {

    const bookings = await Booking.findAll({

      where: {

        providerId,

        status:
          BookingStatus.PROVIDER_ASSIGNED,

      },

      include: [

        {
          association: "user",

          attributes: [
            "id",
            "firstName",
            "lastName",
            "mobile",
            "email",
            "profileImage",
          ],
        },

        {
          association: "items",

          include: [
            // Package / Service if required
          ],
        },

        {
          association: "address",
        },

      ],

      order: [
        ["assignmentExpiresAt", "ASC"],
        ["assignedAt", "DESC"],
      ],

    });

    return bookings;
  }


  /*
  |--------------------------------------------------------------------------
  | Find Booking
  |--------------------------------------------------------------------------
  */

  async findBooking(
    bookingId: string,
    providerId: string
  ) {
    return Booking.findOne({
      where: {
        id: bookingId,
        providerId,
      },
      include: [
        {
          association: "items",
        },
        {
          association: "address",
        },
      ],
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Update Booking
  |--------------------------------------------------------------------------
  */

  async updateBooking(
    bookingId: string,
    data: Partial<Booking>,
    transaction?: Transaction
  ) {

    await Booking.update(
      data,
      {
        where: {
          id: bookingId,
        },
        transaction,
      }
    );

    return Booking.findByPk(
      bookingId,
      {
        include: [
          {
            association: "items",
          },
          {
            association: "address",
          },
        ],
        transaction,
      }
    );

  }

  /*
  |--------------------------------------------------------------------------
  | Create Status Log
  |--------------------------------------------------------------------------
  */

  async createStatusLog(
    bookingId: string,
    status: BookingStatus,
    remarks: string,
    transaction?: Transaction
  ) {

    return BookingStatusLog.create(
      {
        bookingId,
        status,
        remarks,
      } as any,
      {
        transaction,
      }
    );

  }

  async getCurrentBooking(providerId: string) {

    return Booking.findOne({

      where: {
        providerId,

        status: {
          [Op.in]: [
            BookingStatus.PROVIDER_ACCEPTED,
            BookingStatus.ON_THE_WAY,
            BookingStatus.ARRIVED,
            BookingStatus.STARTED,
          ],
        },
      },

      include: [
        {
          association: "user",
          attributes: [
            "id",
            "firstName",
            "lastName",
            "mobile",
            "email",
            "profileImage",
          ],
        },

        {
          association: "items",
          include: [
            {
              association: "package",
            },
          ],
        },

        {
          association: "address",
        },

        {
          association: "statusLogs",
          separate: true,
          order: [
            ["createdAt", "ASC"],
          ],
        },
      ],

      order: [
        ["acceptedAt", "DESC"],
      ],

    });

  }
  async getBookingHistory(
    providerId: string,
    page: number,
    limit: number
  ) {

    const offset =
      (page - 1) * limit;

    const { rows, count } =
      await Booking.findAndCountAll({

        where: {

          providerId,

          status: {
            [Op.in]: [
              BookingStatus.PROVIDER_ACCEPTED,
              BookingStatus.ON_THE_WAY,
              BookingStatus.ARRIVED,
              BookingStatus.STARTED,
              BookingStatus.COMPLETED,
              BookingStatus.PROVIDER_REJECTED,
              BookingStatus.CANCELLED,
            ],
          },

        },

        include: [

          {
            association: "user",

            attributes: [
              "id",
              "firstName",
              "lastName",
              "mobile",
              "email",
              "profileImage",
            ],
          },

          {
            association: "items",

            include: [
              {
                association: "package",
              },
            ],
          },

          {
            association: "address",
          },

        ],

        order: [
          ["createdAt", "DESC"],
        ],

        offset,

        limit,

        distinct: true,

      });

    return {

      bookings: rows,

      pagination: {

        total: count,

        page,

        limit,

        totalPages:
          Math.ceil(count / limit),

      },

    };

  }


  async startBooking(
  bookingId: string,
  providerId: string,
  transaction?: Transaction
) {
  await Booking.update(
    {
      status: BookingStatus.ON_THE_WAY,
      onTheWayAt: new Date(),
    },
    {
      where: {
        id: bookingId,
        providerId,
        status: BookingStatus.PROVIDER_ACCEPTED,
      },
      transaction,
    }
  );

  return Booking.findOne({
    where: {
      id: bookingId,
      providerId,
    },
    include: [
      {
        association: "user",
      },
      {
        association: "items",
      },
      {
        association: "address",
      },
    ],
    transaction,
  });
}

async arriveBooking(
  bookingId: string,
  providerId: string,
  transaction?: Transaction
) {
  await Booking.update(
    {
      status: BookingStatus.ARRIVED,
      arrivedAt: new Date(),
      arrivalOtpVerifiedAt: new Date(),
    },
    {
      where: {
        id: bookingId,
        providerId,
        status: BookingStatus.ON_THE_WAY,
      },
      transaction,
    }
  );

  return Booking.findOne({
    where: {
      id: bookingId,
      providerId,
    },
    include: [
      {
        association: "user",
      },
      {
        association: "items",
      },
      {
        association: "address",
      },
    ],
    transaction,
  });
}


async completeBooking(
  bookingId: string,
  providerId: string,
  transaction?: Transaction
) {

  await Booking.update(
    {
      status: BookingStatus.COMPLETED,
      completedAt: new Date(),
    },
    {
      where: {
        id: bookingId,
        providerId,
        status: BookingStatus.ARRIVED,
      },
      transaction,
    }
  );

  return Booking.findOne({
    where: {
      id: bookingId,
      providerId,
    },

    include: [
      {
        association: "user",
      },

      {
        association: "items",
      },

      {
        association: "address",
      },

      {
        association: "media",
      },
    ],

    transaction,
  });
}

async addBookingMedia(
  data: {
    bookingId: string;
    type: "IMAGE" | "VIDEO";
    url: string;
  },
  transaction?: Transaction
) {

  return BookingMedia.create(
    data,
    {
      transaction,
    }
  );
}

}

export default new AcceptBookingRepository();