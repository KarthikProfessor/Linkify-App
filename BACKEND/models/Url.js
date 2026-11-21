const mongoose = require('mongoose')

const urlSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: [true, "Original url is required"],
      trim: true
    },

    shortCode: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    shortUrl: {
      type: String,
      required: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },

    clicks: {
      type: Number,
      default: 0
    },

    expiresAt: {
      type: Date,
      default: null
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
)

urlSchema.index({ userId: 1 })

const Url = mongoose.model("Url", urlSchema)

module.exports = Url