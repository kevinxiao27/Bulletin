import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import userRouter from "./views/user-router.js"

dotenv.config()
const app = express()

app.use(express.json())
app.use("/user", userRouter)

mongoose
  .connect(
    `mongodb+srv://kevinxiao27:${process.env.MONGODB_PASSWORD}@cluster0.3y7wqny.mongodb.net/`
  )
  .then(() => app.listen(8080, () => console.log(`Connected to MongoDB`)))
  .catch((e) => console.log(e))
