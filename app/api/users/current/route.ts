import { usersRepo } from "@/app/_helpers/server/users-repo";
import { apiHandler } from "@/app/_helpers/server/api";

export const GET = apiHandler(async () => {
  return await usersRepo.getCurrent();
});
