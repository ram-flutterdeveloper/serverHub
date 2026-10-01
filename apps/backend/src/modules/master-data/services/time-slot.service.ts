import { AppError } from "../../../helpers/AppError";

import timeSlotRepository
  from "../repositories/timeSlotRepository";


class TimeSlotService {

  // ==========================================
  // CREATE MULTIPLE TIME SLOTS
  // ==========================================

  async createMany(
    timeSlots: string[]
  ) {

    // --------------------------
    // Validate array
    // --------------------------

    if (
      !Array.isArray(timeSlots) ||
      timeSlots.length === 0
    ) {

      throw new AppError(
        "At least one time slot is required",
        400
      );

    }


    // --------------------------
    // Clean values
    // --------------------------

    const cleanedSlots =
      timeSlots
        .map(
          (time) =>
            typeof time === "string"
              ? time.trim()
              : ""
        )
        .filter(Boolean);


    if (
      cleanedSlots.length === 0
    ) {

      throw new AppError(
        "Valid time slots are required",
        400
      );

    }


    // --------------------------
    // Remove duplicates
    // --------------------------

    const uniqueSlots = [
      ...new Set(cleanedSlots),
    ];


    // --------------------------
    // Check existing slots
    // --------------------------

    const existingSlots =
      await timeSlotRepository
        .findByBookingTimes(
          uniqueSlots
        );


    const existingTimes =
      new Set(
        existingSlots.map(
          (slot) =>
            slot.bookingTime
        )
      );


    // --------------------------
    // Only new slots
    // --------------------------

    const newSlots =
      uniqueSlots.filter(
        (time) =>
          !existingTimes.has(time)
      );


    if (
      newSlots.length === 0
    ) {

      throw new AppError(
        "All time slots already exist",
        400
      );

    }


    // --------------------------
    // Calculate sort order
    // --------------------------

    const allSlots =
      await timeSlotRepository
        .findAll();


    let nextSortOrder =
      allSlots.length + 1;


    const data =
      newSlots.map(
        (bookingTime) => ({

          bookingTime,

          sortOrder:
            nextSortOrder++,

          status:
            "ACTIVE",

        })
      );


    // --------------------------
    // Bulk insert
    // --------------------------

    return timeSlotRepository
      .createMany(data);

  }


  // ==========================================
  // GET ALL
  // ==========================================

  async getAll() {

    return timeSlotRepository
      .findAll();

  }

}


export default new TimeSlotService();