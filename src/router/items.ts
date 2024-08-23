import express from "express";
import { ItemsController } from "../controllers/item";
import { adminMiddleware } from "../middleware/auth";

const itemsController = new ItemsController();
const router = express.Router();

router.post("/create", adminMiddleware, itemsController.create);
router.get("/", itemsController.readAll);
router.get("/:id", itemsController.readByID);
router.delete("/delete/:id", adminMiddleware, itemsController.deleteByID);
router.put("/update/:id", adminMiddleware, itemsController.updateByID);

export default router;
