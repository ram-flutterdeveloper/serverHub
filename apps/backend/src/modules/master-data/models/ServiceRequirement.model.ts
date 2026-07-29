import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

import sequelize from "../../../database/sequelize";
import { BaseModel } from "../../../database/models/BaseModel";

class ServiceRequirement extends BaseModel<
  InferAttributes<ServiceRequirement>,
  InferCreationAttributes<ServiceRequirement>
> {
  declare id: string;

  declare packageId: string;

  declare label: string;

  declare fieldKey: string;

  declare fieldType:
    | "TEXT"
    | "NUMBER"
    | "SELECT"
    | "MULTI_SELECT"
    | "DATE"
    | "TIME"
    | "CHECKBOX";

  declare options: string[] | null;

  declare placeholder: string | null;

  declare isRequired: boolean;

  declare sortOrder: number;

  declare status: "ACTIVE" | "INACTIVE";
}

ServiceRequirement.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    packageId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "packages",
        key: "id",
      },
    },

    label: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    fieldKey: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    fieldType: {
      type: DataTypes.ENUM(
        "TEXT",
        "NUMBER",
        "SELECT",
        "MULTI_SELECT",
        "DATE",
        "TIME",
        "CHECKBOX"
      ),
      allowNull: false,
    },

    options: {
      type: DataTypes.JSONB,
    },

    placeholder: {
      type: DataTypes.STRING,
    },

    isRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    tableName: "service_requirements",
    timestamps: true,
    paranoid: true,
  }
);

export default ServiceRequirement;