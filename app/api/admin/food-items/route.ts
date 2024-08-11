import joi from "joi";

import { foodsRepo } from "@/app/_helpers/server/foods-repo";
import { apiHandler } from "@/app/_helpers/server/api";

export const GET = apiHandler(
  async (req) => {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const dateFrom = url.searchParams.get("dateFrom");
    const dateTo = url.searchParams.get("dateTo");

    if (id) {
      return await foodsRepo.getById(id);
    }

    return await foodsRepo.getAll({ dateFrom, dateTo });
  },
  { admin: true }
);

// export const PUT = apiHandler(async (req: Request, { params: { id } }: any) => {
//   const body = await req.json();
//   await foodsRepo.update(id, body);
// }, { admin: true });

// export const DELETE = apiHandler(
//   async (req: Request) => {
//     const body = await req.json();
//     await foodsRepo.delete(body);
//   },
//   { admin: true }
// );
