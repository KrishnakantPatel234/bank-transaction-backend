import { Router } from "express";
import { authMiddleware, authSystemUserMiddleware } from "../middlewares/auth.middlewares.js";
import { createTransaction , createInitialFundsTransaction } from "../controllers/transaction.controllers.js"

const router = Router();
/**
 * - POST /api/transactions/
 * - Create a new transaction
 */
router.post("/" , authMiddleware , createTransaction);

/**
 * - POST /api/transactions/system/initial-funds
 * - Create initial funds transaction from system user
 */
router.post("/system/initial-funds" , authSystemUserMiddleware , createInitialFundsTransaction)

export default router;