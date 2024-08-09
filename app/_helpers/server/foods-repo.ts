import { db } from "./db";
const mongoose = require("mongoose");

const Food = db.Food;

async function getAll() {
  return await Food.find();
}

async function getByUserId(params: any) {
  return await Food.find({
    userId: params.userId,
    takenAt: {
      $gte: params.dateFrom,
      $lte: params.dateTo,
    },
  }).sort({ takenAt: -1 });
}

async function getUserReachedLimitDays(params: any) {
  const serverTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const result = await Food.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(params.userId),
        cheating: false,
      },
    },
    {
      $addFields: {
        dateOnly: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: {
              $dateFromParts: {
                year: {
                  $year: { date: "$takenAt", timezone: serverTimezone },
                },
                month: {
                  $month: { date: "$takenAt", timezone: serverTimezone },
                },
                day: {
                  $dayOfMonth: { date: "$takenAt", timezone: serverTimezone },
                },
              },
            },
          },
        },
      },
    },
    {
      $group: {
        _id: "$dateOnly",
        totalCalories: { $sum: "$calorieValue" },
        // entries: { $push: "$$ROOT" },
      },
    },
    {
      $match: {
        totalCalories: { $gte: params.caloriesLimit },
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id",
        // totalCalories: 1,
        // entries: 1,
      },
    },
  ]);

  const dates = result.map((entry) => entry.date);

  return dates;
}

async function create(params: any) {
  const food = new Food(params);
  await food.save();
}

export const foodsRepo = {
  getAll,
  getByUserId,
  getUserReachedLimitDays,
  create,
};
