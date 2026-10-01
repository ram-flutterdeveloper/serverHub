import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

import sequelize from "../../../database/sequelize";

import { BaseModel } from "../../../database/models/BaseModel";


class TimeSlot extends BaseModel<
  InferAttributes<TimeSlot>,
  InferCreationAttributes<TimeSlot>
> {

  declare id: string;

  // Example: "2:00 PM"
  declare bookingTime: string;

  declare sortOrder: number;

  declare status:
    | "ACTIVE"
    | "INACTIVE";
}


TimeSlot.init(
  {

    // -------------------------
    // ID
    // -------------------------

    id: {
      type: DataTypes.UUID,

      defaultValue:
        DataTypes.UUIDV4,

      primaryKey: true,
    },


    // -------------------------
    // BOOKING TIME
    // -------------------------

    bookingTime: {

      type: DataTypes.STRING(20),

      allowNull: false,

    },


    // -------------------------
    // SORT ORDER
    // -------------------------

    sortOrder: {

      type: DataTypes.INTEGER,

      allowNull: false,

      defaultValue: 0,

    },


    // -------------------------
    // STATUS
    // -------------------------

    status: {

      type: DataTypes.ENUM(
        "ACTIVE",
        "INACTIVE"
      ),

      allowNull: false,

      defaultValue: "ACTIVE",

    },

  },

  {

    sequelize,

    tableName: "time_slots",

    timestamps: true,

    paranoid: true,

  }
);


export default TimeSlot;