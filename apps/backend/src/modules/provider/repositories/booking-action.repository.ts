
import { BookingStatus } from "../../../constants/booking-status";
import { BookingStatusLog } from "../../booking/models";
import Booking from "../../booking/models/booking.model";

class BookingActionRepository {

    /*
    |--------------------------------------------------------------------------
    | Booking Details
    |--------------------------------------------------------------------------
    */

    async findBooking(id: string) {

        return Booking.findByPk(id, {

            include: [

                {
                    association: "provider",
                },

                {
                    association: "user",
                },

                {
                    association: "address",
                },

                {
                    association: "items",
                },

            ],

        });

    }

    /*
    |--------------------------------------------------------------------------
    | Update Status
    |--------------------------------------------------------------------------
    */

    async updateStatus(
        bookingId: string,
        status: BookingStatus
    ) {

        await Booking.update(
            {
                status,
            },
            {
                where: {
                    id: bookingId,
                },
            }
        );

        return this.findBooking(bookingId);

    }

    /*
    |--------------------------------------------------------------------------
    | Status Log
    |--------------------------------------------------------------------------
    */

    async createStatusLog(
        bookingId: string,
        status: BookingStatus,
        remarks: string
    ) {

        return BookingStatusLog.create({

            bookingId,

            status,

            remarks,

        } as any);

    }

}

export default new BookingActionRepository();