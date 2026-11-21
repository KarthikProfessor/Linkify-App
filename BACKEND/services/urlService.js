const url = require('../models/Url')
const generateShortCode = require("../utils/shortCodeUtils")

function createError(message, statusCode) {

  const error = new Error(message)
  error.statusCode = statusCode
  return error
}

async function createShortUrl(userId, urlData) {

  const { originalUrl, customAlias, expiresAt } = urlData

  let shortCode;

  if (customAlias) {
    shortCode = customAlias
  }

  const existingUrl = await url.findOne({ shortCode })

  if (existingUrl) {
    throw createError("Custom alias already exists", 409)
  } else {
    let attempts = 0;

    do {
      shortCode = generateShortCode()
      attempts++;

      if (attempts > 5) {
        throw createError('Unable to generate unique short code', 500)
      }
    } while (await url.exists({ shortCode }))
  }

  // Replace trailing slashes in BASE_URL and construct the short URL
  const baseUrl = process.env.BASE_URL.replace(/\/+$/, "")
  const shortUrl = `${baseUrl}/${shortCode}`

  const Url = await url.create({
    originalUrl,
    shortCode,
    shortUrl,
    userId,
    expiresAt: expiresAt || null
  })

  return Url
}

// GET ALL USER URLS
async function getUserUrls(userId, page = 1, limit = 10) {

  const skip = (page - 1) * limit

  const [urls, totalUrls] = await Promise.all([
    url.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    
    url.countDocuments({ userId })
  ])

  return {
    urls,
    pagination: {
      totalUrls,
      currentPage: page,
      totalPages: Math.ceil(totalUrls / limit),
      limit
    }
  }

}

// GET URL BY ID
async function getUrlById(userId, urlId) {

  const URL = await url.findOne({
    _id: urlId,
    userId
  })

  if (!URL) {
    throw createError('Url not found', 404)
  }

  return URL

}

// UPDATE URL
async function updateUrl(userId, urlId, updateData) {

  const URL = await url.findOne({
    _id: urlId,
    userId
  })

  if (!URL) {
    throw createError('Url not found', 404)
  }

  const { originalUrl, customAlias, expiresAt, isActive } = updateData

  if (originalUrl !== undefined) {
    URL.originalUrl = originalUrl
  }

  if (customAlias !== undefined) {
    const existingUrl = await url.findOne({
      shortCode: customAlias,
      _id: { $ne: urlId }
    })

    if (existingUrl) {
      throw createError('Custom alias already exists', 409)
    }

    URL.shortCode = customAlias

    const baseUrl = process.env.BASE_URL.replace(/\/+$/, "")
    URL.shortUrl = `${baseUrl}/${customAlias}`
  }

  if (expiresAt !== undefined) {
    URL.expiresAt = expiresAt
  }

  if (isActive !== undefined) {
    URL.isActive = isActive
  }

  await URL.save()

  return URL
}

// DELETE URL
async function deleteUrl(userId, urlId) {

  const URL = await url.findOneAndDelete({
    _id: urlId,
    userId
  })

  if (!URL) {
    throw createError('Url not found', 404)
  }

  return URL
}

module.exports = {
  createShortUrl,
  getUserUrls,
  getUrlById,
  updateUrl,
  deleteUrl
}