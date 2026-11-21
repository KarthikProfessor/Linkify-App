const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const compression = require('compression')
const app = express()

const healthRoutes = require("./routes/health.routes.js")

const errorMiddleware = require("./middlewares/errorMiddleware.js")

const {apiLimiter} = require("./middlewares/rateLimitMiddleware.js")

const authRoutes = require("./routes/auth.routes.js")

const urlRoutes = require("./routes/url.routes.js")

const redirectRoutes = require("./routes/redirect.routes.js")

const analyticRoutes = require("./routes/analytic.routes.js")

// app.use(express.json())

// SECURE HTTP HEADERS
app.use(helmet())

// ENABLE CORS FOR THE FRONTEND
app.use(cors(
  {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }
))

// COMPRESS API RESPONSES
app.use(compression())

// LIMIT INCOMING REQUESTS BODY SIZE
app.use(express.json({ limit: "10kb" }))

// Express 5 compatibility for express-mongo-sanitize
app.use((req, res, next) => {
  Object.defineProperty(req, "query", {
    value: req.query,
    writable: true,
    configurable: true,
    enumerable: true,
  });

  next();
});

app.use(mongoSanitize())

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Linkify..."
  })
})

app.use("/api/v1/health", healthRoutes)
app.use("/api/v1/urls", urlRoutes)
app.use("/api/v1/analytics", analyticRoutes)
app.use("/api/v1", apiLimiter)
app.use("/api/v1/auth", authRoutes)
app.use("/", redirectRoutes)

app.use((req, res, next) => {
  const error = new Error(`route not found: ${req.originalUrl}`)
  error.statusCode = 404
  next(error)
})

app.use(errorMiddleware)

module.exports = app