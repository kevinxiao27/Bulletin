import mongoose from "mongoose"
import validator from "validator"

const bulletinSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  organization: {
    type: mongoose.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  date: {
    type: String,
    required: true,
    // validate: {
    //   validator: validator.isDate,
    //   message: (props) => {
    //     ;`${props.value} is not a valid date input`
    //   },
    // },
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
