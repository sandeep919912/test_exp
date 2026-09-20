import express from "express";
import sequelize from "./config/db.connection.js";
import expenseRouter from "./routes/expense.route.js"
import userRouter from "./routes/user.route.js"
import dotenv from 'dotenv'
import cors from "cors"
import paymentRouter from "./routes/payment.route.js"
import leaderBoardRouter from "./routes/leaderboard.route.js"
import aiRouter from "./routes/genai.route.js"
import resetRouter from "./routes/reset_pass.route.js"
import reportRouter from "./routes/reports.route.js"

import "./models/index.js"

dotenv.config()
const app = express();

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/expense" , expenseRouter)
app.use("/api/user" , userRouter)
app.use("/api/payment" , paymentRouter)
app.use("/api/leaderboard" , leaderBoardRouter)
app.use("/api/gemini" , aiRouter)
app.use("/api/reset-pass" , resetRouter)
app.use("/api/reports" , reportRouter)


const PORT = process.env.PORT
sequelize.sync().then(() => {
    app.listen(PORT , (err) => {
        console.log(`Server is running on port ${PORT}`);
    })
}).catch((err) => {
    console.error("Error connecting to the database:", err);
});
