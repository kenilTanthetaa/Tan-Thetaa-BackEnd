const mongoose = require("mongoose");

const portfolioTagsSchema = new mongoose.Schema({
  
    tag: {
        type: String
    },
    sub_tag: {
        type: Array
    }

}, {  timestamps: true, versionKey: false });

const portfolioTags = new mongoose.model("PortfolioTags", portfolioTagsSchema);

module.exports = portfolioTags;



