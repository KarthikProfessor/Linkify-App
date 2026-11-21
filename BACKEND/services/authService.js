const bcrypt = require('bcrypt')
const User = require('../models/User')
const generateToken = require('../utils/tokenUtils')

function createError(message, statusCode) {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}

function formatUser(user) {
  const userObject = user.toObject()

  delete userObject.password

  return userObject
}

async function registerUser(userData) {

  const { name, email, password } = userData

  const existingUser = await User.findOne({ email })

  if (existingUser) {
    throw createError('Email already registered', 409)
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await User.create({
    name,
    email,
    password: hashedPassword
  })

  const token = generateToken(user._id.toString())

  return {
    user: formatUser(user),
    token
  }

}

async function loginUser(userData) {

  const { email, password } = userData

  const user = await User.findOne({ email }).select('+password')
  
  if (!user) {
    throw createError('Invalid email or password', 401)
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    throw createError('Invalid email or password', 401)
  }

  const token = generateToken(user._id.toString())

  return {
    user: formatUser(user),
    token
  }
}

async function userProfile(userId) {
  const user = await User.findById(userId)
  if (!user) {
    throw createError("User not found", 404)
  }

  return formatUser(user)
}

module.exports = {
  registerUser,
  loginUser,
  userProfile
}