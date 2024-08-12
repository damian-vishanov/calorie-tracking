import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export { errorHandler };

function errorHandler(err: Error | string) {
  if (typeof err === "string") {
    const is404 = err.toLowerCase().endsWith("not found");
    const status = is404 ? 404 : 400;
    return NextResponse.json({ message: err }, { status });
  }

  if (err.name === "JsonWebTokenError") {
    cookies().delete("authorization");
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (err.message === "InsufficientPrivilegesError") {
    return NextResponse.json(
      { message: "Insufficient privileges to complete the operation" },
      { status: 403 }
    );
  }

  console.error(err);
  return NextResponse.json({ message: err.message }, { status: 500 });
}
