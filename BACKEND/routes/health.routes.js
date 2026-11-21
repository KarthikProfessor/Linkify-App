const express = require('express')

const router = express.Router()

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Linkify API is running...",
    status: "OK"
  })
})

module.exports = router