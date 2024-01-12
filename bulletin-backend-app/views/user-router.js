import express from "express"
import { getAllUsers, createUser } from "../controllers/user-controller.js"

const userRouter = express.Router()

userRouter.get("/", getAllUsers)
userRouter.post("/sign-up", createUser)

export default userRouter
