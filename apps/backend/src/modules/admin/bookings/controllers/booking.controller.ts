import { ApiResponseHelper } from "../../../../helpers/api-response";
import { asyncHandler } from "../../../../helpers/asyncHandler";
import bookingService
    from "../services/booking.service";



class BookingController {

    dashboard = asyncHandler(async (req, res) => {

        const data =
            await bookingService.dashboard();

        return ApiResponseHelper.success(

            res,

            data,

            "Dashboard fetched successfully"

        );

    });


    getAll = asyncHandler(async (req, res) => {

        const data =
            await bookingService.getBookings(req.query);

        return ApiResponseHelper.success(

            res,

            data,

            "Bookings fetched successfully"

        );

    });

    getById = asyncHandler(async (req, res) => {

        const data =

            await bookingService.getBooking(req.params.id as string);

        return ApiResponseHelper.success(

            res,

            data,

            "Booking fetched successfully"

        );

    });

    

}

export default new BookingController();