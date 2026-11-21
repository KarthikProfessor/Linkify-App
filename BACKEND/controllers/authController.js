const { registerUser, loginUser, userProfile } = require("../services/authService")

async function register(req, res, next) {
  try {

    const result = await registerUser(req.body)

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: result
    })

  } catch (error) {
    next(error)
  }
}

async function login(req, res, next) {
  try {

    const result = await loginUser(req.body)

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result
    })

  } catch (error) {
    next(error)
  }
}

async function getMe(req, res, next) {
  try {

    const user = await userProfile(req.user.userId)

    res.status(200).json({
      success: true,
      data: user
    })

  } catch (error) {
    next(error)
  }
}

function logout(req, res) {
  res.status(200).json({
    success: true,
    message: "Logout successful. Please clear your token"
  })
}

module.exports = {
  register,
  login,
  logout,
  getMe
}