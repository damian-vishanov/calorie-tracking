import joi from "joi";
import { NextRequest, NextResponse } from "next/server";
import { errorHandler, jwtMiddleware, validateMiddleware, IOptions } from "./";

export function apiHandler(handler: any, options?: IOptions) {
  return async (req: NextRequest, ...args: any) => {
    try {
      // monkey patch req.json() because it can only be called once
      const json = await req.json();
      req.json = () => json;
    } catch {}

    try {
      // global middleware
      await jwtMiddleware(req, options);
      await validateMiddleware(req, options?.schema);

      // route handler
      const responseBody = await handler(req, ...args);
      return NextResponse.json(responseBody || {});
    } catch (err: any) {
      // global error handler
      return errorHandler(err);
    }
  };
}
