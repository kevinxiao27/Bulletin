import express from "express"
import {
  getAllUsers,
  createUser,
  login,
} from "../controllers/user-controller.js"

const userRouter = express.Router()

userRouter.get("/", getAllUsers)
userRouter.post("/sign-up", createUser)
userRouter.post("/login", login)

export default userRouter
