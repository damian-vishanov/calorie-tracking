import joi from "joi";
import { foodsRepo } from "@/app/_helpers/server/foods-repo";
import { apiHandler } from "@/app/_helpers/server/api";

export const GET = apiHandler(
  async (req) => {
    const url = new URL(req.url);
    const dateFrom = url.searchParams.get("dateFrom");
    const dateTo = url.searchParams.get("dateTo");
    const page = url.searchParams.get("page");
    const pageSize = url.searchParams.get("pageSize");

    return await foodsRepo.getAll({ dateFrom, dateTo, page, pageSize });
  },
  { admin: true }
);

export const POST = apiHandler(
  async (req: Request) => {
    const body = await req.json();
    await foodsRepo.create(body);
  }, {
    schema: joi.object({
      takenAt: joi.string().required(),
      name: joi.string().required(),
      calorieValue: joi.string().required(),
      cheating: joi.bool().required(),
      userId: joi.string().required(),
    }),
    admin: true
  }
);
