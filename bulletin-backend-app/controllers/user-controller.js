import User from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

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
    res.status(400).json({ message: "Email is already in use." })
  } else if (userExists) {
    res.status(400).json({ message: "Username is already in use." })
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

export const login = async (req, res, next) => {
  const { username, email, password } = req.body

  let foundUser
  try {
    if (!username) {
      foundUser = await User.findOne({ email })
    } else {
      foundUser = await User.findOne({ username })
    }
  } catch (error) {
    return console.log(error)
  }

  if (!foundUser) {
    return res.status(404).json({ message: "Unable to find matching user." })
  }

  const passwordMatch = bcrypt.compareSync(password, foundUser.password)
  if (!passwordMatch) {
    return res.status(400).json({ message: "Wrong password." })
  }

  const token = jwt.sign({ id: foundUser._id }, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })

  return res.status(200).json({
    message: "User logged in successfully",
    token,
    id: foundUser._id,
  })
}
