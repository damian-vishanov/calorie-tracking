import { db } from "./db";
const mongoose = require("mongoose");

const Food = db.Food;

async function getAll(params: any) {
  let filter: any = {};

  if (params.dateFrom && params.dateTo) {
    filter.takenAt = {
      $gte: new Date(params.dateFrom),
      $lte: new Date(params.dateTo),
    };
  }

  const page = params.page ? parseInt(params.page, 10) : 1;
  const pageSize = params.pageSize ? parseInt(params.pageSize, 10) : 10;

  const skip = (page - 1) * pageSize;
  const totalItems = await Food.countDocuments(filter);

  const items = await Food.find(filter)
    .populate("user")
    .sort({ takenAt: -1 })
    .skip(skip)
    .limit(pageSize);

  return {
    items,
    totalItems,
    page,
    pageSize,
  };
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
      userId: new mongoose.Types.ObjectId(params.userId),
      takenAt: {
        $gte: new Date(params.dateFrom),
        $lte: new Date(params.dateTo),
      },
    };
  } else {
    filter = {
      userId: new mongoose.Types.ObjectId(params.userId),
    };
  }

  const page = params.page ? parseInt(params.page, 10) : 1;
  const pageSize = params.pageSize ? parseInt(params.pageSize, 10) : 10;
  const skip = (page - 1) * pageSize;

  const totalItems = await Food.countDocuments(filter);

  const items = await Food.find(filter)
    .sort({ takenAt: -1 })
    .skip(skip)
    .limit(pageSize);

  const totalCalorieData = await Food.aggregate([
    { $match: filter },
    { $group: { _id: null, totalCalories: { $sum: "$calorieValue" } } },
  ]);

  const takenCalories =
    totalCalorieData.length > 0 ? totalCalorieData[0].totalCalories : 0;

  return {
    items,
    totalItems,
    page,
    pageSize,
    takenCalories,
  };
}

async function getUserAverageCalories(params: any) {
  const dateFrom = new Date(params.dateFrom);
  const dateTo = new Date(params.dateTo);
  const page = params.page || 1;
  const pageSize = params.pageSize || 10;
  const skip = (page - 1) * pageSize;

  const result = await Food.aggregate([
    {
      $match: {
        takenAt: {
          $gte: dateFrom,
          $lte: dateTo,
        },
        cheating: false,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $group: {
        _id: "$user._id",
        email: { $first: "$user.email" },
        averageCalories: { $avg: "$calorieValue" },
      },
    },
    {
      $sort: { email: 1 },
    },
    {
      $facet: {
        data: [{ $skip: skip }, { $limit: pageSize }],
        totalCount: [{ $count: "count" }],
      },
    },
    {
      $project: {
        data: 1,
        totalCount: { $arrayElemAt: ["$totalCount.count", 0] },
      },
    },
  ]);

  const totalCount = result[0].totalCount || 0;
  const usersWithAverageCalories = result[0].data;

  return {
    users: usersWithAverageCalories,
    totalCount,
  };
}

async function getFoodItemsCount() {
  const serverTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const today = new Date();

  const currentWeekEnd = new Date(today);
  const currentWeekStart = new Date(today);
  currentWeekStart.setDate(today.getDate() - 6);

  const previousWeekEnd = new Date(today);
  previousWeekEnd.setDate(today.getDate() - 7);
  const previousWeekStart = new Date(today);
  previousWeekStart.setDate(today.getDate() - 13);

  function formatDateOnly(date) {
    return date.toISOString().split("T")[0];
  }

  const currentWeekCounts = await Food.aggregate([
    {
      $match: {
        $expr: {
          $and: [
            {
              $gte: [
                {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$takenAt",
                    timezone: serverTimezone,
                  },
                },
                formatDateOnly(currentWeekStart),
              ],
            },
            {
              $lte: [
                {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$takenAt",
                    timezone: serverTimezone,
                  },
                },
                formatDateOnly(currentWeekEnd),
              ],
            },
          ],
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: {
              $dateFromParts: {
                year: { $year: { date: "$takenAt", timezone: serverTimezone } },
                month: {
                  $month: { date: "$takenAt", timezone: serverTimezone },
                },
                day: {
                  $dayOfMonth: { date: "$takenAt", timezone: serverTimezone },
                },
              },
            },
            timezone: serverTimezone,
          },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  const previousWeekCounts = await Food.aggregate([
    {
      $match: {
        $expr: {
          $and: [
            {
              $gte: [
                {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$takenAt",
                    timezone: serverTimezone,
                  },
                },
                formatDateOnly(previousWeekStart),
              ],
            },
            {
              $lte: [
                {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$takenAt",
                    timezone: serverTimezone,
                  },
                },
                formatDateOnly(previousWeekEnd),
              ],
            },
          ],
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: {
              $dateFromParts: {
                year: { $year: { date: "$takenAt", timezone: serverTimezone } },
                month: {
                  $month: { date: "$takenAt", timezone: serverTimezone },
                },
                day: {
                  $dayOfMonth: { date: "$takenAt", timezone: serverTimezone },
                },
              },
            },
            timezone: serverTimezone,
          },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  const results = [];

  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(currentWeekStart);
    currentDay.setDate(currentWeekStart.getDate() + i);

    const previousDay = new Date(previousWeekStart);
    previousDay.setDate(previousWeekStart.getDate() + i);

    const formattedCurrentDay = formatDateOnly(currentDay);
    const formattedPreviousDay = formatDateOnly(previousDay);

    const currentDayCount =
      currentWeekCounts.find((item) => item._id === formattedCurrentDay)
        ?.count || 0;
    const previousDayCount =
      previousWeekCounts.find((item) => item._id === formattedPreviousDay)
        ?.count || 0;

    results.push({
      day: `Day ${i + 1}`,
      currentWeek: currentDayCount,
      previousWeek: previousDayCount,
    });
  }

  return results;
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
  getUserAverageCalories,
  getFoodItemsCount,
  getUserReachedLimitDays,
  create,
  update,
  delete: _delete,
};
