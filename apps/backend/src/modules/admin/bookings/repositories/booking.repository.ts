import { Op, fn, col } from "sequelize";


import { BookingStatus } from "../../../../constants/booking-status";
import Booking from "../../../booking/models/booking.model";



import User from "../../../auth/models/User.model";
import Provider from "../../../provider/models/Provider.model";
import Package from "../../../master-data/models/Package.model";
import BookingItem from "../../../booking/models/booking-item.model";
import BookingStatusLog from "../../../booking/models/BookingStatusLog.model";
import { BookingRequirement } from "../../../booking/models";
import { UserAddress } from "../../../profile/models";
import { Category, Service, SubCategory } from "../../../master-data/models";

class AdminBookingRepository {
 

  async getDashboard() {
    const [
      totalBookings,
      pendingBookings,
      confirmedBookings,
      assignedBookings,
      inProgressBookings,
      completedBookings,
      cancelledBookings,
      totalRevenue,
      todayBookings,
    ] = await Promise.all([
      Booking.count(),

      Booking.count({
        where: {
          status: BookingStatus.PENDING,
        },
      }),

      Booking.count({
        where: {
          status: BookingStatus.CONFIRMED,
        },
      }),

      Booking.count({
        where: {
          status: BookingStatus.PROVIDER_ASSIGNED,
        },
      }),

      Booking.count({
        where: {
          status: {
            [Op.in]: [
              BookingStatus.ON_THE_WAY,
              BookingStatus.ARRIVED,
              BookingStatus.STARTED,
            ],
          },
        },
      }),

      Booking.count({
        where: {
          status: BookingStatus.COMPLETED,
        },
      }),

      Booking.count({
        where: {
          status: BookingStatus.CANCELLED,
        },
      }),

      Booking.sum("totalAmount"),

      Booking.count({
        where: fn("DATE", col("createdAt")),
      }),
    ]);

    return {
      totalBookings,

      pendingBookings,

      confirmedBookings,

      assignedBookings,

      inProgressBookings,

      completedBookings,

      cancelledBookings,

      totalRevenue: Number(totalRevenue ?? 0),

      todayBookings,
    };
  }

  async getBookings({
  page,
  limit,
  search,
  status,
  paymentStatus,
  customerId,
  providerId,
  from,
  to,
}: {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  paymentStatus?: string;
  customerId?: string;
  providerId?: string;
  from?: string;
  to?: string;
}) {

  const where: any = {};

  if (search) {
    where.bookingNumber = {
      [Op.iLike]: `%${search}%`,
    };
  }

  if (status) {
    where.status = status;
  }

  if (paymentStatus) {
    where.paymentStatus = paymentStatus;
  }

  if (customerId) {
    where.userId = customerId;
  }

  if (providerId) {
    where.providerId = providerId;
  }

  if (from && to) {
    where.bookingDate = {
      [Op.between]: [from, to],
    };
  }

  const { rows, count } =
    await Booking.findAndCountAll({

      where,

      offset: (page - 1) * limit,

      limit,

      order: [["createdAt", "DESC"]],

      distinct: true,

      include: [

        {
          model: User,
          as: "user",
          attributes: [
            "id",
            "firstName",
            "lastName",
            "mobile",
          ],
        },

        {
          model: Provider,
          as: "provider",
          required: false,
        },

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

      ],

    });

  return {

    bookings: rows,

    pagination: {

      total: count,

      page,

      limit,

      totalPages: Math.ceil(count / limit),

    },

  };
}

async getBookingDetails(id: string) {

    return Booking.findByPk(id, {

        include: [

            /*
            |--------------------------------------------------------------------------
            | Customer
            |--------------------------------------------------------------------------
            */

            {
                model: User,
                as: "user",
                attributes: [
                    "id",
                    "firstName",
                    "lastName",
                    "mobile",
                    "email",
                    "profileImage",
                ],
            },

            /*
            |--------------------------------------------------------------------------
            | Provider
            |--------------------------------------------------------------------------
            */

            {
                model: Provider,
                as: "provider",
                required: false,
            },

            /*
            |--------------------------------------------------------------------------
            | Address
            |--------------------------------------------------------------------------
            */

            {
                model: UserAddress,
                as: "address",
            },

            /*
            |--------------------------------------------------------------------------
            | Booking Items
            |--------------------------------------------------------------------------
            */

            {
                model: BookingItem,
                as: "items",

                include: [

                    {
                        model: Package,
                        as: "package",

                        include: [

                            {
                                model: Service,
                                as: "service",

                                include: [

                                    {
                                        model: SubCategory,
                                        as: "subCategory",

                                        include: [

                                            {
                                                model: Category,
                                                as: "category",
                                            },

                                        ],

                                    },

                                ],

                            },

                        ],

                    },

                ],

            },

            /*
            |--------------------------------------------------------------------------
            | Requirements
            |--------------------------------------------------------------------------
            */

            {
                model: BookingRequirement,
                as: "requirements",
            },

            /*
            |--------------------------------------------------------------------------
            | Timeline
            |--------------------------------------------------------------------------
            */

            {
                model: BookingStatusLog,
                as: "statusLogs",

                separate: true,

                order: [
                    ["createdAt", "ASC"],
                ],
            },

        ],

    });
}
}

export default new AdminBookingRepository();