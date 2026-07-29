import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

import sequelize from "../../../database/sequelize";
import { BaseModel } from "../../../database/models/BaseModel";

class Area extends BaseModel<
  InferAttributes<Area>,
  InferCreationAttributes<Area>
> {
  declare id: string;

  declare cityId: string;

  declare name: string;

  declare slug: string;

  declare googlePlaceId: string | null;

  declare latitude: number | null;

  declare longitude: number | null;

  declare pincode: string | null;

  declare status: "ACTIVE" | "INACTIVE";

  declare sortOrder: number;
}

Area.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    cityId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "cities",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },

    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    slug: {
      type: DataTypes.STRING(180),
      allowNull: false,
    },

    googlePlaceId: {
      type: DataTypes.STRING,
    },

    latitude: {
      type: DataTypes.DOUBLE,
    },

    longitude: {
      type: DataTypes.DOUBLE,
    },

    pincode: {
      type: DataTypes.STRING(10),
    },

    status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      defaultValue: "ACTIVE",
    },

    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "areas",
    timestamps: true,
    paranoid: true,
  }
);

export default Area;