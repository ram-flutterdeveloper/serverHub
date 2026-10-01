
import { AppError } from "../../../../helpers/AppError";
import { Booking, BookingItem } from "../../../booking/models";
import { Package, Service } from "../../../master-data/models";
import { UserAddress } from "../../../profile/models";
import availableProviderRepository from "../repositories/available-provider.repository";

class AvailableProviderService {



    async execute(bookingId: string) {

        const booking =
            await this.getBooking(bookingId);

        const providers =
            await this.getProviders(booking);

        const availableProviders =
            await this.filterProviders(
                booking,
                providers
            );

        return availableProviders;

    }

    /*x
    |--------------------------------------------------------------------------
    | Booking
    |--------------------------------------------------------------------------
    */

    // private async getBooking(
    //     bookingId: string
    // ) {

    //     const booking =
    //         await availableProviderRepository.getBooking(
    //             bookingId
    //         );

    //     if (!booking) {

    //         throw new AppError(
    //             "Booking not found",
    //             404
    //         );

    //     }

    //     return booking;

    // }

    async getBooking(id: string) {
        return Booking.findByPk(id, {
            include: [
                {
                    model: UserAddress,
                    as: "address",
                },
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
                                },
                            ],
                        },
                    ],
                },
            ],
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Provider List
    |--------------------------------------------------------------------------
    */

    // private async getProviders(
    //     booking: any
    // ) {

    //     const serviceId =
    //         booking.package.service.id;

    //     return availableProviderRepository
    //         .getProvidersByService(serviceId);

    // }

    private async getProviders(
        booking: any
    ) {

        if (!booking.items || booking.items.length === 0) {
            throw new AppError(
                "Booking item not found",
                400
            );
        }

        const packageItem = booking.items[0];

        const serviceId = packageItem.package.service.id;

        // return await availableProviderRepository.getProvidersByService(
        //     serviceId
        // );

        const providers =
            await availableProviderRepository.getProvidersByService(
                serviceId
            );

        console.log("Providers:", providers.length);

        providers.forEach((p: any) => {
            console.log({
                id: p.id,
                locations: p.locations?.length,
                workingHours: p.workingHours?.length,
                services: p.providerServices?.length,
            });
        });

        return providers;


    }

    /*
    |--------------------------------------------------------------------------
    | Recommendation Engine
    |--------------------------------------------------------------------------
    */

    private async filterProviders(
        booking: any,
        providers: any[]
    ) {

        const result: any[] = [];

        for (const provider of providers) {

            const location =
                provider.locations[0];

            /*
            |--------------------------------------------------------------------------
            | Distance
            |--------------------------------------------------------------------------
            */

            const distance =
                this.calculateDistance(

                    booking.address.latitude,

                    booking.address.longitude,

                    location.latitude,

                    location.longitude

                );

            if (
                distance >
                location.serviceRadius
            ) {
                continue;
            }

            /*
            |--------------------------------------------------------------------------
            | Working Hours
            |--------------------------------------------------------------------------
            */

            const isWorking =
                this.checkWorkingHours(

                    booking.bookingDate,

                    booking.bookingTime,

                    provider.workingHours

                );

            if (!isWorking) {
                continue;
            }

            /*
            |--------------------------------------------------------------------------
            | Booking Conflict
            |--------------------------------------------------------------------------
            */

            const busy =
                await this.hasBookingConflict(

                    provider.id,

                    booking.bookingDate,

                    booking.bookingTime

                );

            if (busy) {
                continue;
            }

            result.push({

                ...provider.toJSON(),

                distance,

            });

        }

        /*
        |--------------------------------------------------------------------------
        | Sort
        |--------------------------------------------------------------------------
        */

        result.sort(
            (a, b) =>
                a.distance - b.distance
        );

        return result;

    }

    /*
    |--------------------------------------------------------------------------
    | Distance
    |--------------------------------------------------------------------------
    */

    private calculateDistance(

        lat1: number,

        lon1: number,

        lat2: number,

        lon2: number

    ) {

        const R = 6371;

        const dLat =
            this.toRad(lat2 - lat1);

        const dLon =
            this.toRad(lon2 - lon1);

        const a =

            Math.sin(dLat / 2) *
            Math.sin(dLat / 2) +

            Math.cos(this.toRad(lat1)) *

            Math.cos(this.toRad(lat2)) *

            Math.sin(dLon / 2) *

            Math.sin(dLon / 2);

        const c =
            2 *
            Math.atan2(
                Math.sqrt(a),
                Math.sqrt(1 - a)
            );

        return Number(
            (R * c).toFixed(2)
        );

    }

    private toRad(value: number) {

        return value * Math.PI / 180;

    }

    /*
    |--------------------------------------------------------------------------
    | Working Hours
    |--------------------------------------------------------------------------
    */

    // private checkWorkingHours(

    //     bookingDate: string,

    //     bookingTime: string,

    //     hours: any[]

    // ) {

    //     const day =
    //         new Date(bookingDate)
    //             .toLocaleDateString(
    //                 "en-US",
    //                 {
    //                     weekday: "long",
    //                 }
    //             )
    //             .toUpperCase();

    //     const working =
    //         hours.find(
    //             (item) =>
    //                 item.dayOfWeek === day
    //         );

    //     if (!working) {
    //         return false;
    //     }

    //     if (!working.isOpen) {
    //         return false;
    //     }

    //     return (

    //         bookingTime >=
    //         working.openTime &&

    //         bookingTime <=
    //         working.closeTime

    //     );

    // }

    private checkWorkingHours(
        bookingDate: string,
        bookingTime: string,
        hours: any[]
    ) {
        const date = new Date(bookingDate);

        const day = date
            .toLocaleDateString("en-US", {
                weekday: "long",
            })
            .toUpperCase();

        const working = hours.find(
            (item) => item.dayOfWeek === day
        );

        console.log("Working day:", day);
        console.log("Working hours:", working);

        if (!working) {
            console.log("❌ No working hours found");
            return false;
        }

        if (!working.isOpen) {
            console.log("❌ Provider is closed");
            return false;
        }

        const bookingMinutes =
            this.convertTimeToMinutes(bookingTime);

        const openMinutes =
            this.convertTimeToMinutes(working.openTime);

        const closeMinutes =
            this.convertTimeToMinutes(working.closeTime);

        console.log({
            bookingTime,
            bookingMinutes,
            openTime: working.openTime,
            openMinutes,
            closeTime: working.closeTime,
            closeMinutes,
        });

        return (
            bookingMinutes >= openMinutes &&
            bookingMinutes <= closeMinutes
        );
    }
    private convertTimeToMinutes(time: string): number {
        const value = time.trim().toUpperCase();

        // 3:00 PM
        const amPmMatch = value.match(
            /^(\d{1,2}):(\d{2})\s*(AM|PM)$/
        );

        if (amPmMatch) {
            let hour = Number(amPmMatch[1]);
            const minute = Number(amPmMatch[2]);
            const period = amPmMatch[3];

            if (period === "AM" && hour === 12) {
                hour = 0;
            }

            if (period === "PM" && hour !== 12) {
                hour += 12;
            }

            return hour * 60 + minute;
        }

        // 09:00:00 / 18:00:00
        const timeMatch = value.match(
            /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/
        );

        if (timeMatch) {
            const hour = Number(timeMatch[1]);
            const minute = Number(timeMatch[2]);

            return hour * 60 + minute;
        }

        throw new Error(`Invalid time format: ${time}`);
    }

    /*
    |--------------------------------------------------------------------------
    | Booking Conflict
    |--------------------------------------------------------------------------
    */

    private async hasBookingConflict(

        providerId: string,

        bookingDate: string,

        bookingTime: string

    ) {

        /**
         * Next step:
         * Query bookings table
         * for same provider,
         * same date,
         * overlapping time.
         */

        return false;

    }

}

export default new AvailableProviderService();