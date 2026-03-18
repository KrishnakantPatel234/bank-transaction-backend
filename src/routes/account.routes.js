import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middlewares.js";
import { createAccount, getAllAccounts } from "../controllers/account.controllers.js";

const router = Router();

/**
 * - POST /api/account/
 * - Create a new account
 * - Protected Route
 */
router.get("/" , authMiddleware , getAllAccounts);
router.post("/create" , authMiddleware , createAccount);


export default router;