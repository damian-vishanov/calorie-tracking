import joi from "joi";
import { foodsRepo } from "@/app/_helpers/server/foods-repo";
import { apiHandler } from "@/app/_helpers/server/api";

async function getByUserId(
  userId: string,
  dateFrom?: string,
  dateTo?: string,
  page?: number,
  pageSize?: number
) {
  return await foodsRepo.getByUserId({
    userId,
    dateFrom,
    dateTo,
    page,
    pageSize,
  });
}

async function create(req: Request) {
  const body = await req.json();
  await foodsRepo.create(body);
}

export const GET = apiHandler(async (req) => {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");
  const dateFrom = url.searchParams.get("dateFrom");
  const dateTo = url.searchParams.get("dateTo");
  const page = url.searchParams.get("page");
  const pageSize = url.searchParams.get("pageSize");

  return getByUserId(
    userId,
    dateFrom,
    dateTo,
    parseInt(page),
    parseInt(pageSize)
  );
});

export const POST = apiHandler(create, {
  schema: joi.object({
    takenAt: joi.string().required(),
    name: joi.string().required(),
    calorieValue: joi.string().required(),
    cheating: joi.bool().required(),
    userId: joi.string().required(),
  }),
});
