import joi from "joi";

import { usersRepo } from "@/app/_helpers/server/users-repo";
import { apiHandler } from "@/app/_helpers/server/api";

async function getAll() {
  return await usersRepo.getAll();
}

// async function create(req: Request) {
//   const body = await req.json();
//   await foodsRepo.create(body);
// }

// create.schema = joi.object({
//   takenAt: joi.string().required(),
//   name: joi.string().required(),
//   calorieValue: joi.string().required(),
//   cheating: joi.bool().required(),
//   userId: joi.string().required(),
// });

module.exports = apiHandler({
  GET: async (req) => {
    return getAll();
  },
  // POST: create,
});
