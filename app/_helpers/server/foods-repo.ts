import { db } from "./db";
const mongoose = require("mongoose");

const Food = db.Food;

async function getAll(params: any) {
  let filter = {};
  if (params.dateFrom && params.dateTo) {
    filter = {
      takenAt: {
        $gte: params.dateFrom,
        $lte: params.dateTo,
      },
    };
  }

  return await Food.find(filter).populate("user").sort({ takenAt: -1 });
}

async function getById(params: any) {
  try {
    return await Food.findById(params);
  } catch {
    throw "Food Not Found";
  }
}

async function getByUserId(params: any) {
  let filter = {};
  if (params.dateFrom && params.dateTo) {
    filter = {
      userId: params.userId,
      takenAt: {
        $gte: params.dateFrom,
        $lte: params.dateTo,
      },
    };
  } else {
    filter = {
      userId: params.userId,
    };
  }

  return await Food.find(filter).sort({ takenAt: -1 });
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

async function update(id: string, params: any) {
  await Food.findOneAndUpdate({ _id: id }, params);
}

async function _delete(id: string) {
  await Food.findByIdAndDelete(id);
}

export const foodsRepo = {
  getAll,
  getById,
  getByUserId,
  getUserReachedLimitDays,
  create,
  update,
  delete: _delete,
};
