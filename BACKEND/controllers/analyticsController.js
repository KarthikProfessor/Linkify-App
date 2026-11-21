const {
  getDashboardAnalytics,
  getTopUrls,
  getUrlSummary,
  getUrlClickHistory,
  getUrlBreakDown
} = require("../services/analyticsService")

async function getDashboard(req, res, next) {

  try {

    const data = await getDashboardAnalytics(req.user.userId)

    res.status(200).json({
      success: true,
      data
    })

  } catch (error) {
    next(error)
  }
}

async function getUrlAnalytics(req, res, next) {

  try {

    const data = await getUrlSummary(req.user.userId, req.params.urlId)

    res.status(200).json({
      success: true,
      data
    })

  } catch (error) {
    next(error)
  }

}

async function getClickHistory(req, res, next) {

  try {

    const days = Number(req.query.days) || 30

    if (!Number.isInteger(days) || days < 1 || days > 365) {
      return res.status(400).json({
        success: false,
        message: "Days must be between 1 and 365"
      })
    }

    const data = await getUrlClickHistory(req.user.userId, req.params.urlId, days)

    res.status(200).json({
      success: true,
      data
    })

  } catch (error) {
    next(error)
  }
}

async function getBreakdown(req, res, next) {

  try {

    const data = await getUrlBreakDown(req.user.userId, req.params.urlId)

    res.status(200).json({
      success: true,
      data
    })

  } catch (error) {
    next(error)
  }
}

async function getTopPerformingUrls(req, res, next) {

  try {

    const limit = Number(req.query.limit) || 5

    if (!Number.isInteger(limit) || limit < 1 || limit > 20) {

      return res.status(400).json({
        success: false,
        message: "Limit must be between 1 and 20"
      })
    }

    const data = await getTopUrls(req.user.userId, limit)

    res.status(200).json({
      success: true,
      data
    })

  } catch (error) {
    next(error)
  }
}

module.exports = {
  getDashboard,
  getUrlAnalytics,
  getTopPerformingUrls,
  getBreakdown,
  getClickHistory
}