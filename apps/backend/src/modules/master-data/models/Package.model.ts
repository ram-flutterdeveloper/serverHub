import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

import sequelize from "../../../database/sequelize";
import { BaseModel } from "../../../database/models/BaseModel";

class Package extends BaseModel<
  InferAttributes<Package>,
  InferCreationAttributes<Package>
> {
  declare id: string;

  declare subCategoryId: string | null;

  declare name: string;

  declare slug: string;

  declare description: string | null;

  declare image: string | null;

  declare defaultPrice: number;

  declare offerPrice: number | null;

  declare durationMinutes: number;

  declare sortOrder: number;

  declare isFeatured: boolean;

  declare status: "ACTIVE" | "INACTIVE";
  declare serviceId: string;
}

Package.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    // subCategoryId: {
    //   type: DataTypes.UUID,
    //   allowNull: false,
    //   references: {
    //     model: "sub_categories",
    //     key: "id",
    //   },
    //   onUpdate: "CASCADE",
    //   onDelete: "RESTRICT",
    // },

    subCategoryId: {
      type: DataTypes.UUID,
      allowNull: true,

      references: {
        model: "sub_categories",
        key: "id",
      },

      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },

    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    slug: {
      type: DataTypes.STRING(180),
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
    },

    image: {
      type: DataTypes.STRING,
    },

    defaultPrice: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    offerPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },

    durationMinutes: {
      type: DataTypes.INTEGER,
      defaultValue: 60,
    },

    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      defaultValue: "ACTIVE",
    },
    serviceId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "services",
        key: "id",
      },
    }
  },
  {
    sequelize,
    tableName: "packages",
    timestamps: true,
    paranoid: true,
  }

);

export default Package;