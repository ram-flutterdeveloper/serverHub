// Master Data Models
import "../modules/master-data/models";

// Provider Models
import "../modules/provider/models";

// Auth Models
import "../modules/auth/models";

// Booking Models


// Initialize Associations
import { initializeMasterDataAssociations } from "../modules/master-data/models/associations";
// Later:
// import { initializeProviderAssociations } from "../modules/provider/associations";

export const initializeModels = () => {
    initializeMasterDataAssociations();

    // initializeProviderAssociations();
    // initializeBookingAssociations();
};