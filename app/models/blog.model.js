const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  tag: {
    type: String
  },
  sub_tag: {
    type: String
  },
  title: {
    type: String
  },
  description: {
     type: String
  },
  outsideImg: {
    type: String
  },
  general: [{
    number: {
      type: String
    },
    question: {
      type: String,
      // required: true
    },
    para1: {
      type: String,
      //  required: true
    },
    topBullet1: {
      type: String
    },
    topBullet2: {
      type: String
    },
    topBullet3: {
      type: String
    },
    topBullet4: {
      type: String
    },
    topBullet5: {
      type: String
    },
    para2: {
      type: String
    },
    para3: {
      type: String
    },
    para4: {
      type: String
    },
    para5: {
      type: String
    },
    bottomBullet1: {
      type: String
    },
    bottomBullet2: {
      type: String
    },
    bottomBullet3: {
      type: String
    },
    bottomBullet4: {
      type: String
    },
    bottomBullet5:{
      type: String
    }
  }],
  image1: {
    type: String
  },
  image2: {
    type: String
  },
  image3: {
    type: String
  },
  image4: {
    type: String
  },
  author: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: true
  },
  publish: {
    type: Boolean,
    default: false
  },
  other: {
    type: String
  },
  otpCheck: {
    type: Number
  }
}, {  timestamps: true, versionKey: false });

const blog = new mongoose.model("Blog", blogSchema);

module.exports = blog;
