import express from "express";
import { addExpense, deleteExpense, getExpense, getExpensesByUser } from "../controller/expense.controller.js";
import authenticateUser from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/add-expense",authenticateUser , addExpense);
router.get("/get-expense", authenticateUser , getExpense);
router.delete("/delete-expense/:id",authenticateUser , deleteExpense);
router.get("/get-user-expenses",authenticateUser, getExpensesByUser)

export default router;