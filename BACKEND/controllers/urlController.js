const {
  createShortUrl,
  getUserUrls,
  getUrlById,
  updateUrl,
  deleteUrl
} = require("../services/urlService")

async function createUrl(req, res, next) {

  try {

    const url = await createShortUrl(
      req.user.userId,
      req.body
    )

    res.status(201).json({
      success: true,
      message: "URL shortened successfully",
      data: url
    })

  } catch(error) {
    next(error)
  }

}

async function getUrls(req, res, next) {

  try {

    const page = Math.max(1, Number(req.query.page) || 1)
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10))

    const { urls, pagination } = await getUserUrls(req.user.userId, page, limit)

    res.status(200).json({
      success: true,
      count: urls.length,
      data: urls,
      pagination
    })

  } catch(error) {
    next(error)
  }

}

async function getUrl(req, res, next) {

  try {

    const url = await getUrlById(
      req.user.userId,
      req.params.id
    )

    res.status(200).json({
      success: true,
      data: url
    })

  } catch(error) {
    next(error)
  }

}

async function editUrl(req, res, next) {

  try {

    const edit = await updateUrl(
      req.user.userId,
      req.params.id,
      req.body
    )

    res.status(200).json({
      success: true,
      message: "URL updated successfully",
      data: edit
    })

  } catch(error) {
    next(error)
  }

}

async function removeUrl(req, res, next) {

  try {

    await deleteUrl(
      req.user.userId,
      req.params.id
    )

    res.status(200).json({
      success: true,
      message: "URL deleted successfully"
    })

  } catch(error) {
    next(error)
  }

}

module.exports = {
  createUrl,
  getUrl,
  getUrls,
  editUrl,
  removeUrl
}