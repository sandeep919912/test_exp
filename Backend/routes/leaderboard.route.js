import express from "express";
import { getLeaderBoard } from "../controller/leaderboard.controller.js";

const router = express.Router();

router.get("/get-leaderboard" , getLeaderBoard)

export default router;