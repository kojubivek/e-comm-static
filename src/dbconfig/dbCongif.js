import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export const dbConnect = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGO_CLIENT);

    if (con) {
      console.log("Database connected");
    } else {
      console.log("cannot connect db");
    }
  } catch (error) {
    console.log(error.message);
  }
};
