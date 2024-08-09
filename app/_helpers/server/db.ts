import mongoose from "mongoose";

const Schema = mongoose.Schema;

mongoose.connect(process.env.MONGODB_URI!, { dbName: "CalorieTracking" });
mongoose.Promise = global.Promise;

export const db = {
  User: userModel(),
  Food: foodModel(),
};

function userModel() {
  const schema = new Schema(
    {
      email: { type: String, unique: true, required: true },
      hash: { type: String, required: true },
      role: { type: String, required: true },
      caloriesLimit: { type: Number, required: true },
    },
    {
      timestamps: true,
    }
  );

  schema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id;
      delete ret.hash;
    },
  });

  return mongoose.models.User || mongoose.model("User", schema);
}

function foodModel() {
  const schema = new Schema(
    {
      takenAt: { type: Date, required: true },
      name: { type: String, required: true },
      calorieValue: { type: Number, required: true, index: true },
      cheating: { type: Boolean, required: true },
      userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    },
    {
      timestamps: true,
    }
  );

  schema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id;
    },
  });

  schema.virtual("user", {
    ref: "User",
    localField: "userId",
    foreignField: "_id",
    justOne: true,
  });

  return mongoose.models.Food || mongoose.model("Food", schema);
}
