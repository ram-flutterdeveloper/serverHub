import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

import sequelize from "../../../database/sequelize";
import { BaseModel } from "../../../database/models/BaseModel";

class Favourite extends BaseModel<
  InferAttributes<Favourite>,
  InferCreationAttributes<Favourite>
> {
  declare id: string;

  declare userId: string;

  declare packageId: string;
}

Favourite.init(
  {
    // ==========================================
    // ID
    // ==========================================

    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    // ==========================================
    // USER ID
    // ==========================================

    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    // ==========================================
    // PACKAGE ID
    // ==========================================

    packageId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,

    tableName: "favourites",

    timestamps: true,

    paranoid: true,

    indexes: [
      {
        unique: true,
        fields: ["userId", "packageId"],
      },
    ],
  }
);

export default Favourite;