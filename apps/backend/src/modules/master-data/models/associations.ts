import { Area, Category, City, Package, Service, SubCategory,ServiceRequirement } from "./index";
import ServiceCity from "./service-city.model";


export const initializeMasterDataAssociations = () => {
  // Category -> Service
  Category.hasMany(Service, {
    foreignKey: "categoryId",
    as: "services",
  });

  Service.belongsTo(Category, {
    foreignKey: "categoryId",
    as: "category",
  });

  // Service -> SubCategory
  Service.hasMany(SubCategory, {
    foreignKey: "serviceId",
    as: "subCategories",
  });

  SubCategory.belongsTo(Service, {
    foreignKey: "serviceId",
    as: "service",
  });
};
SubCategory.hasMany(Package, {
    foreignKey: "subCategoryId",
    as: "packages",
});

Package.belongsTo(SubCategory, {
    foreignKey: "subCategoryId",
    as: "subCategory",
});

City.hasMany(Area, {
  foreignKey: "cityId",
  as: "areas",
});

Area.belongsTo(City, {
  foreignKey: "cityId",
  as: "city",
});


Package.hasMany(ServiceRequirement, {
  foreignKey: "packageId",
  as: "requirements",
});

ServiceRequirement.belongsTo(Package, {
  foreignKey: "packageId",
  as: "package",
});

Package.belongsTo(Service, {
  foreignKey: "serviceId",
  as: "service",
});

Service.hasMany(Package, {
  foreignKey: "serviceId",
  as: "packages",
});

// ------------------------------------
// Service -> ServiceCity
// ------------------------------------

Service.hasMany(ServiceCity, {
  foreignKey: "serviceId",
  as: "serviceCities",
});

ServiceCity.belongsTo(Service, {
  foreignKey: "serviceId",
  as: "service",
});


// ------------------------------------
// City -> ServiceCity
// ------------------------------------

City.hasMany(ServiceCity, {
  foreignKey: "cityId",
  as: "serviceCities",
});

ServiceCity.belongsTo(City, {
  foreignKey: "cityId",
  as: "city",
});