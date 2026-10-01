import Review from "./review.model";


import Booking from "../../booking/models/booking.model";
import { User } from "../../auth/models";
import { Provider } from "../../provider/models";


import { Package } from "../../master-data/models";

export const initializeReviewAssociations = () => {

    // Review belongs to User
    Review.belongsTo(User, {
        foreignKey: "userId",
        as: "user",
    });

    // Review belongs to Provider
    Review.belongsTo(Provider, {
        foreignKey: "providerId",
        as: "provider",
    });

    // Review belongs to Package
    Review.belongsTo(Package, {
        foreignKey: "packageId",
        as: "package",
    });

    // Review belongs to Booking
    Review.belongsTo(Booking, {
        foreignKey: "bookingId",
        as: "booking",
    });


    // Reverse relationships
    User.hasMany(Review, {
        foreignKey: "userId",
        as: "reviews",
    });

    Provider.hasMany(Review, {
        foreignKey: "providerId",
        as: "reviews",
    });

    Package.hasMany(Review, {
        foreignKey: "packageId",
        as: "reviews",
    });

    Booking.hasOne(Review, {
        foreignKey: "bookingId",
        as: "review",
    });
};