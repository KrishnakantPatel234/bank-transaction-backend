import { Router } from "express";

// Controllers
import { registerUser , loginUser, logoutUser } from "../controllers/auth.controllers.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";

const router = Router();

router.post("/register" , registerUser )

router.post("/login" , loginUser);

router.post("/logout" , authMiddleware , logoutUser);

export default router;