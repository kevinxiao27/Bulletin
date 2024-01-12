import mongoose from "mongoose"

const Schema = mongoose.Schema
const userSchema = new Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, minLength: 8 },
})

export default mongoose.model("User", userSchema)
