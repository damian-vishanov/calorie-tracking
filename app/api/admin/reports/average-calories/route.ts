import { foodsRepo, usersRepo } from "@/app/_helpers/server";
import { apiHandler } from "@/app/_helpers/server/api";

async function getAverageCalories(
  dateFrom?: string,
  dateTo?: string,
  page?: number,
  pageSize?: number
) {
  // const results = [];

  // const users = await usersRepo.getAll();
  // for (const user of users) {
  //   const averageCalories = await foodsRepo.getUserAverageCalories({
  //     userId: user._id,
  //     dateFrom,
  //     dateTo,
  //     page,
  //     pageSize,
  //   });

  //   results.push({
  //     userId: user._id,
  //     email: user.email,
  //     averageCalories,
  //   });
  // }

  // return results;
  const averageCalories = await foodsRepo.getUserAverageCalories({
    dateFrom,
    dateTo,
    page,
    pageSize,
  });
  return averageCalories;
  // console.log(averageCalories);
}

export const GET = apiHandler(async (req) => {
  const url = new URL(req.url);
  const dateFrom = url.searchParams.get("dateFrom");
  const dateTo = url.searchParams.get("dateTo");
  const page = url.searchParams.get("page");
  const pageSize = url.searchParams.get("pageSize");

  return getAverageCalories(
    dateFrom,
    dateTo,
    parseInt(page),
    parseInt(pageSize)
  );
});
