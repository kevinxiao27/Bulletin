import mongoose from "mongoose"
import validator from "validator"

const organizationSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "username is required"],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: validator.isEmail,
      message: (props) => `${props.value} is not a valid email`,
    },
  },
  password: {
    type: String,
    minLength: 8,
    required: true,
  },
  bulletins: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Bulletin",
    },
  ],
})

export default mongoose.model("Organization", organizationSchema)
