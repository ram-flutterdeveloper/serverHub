import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

import sequelize from "../../../database/sequelize";
import { BaseModel } from "../../../database/models/BaseModel";

class PackageHowItWorks extends BaseModel<
  InferAttributes<PackageHowItWorks>,
  InferCreationAttributes<PackageHowItWorks>
> {
  declare id: string;
  declare packageId: string;
  declare step: number;
  declare title: string;
  declare description: string;
  declare image: string | null;
}

PackageHowItWorks.init(
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

    step: {
      type: DataTypes.INTEGER,
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
  },
  {
    sequelize,
    tableName: "package_how_it_works",
    timestamps: true,
    paranoid: true,
  }
);

export default PackageHowItWorks;