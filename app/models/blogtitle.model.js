const mongoose = require("mongoose");

const blogTitleSchema = new mongoose.Schema({
  
  tag: {
    type: String
  },
  title: {
    type: String
  },
  description: {
    type: String
  },
  author: {
    type: String,
    required: true,
  },
  // sub_tags:{
  //   type: Array
  // },
  // ----------------------------------
  sub_tags: [{
    number: {
      type: Number
    },
    subTagtitle: {
      type: String
    }

  }]

}, {  timestamps: true, versionKey: false });

const blogTitle = new mongoose.model("BlogTitle", blogTitleSchema);

module.exports = blogTitle;
