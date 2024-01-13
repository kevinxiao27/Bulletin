import mongoose from "mongoose"

const bulletinSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  organizations: [{ type: mongoose.Types.ObjectId, ref: "Organization" }],
  releaseDate: {
    type: String,
    required: true,
  },
  posterUrl: {
    type: String,
    required: true,
  },
  featured: {
    type: Boolean,
  },
  registered: [{ type: mongoose.Types.ObjectId, ref: "User" }],
})

export default mongoose.model("Bulletin", bulletinSchema)
