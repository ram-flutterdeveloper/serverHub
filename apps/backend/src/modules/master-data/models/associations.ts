import { Area, Category, City, Package, Service, SubCategory,ServiceRequirement } from "./index";


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