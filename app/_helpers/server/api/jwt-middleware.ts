import { NextRequest } from "next/server";

import { auth } from "../auth";

import { usersRepo } from "../users-repo";

export async function jwtMiddleware(req: NextRequest) {
  if (isPublicPath(req)) return;

  const id = auth.verifyToken();
  if (isAdminPath(req)) {
    console.log("isAdminPath: ", true);
    const currentUser = await usersRepo.getById(id);
    if (currentUser.role !== "Admin") return;
  }

  req.headers.set("userId", id);
}

function isPublicPath(req: NextRequest) {
  const publicPaths = ["POST:/api/account/login", "POST:/api/account/logout"];
  return publicPaths.includes(`${req.method}:${req.nextUrl.pathname}`);
}

function isAdminPath(req: NextRequest) {
  const publicPaths = [
    "GET:/api/admin/food-items, GET:/api/admin/reports, GET:/api/admin/users-management",
  ];
  return publicPaths.includes(`${req.method}:${req.nextUrl.pathname}`);
}
