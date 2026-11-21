const { body, validationResult } = require("express-validator")

function handleValidateErrors(req, res, next) {

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    })
  }

  next()
}

const reservedAliases = [
  "api",
  "login",
  "register",
  "logout",
  "dashboard",
  "analytics",
  "health",
  "admin"
]

function validateOriginalUrl(field = "originalUrl") {

  return body(field)
    .trim()
    .isURL({
      protocols: ["http", "https"],
      require_protocol: true
    })
    .withMessage('Please provide a valid Http or Https Url')

}

function validateCustomAlias() {

  return body("customAlias")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Alias must be between 3 and 20 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Alias can contain letters, numbers, hypens and underscores')
    .custom((value) => {
      if (reservedAliases.includes(value.toLowerCase())) {
        throw new Error('Alias is reserved')
      }

      return true;
    })
}

function validateExpiration() {

  return body('expiresAt')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .withMessage('Please provide a valid expiration date')
    .toDate()
    .custom((value) => {
      if (value <= new Date()) {
        throw new Error('Expiration date must be in the future')
      }

      return true;
    })
  
}

const validateCreateUrl = [
  validateOriginalUrl(),
  validateCustomAlias(),
  validateExpiration(),
  handleValidateErrors
]

const validateUpdateUrl = [

  body("originalUrl")
    .optional()
    .trim()
    .isURL({
      protocols: ["http", "https"],
      require_protocol: true
    })
    .withMessage('Please provide a valid Http or Https Url'),

  
  validateCustomAlias(),

  body('expiresAt')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .withMessage('Please provide a valid expiration date')
    .toDate()
    .custom((value) => {
      if (value <= new Date()) {
        throw new Error('Expiration date must be in the future')
      }

      return true
    }),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be true or false')
    .toBoolean(),

  handleValidateErrors
]

module.exports = {
  validateUpdateUrl,
  validateCreateUrl
}