import { User } from "../../auth/models";
import { Package } from "../../master-data/models";
import { UserAddress } from "../../profile/models";
import { Provider } from "../../provider/models";
import BookingItem from "./booking-item.model";
import Booking from "./booking.model";
import BookingMedia from "./BookingMedia.model";

import BookingRequirement from "./BookingRequirement.model";
import BookingStatusLog from "./BookingStatusLog.model";

export const initializeBookingAssociations = () => {
  // Booking → Items
  Booking.hasMany(BookingItem, {
    foreignKey: "bookingId",
    as: "items",
  });

  BookingItem.belongsTo(Booking, {
    foreignKey: "bookingId",
    as: "booking",
  });

  // Booking → Requirements
  Booking.hasMany(BookingRequirement, {
    foreignKey: "bookingId",
    as: "requirements",
  });

  BookingRequirement.belongsTo(Booking, {
    foreignKey: "bookingId",
    as: "booking",
  });

  // Booking → Status Logs
  Booking.hasMany(BookingStatusLog, {
    foreignKey: "bookingId",
    as: "statusLogs",
  });

  BookingStatusLog.belongsTo(Booking, {
    foreignKey: "bookingId",
    as: "booking",
  });
};

BookingItem.belongsTo(Package, {
  foreignKey: "packageId",
  as: "package",
});

Package.hasMany(BookingItem, {
  foreignKey: "packageId",
  as: "bookingItems",
});
Booking.belongsTo(Provider, {
  foreignKey: "providerId",
  as: "provider",
});

Provider.hasMany(Booking, {
  foreignKey: "providerId",
  as: "bookings",
});

Booking.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

User.hasMany(Booking, {
  foreignKey: "userId",
  as: "bookings",
});

Booking.belongsTo(UserAddress, {
  foreignKey: "addressId",
  as: "address",
});

UserAddress.hasMany(Booking, {
  foreignKey: "addressId",
  as: "bookings",
});

Booking.hasMany(BookingMedia, {
  foreignKey: "bookingId",
  as: "media",
});

BookingMedia.belongsTo(Booking, {
  foreignKey: "bookingId",
  as: "booking",
});