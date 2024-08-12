import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  email: String,
  hash: String,
  role: String,
  caloriesLimit: Number,
});

const UserModel = mongoose.model("User", userSchema);

async function seedUsers() {
  mongoose.connect(process.env.MONGODB_URI, { dbName: "CalorieTracking" });

  const users = await UserModel.find();

  if (!users.length) {
    const adminUser = {
      email: process.env.ADMIN_EMAIL,
      hash: process.env.ADMIN_PASSWORD,
      role: "Admin",
      caloriesLimit: 2100,
    };

    const salt = await bcrypt.genSalt(10);
    const adminHashedPassword = await bcrypt.hash(adminUser.hash, salt);
    adminUser.hash = adminHashedPassword;

    await UserModel.create(adminUser);
    console.log("Admin user created successfully");

    const clientUser = {
      email: process.env.CLIENT_EMAIL,
      hash: process.env.CLIENT_PASSWORD,
      role: "Client",
      caloriesLimit: 2100,
    };

    const clientHashedPassword = await bcrypt.hash(clientUser.hash, salt);
    clientUser.hash = clientHashedPassword;

    await UserModel.create(clientUser);
    console.log("Client user created successfully");
  } else {
    console.log("Users already exists");
  }

  await mongoose.disconnect();
}

seedUsers()
  .then(() => {
    console.log("Users seeding completed");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error seeding users:", err);
    process.exit(1);
  });
