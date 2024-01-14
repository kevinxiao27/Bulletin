import mongoose from "mongoose"
import Bulletin from "../models/Bulletin.js"
import jwt from "jsonwebtoken"
import Organization from "../models/Organization.js"
import User from "../models/User.js"

export const addBulletin = async (req, res, next) => {
  const extractedToken = req.headers.authorization.split(" ")[1]
  if (!extractedToken || extractedToken.trim() === "") {
    return res.status(404).json({ message: "Token not found" })
  }

  let orgId
  // verify -- then decrypt the token ==> then store the admin id from the token
  jwt.verify(extractedToken, process.env.SECRET_KEY, (err, decrypted) => {
    if (err) {
      return res.status(400).json({ message: `${err.message}` })
    } else {
      orgId = decrypted.id
      return
    }
  })

  const { title, description, date, posterUrl, featured, registered } = req.body

  if (
    !title ||
    title.trim() === "" ||
    !description ||
    description.trim() === "" ||
    !date ||
    date.trim() === ""
  ) {
    return res.status(422).json({
      message:
        "Invalid Inputs. Please check that your title, description, and date format is correct and not empty.",
    })
  }

  let bulletin
  try {
    bulletin = new Bulletin({
      title,
      description,
      organization: orgId,
      date,
      posterUrl,
      featured,
      registered,
    })
    const session = await mongoose.startSession()
    const orgUser = await Organization.findById(orgId)
    session.startTransaction()
    await bulletin.save({ session })
    orgUser.bulletins.push(bulletin)
    await orgUser.save({ session })
    await session.commitTransaction()
  } catch (error) {
    return console.log(error)
  }

  if (!bulletin) {
    return res.status(500).json({ message: "Bulletin request failed." })
  }

  return res.status(200).json({ bulletin })
}

export const updateBulletin = async (req, res, next) => {
  const extractedToken = req.headers.authorization.split(" ")[1]
  const id = req.params.id
  let bulletin

  try {
    bulletin = await Bulletin.findById(id)
  } catch (error) {
    console.log(error)
  }

  if (!bulletin) {
    return res.status(404).json({ message: "Failed to find Bulletin" })
  }
  if (!extractedToken || extractedToken.trim() === "") {
    return res.status(404).json({ message: "Token not found" })
  }

  let orgId
  // verify -- then decrypt the token ==> then store the admin id from the token
  jwt.verify(extractedToken, process.env.SECRET_KEY, (err, decrypted) => {
    if (err) {
      return res.status(400).json({ message: `${err.message}` })
    } else {
      orgId = decrypted.id
      return
    }
  })

  if (bulletin.organization != orgId) {
    return res
      .status(401)
      .json({ message: "Unauthorized to complete this action" })
  }

  const { title, description, date, posterUrl, featured, registered } = req.body

  if (
    !title ||
    title.trim() === "" ||
    !description ||
    description.trim() === "" ||
    !date ||
    date.trim() === ""
  ) {
    return res.status(422).json({
      message:
        "Invalid Inputs. Please check that your title, description, and date format is correct and not empty.",
    })
  }
  let updateBulletin
  try {
    updateBulletin = await Bulletin.findByIdAndUpdate(id, {
      title,
      description,
      orgId,
      date,
      posterUrl,
      featured,
      registered,
    })
  } catch (error) {
    return console.log(error)
  }

  if (!updateBulletin) {
    return res.status(500).json({ message: "Bulletin request failed." })
  }

  return res.status(200).json({ updateBulletin })
}

export const getAllBulletins = async (req, res, next) => {
  let bulletins

  try {
    bulletins = await Bulletin.find()
  } catch (error) {
    console.log(error)
  }

  if (!bulletins) {
    return res.status(500).json({ message: "Failed to get Bulletins" })
  }

  return res.status(200).json({ bulletins })
}

export const getBulletinById = async (req, res, next) => {
  const id = req.params.id
  let bulletin

  try {
    bulletin = await Bulletin.findById(id)
  } catch (error) {
    console.log(error)
  }

  if (!bulletin) {
    return res.status(404).json({ message: "Failed to find Bulletin" })
  }

  return res.status(200).json({ bulletin })
}

export const deleteBulletin = async (req, res, next) => {
  const extractedToken = req.headers.authorization.split(" ")[1]
  const id = req.params.id
  let bulletin

  try {
    bulletin = await Bulletin.findById(id)
  } catch (error) {
    console.log(error)
  }

  if (!bulletin) {
    return res.status(404).json({ message: "Failed to find Bulletin" })
  }
  if (!extractedToken || extractedToken.trim() === "") {
    return res.status(404).json({ message: "Token not found" })
  }

  let orgId
  // verify -- then decrypt the token ==> then store the admin id from the token
  jwt.verify(extractedToken, process.env.SECRET_KEY, (err, decrypted) => {
    if (err) {
      return res.status(400).json({ message: `${err.message}` })
    } else {
      orgId = decrypted.id
      return
    }
  })

  if (bulletin.organization != orgId) {
    return res
      .status(401)
      .json({ message: "Unauthorized to complete this action" })
  }

  let deleteBulletin
  try {
    deleteBulletin = await Bulletin.findByIdAndDelete(id)
  } catch (error) {
    console.log(error)
  }

  if (!deleteBulletin) {
    return res.status(500).json({ message: "Something Unexpected Occured" })
  }
  console.log(deleteBulletin)
  res.status(200).json({ message: "Bulletin Deleted Successfully" })
}

export const registerUser = async (req, res, next) => {
  const extractedToken = req.headers.authorization.split(" ")[1]
  const id = req.params.id
  let bulletin

  try {
    bulletin = await Bulletin.findById(id)
  } catch (error) {
    console.log(error)
  }

  if (!bulletin) {
    return res.status(404).json({ message: "Failed to find Bulletin" })
  }
  if (!extractedToken || extractedToken.trim() === "") {
    return res.status(404).json({ message: "Token not found" })
  }

  let userId
  // verify -- then decrypt the token ==> then store the admin id from the token
  jwt.verify(extractedToken, process.env.SECRET_KEY, (err, decrypted) => {
    if (err) {
      return res.status(400).json({ message: `${err.message}` })
    } else {
      userId = decrypted.id
      return
    }
  })

  var registeredList = bulletin.registered
  if (registeredList.includes(userId)) {
    return res.status(401).json({ message: "Already Registered" })
  } else {
    registeredList.push(userId)
  }

  let updateBulletin
  try {
    const session = await mongoose.startSession()
    const user = await User.findById(userId)
    session.startTransaction()
    updateBulletin = await Bulletin.findByIdAndUpdate(id, {
      registered: registeredList,
    })
    user.registeredBulletins.push(updateBulletin)
    await user.save({ session })
    await session.commitTransaction()
  } catch (error) {
    return console.log(error)
  }

  if (!updateBulletin) {
    return res.status(500).json({ message: "Registration failed" })
  }

  return res.status(200).json({ updateBulletin })
}
