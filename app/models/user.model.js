const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: [true, "Required"],
    trim: true,
  },
  role: {
    type: String,
    default: "user",
    trim: true
  },
  status: {
    type: Boolean,
    default: true
  }
},{  timestamps: true, versionKey: false });

const user = new mongoose.model("User", userSchema);

module.exports = user;
