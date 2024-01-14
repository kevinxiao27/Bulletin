import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import userRouter from "../views/user-router.js"
import orgRouter from "../views/org-router.js"
import bulletRouter from "../views/bullet-router.js"

dotenv.config()

function createServer() {
  const app = express()

  app.use(express.json())
  app.use("/user", userRouter)
  app.use("/org", orgRouter)
  app.use("/bulletin", bulletRouter)

  mongoose.connect(`${process.env.MONGODB_URI}`).catch((e) => console.log(e))

  return app
}

export default createServer
