import { foodsRepo } from "@/app/_helpers/server";
import { apiHandler } from "@/app/_helpers/server/api";

async function getAverageCalories(
  dateFrom?: string,
  dateTo?: string,
  page?: number,
  pageSize?: number
) {
  const averageCalories = await foodsRepo.getUserAverageCalories({
    dateFrom,
    dateTo,
    page,
    pageSize,
  });
  return averageCalories;
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
}, { admin: true });
