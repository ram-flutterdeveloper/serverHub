import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

import sequelize from "../../../database/sequelize";
import { BaseModel } from "../../../database/models/BaseModel";

class PackageDetail extends BaseModel<
  InferAttributes<PackageDetail>,
  InferCreationAttributes<PackageDetail>
> {
  declare id: string;
  declare packageId: string;
  declare description: string | null;
  declare whyChooseUs: string | null;
}

PackageDetail.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    packageId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: "packages",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    whyChooseUs: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "package_details",
    timestamps: true,
    paranoid: true,
  }
);

export default PackageDetail;