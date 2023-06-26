import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    middlename: {
      type: String,
    },

    username: {
      type: String,
      require: true,
      unique: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      rquired: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    img: { type: String },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("User", userSchema);
