import dashboardRepository from "../repositories/dashboard.repository";

class DashboardService {
    async execute() {
        const [
            customers,
            providers,
            // bookings,
            // pendingProviders,
        ] = await Promise.all([
            dashboardRepository.totalCustomers(),
            dashboardRepository.totalProviders(),
            // dashboardRepository.totalBookings(),
            // dashboardRepository.pendingProviders(),
        ]);

        return {
            customers,
            providers,
            // bookings,
            // pendingProviders,
        };
    }
}

export default new DashboardService();