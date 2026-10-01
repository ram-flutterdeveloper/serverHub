// import User from "../modules/auth/models/User.model";
// import Provider from "../modules/provider/models/Provider.model";
// import ProviderBankAccount from "../modules/provider/models/ProviderBankAccount.model";
// import ProviderDocument from "../modules/provider/models/ProviderDocument.model";
// import ProviderLocation from "../modules/provider/models/ProviderLocation.model";
// import ProviderService from "../modules/provider/models/ProviderService.model";
// import ProviderWorkingHour from "../modules/provider/models/ProviderWorkingHour.model";

// console.log("Associations file loaded");

// User.hasOne(Provider, {
//     foreignKey: "userId",
//     as: "provider",
// });

// Provider.belongsTo(User, {
//     foreignKey: "userId",
//     as: "user",
// });

// Provider.hasOne(ProviderLocation, {
//     foreignKey: "providerId",
//     as: "location",
// });

// Provider.hasMany(ProviderService, {
//     foreignKey: "providerId",
//     as: "services",
// });

// Provider.hasMany(ProviderDocument, {
//     foreignKey: "providerId",
//     as: "documents",
// });

// Provider.hasOne(ProviderBankAccount, {
//     foreignKey: "providerId",
//     as: "bankAccount",
// });

// Provider.hasMany(ProviderWorkingHour, {
//     foreignKey: "providerId",
//     as: "workingHours",
// });

// console.log("Provider Associations:", Provider.associations);
// console.log("User Associations:", User.associations);