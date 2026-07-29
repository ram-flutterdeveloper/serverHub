import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

import sequelize from "../../../database/sequelize";
import { BaseModel } from "../../../database/models/BaseModel";

class City extends BaseModel<
  InferAttributes<City>,
  InferCreationAttributes<City>
> {
  declare id: string;

  declare name: string;

  declare slug: string;

  declare state: string;

  declare country: string;

  declare googlePlaceId: string | null;

  declare latitude: number | null;

  declare longitude: number | null;

  declare image: string | null;

  declare status: "ACTIVE" | "INACTIVE";

  declare sortOrder: number;
}

City.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true,
    },

    slug: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },

    state: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },

    country: {
      type: DataTypes.STRING(120),
      defaultValue: "India",
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

    image: {
      type: DataTypes.STRING,
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
    tableName: "cities",
    timestamps: true,
    paranoid: true,
  }
);

export default City;