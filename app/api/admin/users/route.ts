import joi from "joi";
import { usersRepo } from "@/app/_helpers/server/users-repo";
import { apiHandler } from "@/app/_helpers/server/api";

export const GET = apiHandler(
  async (req) => {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const page = url.searchParams.get("page");
    const pageSize = url.searchParams.get("pageSize");

    if (id) {
      return await usersRepo.getById(id);
    }

    if (page && pageSize) {
      return await usersRepo.getAllPaged({ page, pageSize });
    }

    return await usersRepo.getAll();
  },
  { admin: true }
);

async function create(req: Request) {
  const body = await req.json();
  await usersRepo.create(body);
}

export const POST = apiHandler(create, {
  schema: joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
    caloriesLimit: joi.number().required(),
    role: joi.string().required(),
  }),
  admin: true,
});
