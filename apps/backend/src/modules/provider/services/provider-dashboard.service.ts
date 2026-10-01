import { AppError } from "../../../helpers/AppError";

import providerRepository
    from "../repositories/provider.repository";

import dashboardRepository
    from "../repositories/provider-dashboard.repository";


class ProviderDashboardService {

    async getDashboard(userId: string) {

        /*
        |--------------------------------------------------------------------------
        | Find Provider
        |--------------------------------------------------------------------------
        */

        const provider =
            await providerRepository.findByUserId(
                userId
            );


        if (!provider) {

            throw new AppError(
                "Provider not found",
                404
            );

        }


        /*
        |--------------------------------------------------------------------------
        | Dashboard Data
        |--------------------------------------------------------------------------
        */

        const [

            providerDetails,

            counts,

            totalEarned,

            currentBooking,

            weekly,

            recentBookings,

        ] = await Promise.all([

            dashboardRepository
                .getProvider(provider.id),

            dashboardRepository
                .getBookingCounts(provider.id),

            dashboardRepository
                .getTotalEarnings(provider.id),

            dashboardRepository
                .getCurrentBooking(provider.id),

            dashboardRepository
                .getWeeklyStats(provider.id),

            dashboardRepository
                .getRecentBookings(provider.id),

        ]);


        /*
        |--------------------------------------------------------------------------
        | Weekly Earnings
        |--------------------------------------------------------------------------
        */

        const thisWeekEarned =
            weekly.reduce(
                (
                    total: number,
                    item: any
                ) => {

                    return total +
                        Number(item.earned || 0);

                },
                0
            );


        return {

            provider: {

                id: providerDetails?.id,

                businessName:
                    providerDetails?.businessName,

                ownerName:
                    providerDetails?.ownerName,

                profileImage:
                    providerDetails?.profileImage,

                isVerified:
                    providerDetails?.isVerified,

                status:
                    providerDetails?.status,

            },


            summary: {

                totalBookings:
                    counts.total,

                completedBookings:
                    counts.completed,

                pendingBookings:
                    counts.pending,

                acceptedBookings:
                    counts.accepted,

                onTheWayBookings:
                    counts.onTheWay,

                arrivedBookings:
                    counts.arrived,

                startedBookings:
                    counts.started,

                cancelledBookings:
                    counts.cancelled,

                totalEarned,

                thisWeekEarned,

            },


            currentBooking,

            weekly,

            recentBookings,

        };

    }

}


export default new ProviderDashboardService();