import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

import sequelize from "../../../database/sequelize";
import { BaseModel } from "../../../database/models/BaseModel";

class PackageExcluded extends BaseModel<
  InferAttributes<PackageExcluded>,
  InferCreationAttributes<PackageExcluded>
> {
  declare id: string;
  declare packageId: string;
  declare title: string;
  declare description: string | null;
  declare image: string | null;
  declare sortOrder: number;
}

PackageExcluded.init(
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

    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    image: {
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
    tableName: "package_excluded",
    timestamps: true,
    paranoid: true,
  }
);

export default PackageExcluded;