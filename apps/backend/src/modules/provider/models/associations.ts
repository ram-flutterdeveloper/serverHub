import { Provider, ProviderLocation, ProviderService } from "./index";
import { Service } from "../../master-data/models";
import { ProviderWorkingHour } from "./index";
import { ProviderDocument } from "./index";
// provider/models/associations.ts
import { ProviderBankAccount } from "./index";
import User from "../../auth/models/User.model";
export const initializeProviderAssociations = () => {
    Provider.hasMany(ProviderLocation, {
        foreignKey: "providerId",
        as: "locations",
    });

    ProviderLocation.belongsTo(Provider, {
        foreignKey: "providerId",
        as: "provider",
    });

    Provider.hasMany(ProviderService, {
        foreignKey: "providerId",
        as: "providerServices",
    });

    ProviderService.belongsTo(Provider, {
        foreignKey: "providerId",
        as: "provider",
    });

    // Service -> ProviderService
    Service.hasMany(ProviderService, {
        foreignKey: "serviceId",
        as: "providerServices",
    });

    ProviderService.belongsTo(Service, {
        foreignKey: "serviceId",
        as: "service",
    });



    Provider.hasMany(ProviderWorkingHour, {
        foreignKey: "providerId",
        as: "workingHours",
    });

    ProviderWorkingHour.belongsTo(Provider, {
        foreignKey: "providerId",
        as: "provider",
    });



    Provider.hasMany(ProviderDocument, {
        foreignKey: "providerId",
        as: "documents",
    });

    ProviderDocument.belongsTo(Provider, {
        foreignKey: "providerId",
        as: "provider",
    });



    Provider.hasOne(ProviderBankAccount, {
        foreignKey: "providerId",
        as: "bankAccount",
    });

    ProviderBankAccount.belongsTo(Provider, {
        foreignKey: "providerId",
        as: "provider",
    });
    User.hasOne(Provider, {
        foreignKey: "userId",
        as: "provider",
    });

    Provider.belongsTo(User, {
        foreignKey: "userId",
        as: "user",
    });

};