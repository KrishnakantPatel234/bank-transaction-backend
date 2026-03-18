import express from "express";
import cookieParser from "cookie-parser";

/**
 * - Routes required
 */
import authRoutes from "./routes/auth.routes.js";
import accountRoutes from "./routes/account.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
const app = express();

/**
 * - Middlewares
 */
app.use(express.json());
app.use(cookieParser());

/**
 * - Use Routes
 */
app.use("/api/auth" , authRoutes);
app.use("/api/accounts" , accountRoutes);
app.use("/api/transactions" , transactionRoutes);

export default app;