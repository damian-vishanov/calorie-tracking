import { foodsRepo } from "@/app/_helpers/server/foods-repo";
import { apiHandler } from "@/app/_helpers/server/api";

export const GET = apiHandler(
  async (req: Request, { params: { id } }: any) => {
    return await foodsRepo.getById(id);
  },
  { admin: true }
);

export const PUT = apiHandler(
  async (req: Request, { params: { id } }: any) => {
    const body = await req.json();
    await foodsRepo.update(id, body);
  },
  { admin: true }
);

export const DELETE = apiHandler(
  async (req: Request, { params: { id } }: any) => {
    await foodsRepo.delete(id);
  },
  { admin: true }
);
