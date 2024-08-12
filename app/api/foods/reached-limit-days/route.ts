import { foodsRepo } from "@/app/_helpers/server";
import { apiHandler } from "@/app/_helpers/server/api";

async function getUserReachedLimitDays(userId: string, caloriesLimit: number) {
  return await foodsRepo.getUserReachedLimitDays({ userId, caloriesLimit });
}

export const GET = apiHandler(async (req) => {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");
  const caloriesLimit = url.searchParams.get("caloriesLimit");

  return getUserReachedLimitDays(userId, parseInt(caloriesLimit));
});
