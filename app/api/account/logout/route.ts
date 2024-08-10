import { cookies } from "next/headers";

import { apiHandler } from "@/app/_helpers/server/api";

function logout() {
  cookies().delete("authorization");
}

export const POST = apiHandler(logout, { public: true });
