const mongoose = require('mongoose')

const analyticSchema = new mongoose.Schema(
  {
    urlId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Url",
      index: true
    },

    ipAddress: {
      type: String,
      default: "unknown"
    },

    browser: {
      type: String,
      default: "unknown"
    },

    device: {
      type: String,
      default: "unknown"
    },

    referrer: {
      type: String,
      default: "Direct"
    },

    country: {
      type: String,
      default: "unknown"
    },

    clickedAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true
  }
)

analyticSchema.index({ urlId: 1, clickedAt: -1 })

const Analytics = mongoose.model("Analytics", analyticSchema)

module.exports = Analytics