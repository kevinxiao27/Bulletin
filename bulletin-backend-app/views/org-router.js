import express from "express"
import {
  createOrg,
  deleteOrg,
  getAllOrgs,
  login,
  updateOrg,
} from "../controllers/org-controller.js"

const orgRouter = express()

orgRouter.get("/", getAllOrgs)
orgRouter.post("/sign-up", createOrg)
orgRouter.post("/login", login)
orgRouter.put("/:id", updateOrg)
orgRouter.delete("/:id", deleteOrg)

export default orgRouter
