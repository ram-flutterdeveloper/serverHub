import { User } from "../../../auth/models";

import { UserRole } from "../../../../constants/user-role";

class DashboardRepository {
  async totalCustomers() {
    return User.count({
      where: {
        role: UserRole.CUSTOMER,
      },
    });
  }

  async totalProviders() {
    return User.count({
      where: {
        role: UserRole.PROVIDER,
      },
    });
  }

  // async totalBookings() {
  //   return Booking.count();
  // }

  // async pendingProviders() {
  //   return ProviderProfile.count({
  //     where: {
  //       status: "PENDING",
  //     },
  //   });
  // }
}

export default new DashboardRepository();