import { NextRequest } from "next/server";
import { auth } from "../auth";
import { usersRepo } from "../users-repo";
import { IOptions } from "./";

export async function jwtMiddleware(req: NextRequest, options?: IOptions) {
  if (options?.public) return;

  const id = auth.verifyToken();
  if (options?.admin) {
    const currentUser = await usersRepo.getById(id);
    if (currentUser.role !== "Admin") return;
  }

  req.headers.set("userId", id);
}
