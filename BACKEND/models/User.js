const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: 2,
      maxLength: 50
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      unique: true
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      select: false
    }
  },
  {
    timestamps: true
  }
)

const User = mongoose.model("User", userSchema)

module.exports = User