import { Op } from "sequelize";

import Booking from "../modules/booking/models/booking.model";
import BookingStatusLog from "../modules/booking/models/BookingStatusLog.model";

import { BookingStatus } from "../constants/booking-status";

export const expireProviderAssignments = async () => {

    try {

        const expiredBookings =
            await Booking.findAll({

                where: {

                    status:
                        BookingStatus.PROVIDER_ASSIGNED,

                    assignmentExpiresAt: {
                        [Op.lte]: new Date(),
                    },

                },

            });


        if (expiredBookings.length === 0) {
            return;
        }


        for (const booking of expiredBookings) {

            await booking.update({

                providerId: null,

                status:
                    BookingStatus.PROVIDER_REJECTED,

                rejectedAt: new Date(),

                rejectionReason:
                    "Provider did not respond within 10 minutes",

            });


            await BookingStatusLog.create({

                bookingId: booking.id,

                status:
                    BookingStatus.PROVIDER_REJECTED,

                remarks:
                    "Booking automatically expired because provider did not respond within 10 minutes",

            } as any);

        }


        console.log(
            `Expired ${expiredBookings.length} booking(s)`
        );

    } catch (error) {

        console.error(
            "Expire provider assignment error:",
            error
        );

    }

};