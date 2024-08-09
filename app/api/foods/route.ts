import joi from "joi";

import { foodsRepo } from "@/app/_helpers/server/foods-repo";
import { apiHandler } from "@/app/_helpers/server/api";

async function getByUserId(userId: string, dateFrom?: string, dateTo?: string) {
  return await foodsRepo.getByUserId({ userId, dateFrom, dateTo });
}

async function getUserReachedLimitDays(userId: string, caloriesLimit: number) {
  return await foodsRepo.getUserReachedLimitDays({ userId, caloriesLimit });
}

async function create(req: Request) {
  const body = await req.json();
  await foodsRepo.create(body);
}

getByUserId.schema = joi.object({
  userId: joi.string().required(),
});

create.schema = joi.object({
  takenAt: joi.string().required(),
  name: joi.string().required(),
  calorieValue: joi.string().required(),
  cheating: joi.bool().required(),
  userId: joi.string().required(),
});

module.exports = apiHandler({
  GET: async (req) => {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    const dateFrom = url.searchParams.get("dateFrom");
    const dateTo = url.searchParams.get("dateTo");
    const caloriesLimit = url.searchParams.get("caloriesLimit");

    if (userId && caloriesLimit) {
      return getUserReachedLimitDays(userId, parseInt(caloriesLimit));
    } else {
      return getByUserId(userId, dateFrom, dateTo);
    }
  },
  POST: create,
});
