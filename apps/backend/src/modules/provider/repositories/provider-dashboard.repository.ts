import { Op } from "sequelize";

import Booking from "../../booking/models/booking.model";
import Provider from "../models/Provider.model";
import User from "../../auth/models/User.model";

import { BookingStatus } from "../../../constants/booking-status";

class ProviderDashboardRepository {

    async getProvider(providerId: string) {

        return Provider.findByPk(providerId, {
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: [
                        "id",
                        "firstName",
                        "lastName",
                        "profileImage",
                        "status",
                    ],
                },
            ],
        });

    }


    async getBookingCounts(providerId: string) {

        const [
            total,
            completed,
            pending,
            accepted,
            onTheWay,
            arrived,
            started,
            cancelled,
        ] = await Promise.all([

            Booking.count({
                where: {
                    providerId,
                },
            }),

            Booking.count({
                where: {
                    providerId,
                    status: BookingStatus.COMPLETED,
                },
            }),

            Booking.count({
                where: {
                    providerId,
                    status: BookingStatus.PROVIDER_ASSIGNED,
                },
            }),

            Booking.count({
                where: {
                    providerId,
                    status: BookingStatus.PROVIDER_ACCEPTED,
                },
            }),

            Booking.count({
                where: {
                    providerId,
                    status: BookingStatus.ON_THE_WAY,
                },
            }),

            Booking.count({
                where: {
                    providerId,
                    status: BookingStatus.ARRIVED,
                },
            }),

            Booking.count({
                where: {
                    providerId,
                    status: BookingStatus.STARTED,
                },
            }),

            Booking.count({
                where: {
                    providerId,
                    status: BookingStatus.CANCELLED,
                },
            }),

        ]);

        return {
            total,
            completed,
            pending,
            accepted,
            onTheWay,
            arrived,
            started,
            cancelled,
        };

    }


    async getTotalEarnings(providerId: string) {

        const bookings = await Booking.findAll({

            where: {
                providerId,
                status: BookingStatus.COMPLETED,
            },

            attributes: [
                "totalAmount",
            ],

            raw: true,

        });

        return bookings.reduce(
            (total: number, booking: any) => {

                return total +
                    Number(booking.totalAmount || 0);

            },
            0
        );

    }


    async getCurrentBooking(providerId: string) {

        return Booking.findOne({

            where: {
                providerId,

                status: {
                    [Op.in]: [
                        BookingStatus.PROVIDER_ASSIGNED,
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
                ["assignedAt", "DESC"],
            ],

        });

    }


    async getRecentBookings(providerId: string) {

        return Booking.findAll({

            where: {
                providerId,
            },

            include: [

                {
                    association: "user",

                    attributes: [
                        "id",
                        "firstName",
                        "lastName",
                        "mobile",
                    ],
                },

                {
                    association: "items",
                },

            ],

            order: [
                ["createdAt", "DESC"],
            ],

            limit: 5,

        });

    }

    async getWeeklyStats(providerId: string) {

    const today = new Date();

    const startDate = new Date(today);

    startDate.setDate(
        today.getDate() - 6
    );

    startDate.setHours(0, 0, 0, 0);


    const bookings = await Booking.findAll({

        where: {

            providerId,

            status: BookingStatus.COMPLETED,

            completedAt: {
                [Op.gte]: startDate,
            },

        },

        attributes: [
            "completedAt",
            "totalAmount",
        ],

        raw: true,

    });


    const weekly: any[] = [];

    for (let i = 6; i >= 0; i--) {

        const date = new Date();

        date.setDate(
            today.getDate() - i
        );

        const dateString =
            date.toISOString()
                .split("T")[0];


        const dayBookings =
            bookings.filter(
                (booking: any) => {

                    if (!booking.completedAt) {
                        return false;
                    }

                    return new Date(
                        booking.completedAt
                    )
                        .toISOString()
                        .split("T")[0]
                        === dateString;

                }
            );


        const earned =
            dayBookings.reduce(
                (
                    total: number,
                    booking: any
                ) => {

                    return total +
                        Number(
                            booking.totalAmount || 0
                        );

                },
                0
            );


        weekly.push({

            date: dateString,

            bookings:
                dayBookings.length,

            earned,

        });

    }


    return weekly;

}

}

export default new ProviderDashboardRepository();