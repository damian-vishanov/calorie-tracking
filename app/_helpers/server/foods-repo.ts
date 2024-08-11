import { db } from "./db";
const mongoose = require("mongoose");

const Food = db.Food;

async function getAll(params: any) {
  let filter: any = {};

  // Filter based on date range if provided
  if (params.dateFrom && params.dateTo) {
    filter.takenAt = {
      $gte: new Date(params.dateFrom),
      $lte: new Date(params.dateTo),
    };
  }

  const page = params.page ? parseInt(params.page, 10) : 1;
  const pageSize = params.pageSize ? parseInt(params.pageSize, 10) : 10;

  // Calculate the number of documents to skip
  const skip = (page - 1) * pageSize;

  // Fetch the total count of documents matching the filter
  const totalItems = await Food.countDocuments(filter);

  // Fetch the documents with pagination
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
        $gte: params.dateFrom,
        $lte: params.dateTo,
      },
    };
  } else {
    filter = {
      userId: params.userId,
    };
  }

  const page = params.page ? parseInt(params.page, 10) : 1;
  const pageSize = params.pageSize ? parseInt(params.pageSize, 10) : 10;

  // Calculate the number of documents to skip
  const skip = (page - 1) * pageSize;

  // Fetch the total count of documents matching the filter
  const totalItems = await Food.countDocuments(filter);

  const items = await Food.find(filter)
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

// async function getUserAverageCalories(params: any) {
//   const filter = {
//     userId: new mongoose.Types.ObjectId(params.userId),
//     takenAt: {
//       $gte: new Date(params.dateFrom),
//       $lte: new Date(params.dateTo),
//     },
//     cheating: false,
//   };

//   const result = await Food.aggregate([
//     { $match: filter },
//     { $group: { _id: null, averageCalories: { $avg: "$calorieValue" } } },
//     { $project: { _id: 0, averageCalories: 1 } },
//   ]);

//   return result.length > 0 ? result[0].averageCalories : 0;
// }

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
        from: "users", // Assuming the 'User' collection is named 'users'
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
      $sort: { email: 1 }, // Sort by email or another field if needed
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

  // Get the current date and compute the start and end of the current and previous weeks
  const today = new Date();

  // Current week: from 6 days ago to today
  const currentWeekEnd = new Date(today);
  const currentWeekStart = new Date(today);
  currentWeekStart.setDate(today.getDate() - 6);

  // Previous week: from 13 days ago to 7 days ago
  const previousWeekEnd = new Date(today);
  previousWeekEnd.setDate(today.getDate() - 7);
  const previousWeekStart = new Date(today);
  previousWeekStart.setDate(today.getDate() - 13);

  // Function to convert a date to YYYY-MM-DD format string
  function formatDateOnly(date) {
    return date.toISOString().split("T")[0];
  }

  // Function to match date only (strips the time part)
  function matchDateOnly(field, date) {
    return {
      $eq: [
        {
          $dateToString: {
            format: "%Y-%m-%d",
            date: {
              $dateFromParts: {
                year: {
                  $year: { date: `$${field}`, timezone: serverTimezone },
                },
                month: {
                  $month: { date: `$${field}`, timezone: serverTimezone },
                },
                day: {
                  $dayOfMonth: { date: `$${field}`, timezone: serverTimezone },
                },
              },
            },
            timezone: serverTimezone,
          },
        },
        date,
      ],
    };
  }

  // Query 1: Get food item counts for the current week
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
      $sort: { _id: 1 }, // Sort by day
    },
  ]);

  // Query 2: Get food item counts for the previous week
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
      $sort: { _id: 1 }, // Sort by day
    },
  ]);

  // Process the results on the server to create the desired array
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

// async function getFoodItemsCount() {
//   const serverTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

//   // Get the current date and compute the start and end of the current and previous weeks
//   const today = new Date();
//   const currentWeekStart = new Date(today);
//   currentWeekStart.setDate(today.getDate() - today.getDay()); // Set to Sunday of the current week
//   const currentWeekEnd = new Date(currentWeekStart);
//   currentWeekEnd.setDate(currentWeekStart.getDate() + 6); // End of the current week

//   const previousWeekStart = new Date(currentWeekStart);
//   previousWeekStart.setDate(currentWeekStart.getDate() - 7); // Start of the previous week
//   const previousWeekEnd = new Date(currentWeekEnd);
//   previousWeekEnd.setDate(currentWeekEnd.getDate() - 7); // End of the previous week

//   const pipeline = [
//     {
//       $match: {
//         takenAt: {
//           $gte: previousWeekStart,
//           $lte: currentWeekEnd,
//         },
//       },
//     },
//     {
//       $addFields: {
//         week: {
//           $cond: [
//             {
//               $and: [
//                 { $gte: ["$takenAt", currentWeekStart] },
//                 { $lte: ["$takenAt", currentWeekEnd] },
//               ],
//             },
//             "currentWeek",
//             "previousWeek",
//           ],
//         },
//         day: {
//           $dateToString: {
//             format: "%Y-%m-%d",
//             date: {
//               $dateFromParts: {
//                 year: { $year: { date: "$takenAt", timezone: serverTimezone } },
//                 month: {
//                   $month: { date: "$takenAt", timezone: serverTimezone },
//                 },
//                 day: {
//                   $dayOfMonth: { date: "$takenAt", timezone: serverTimezone },
//                 },
//               },
//             },
//             timezone: serverTimezone,
//           },
//         },
//       },
//     },
//     {
//       $group: {
//         _id: { week: "$week", day: "$day" },
//         count: { $sum: 1 },
//       },
//     },
//     {
//       $group: {
//         _id: "$_id.day",
//         counts: {
//           $push: {
//             week: "$_id.week",
//             count: "$count",
//           },
//         },
//       },
//     },
//     {
//       $project: {
//         _id: 0,
//         day: "$_id",
//         currentWeek: {
//           $sum: {
//             $cond: [
//               { $eq: ["$counts.week", "currentWeek"] },
//               "$counts.count",
//               0,
//             ],
//           },
//         },
//         previousWeek: {
//           $sum: {
//             $cond: [
//               { $eq: ["$counts.week", "previousWeek"] },
//               "$counts.count",
//               0,
//             ],
//           },
//         },
//       },
//     },
//   ];

//   const results = await Food.aggregate(pipeline).sort({ day: 1 });

//   // Format the results to match the desired structure
//   const formattedResults = results.map((result, index) => ({
//     day: `Day ${index + 1}`,
//     currentWeek: result.currentWeek,
//     previousWeek: result.previousWeek,
//   }));
//   console.log(formattedResults);
//   return formattedResults;
// }

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
  getUserAverageCalories,
  getFoodItemsCount,
  getUserReachedLimitDays,
  create,
  update,
  delete: _delete,
};
