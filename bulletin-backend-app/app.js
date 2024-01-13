// import express from "express"
// import mongoose, { connect } from "mongoose"
import dotenv from "dotenv"
import createServer from "./utils/server.js"

dotenv.config()
const app = createServer()

app.listen(8080, async () => {
  console.log("Connected to MongoDB and running at http://localhost:8080")
})
