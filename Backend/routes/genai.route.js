import express from "express"
import { askGemini, suggestCategory } from "../controller/genai.controller.js"

const router = express.Router()

router.post("/ask" , askGemini)
router.post("/suggestion" , suggestCategory)

export default router