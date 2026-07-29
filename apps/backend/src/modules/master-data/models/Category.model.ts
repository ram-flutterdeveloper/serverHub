import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

import sequelize from "../../../database/sequelize";
import { BaseModel } from "../../../database/models/BaseModel";



class Category extends BaseModel<
  InferAttributes<Category>,
  InferCreationAttributes<Category>
> {
  declare id: string;

  declare name: string;

  declare slug: string;

  declare image: string | null;

  declare icon: string | null;

  declare description: string | null;

  declare sortOrder: number;

  declare isFeatured: boolean;

  declare status: string;
}

Category.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      comment: "Primary Key",
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100],
      },
    },

    slug: {
      type: DataTypes.STRING(120),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    image: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Category Banner Image",
    },

    icon: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Category Icon",
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Category Description",
    },

    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "Display Order",
    },

    isFeatured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "Show On Home",
    },

    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "ACTIVE",
      comment: "ACTIVE | INACTIVE",
      validate: {
        isIn: [["ACTIVE", "INACTIVE"]],
      },
    },
  },
  {
    sequelize,

    modelName: "Category",

    tableName: "categories",

    freezeTableName: true,

    timestamps: true,

    paranoid: true,

    underscored: true,

    indexes: [
      {
        unique: true,
        fields: ["name"],
      },
      {
        unique: true,
        fields: ["slug"],
      },
      {
        fields: ["status"],
      },
      {
        fields: ["sort_order"],
      },
      {
        fields: ["is_featured"],
      },
    ],
  }
);


export default Category;