import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

import sequelize from "../../../database/sequelize";
import { BaseModel } from "../../../database/models/BaseModel";

class PackageBenefit extends BaseModel<
  InferAttributes<PackageBenefit>,
  InferCreationAttributes<PackageBenefit>
> {
  declare id: string;
  declare packageId: string;
  declare title: string;
  declare description: string;
  declare image: string | null;
  declare sortOrder: number;
}

PackageBenefit.init(
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
      allowNull: false,
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
    tableName: "package_benefits",
    timestamps: true,
    paranoid: true,
  }
);

export default PackageBenefit;