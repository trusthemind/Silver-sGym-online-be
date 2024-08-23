import express from "express";
import { AuthController } from "../controllers/auth"; 
import { authMiddleware } from "../middleware/auth"; 

const authController = new AuthController();
const router = express.Router();

router.post("/registration", authController.registration);
router.post("/login", authController.login);
router.get("/me", authMiddleware, authController.getUser);

export default router;
