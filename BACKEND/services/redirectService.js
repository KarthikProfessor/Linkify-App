const URL = require("../models/Url")
const analytics = require("../models/Analytics")
const {
  getBrowser,
  getDevice
} = require("../utils/userAgentUtils")
// const createError = require("http-errors")

function createError(message, statusCode) {

  const error = new Error(message)
  error.statusCode = statusCode
  return error
}

async function getOriginalUrl(shortCode, req) {

  const url = await URL.findOne({shortCode})

  console.log("Received shortCode:", shortCode);
  console.log("Found URL:", url);

  if (!url) {
    throw createError('Short URL not found', 404)
  }

  if (!url.isActive) {
    throw createError('This URL is inactive', 410)
  }

  if (url.expiresAt && url.expiresAt <= new Date()) {
    throw createError('This URL is expired', 410)
  }

  await URL.findOneAndUpdate(
    { _id: url._id },
    {
      $inc: {
        clicks: 1
      }
    }
  )

  const userAgent = req.headers["user-agent"] || ""
  const referrer = req.get("referer") || "Direct"

  try {
    await analytics.create({

      urlId: url._id,
      ipAddress: req.ip || "Unknown",
      browser: getBrowser(userAgent),
      device: getDevice(userAgent),
      referrer,
      country: req.headers["cf-ipcountry"] || "Unknown"
    })
  } catch(error) {
    console.error("Click analytics recording failed:", error.message)
  }

  return url.originalUrl
}

module.exports = {
  getOriginalUrl
}