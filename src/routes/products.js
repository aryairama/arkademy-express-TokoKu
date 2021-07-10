import express from "express";
const router = express.Router();
import ControllerProduct from "../controllers/ControllerProducts.js";
import ValidationProducts from "../validations/ValidationProducts.js";
router
  .get("/", ValidationProducts("read"), ControllerProduct.readProduct)
  .post("/", ValidationProducts("create"), ControllerProduct.insertProduct)
  .put("/:id", ValidationProducts("update"), ControllerProduct.updateProduct)
  .delete("/:id", ValidationProducts("delete"), ControllerProduct.deleteProduct);

export default router;
