import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import userRouter from "./views/user-router.js"

dotenv.config()
const app = express()

app.use(express.json())
app.use("/user", userRouter)

mongoose
  .connect(`${process.env.MONGODB_URL}`)
  .then(() => app.listen(8080, () => console.log(`Connected to MongoDB`)))
  .catch((e) => console.log(e))
