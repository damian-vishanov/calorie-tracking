import { foodsRepo } from "@/app/_helpers/server";
import { apiHandler } from "@/app/_helpers/server/api";

async function getFoodItemsCount() {
  return await foodsRepo.getFoodItemsCount();
}

export const GET = apiHandler(async () => {
  return getFoodItemsCount();
}, { admin: true });
