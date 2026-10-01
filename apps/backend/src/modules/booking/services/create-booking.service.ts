import sequelize from "../../../database/sequelize";
import { AppError } from "../../../helpers/AppError";
import { BookingStatus } from "../../../constants/booking-status";

import bookingRepository from "../repositories/booking.repository";

import packageRepository
    from "../../master-data/repositories/package.repository";

import addressRepository
    from "../../profile/repositories/address.repository";

import timeSlotRepository
    from "../../master-data/repositories/timeSlotRepository";

import { generateOtp } from "../../../helpers/otp";


interface CreateBookingDto {

    userId: string;

    packageId: string;

    addressId: string;

    bookingDate: string;

    timeSlotId: string;

    paymentMethod?: "COD" | "ONLINE";

    notes?: string;
}


class CreateBookingService {

    async execute(data: CreateBookingDto) {

        const transaction =
            await sequelize.transaction();

        try {

            // ==========================================
            // 1. VALIDATE PACKAGE
            // ==========================================

            const packageData =
                await packageRepository.findById(
                    data.packageId
                );

            if (!packageData) {
                throw new AppError(
                    "Package not found",
                    404
                );
            }

            if (packageData.status !== "ACTIVE") {
                throw new AppError(
                    "Package is not active",
                    400
                );
            }


            // ==========================================
            // 2. VALIDATE ADDRESS
            // ==========================================

            const address =
                await addressRepository.getById(
                    data.addressId
                );

            if (!address) {
                throw new AppError(
                    "Address not found",
                    404
                );
            }

            if (address.userId !== data.userId) {
                throw new AppError(
                    "Address does not belong to this user",
                    403
                );
            }

            if (address.status !== "ACTIVE") {
                throw new AppError(
                    "Address is not active",
                    400
                );
            }


            // ==========================================
            // 3. VALIDATE TIME SLOT
            // ==========================================

            const timeSlot =
                await timeSlotRepository.findById(
                    data.timeSlotId
                );

            if (!timeSlot) {
                throw new AppError(
                    "Time slot not found",
                    404
                );
            }

            if (timeSlot.status !== "ACTIVE") {
                throw new AppError(
                    "Time slot is not available",
                    400
                );
            }


            // ==========================================
            // 4. PRICE CALCULATION
            // ==========================================

            const subtotal =
                Number(
                    packageData.offerPrice ??
                    packageData.defaultPrice
                );

            const discount = 0;

            const tax = 0;

            const extraCharge = 0;

            const total =
                subtotal +
                tax +
                extraCharge -
                discount;


            // ==========================================
            // 5. BOOKING NUMBER
            // ==========================================

            const bookingNumber =
                await bookingRepository
                    .generateBookingNumber();


            // ==========================================
            // 6. ARRIVAL OTP
            // ==========================================

            const arrivalOtp =
                generateOtp();


            // ==========================================
            // 7. CREATE BOOKING
            // ==========================================

            const booking =
                await bookingRepository.createBooking(
                    {
                        bookingNumber,

                        userId:
                            data.userId,

                        packageId:
                            packageData.id,

                        addressId:
                            data.addressId,

                        bookingDate:
                            new Date(
                                data.bookingDate
                            ),

                        bookingTime:
                            timeSlot.bookingTime,

                        paymentMethod:
                            data.paymentMethod ?? "COD",

                        paymentStatus:
                            "PENDING",

                        status:
                            BookingStatus.PENDING,

                        subtotal,

                        discount,

                        tax,

                        extraCharge,

                        totalAmount:
                            total,

                        notes:
                            data.notes,

                        arrivalOtp,
                    },

                    transaction
                );


            // ==========================================
            // 8. RESOLVE CATEGORY / SUBCATEGORY
            // ==========================================

            const packageInfo =
                packageData as any;


            /*
             * Supported structures:
             *
             * Category
             *    └── Service
             *         └── Package
             *
             * OR
             *
             * Category
             *    └── Service
             *         └── SubCategory
             *              └── Package
             */


            const categoryId =
                packageInfo
                    .subCategory
                    ?.service
                    ?.category
                    ?.id
                ??
                packageInfo
                    .service
                    ?.category
                    ?.id;


            const subCategoryId =
                packageInfo.subCategoryId ?? null;


            // Category is required
            if (!categoryId) {

                throw new AppError(
                    "Category could not be determined for this package",
                    400
                );
            }


            // ==========================================
            // 9. CREATE BOOKING ITEM
            // ==========================================

            await bookingRepository.createBookingItem(
                {
                    bookingId:
                        booking.id,

                    categoryId:
                        categoryId,

                    /*
                     * NULL is allowed when package
                     * belongs directly to Service.
                     */
                    subCategoryId:
                        subCategoryId,

                    serviceId:
                        packageInfo.serviceId,

                    packageId:
                        packageInfo.id,

                    packageName:
                        packageInfo.name,

                    packageDescription:
                        packageInfo.description,

                    quantity:
                        1,

                    duration:
                        packageInfo.durationMinutes,

                    unitPrice:
                        subtotal,

                    discount,

                    tax,

                    totalPrice:
                        total,
                },

                transaction
            );


            // ==========================================
            // 10. STATUS LOG
            // ==========================================

            await bookingRepository.addStatusLog(
                booking.id,

                BookingStatus.PENDING,

                "Booking Created",

                transaction
            );


            // ==========================================
            // 11. COMMIT
            // ==========================================

            await transaction.commit();


            // ==========================================
            // 12. RETURN BOOKING
            // ==========================================

            return await bookingRepository
                .findBookingById(
                    booking.id
                );

        } catch (error) {

            await transaction.rollback();

            console.error(
                "CREATE BOOKING ERROR =>",
                error
            );

            throw error;
        }
    }
}


export default new CreateBookingService();


// import sequelize from "../../../database/sequelize";
// import { AppError } from "../../../helpers/AppError";
// import { BookingStatus } from "../../../constants/booking-status";

// import bookingRepository from "../repositories/booking.repository";

// import packageRepository
//     from "../../master-data/repositories/package.repository";

// import addressRepository
//     from "../../profile/repositories/address.repository";

// import timeSlotRepository
//     from "../../master-data/repositories/timeSlotRepository";

// import { generateOtp } from "../../../helpers/otp";


// interface CreateBookingDto {

//     userId: string;

//     packageId: string;

//     addressId: string;

//     bookingDate: string;

//     timeSlotId: string;

//     paymentMethod?: "COD" | "ONLINE";

//     notes?: string;

// }


// class CreateBookingService {


//     async execute(
//         data: CreateBookingDto
//     ) {

//         const transaction =
//             await sequelize.transaction();


//         try {

//             // ==========================================
//             // 1. VALIDATE PACKAGE
//             // ==========================================

//             const packageData =
//                 await packageRepository.findById(
//                     data.packageId
//                 );


//             if (!packageData) {

//                 throw new AppError(
//                     "Package not found",
//                     404
//                 );

//             }


//             if (
//                 packageData.status !== "ACTIVE"
//             ) {

//                 throw new AppError(
//                     "Package is not active",
//                     400
//                 );

//             }


//             // ==========================================
//             // 2. VALIDATE ADDRESS
//             // ==========================================

//             const address =
//                 await addressRepository.getById(
//                     data.addressId
//                 );


//             if (!address) {

//                 throw new AppError(
//                     "Address not found",
//                     404
//                 );

//             }


//             if (
//                 address.userId !==
//                 data.userId
//             ) {

//                 throw new AppError(
//                     "Address does not belong to this user",
//                     403
//                 );

//             }


//             if (
//                 address.status !== "ACTIVE"
//             ) {

//                 throw new AppError(
//                     "Address is not active",
//                     400
//                 );

//             }


//             // ==========================================
//             // 3. VALIDATE TIME SLOT
//             // ==========================================

//             const timeSlot =
//                 await timeSlotRepository.findById(
//                     data.timeSlotId
//                 );


//             if (!timeSlot) {

//                 throw new AppError(
//                     "Time slot not found",
//                     404
//                 );

//             }


//             if (
//                 timeSlot.status !== "ACTIVE"
//             ) {

//                 throw new AppError(
//                     "Time slot is not available",
//                     400
//                 );

//             }


//             // ==========================================
//             // 4. PRICE CALCULATION
//             // ==========================================

//             const subtotal =
//                 Number(
//                     packageData.offerPrice ??
//                     packageData.defaultPrice
//                 );


//             const discount = 0;

//             const tax = 0;

//             const extraCharge = 0;


//             const total =
//                 subtotal +
//                 tax +
//                 extraCharge -
//                 discount;


//             // ==========================================
//             // 5. BOOKING NUMBER
//             // ==========================================

//             const bookingNumber =
//                 await bookingRepository
//                     .generateBookingNumber();


//             // ==========================================
//             // 6. ARRIVAL OTP
//             // ==========================================

//             const arrivalOtp =
//                 generateOtp();


//             // ==========================================
//             // 7. CREATE BOOKING
//             // ==========================================

//             const booking =
//                 await bookingRepository.createBooking(

//                     {

//                         bookingNumber,

//                         userId:
//                             data.userId,

//                         packageId:
//                             packageData.id,

//                         addressId:
//                             data.addressId,

//                         bookingDate:
//                             new Date(
//                                 data.bookingDate
//                             ),

//                         bookingTime:
//                             timeSlot.bookingTime,

//                         paymentMethod:
//                             data.paymentMethod ??
//                             "COD",

//                         paymentStatus:
//                             "PENDING",

//                         status:
//                             BookingStatus.PENDING,

//                         subtotal,

//                         discount,

//                         tax,

//                         extraCharge,

//                         totalAmount:
//                             total,

//                         notes: data.notes,

//                         arrivalOtp,

//                     },

//                     transaction

//                 );


//             // ==========================================
//             // 8. BOOKING ITEM
//             // ==========================================

//             const packageInfo =
//                 packageData as any;


//             await bookingRepository.createBookingItem(

//                 {

//                     bookingId:   booking.id,

//                     categoryId:
//                         packageInfo
//                             .subCategory
//                             ?.service
//                             ?.category
//                             ?.id ?? null,

//                     subCategoryId:
//                         packageInfo
//                             .subCategoryId ?? null,

//                     serviceId:
//                         packageInfo
//                             .serviceId,

//                     packageId:
//                         packageInfo
//                             .id,

//                     packageName:
//                         packageInfo
//                             .name,

//                     packageDescription:
//                         packageInfo
//                             .description,

//                     quantity:
//                         1,

//                     duration:
//                         packageInfo
//                             .durationMinutes,

//                     unitPrice:
//                         subtotal,

//                     discount,

//                     tax,

//                     totalPrice:
//                         total,

//                 },

//                 transaction

//             );


//             // ==========================================
//             // 9. STATUS LOG
//             // ==========================================

//             await bookingRepository.addStatusLog(

//                 booking.id,

//                 BookingStatus.PENDING,

//                 "Booking Created",

//                 transaction

//             );


//             // ==========================================
//             // 10. COMMIT
//             // ==========================================

//             await transaction.commit();


//             // ==========================================
//             // 11. RETURN BOOKING
//             // ==========================================

//             return await bookingRepository
//                 .findBookingById(
//                     booking.id
//                 );


//         } catch (error) {

//             await transaction.rollback();

//             console.error(
//                 "CREATE BOOKING ERROR =>",
//                 error
//             );

//             throw error;

//         }

//     }

// }


// export default new CreateBookingService();