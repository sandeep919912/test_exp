import express from "express";
import authenticateUser from "../middleware/auth.middleware.js";
import { createPayment, verifyPayment } from "../controller/payment.controller.js";

const router = express.Router();

router.post("/create-order", authenticateUser , createPayment)
router.get("/verify" , verifyPayment)

export default router;