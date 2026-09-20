import express from "express"
import { getDownloads } from "../controller/reports.controller.js"
import authenticateUser from "../middleware/auth.middleware.js"

const router = express.Router()

router.get("/downloads" , authenticateUser , getDownloads)
export default router