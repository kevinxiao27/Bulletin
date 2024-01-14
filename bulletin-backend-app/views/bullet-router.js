import express from "express"
import {
  addBulletin,
  deleteBulletin,
  getAllBulletins,
  getBulletinById,
  registerUser,
  updateBulletin,
} from "../controllers/bulletin-controller.js"

const bulletRouter = express()

bulletRouter.get("/", getAllBulletins)
bulletRouter.get("/:id", getBulletinById)
bulletRouter.post("/add", addBulletin)
bulletRouter.put("/:id", updateBulletin)
bulletRouter.put("/register/:id", registerUser)
bulletRouter.delete("/:id", deleteBulletin)

export default bulletRouter
