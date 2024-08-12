import { NextRequest, NextResponse } from "next/server";
import { errorHandler, jwtMiddleware, validateMiddleware, IOptions } from "./";

export function apiHandler(handler: any, options?: IOptions) {
  return async (req: NextRequest, ...args: any) => {
    try {
      const json = await req.json();
      req.json = () => json;
    } catch {}

    try {
      await jwtMiddleware(req, options);
      await validateMiddleware(req, options?.schema);

      const responseBody = await handler(req, ...args);
      return NextResponse.json(responseBody || {});
    } catch (err: any) {
      return errorHandler(err);
    }
  };
}
