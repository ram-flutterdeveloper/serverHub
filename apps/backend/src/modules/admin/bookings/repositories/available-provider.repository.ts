import { Op } from "sequelize";


import Package from "../../../master-data/models/Package.model";

import Service from "../../../master-data/models/Service.model";

import {
    Provider,
    ProviderLocation,
    ProviderService,
    ProviderWorkingHour,
} from "../../../provider/models";
import { Booking } from "../../../booking/models";

class AvailableProviderRepository {

    /*
    |--------------------------------------------------------------------------
    | Booking
    |--------------------------------------------------------------------------
    */

    async getBooking(bookingId: string) {

        return Booking.findByPk(bookingId, {

            include: [

                {
                    association: "address",
                },

                {
                    association: "items",

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
    | Providers By Service
    |--------------------------------------------------------------------------
    */

    async getProvidersByService(serviceId: string) {

        return Provider.findAll({

            where: {

                status: "ACTIVE",

                isVerified: true,

            },

            include: [

                {

                    model: ProviderService,

                    as: "providerServices",

                    where: {

                        serviceId,

                        isActive: true,

                    },

                },

                {

                    model: ProviderLocation,

                    as: "locations",

                    where: {

                        isPrimary: true,

                    },

                },

                {

                    model: ProviderWorkingHour,

                    as: "workingHours",

                },

            ],

        });

    }

}

export default new AvailableProviderRepository();