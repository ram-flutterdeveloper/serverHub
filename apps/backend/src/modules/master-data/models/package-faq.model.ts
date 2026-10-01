import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

import sequelize from "../../../database/sequelize";
import { BaseModel } from "../../../database/models/BaseModel";

class PackageFaq extends BaseModel<
  InferAttributes<PackageFaq>,
  InferCreationAttributes<PackageFaq>
> {
  declare id: string;
  declare packageId: string;
  declare question: string;
  declare answer: string;
  declare sortOrder: number;
}

PackageFaq.init(
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

    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    answer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "package_faqs",
    timestamps: true,
    paranoid: true,
  }
);

export default PackageFaq;