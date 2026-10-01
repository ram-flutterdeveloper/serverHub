import TimeSlot from "../models/TimeSlot.model";
import { Op } from "sequelize";

class TimeSlotRepository {

  async createMany(data: any[]) {

    return TimeSlot.bulkCreate(
      data,
      {
        returning: true,
      }
    );

  }


  async findAll() {

    return TimeSlot.findAll({

      where: {
        status: "ACTIVE",
      },

      order: [
        ["sortOrder", "ASC"],
      ],

    });

  }
  async findById(id: string) {
    return TimeSlot.findByPk(id);
  }

  async findByBookingTimes(
    bookingTimes: string[]
  ) {

    return TimeSlot.findAll({

      where: {
        bookingTime: {
          [Op.in]: bookingTimes,
        },
      },

    });

  }

}

export default new TimeSlotRepository();