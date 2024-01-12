import User from "../models/User.js"
import bcrypt from "bcrypt"

export const getAllUsers = async (req, res, next) => {
  let users
  try {
    users = await User.find()
  } catch (error) {
    return console.log(err)
  }
  if (!users) {
    return res.status(500).json({ message: "Unexpected Error Occured" })
  }

  return res.status(200).json({ users })
}

export const createUser = async (req, res, next) => {
  const { username, email, password } = req.body
  const hashedPassword = bcrypt.hashSync(password, 10)

  if (
    !username &&
    username.trim() === "" &&
    !email &&
    email.trim() === "" &&
    !password &&
    password.trim() === ""
  ) {
    return res.status(422).json({ message: "Please enter valid inputs." })
  }

  let emailExists = await User.findOne({ email })
  let userExists = await User.findOne({ username })

  if (emailExists) {
    res.status(401).json({ message: "Email is already in use." })
  } else if (userExists) {
    res.status(401).json({ message: "Username is already in use." })
  }

  let user
  try {
    user = new User({ username, email, password: hashedPassword })
    user = await user.save()
  } catch (err) {
    return console.log(err)
  }

  if (!user) {
    return res.status(500).json({ message: "Unexpected Error Occurred" })
  }
  return res.status(201).json({ user })
}
