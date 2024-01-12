import mongoose from "mongoose"

const { isEmail } = require("validator")
const Schema = mongoose.Schema
const userSchema = new Schema({
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
      validator: isEmail,
      message: (props) => `${props.value} is not a valid email`,
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    validate: {
      validator: function (value) {
        return value.length >= 6
      },
      message: () => "Password must be at least six characters long",
    },
  },
})

export default mongoose.model("User", userSchema)
