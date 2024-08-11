import { foodsRepo } from "@/app/_helpers/server/foods-repo";
import { apiHandler } from "@/app/_helpers/server/api";

export const GET = apiHandler(
  async (req) => {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const dateFrom = url.searchParams.get("dateFrom");
    const dateTo = url.searchParams.get("dateTo");
    const page = url.searchParams.get("page");
    const pageSize = url.searchParams.get("pageSize");

    if (id) {
      return await foodsRepo.getById(id);
    }

    return await foodsRepo.getAll({ dateFrom, dateTo, page, pageSize });
  },
  { admin: true }
);
