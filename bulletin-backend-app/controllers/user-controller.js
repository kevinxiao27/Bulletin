import User from "../models/User.js"

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
  const saltRounds = 10
  const saveUser = (err, hash) => {
    if (err != null) {
      console.error(`An error occured: ${err}`)
    }

    let user = new User({
      username,
      email,
      password: hash,
    })

    try {
      user.save().then(() => {
        res.status(200).json({ message: "User created successfully", user })
      })
    } catch (error) {
      return res.status(401).send(err.message)
    }
  }
  let emailExists = await User.findOne({ email })
  let userExists = await User.findOne({ username })

  if (emailExists) {
    res.status(401).json({ message: "Email is already in use." })
  } else if (userExists) {
    res.status(401).json({ message: "Username is already in use." })
  }

  try {
    bcrypt.hash(password, saltRounds, saveUser)
  } catch (error) {
    return res.status(401).send(err.message)
  }
}
