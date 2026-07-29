import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

import sequelize from "../../../database/sequelize";
import { BaseModel } from "../../../database/models/BaseModel";
import { UserRole } from "../../../constants/user-role";

class User extends BaseModel<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare id: string;

  declare mobile: string;

  declare countryCode: string;

  declare firstName: string | null;

  declare lastName: string | null;

  declare email: string | null;

  declare profileImage: string | null;

  declare gender: string | null;

  declare dob: Date | null;

  declare isMobileVerified: boolean;

  declare isProfileCompleted: boolean;

  declare status: string;

  declare role: string;

  declare googleId: string | null;

  declare authProvider: "OTP" | "GOOGLE";

  declare isEmailVerified: boolean;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    mobile: {
      type: DataTypes.STRING(15),
      allowNull: true,
      unique: true,
    },

    countryCode: {
      type: DataTypes.STRING(5),
      allowNull: false,
      defaultValue: "+91",
    },

    firstName: {
      type: DataTypes.STRING,
    },

    lastName: {
      type: DataTypes.STRING,
    },

    email: {
      type: DataTypes.STRING,
    },

    profileImage: {
      type: DataTypes.STRING,
    },

    gender: {
      type: DataTypes.ENUM("MALE", "FEMALE", "OTHER"),
    },

    dob: {
      type: DataTypes.DATE,
    },

    isMobileVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    isProfileCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    status: {
      type: DataTypes.ENUM("ACTIVE", "BLOCKED"),
      defaultValue: "ACTIVE",
    },

    role: {
      type: DataTypes.ENUM(
        UserRole.ADMIN,
        UserRole.CUSTOMER,
        UserRole.PROVIDER
      ),
      defaultValue: UserRole.CUSTOMER,
    },
    googleId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },

    authProvider: {
      type: DataTypes.ENUM("OTP", "GOOGLE"),
      defaultValue: "OTP",
    },

    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },



  {
    sequelize,
    tableName: "users",
    timestamps: true,
    paranoid: true,
  }


);

export default User;