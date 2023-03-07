const mongoose = require("mongoose");

const jobApplySchema = new mongoose.Schema({
  
    name: {
        type: String
    },    
    email: {
        type: String
    },    
    contact: {
        type: Number
    },  
    message: {
        type: String
    },
    file: {
        type: String
    },
    status: {
        type: Boolean,
        default: true
    }
}, {  timestamps: true, versionKey: false });

const jobApply = new mongoose.model("JobApply", jobApplySchema);

module.exports = jobApply;
