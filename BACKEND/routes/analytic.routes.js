const express = require('express')
const router = express.Router()

const authMiddleware = require("../middlewares/authMiddleware")

const {
  getBreakdown,
  getClickHistory,
  getDashboard,
  getTopPerformingUrls,
  getUrlAnalytics
} = require("../controllers/analyticsController")

// AUTHENTICATION
router.use(authMiddleware)

// OVERALL DASHBOARD
router.get("/dashboard", getDashboard)

// TOP-PERFORMING URLS
router.get("/top-links", getTopPerformingUrls)

// INDIVIDUAL URL ANALYTICS
router.get("/urls/:urlId/summary", getUrlAnalytics)
router.get("/urls/:urlId/history", getClickHistory)
router.get("/urls/:urlId/breakdown", getBreakdown)

module.exports = router