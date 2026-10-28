import express from "express";
import { getLeaderBoard } from "../controller/leaderboard.controller.js";
import authenticateUser from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/get-leaderboard", authenticateUser , getLeaderBoard)

export default router;