import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import userRouter from "../views/user-router.js"

function createServer() {
  const app = express()

  app.use(express.json())
  app.use("/user", userRouter)

  mongoose.connect(`${process.env.MONGODB_URL}`).catch((e) => console.log(e))

  return app
}

export default createServer
