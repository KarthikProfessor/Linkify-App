const express = require('express')

const {
  redirectUrl
} = require("../controllers/redirectController")

const router = express.Router()

// PUBLIC REDIRECTION ROUTE
router.get("/:shortCode", redirectUrl)

module.exports = router