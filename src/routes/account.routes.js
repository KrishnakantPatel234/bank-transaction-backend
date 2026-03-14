import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middlewares.js";
import { createAccount } from "../controllers/account.controllers.js";

const router = Router();

/**
 * - POST /api/account/
 * - Create a new account
 * - Protected Route
 */
router.post("/" , authMiddleware , createAccount);


export default router;