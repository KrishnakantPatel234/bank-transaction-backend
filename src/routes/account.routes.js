import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middlewares.js";
import { createAccount, getAllAccounts , getAccountBalance } from "../controllers/account.controllers.js";

const router = Router();

/**
 * - GET /api/accounts/
 * - get all accounts
 * - Protected Route
 */
router.get("/" , authMiddleware , getAllAccounts);

/**
 * - POST /api/accounts/create
 * - Create a new account
 * - Protected Route
 */
router.post("/create" , authMiddleware , createAccount);

/**
 * - POST /api/accounts/balance/:accountId
 * - get account balance
 * - Protected Route
 */
router.get("/balance/:accountId" , authMiddleware , getAccountBalance);


export default router;