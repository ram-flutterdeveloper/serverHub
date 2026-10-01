import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

import sequelize from "../../../database/sequelize";
import { BaseModel } from "../../../database/models/BaseModel";

class PackageImage extends BaseModel<
  InferAttributes<PackageImage>,
  InferCreationAttributes<PackageImage>
> {
  declare id: string;
  declare packageId: string;
  declare image: string;
  declare title: string | null;
  declare sortOrder: number;
}

PackageImage.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    packageId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "package_images",
    timestamps: true,
    paranoid: true,
  }
);

export default PackageImage;