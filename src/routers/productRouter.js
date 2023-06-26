import express from "express";
import {
  verfyTokenAndAdmin,
  verfyTokenAndAuthorization,
  verifyToken,
} from "./verifyToken.js";
import Product from "../models/product/ProductSchema.js";
import mongoose from "mongoose";
import {
  createProduct,
  getSelectedProduct,
} from "../models/product/ProductModel.js";

const router = express.Router();

//crate
router.post("/", verfyTokenAndAdmin, async (req, res, next) => {
  try {
    const data = await createProduct(req.body);
    res.json({
      status: "success",
      message: "product saved",
      data,
    });
  } catch (error) {
    next(error);
  }
});

//delete
router.delete("/:id", verfyTokenAndAdmin, async (req, res, next) => {
  const id = new mongoose.Types.ObjectId(req.params.id);

  try {
    await Product.findByIdAndDelete(id);
    res.json({
      status: "success",
      message: "product deleted",
    });
  } catch (error) {
    next(error);
  }
});

//get product
router.get("/find/:id", async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product?._id) {
      res.json({
        status: "success",
        message: "userFound",
        product,
      });
    }
  } catch (error) {
    next(error);
  }
});
//get producrts parentcat
router.get("/:id", async (req, res, next) => {
  const id = req.params.id;

  try {
    const products = await Product.find({ parentCat: id });
    console.log(products, "products");

    if (products.length > 0) {
      res.json({
        status: "success",
        message: "Products found",
        products,
      });
    } else {
      res.json({
        status: "success",
        message: "No products found",
        products: [],
      });
    }
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;

  try {
    let products;
    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }.limit(5));
    } else if (qCategory) {
      products = await Product.find({
        categories: { $in: [qCategory] },
      });
    } else {
      products = await Product.find();
    }
    res.json({
      status: "success",
      message: "fetched products",
      products,
    });
  } catch (error) {
    next(error);
  }
});
router.put("/:id", verfyTokenAndAdmin, async (req, res, next) => {
  console.log(req.params.id, req.body);
  try {
    const updateProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json({
      status: "success",
      message: "product updated",
      updateProduct,
    });
  } catch (error) {
    next(error);
  }
});
export default router;
