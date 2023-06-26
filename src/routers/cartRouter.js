import express from "express";
import {
  verfyTokenAndAdmin,
  verfyTokenAndAuthorization,
  verifyToken,
} from "./verifyToken.js";
import Cart from "../models/Cart.js";
const router = express.Router();

//crate
router.post("/", verifyToken, async (req, res, next) => {
  const newCart = new Cart(req.body);
  try {
    const savedCart = await newCart.save();
    res.json({
      status: "success",
      message: "cart saved",
      savedCart,
    });
  } catch (error) {
    next(error);
  }
});

//delete

router.put("/:id", verfyTokenAndAuthorization, async (req, res, next) => {
  try {
    const updateCart = await Cart.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json({
      status: "success",
      message: "Cart updated",
      updateCart,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", verfyTokenAndAuthorization, async (req, res, next) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.json({
      status: "success",
      message: "Cart deleted",
    });
  } catch (error) {
    next(error);
  }
});

router.get("/find/:id", verfyTokenAndAuthorization, async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (cart?._id) {
      res.json({
        status: "success",
        message: "userFound",
        cart,
      });
    }
  } catch (error) {
    next(error);
  }
});

router.get("/", verfyTokenAndAdmin, async (req, res, next) => {
  try {
    const carts = await Cart.find();
    if (carts) {
      res.json({
        status: "success",
        message: "cartadded",
        carts,
      });
    }
  } catch (error) {
    next(error);
  }
});
export default router;
