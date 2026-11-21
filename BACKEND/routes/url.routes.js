const express = require('express')

const {
  createUrl,
  getUrls,
  getUrl,
  editUrl,
  removeUrl
} = require("../controllers/urlController")

const authMiddleware = require("../middlewares/authMiddleware")

const {createUrlLimiter} = require("../middlewares/rateLimitMiddleware")

const {
  validateCreateUrl,
  validateUpdateUrl
} = require("../validators/urlValidator")

const router = express.Router()

// ALL URL ROUTES REQUIRE AUTHENTICATION
router.use(authMiddleware)

// CREATE SHORT URL
router.post("/shorten", createUrlLimiter, validateCreateUrl, createUrl)

router.get("/", getUrls)
router.get("/:id", getUrl)
router.put("/:id", validateUpdateUrl, editUrl)
router.delete("/:id", removeUrl)

module.exports = router