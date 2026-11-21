const { body, validationResult } = require('express-validator')

function handleValidationErrors(req, res, next) {

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    })
  }

  next()
}

const validateRegister = [

  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  
  body("email")
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email ID'),

  body('password')
    .isLength({ min: 8 })
    .withMessage("Password must contain at least 8 characters"),

  handleValidationErrors
]

const validateLogin = [

  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email ID")
    .normalizeEmail(),
  
  body("password")
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
]

module.exports = {
  validateRegister,
  validateLogin
}