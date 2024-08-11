import { foodsRepo, usersRepo } from "@/app/_helpers/server";
import { apiHandler } from "@/app/_helpers/server/api";
import { isError } from "joi";

async function getAverageCalories2(
  userId: string,
  dateFrom: string,
  dateTo: string
) {
  const result = [];
  const users = await usersRepo.getAll();

  await foodsRepo.getUserAverageCalories({ userId, dateFrom, dateTo });

  return result;
}

async function getAverageCalories(dateFrom?: string, dateTo?: string) {
  const users = await usersRepo.getAll();
  const results = [];
  for (const user of users) {
    const averageCalories = await foodsRepo.getUserAverageCalories({
      userId: user._id,
      dateFrom,
      dateTo,
    });
    results.push({
      userId: user._id,
      email: user.email,
      averageCalories,
    });
  }

  return results;
}

export const GET = apiHandler(async (req) => {
  const url = new URL(req.url);
  const dateFrom = url.searchParams.get("dateFrom");
  const dateTo = url.searchParams.get("dateTo");

  return getAverageCalories(dateFrom, dateTo);
});
