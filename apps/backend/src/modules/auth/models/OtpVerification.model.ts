import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

import sequelize from "../../../database/sequelize";
import { BaseModel } from "../../../database/models/BaseModel";

class OtpVerification extends BaseModel<
  InferAttributes<OtpVerification>,
  InferCreationAttributes<OtpVerification>
> {
  declare id: string;

  declare mobile: string;

  declare countryCode: string;

  declare otp: string;

  declare purpose: string;

  declare expiresAt: Date;

  declare verifiedAt: Date | null;

  declare attempts: number;
}

OtpVerification.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    countryCode: {
      type: DataTypes.STRING,
      defaultValue: "+91",
    },

    otp: {
      type: DataTypes.STRING(6),
      allowNull: false,
    },

    purpose: {
      type: DataTypes.ENUM(
        "LOGIN",
        "REGISTER",
        "BOOKING",
        "RESET_PASSWORD"
      ),
      defaultValue: "LOGIN",
    },

    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    verifiedAt: {
      type: DataTypes.DATE,
    },

    attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "otp_verifications",
    timestamps: true,
  }
);

export default OtpVerification;