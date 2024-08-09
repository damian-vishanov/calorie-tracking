import joi from "joi";

import { foodsRepo } from "@/app/_helpers/server/foods-repo";
import { apiHandler } from "@/app/_helpers/server/api";

async function getAll(dateFrom?: string, dateTo?: string) {
  return await foodsRepo.getAll({ dateFrom, dateTo });
}

module.exports = apiHandler({
  GET: async (req) => {
    const url = new URL(req.url);
    // const userId = url.searchParams.get("userId");
    const dateFrom = url.searchParams.get("dateFrom");
    const dateTo = url.searchParams.get("dateTo");
    // const caloriesLimit = url.searchParams.get("caloriesLimit");

    return getAll(dateFrom, dateTo);
  },
});
