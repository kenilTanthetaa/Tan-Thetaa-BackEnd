const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  category: {
    type: String,
  },
  name: {
    type: String,
    // required: true,
  },
  position: {
    type: String,
    // required: true,
  },
  about: {
    type: String,
  },
  linkedin: {
    type: String
  },
  gmail: {
    type: String
  },
  twitter: {
    type: String
  },
  profileImg: {
    type: String,
    // required: true
  },
  editedImg: {
    type: String
  },
  status: {
    type: Boolean,
    default: true
  },
  number:{
    type: Number
  }

}, { timestamps: true, versionKey: false });

const team = new mongoose.model("Team", teamSchema);

module.exports = team;
