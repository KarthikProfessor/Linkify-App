const Url = require("../models/Url")
const analytics = require("../models/Analytics")
const createError = require('http-errors')

// CHECK WHETHER THE URL BELONGS TO THE LOGGED-IN USER
async function getOwnedUrl(userId, urlId) {

  const url = await Url.findOne({
    _id: urlId,
    userId
  })

  if (!url) {
    throw createError(404, "URL not found")
  }

  return url
}

// 1. INDIVIDUAL URL SUMMARY
async function getUrlSummary(userId, urlId) {

  const url = await getOwnedUrl(userId, urlId)

  const [clickStats] = await analytics.aggregate(
    [
      {
        $match: {
          urlId: url._id
        }
      },
      {
        $group: {
          _id: null,
          totalClicks: {
            $sum: 1
          },
          firstClick: { $min: "$clickedAt" },
          lastClick: { $max: "$clickedAt" }
        },
      },
    ]
  )

  return {
    urlId: url._id,
    shortCode: url.shortCode,
    shortUrl: url.shortUrl,
    originalUrl: url.originalUrl,
    totalClicks: url.clicks,
    trackedClicks: clickStats?.trackedClicks || 0,
    firstClick: clickStats?.firstClick || null,
    lastClick: clickStats?.lastClick || null

  }
}

// 2. INDIVIDUAL URL CLICK HISTORY
async function getUrlClickHistory(userId, urlId, days = 30) {

  const url = await getOwnedUrl(userId, urlId)

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const history = await analytics.aggregate([
    {
      $match: { urlId: url._id, clickedAt: { $gte: startDate } }
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$clickedAt"
          },
        },
        clicks: {
          $sum: 1
        },
      }
    },
    {
      $sort: {
        _id: 1
      }
    },
    {
      $project: {
        _id: 0,
        date: "$_id",
        clicks: 1
      }
    },
  ])

  return history;
}

// 3. BROWSER, DEVICE AND REFERRER STATISTICS
async function getUrlBreakDown(userId, urlId) {

  const url = await getOwnedUrl(userId, urlId)

  const [browserStats, deviceStats, referrerStats, countryStats] = await Promise.all([
    analytics.aggregate([
      {
        $match: {
          urlId: url._id
        }
      },
      {
        $group: {
          _id: "$browser",
          clicks: {
            $sum: 1
          }
        },
      },
      {
        $sort: {
          clicks: -1
        }
      },
    ]),

    analytics.aggregate([
      {
        $match: {
          urlId: url._id
        }
      },
      {
        $group: {
          _id: "$device",
          clicks: {
            $sum: 1
          }
        }
      },
      {
        $sort: {
          clicks: -1
        }
      }
    ]),

    analytics.aggregate([
      {
        $match: {
          urlId: url._id
        }
      },
      {
        $group: {
          _id: "$referrer",
          clicks: {
            $sum: 1
          }
        }
      },
      {
        $sort: {
          clicks: -1
        }
      },
      {
        $limit: 10
      }
    ]),

    analytics.aggregate([
      {
        $match: {
          urlId: url._id
        }
      },
      {
        $group: {
          _id: "$country",
          clicks: {
            $sum: 1
          }
        }
      },
      {
        $sort: {
          clicks: -1
        }
      },
      {
        $limit: 10
      }
    ])
  ])

  return {
    browserStats,
    deviceStats,
    referrerStats,
    countryStats
  }
}

// 4. TOP PERFORMING URLS
async function getTopUrls(userId, limit = 5) {

  const urls = await 
  Url.find({ userId })
    .sort({ clicks: -1, createdAt: -1 })
    .limit(limit)
    .select("originalUrl shortUrl shortCode clicks createdAt")
  
  return urls
}

// 5. OVERALL DASHBOARD ANALYTICS
async function getDashboardAnalytics(userId) {

  const urls = await Url.find({ userId }).select("_id clicks isActive expiresAt")

  const urlIds = urls.map((url) => url._id)
  const totalClicks = urls.reduce((total, url) => total + url.clicks, 0)

  const activeUrls = urls.filter(
    (url) => url.isActive && (!url.expiresAt || url.expiresAt > new Date())
  ).length;

  const expiredUrls = urls.filter(
    (url) => url.expiresAt && url.expiresAt <= new Date()
  ).length;

  const clicksByDate = await analytics.aggregate([
    {
      $match: {
        urlId: {
          $in: urlIds
        }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$clickedAt"
          }
        },
        clicks: {
          $sum: 1
        }
      }
    },
    {
      $sort: {
        _id: 1
      }
    },
    {
      $set: {
        date: "$_id"
      }
    },
    {
      $unset: "_id"
    }
  ])

  return {
    totalUrls: urls.length,
    totalClicks,
    activeUrls,
    expiredUrls,
    clicksByDate
  }
}

module.exports = {
  getUrlSummary,
  getUrlClickHistory,
  getUrlBreakDown,
  getTopUrls,
  getDashboardAnalytics
}