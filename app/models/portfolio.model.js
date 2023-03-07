const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema({
  title: {
    type: String,
    // required: true
  },
  sub_title: {
    type: String,
    // required: true
  },
  general: [{
        industry: {
            type: String,
            // required: true
        },
        services: {
            type: String,
            // required: true
        },
        businessType: {
            type: String,
            // required: true
        },
        buildYourIdea: {
            type: String,
            // required: true
        }
    }],
  description: {
    type: String,
    // required: true
  },
  websiteLink: {
    type: String,
    // required: true
  },
  bgImg: {
    type: String
  },
  aboutImg: {
    type: String
  },
  quoteImg: {
    type: String
  },
  projectImg: {
    type: String
  },
  outsideImg: {
    type: String
  },
  question: {
    type: String,
    // required: true
  },
  answer: {
    type: String,
    // required: true
  },
  answer2: {
    type: String,
    // required: true
  },
  quote:{
    type: String,
    // required: true
  },  
  projectGoals: [{
    number: {
      type: Number,
      // required: true
    },
    goal_title: {
        type: String,
        // required: true
    },
    goal_desc: {
        type: String,
        // required: true
    }
  }],
  status: {
    type: Boolean,
    default: true
  },
  tag: {
    type: String
  },
  sub_tag: {
      type: String
  },
  publish: {
    type: Boolean,
    default: false
  },
  otpCheck: {
    type: Number
  }
}, {  timestamps: true, versionKey: false });

const portfolio = new mongoose.model("Portfolio", portfolioSchema);

module.exports = portfolio;
