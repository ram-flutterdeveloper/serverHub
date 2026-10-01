import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

import sequelize from "../../../database/sequelize";
import { BaseModel } from "../../../database/models/BaseModel";
import { UserRole } from "../../../constants/user-role";
import Provider from "../../provider/models/Provider.model";
import { UserStatus } from "../constants/user-status";

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

  declare providerSignupStep: number;
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
      type: DataTypes.ENUM(
        UserStatus.ACTIVE,
        UserStatus.BLOCKED
      ),
      defaultValue: UserStatus.ACTIVE,
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

    providerSignupStep: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
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