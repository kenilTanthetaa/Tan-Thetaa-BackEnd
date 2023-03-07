const mongoose = require("mongoose");

const jobOpportunitySchema = new mongoose.Schema({
  job_name: {
    type: String,
    required: true
  },
  job_title: {
    type: String,
    required: true
  },
  job_location: {
    type: String,
    required: true
  },
  job_experience: {
    type: String,
    required: true
  },
  job_description_1: {
    type: String,
  },
  job_description_2: {
    type: String,
  },
  job_description_3: {
    type: String,
  },
  job_description_4: {
    type: String,
  },
  job_description_5: {
    type: String,
  },
  job_description_6: {
    type: String,
  },
  job_description_7: {
    type: String,
  },
  job_description_8: {
    type: String,
  },
  job_description_9: {
    type: String,
  },
  job_description_10: {
    type: String,
  },
  job_description_11: {
    type: String,
  },
  job_description_12: {
    type: String,
  },
  job_requirement_1: {
    type: String,
  },
  job_requirement_2: {
    type: String,
  },
  job_requirement_3: {
    type: String,
  },
  job_requirement_4: {
    type: String,
  },
  job_requirement_5: {
    type: String,
  },
  job_requirement_6: {
    type: String,
  },
  job_requirement_7: {
    type: String,
  },
  job_requirement_8: {
    type: String,
  },
  status: {
    type: Boolean,
    default: true
  }
  // city: {
  //   type: String,
  //   required: true
  // },
}, {  timestamps: true, versionKey: false });

const jobOpportunity = new mongoose.model("JobOpportunity", jobOpportunitySchema);

module.exports = jobOpportunity;
