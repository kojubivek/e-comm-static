import express from "express";
import {
  verfyTokenAndAdmin,
  verfyTokenAndAuthorization,
  verifyToken,
} from "./verifyToken.js";
import Order from "../models/Order.js";
const router = express.Router();

//crate
router.post("/", verifyToken, async (req, res, next) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.json({
      status: "success",
      message: "Order saved",
      savedOrder,
    });
  } catch (error) {
    next(error);
  }
});

//delete

router.put("/:id", verfyTokenAndAdmin, async (req, res, next) => {
  try {
    const updatOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json({
      status: "success",
      message: "Order updated",
      updatOrder,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", verfyTokenAndAdmin, async (req, res, next) => {
  try {
    awaitOrder.findByIdAndDelete(req.params.id);
    res.json({
      status: "success",
      message: "Order deleted",
    });
  } catch (error) {
    next(error);
  }
});

router.get("/find/:id", verfyTokenAndAuthorization, async (req, res, next) => {
  try {
    const order = await Order.find({ userId: req.params.id });

    if (order) {
      res.json({
        status: "success",
        message: "oreder Found",
        order,
      });
    }
  } catch (error) {
    next(error);
  }
});

router.get("/", verfyTokenAndAdmin, async (req, res, next) => {
  try {
    console.log("order hit");
    const orders = await Order.find();

    if (orders) {
      res.json({
        status: "success",
        message: "Order added",
        orders,
      });
    }
  } catch (error) {
    next(error);
  }
});
///
///get Monthly income

router.get("/income", verfyTokenAndAdmin, async (req, res, next) => {
  const productId = req.query.pid;
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: previousMonth },
          ...(productId && {
            products: { $elemMatch: { productId } },
          }),
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.json({
      status: "success",
      income,
    });
  } catch (error) {
    next(error);
  }
});
export default router;
