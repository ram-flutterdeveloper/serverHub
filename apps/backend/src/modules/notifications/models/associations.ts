import { User } from "../../auth/models";
import { DeviceToken } from "./index";

User.hasMany(DeviceToken, {
  foreignKey: "userId",
  as: "deviceTokens",
});

DeviceToken.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

