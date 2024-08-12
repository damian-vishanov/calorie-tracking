import { usersRepo } from "@/app/_helpers/server";
import { apiHandler } from "@/app/_helpers/server/api";

export const PUT = apiHandler(
  async (req: Request, { params: { id } }: any) => {
    const body = await req.json();
    await usersRepo.update(id, body);
  },
  { admin: true }
);

export const DELETE = apiHandler(
  async (req: Request, { params: { id } }: any) => {
    await usersRepo.delete(id);
  },
  { admin: true }
);
