import express from "express";
import { CategoryController } from "../controllers/category";
import { adminMiddleware } from "../middleware/auth";

const categoryController = new CategoryController();
const router = express.Router();

router.post("/create", adminMiddleware, categoryController.create);
router.get("/", categoryController.readAll);
router.get("/:id", categoryController.readByID);
router.delete("/delete/:id", adminMiddleware, categoryController.deleteByID);
router.put("/update/:id", adminMiddleware, categoryController.updateByID);

export default router;
