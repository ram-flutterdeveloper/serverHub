import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

import sequelize from "../../../database/sequelize";
import { BaseModel } from "../../../database/models/BaseModel";
import User from "../../auth/models/User.model";

class Provider extends BaseModel<
  InferAttributes<Provider>,
  InferCreationAttributes<Provider>
> {
  declare id: string;

  declare userId: string;

  declare businessName: string;

  declare ownerName: string;

  declare email: string | null;

  declare phone: string;

  declare experience: number;

  declare description: string | null;

  declare profileImage: string | null;

  declare isVerified: boolean;

  declare status:
    | "PENDING"
    | "ACTIVE"
    | "REJECTED"
    | "SUSPENDED";
}

Provider.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },

    businessName: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    ownerName: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
    },

    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },

    experience: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    description: {
      type: DataTypes.TEXT,
    },

    profileImage: {
      type: DataTypes.STRING,
    },

    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    status: {
      type: DataTypes.ENUM(
        "PENDING",
        "ACTIVE",
        "REJECTED",
        "SUSPENDED"
      ),
      defaultValue: "PENDING",
    },
  },
  {
    sequelize,
    tableName: "providers",
    timestamps: true,
    paranoid: true,
  }
);


export default Provider;