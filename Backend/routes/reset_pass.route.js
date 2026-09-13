import express from 'express'
import { resetPassword, sendMail, verifyFPrequest } from '../controller/reset_pass.controller.js'

const router = express.Router()

router.post("/sendmail" , sendMail)
router.get("/verify-request/:id" , verifyFPrequest)
router.post("/resetPassword/:id" , resetPassword)

export default router