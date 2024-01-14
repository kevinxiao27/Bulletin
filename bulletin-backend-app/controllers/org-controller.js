import Organization from "../models/Organization.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const getAllOrgs = async (req, res, next) => {
  let orgs
  try {
    orgs = await Organization.find()
  } catch (error) {
    return console.log(err)
  }
  if (!orgs) {
    return res.status(500).json({ message: "Unexpected Error Occured" })
  }

  return res.status(200).json({ orgs })
}

export const createOrg = async (req, res, next) => {
  const { username, email, password } = req.body

  if (
    !username ||
    username.trim() === "" ||
    !email ||
    email.trim() === "" ||
    !password ||
    password.trim() === ""
  ) {
    return res.status(422).json({ message: "Please enter valid inputs." })
  }
  const hashedPassword = bcrypt.hashSync(password, 10)

  let emailExists = await Organization.findOne({ email })
  let orgExists = await Organization.findOne({ username })

  if (emailExists) {
    return res.status(400).json({ message: "Email is already in use." })
  } else if (orgExists) {
    return res.status(400).json({ message: "Username is already in use." })
  }

  let org
  try {
    org = new Organization({ username, email, password: hashedPassword })
    org = await org.save()
  } catch (err) {
    return console.log(err)
  }

  if (!org) {
    return res.status(500).json({ message: "Unexpected Error Occurred" })
  }
  return res.status(201).json({ org })
}

export const login = async (req, res, next) => {
  const { username, email, password } = req.body

  let foundOrg
  try {
    if (!username) {
      foundOrg = await Organization.findOne({ email: email })
    } else {
      foundOrg = await Organization.findOne({ username: username })
    }
  } catch (error) {
    return console.log(error)
  }

  if (!foundOrg) {
    return res.status(404).json({ message: "Unable to find matching user." })
  }

  const passwordMatch = bcrypt.compareSync(password, foundOrg.password)
  if (!passwordMatch) {
    return res.status(400).json({ message: "Wrong password." })
  }

  const token = jwt.sign({ id: foundOrg._id }, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })

  return res.status(200).json({
    message: "User logged in successfully",
    token,
    id: foundOrg._id,
  })
}

export const updateOrg = async (req, res, next) => {
  const extractedToken = req.headers.authorization.split(" ")[1]
  const id = req.params.id
  const { username, email, password } = req.body
  const hashedPassword = bcrypt.hashSync(password, 10)
  let org

  if (!extractedToken && extractedToken.trim() === "") {
    return res.status(404).json({ message: "Token not found." })
  }

  let orgId
  jwt.verify(extractedToken, process.env.SECRET_KEY, (err, decrypted) => {
    if (err) {
      return res.status(400).json({ message: `${err.message}` })
    } else {
      orgId = decrypted.id
      return
    }
  })

  if (
    !username ||
    username.trim() === "" ||
    !email ||
    email.trim() === "" ||
    !password ||
    password.trim() === ""
  ) {
    return res.status(422).json({ message: "Invalid Inputs" })
  }

  let emailExists = await Organization.findOne({ email })
  let orgExists = await Organization.findOne({ username })

  if (emailExists) {
    return res.status(400).json({ message: "Email is already in use." })
  } else if (orgExists) {
    return res.status(400).json({ message: "Username is already in use." })
  }

  try {
    org = await Organization.findByIdAndUpdate(id, {
      username,
      email,
      password: hashedPassword,
    })
  } catch (error) {
    return console.log(error)
  }

  res.status(200).json({ message: "User updated successfully" })
}

export const deleteOrg = async (req, res, next) => {
  const _id = req.params.id
  let org

  try {
    org = await Organization.findByIdAndDelete(_id)
  } catch (error) {
    console.log(error)
  }

  if (!org) {
    return res.status(500).json({ message: "Something Unexpected Occured" })
  }
  console.log(org)
  res.status(200).json({ message: "User Deleted Successfully" })
}
