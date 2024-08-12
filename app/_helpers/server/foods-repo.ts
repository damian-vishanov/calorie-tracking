import { db } from "./db";
import * as mongoose from "mongoose";

const Food = db.Food;

async function getAll(params: any) {
  const filter: any = {};

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

  function getWeekBounds(date) {
    const dayOfWeek = date.getUTCDay(); // Sunday is 0, Monday is 1, etc.
    const startOfWeek = new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1) // Monday as the start
      )
    );
    const endOfWeek = new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate() + (dayOfWeek === 0 ? 0 : 7 - dayOfWeek) // Sunday as the end
      )
    );
    endOfWeek.setUTCHours(23, 59, 59, 999); // End of the day

    return { startOfWeek, endOfWeek };
  }

  // Get the start and end dates for the current and previous weeks
  const { startOfWeek: currentWeekStart, endOfWeek: currentWeekEnd } =
    getWeekBounds(today);

  const previousWeekStart = new Date(currentWeekStart);
  previousWeekStart.setUTCDate(currentWeekStart.getUTCDate() - 7);

  const previousWeekEnd = new Date(currentWeekStart);
  previousWeekEnd.setUTCDate(currentWeekStart.getUTCDate() - 1);
  previousWeekEnd.setUTCHours(23, 59, 59, 999);

  function formatDateOnly(date) {
    return date.toISOString().split("T")[0];
  }

  const currentWeekStartISO = formatDateOnly(currentWeekStart);
  const currentWeekEndISO = formatDateOnly(currentWeekEnd);
  const previousWeekStartISO = formatDateOnly(previousWeekStart);
  const previousWeekEndISO = formatDateOnly(previousWeekEnd);

  console.log("Current Week Start:", currentWeekStart.toISOString());
  console.log("Current Week End:", currentWeekEnd.toISOString());
  console.log("Previous Week Start:", previousWeekStart.toISOString());
  console.log("Previous Week End:", previousWeekEnd.toISOString());

  // Aggregate counts for the current week
  const currentWeekCounts = await Food.aggregate([
    {
      $match: {
        $expr: {
          $and: [
            {
              $gte: ["$takenAt", currentWeekStart],
            },
            {
              $lte: ["$takenAt", currentWeekEnd],
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
            date: "$takenAt",
            timezone: "UTC",
          },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  // Aggregate counts for the previous week
  const previousWeekCounts = await Food.aggregate([
    {
      $match: {
        $expr: {
          $and: [
            {
              $gte: ["$takenAt", previousWeekStart],
            },
            {
              $lte: ["$takenAt", previousWeekEnd],
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
            date: "$takenAt",
            timezone: "UTC",
          },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  // Prepare results for each day of the current and previous week
  const results = [];
  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(currentWeekStart);
    currentDay.setUTCDate(currentWeekStart.getUTCDate() + i);

    const previousDay = new Date(previousWeekStart);
    previousDay.setUTCDate(previousWeekStart.getUTCDate() + i);

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
