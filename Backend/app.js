import express from "express";
import sequelize from "./config/db.connection.js";
import expenseRouter from "./routes/expense.route.js"
import userRouter from "./routes/user.route.js"
import dotenv from 'dotenv'
import cors from "cors"
import paymentRouter from "./routes/payment.route.js"

import "./models/index.js"

dotenv.config()
const app = express();

app.use(cors())
app.use(express.json());

app.use("/api/expense" , expenseRouter)
app.use("/api/user" , userRouter)
app.use("/api/payment" , paymentRouter)

sequelize.sync().then(() => {
    app.listen(3000 , (err) => {
        console.log("Server is running on port 3000");
    })
}).catch((err) => {
    console.error("Error connecting to the database:", err);
});
