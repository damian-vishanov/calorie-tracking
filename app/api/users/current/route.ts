import { usersRepo } from "@/app/_helpers/server/users-repo";
import { apiHandler } from "@/app/_helpers/server/api";

module.exports = apiHandler({
  GET: getCurrent,
});

async function getCurrent() {
  return await usersRepo.getCurrent();
}
