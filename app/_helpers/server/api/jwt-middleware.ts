import { NextRequest } from "next/server";

import { auth } from "../auth";

export async function jwtMiddleware(req: NextRequest) {
  if (isPublicPath(req)) return;

  const id = auth.verifyToken();
  req.headers.set("userId", id);
}

function isPublicPath(req: NextRequest) {
  const publicPaths = ["POST:/api/account/login", "POST:/api/account/logout"];
  return publicPaths.includes(`${req.method}:${req.nextUrl.pathname}`);
}
