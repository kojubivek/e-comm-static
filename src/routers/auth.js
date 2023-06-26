import express from "express";
import dotenv from "dotenv";
import CryptoJS from "crypto-js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();
dotenv.config();

router.get("/", (req, res, next) => {
  res.json({
    status: "success",
    message: "auth",
  });
});

router.post("/register", async (req, res, next) => {
  const newUser = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    middlename: req.body.middlename,

    username: req.body.username,
    email: req.body.email,

    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.Pass_KEY
    ).toString(),
  });
  console.log(newUser), "new user";
  try {
    const savedUser = await newUser.save();
    console.log("hitheer");
    res.json({
      status: "success",
      message: "user created",
      savedUser,
    });
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error collection")) {
      error.message =
        "There is already account exist associated with this email";
      error.errorCode = 200;
    }
    next(error);
  }
});
//LOGIN

router.post("/login", async (req, res, next) => {
  try {
    console.log(req.body);
    const user = await User.findOne({ username: req.body.username });
    console.log(user, "user");
    if (user?.id) {
      const hasedPassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.PASS_KEY
      ).toString(CryptoJS.enc.Utf8);

      if (hasedPassword === req.body.password) {
        const { password, ...others } = user._doc;
        console.log(others);
        const accesstoken = jwt.sign(
          {
            id: user?._id,
            isAdmin: user.isAdmin,
          },
          process.env.JWT_KEY,
          { expiresIn: "3d" }
        );
        res.json({
          status: "success",
          message: "login Succesfull",

          ...others,
          accesstoken,
        });
        return;
      }
    }
    res.json({
      status: "error",
      message: "wrong credentials",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
