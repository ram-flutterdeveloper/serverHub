import { User } from "../../auth/models";
import { City, Area } from "../../master-data/models";
import { UserAddress } from "./index";

/*
|--------------------------------------------------------------------------
| User
|--------------------------------------------------------------------------
*/

User.hasMany(UserAddress, {
  foreignKey: "userId",
  as: "addresses",
});

UserAddress.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

/*
|--------------------------------------------------------------------------
| City
|--------------------------------------------------------------------------
*/

City.hasMany(UserAddress, {
  foreignKey: "cityId",
  as: "addresses",
});

UserAddress.belongsTo(City, {
  foreignKey: "cityId",
  as: "city",
});

/*
|--------------------------------------------------------------------------
| Area
|--------------------------------------------------------------------------
*/

Area.hasMany(UserAddress, {
  foreignKey: "areaId",
  as: "addresses",
});

UserAddress.belongsTo(Area, {
  foreignKey: "areaId",
  as: "area",
});