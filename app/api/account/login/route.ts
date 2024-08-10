import { cookies } from "next/headers";
import joi from "joi";

import { usersRepo } from "@/app/_helpers/server/users-repo";
import { apiHandler } from "@/app/_helpers/server/api";

async function login(req: Request) {
  const body = await req.json();
  const { user, token } = await usersRepo.authenticate(body);

  cookies().set("authorization", token, { httpOnly: true });

  return user;
}

const schema = joi.object({
  email: joi.string().required().email(),
  password: joi.string().required(),
});

export const POST = apiHandler(login, { schema, public: true });
