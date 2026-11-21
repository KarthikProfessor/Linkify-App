const express = require('express')
const router = express.Router()

const { register, login, logout, getMe } = require("../controllers/authController")

const authMiddleware = require("../middlewares/authMiddleware")

const { validateRegister, validateLogin } = require("../validators/authValidator")

const {
  authLimiter
} = require("../middlewares/rateLimitMiddleware")

// public routes
router.post("/register", authLimiter, validateRegister, register)
router.post("/login", authLimiter, validateLogin, login)

// protected routes
router.get("/me", authMiddleware, getMe)
router.post("/logout", authMiddleware, logout)

module.exports = router