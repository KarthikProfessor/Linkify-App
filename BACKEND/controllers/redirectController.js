const {
  getOriginalUrl
} = require('../services/redirectService')

async function redirectUrl(req, res, next) {

  try {

    const {shortCode} = req.params

    const originalUrl = await getOriginalUrl(shortCode, req)

    return res.redirect(302, originalUrl)

  } catch (error) {
    next(error)
  }
}

module.exports = {
  redirectUrl
}