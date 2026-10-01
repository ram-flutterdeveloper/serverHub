// Master Data Models
import "../modules/master-data/models";

// Provider Models
import "../modules/provider/models";

// Auth Models
import "../modules/auth/models";



// Booking Models
import "../modules/booking/models";

import { initializeBookingAssociations } from "../modules/booking/models";

// Initialize Associations
import { initializeMasterDataAssociations } from "../modules/master-data/models/associations";
import { initializeProviderAssociations } from "../modules/provider/models/associations";
import { initializeReviewAssociations } from "../modules/reviews/models/ associations";
import { initializeFavouriteAssociations } from "../modules/favourite/models/associations";
// Later:

export const initializeModels = () => {
    initializeMasterDataAssociations();

    initializeProviderAssociations();
    initializeBookingAssociations();
    initializeReviewAssociations();
    initializeFavouriteAssociations();
};