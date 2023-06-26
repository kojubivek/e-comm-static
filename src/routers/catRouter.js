import express from "express";
import {
  createNewCategory,
  deleteCat,
  getCategoryById,
  updateCategory,
} from "../models/category/CategoryModel.js";
import { readCategories } from "../models/category/CategoryModel.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const category = req.body;

    const data = await createNewCategory(category);
    if (data?.id) {
      res.json({
        status: "success",
        message: "category created",
        data,
      });
    }
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const data = await readCategories();

    if (data) {
      res.json({
        status: "success",
        message: "category fetched",
        data,
      });
    }
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  const catid = req.params.id;
  try {
    const data = await getCategoryById(catid);
    console.log(data, "catid");
    if (data) {
      res.json({
        status: "success",
        message: "category id",
        data,
      });
    }
  } catch (error) {}
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    console.log(id);
    const data = await deleteCat(id);
    console.log(data, "deletedadta");
    if (data) {
      res.json({
        status: "success",
        message: "category deleted",
        data,
      });
    }
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const category = req.body;
    console.log(category, "data");
    const data = await updateCategory(category);
    console.log(data, "updated");
    if (data) {
      res.json({
        status: "success",
        message: "category updatefed",
        data,
      });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
