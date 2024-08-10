import joi from "joi";

import { foodsRepo } from "@/app/_helpers/server/foods-repo";
import { apiHandler } from "@/app/_helpers/server/api";

async function getAll(dateFrom?: string, dateTo?: string) {
  return await foodsRepo.getAll({ dateFrom, dateTo });
}

async function getById(id: string) {
  return await foodsRepo.getById(id);
}

async function update(req: Request, { params: { id } }: any) {
  const body = await req.json();
  await foodsRepo.update(id, body);
}

async function _delete(req: Request) {
  const body = await req.json();
  await foodsRepo.delete(body);
}

module.exports = apiHandler({
  GET: async (req) => {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const dateFrom = url.searchParams.get("dateFrom");
    const dateTo = url.searchParams.get("dateTo");
    console.log("ID: ", id);
    if (id) {
      return getById(id);
    }

    return getAll(dateFrom, dateTo);
  },
  PUT: update,
  DELETE: _delete,
});
