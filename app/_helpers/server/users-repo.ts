import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { db } from "./db";

const User = db.User;

async function authenticate({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = await User.findOne({ email });
  if (!(user && bcrypt.compareSync(password, user.hash))) {
    throw "Email or password is incorrect";
  }

  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  return {
    user: user.toJSON(),
    token,
  };
}

async function getAllPaged(params: any) {
  const page = params.page ? parseInt(params.page, 10) : 1;
  const pageSize = params.pageSize ? parseInt(params.pageSize, 10) : 10;

  // Calculate the number of documents to skip
  const skip = (page - 1) * pageSize;

  // Fetch the total count of documents matching the filter
  const totalItems = await User.countDocuments();

  // Fetch the documents with pagination
  const items = await User.find().sort({ role: 1 }).skip(skip).limit(pageSize);

  return {
    items,
    totalItems,
    page,
    pageSize,
  };
}

async function getAll() {
  return await User.find().sort({ role: 1 });
}

async function getById(id: string) {
  try {
    return await User.findById(id);
  } catch {
    throw "User Not Found";
  }
}

async function getCurrent() {
  try {
    const currentUserId = headers().get("userId");
    return await User.findById(currentUserId);
  } catch {
    throw "Current User Not Found";
  }
}

async function create(params: any) {
  if (await User.findOne({ username: params.email })) {
    throw 'Email "' + params.email + '" is already taken';
  }

  const user = new User(params);

  if (params.password) {
    user.hash = bcrypt.hashSync(params.password, 10);
  }

  await user.save();
}

async function update(id: string, params: any) {
  await User.findOneAndUpdate({ _id: id }, params);
}

async function _delete(id: string) {
  await User.findByIdAndDelete(id);
}

export const usersRepo = {
  authenticate,
  getAll,
  getAllPaged,
  getById,
  getCurrent,
  create,
  update,
  delete: _delete,
};
