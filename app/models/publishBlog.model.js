const mongoose = require("mongoose");

const publishBlogSchema = new mongoose.Schema({

    blog_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "blog id is required"],
        ref: 'blogs' 
    },
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
    author: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        default: true
    },
    other: {
        type: String
    },
    
}, {  timestamps: true, versionKey: false });

const publishBlog = new mongoose.model("PublishBlog", publishBlogSchema);

module.exports = publishBlog;
