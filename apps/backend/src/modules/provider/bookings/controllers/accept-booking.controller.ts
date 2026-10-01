import { Response } from "express";

import { asyncHandler } from "../../../../helpers/asyncHandler";
import { ApiResponseHelper } from "../../../../helpers/api-response";
import { AuthRequest } from "../../../../middlewares/auth.middleware";

import acceptBookingService from "../services/accept-booking.service";

class AcceptBookingController {

    accept = asyncHandler(
        async (
            req: AuthRequest,
            res: Response
        ) => {

            const booking =
                await acceptBookingService.execute(
                    req.params.bookingId as string,
                    req.user!.userId
                );

            return ApiResponseHelper.success(
                res,
                booking,
                "Booking accepted successfully"
            );
        }
    );


    reject = asyncHandler(
        async (
            req: AuthRequest,
            res: Response
        ) => {

            const bookingId =
                req.params.bookingId as string;

            const userId =
                req.user!.userId;

            const { reason } =
                req.body;

            const booking =
                await acceptBookingService.reject(
                    bookingId,
                    userId,
                    reason
                );

            return ApiResponseHelper.success(
                res,
                booking,
                "Booking rejected successfully"
            );
        }
    );


    getAssigned = asyncHandler(
        async (
            req: AuthRequest,
            res: Response
        ) => {

            const bookings =
                await acceptBookingService
                    .getAssignedBookings(
                        req.user!.userId
                    );

            return ApiResponseHelper.success(
                res,
                bookings,
                "Assigned bookings fetched successfully"
            );

        }
    );


    getCurrent = asyncHandler(
        async (
            req: AuthRequest,
            res: Response
        ) => {

            const booking =
                await acceptBookingService
                    .getCurrentBooking(
                        req.user!.userId
                    );

            return ApiResponseHelper.success(
                res,
                booking,
                "Current booking fetched successfully"
            );
        }
    );

    getHistory = asyncHandler(
        async (
            req: AuthRequest,
            res: Response
        ) => {

            const page =
                Number(req.query.page) || 1;

            const limit =
                Number(req.query.limit) || 10;

            const result =
                await acceptBookingService
                    .getBookingHistory(
                        req.user!.userId,
                        page,
                        limit
                    );

            return ApiResponseHelper.success(
                res,
                result,
                "Booking history fetched successfully"
            );

        }
    );


    start = asyncHandler(
        async (
            req: AuthRequest,
            res: Response
        ) => {

            const booking =
                await acceptBookingService.start(
                    req.params.bookingId as string,
                    req.user!.userId
                );

            return ApiResponseHelper.success(
                res,
                booking,
                "Provider is on the way"
            );
        }
    );

    arrive = asyncHandler(
        async (
            req: AuthRequest,
            res: Response
        ) => {

            const booking =
                await acceptBookingService.arrive(
                    req.params.bookingId as string,
                    req.user!.userId,
                    req.body.otp
                );

            return ApiResponseHelper.success(
                res,
                booking,
                "OTP verified and provider arrived successfully"
            );
        }
    );
    complete = asyncHandler(
        async (
            req: AuthRequest,
            res: Response
        ) => {

            const files =
                req.files as Express.Multer.File[] | undefined;

            const booking =
                await acceptBookingService.complete(
                    req.params.bookingId as string,
                    req.user!.userId,
                    files
                );

            return ApiResponseHelper.success(
                res,
                booking,
                "Booking completed successfully"
            );
        }
    );
}

export default new AcceptBookingController();