import { foodsRepo } from "@/app/_helpers/server/foods-repo";
import { apiHandler } from "@/app/_helpers/server/api";

export const GET = apiHandler(
  async (req: Request, { params: { id } }: any) => {
    return await foodsRepo.getByIdAndUserId(id, req.headers.get("userId"));
  }
);

export const PUT = apiHandler(
  async (req: Request, { params: { id } }: any) => {
    const body = await req.json();
    await foodsRepo.updateByIdAndUserId(id, req.headers.get("userId"), body);
  }
);

export const DELETE = apiHandler(
  async (req: Request, { params: { id } }: any) => {
    await foodsRepo.deleteByIdAndUserId(id, req.headers.get("userId"));
  }
);
