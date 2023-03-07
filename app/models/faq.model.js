const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema({
  page_name: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    default: true
  }
}, {  timestamps: true, versionKey: false });

const faq = new mongoose.model("FAQ", faqSchema);

module.exports = faq;
