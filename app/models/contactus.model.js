const mongoose = require("mongoose");

const contactUsSchema = new mongoose.Schema({
  
    name: {
        type: String
    },
    email: {
        type: String
    },
    skypeId: {
        type: String
    },
    contact: {
        type: Number
    },
    budgetRange: {
        type: String
    },
    description: {
        type: String
    },
    ndaCopy: {
        type: Boolean,
        default: false
    },
    files: {
        type: Array
    },
    status: {
        type: Boolean,
        default: true
    }

}, {  timestamps: true, versionKey: false });

const contactUs = new mongoose.model("contactUs", contactUsSchema);

module.exports = contactUs;
