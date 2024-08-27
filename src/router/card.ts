import express from "express";
import { CardController } from "../controllers/card";
import { authMiddleware } from "../middleware/auth";

const cardController = new CardController();
const router = express.Router();

router.post("/add", authMiddleware, cardController.add);
router.get("/", authMiddleware, cardController.get);
router.put("/update",authMiddleware,cardController.update)
router.delete("/delete/:itemId",authMiddleware,cardController.delete)

export default router;
