import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

import sequelize from "../../../database/sequelize";
import { BaseModel } from "../../../database/models/BaseModel";

class Banner extends BaseModel<
  InferAttributes<Banner>,
  InferCreationAttributes<Banner>
> {
  declare id: string;

  declare title: string;

  declare subtitle: string | null;

  declare image: string;

  declare mobileImage: string | null;

  declare bannerType:
    | "HOME"
    | "CATEGORY"
    | "SERVICE"
    | "PACKAGE";

  declare redirectType:
    | "NONE"
    | "CATEGORY"
    | "SERVICE"
    | "SUB_CATEGORY"
    | "PACKAGE"
    | "URL";

  declare redirectId: string | null;

  declare redirectUrl: string | null;

  declare cityId: string | null;

  declare areaId: string | null;

  declare startDate: Date | null;

  declare endDate: Date | null;

  declare sortOrder: number;

  declare status: "ACTIVE" | "INACTIVE";
}

Banner.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    subtitle: {
      type: DataTypes.STRING,
    },

    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    mobileImage: {
      type: DataTypes.STRING,
    },

    bannerType: {
      type: DataTypes.ENUM(
        "HOME",
        "CATEGORY",
        "SERVICE",
        "PACKAGE"
      ),
      defaultValue: "HOME",
    },

    redirectType: {
      type: DataTypes.ENUM(
        "NONE",
        "CATEGORY",
        "SERVICE",
        "SUB_CATEGORY",
        "PACKAGE",
        "URL"
      ),
      defaultValue: "NONE",
    },

    redirectId: {
      type: DataTypes.UUID,
    },

    redirectUrl: {
      type: DataTypes.STRING,
    },

    cityId: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    areaId: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    startDate: {
      type: DataTypes.DATE,
    },

    endDate: {
      type: DataTypes.DATE,
    },

    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      defaultValue: "ACTIVE",
    },
  },
  {
    sequelize,
    tableName: "banners",
    timestamps: true,
    paranoid: true,
  }
);

export default Banner;