const Blog = require("../models/blog.model")
const BlogTitle = require("../models/blogtitle.model")
const PublishBlog = require("../models/publishBlog.model")
const HTTP = require("../../constants/responseCode.constant");
var randomstring = require("randomstring");
const { sendEmailOTP } = require("../../public/partials/utils")
const fs = require('fs');

// addBlogTitle
async function addBlogTitle(req, res) {
    try {
        
        const { tag, title, description, author, sub_tags } = req.body
        console.log("🚀 ~ addBlogTitle ~ req.body", req.body)
        console.log("🚀 ~ file: blog.controller.js:14 ~ addBlogTitle ~ sub_tags", sub_tags)
        console.log("🚀 ~ file: blog.controller.js:23 ~ addBlogTitle ~ JSON.parse(sub_tags)", JSON.parse(sub_tags))

        if(!tag || !title || !description || !author || !sub_tags) return res.status(HTTP.SUCCESS).send({ 'status': false,  'code': HTTP.BAD_REQUEST, 'message': "All fields are required!" })

        const checkTag = await BlogTitle.findOne({ tag })
        if(checkTag) return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.NOT_FOUND, 'message': `${tag} has already been added.`, data: {} })

        const data = await BlogTitle({ tag, title, description, author, sub_tags: JSON.parse(sub_tags) }).save()
        if(!data) return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.NOT_FOUND, 'message': "Could not save data", data: {} })

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, 'message': "Blog tag added successfully.", data })

    } catch (e) {
        // console.log(e) 
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

// editBlogTitle
async function editBlogTitle(req, res) {
    try {
        
        const { tag, title, description, author, sub_tags } = req.body

        const blogTitle = await BlogTitle.findById({ _id: req.params.id })
        if(!blogTitle) return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.NOT_FOUND, "message": "Blog Title data does not exists!", data: {} })

        if( tag && tag != blogTitle.tag ){
            blogTitle.tag = tag
        }
        
        if( title && title != blogTitle.title ){
            blogTitle.title = title
        }

        if( description && description != blogTitle.description ){
            blogTitle.description = description
        }

        if( author && author != blogTitle.author ){
            blogTitle.author = author
        }

        // if( sub_tags && sub_tags != blogTitle.sub_tags ){
        //     blogTitle.sub_tags = sub_tags
        // }

        if(sub_tags){
            // console.log("🚀 ~ file: blog.controller.js:64 ~ editBlogTitle ~ sub_tags", sub_tags)
            for(const data of JSON.parse(sub_tags)){
                // console.log("🚀 ~ file: blog.controller.js:68 ~ editBlogTitle ~ data.subTagtitle", data)

                if(data.subTagtitle && data.subTagtitle != ""){
                    // console.log("🚀 ~ file: blog.controller.js:69 ~ editBlogTitle ~ data.subTagtitle >>>> ", data.subTagtitle)
                    // console.log("🚀 ~ file: blog.controller.js:71 ~ editBlogTitle ~ data.number", data.number)
                    await BlogTitle.updateOne({ _id: req.params.id, 'sub_tags.number': data.number }, { $set: { 'sub_tags.$.subTagtitle': data.subTagtitle } })
                }

            }
        }

        await blogTitle.save()
        if(!blogTitle)return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'Unable to update blog title!', data: {} })

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, 'message': 'Blog Title edited.', data: { } })

    } catch (e) {
        // console.log(e) 
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

// deleteBlogTitle
async function deleteBlogTitle(req, res) {
    try {
        
        const deleteData = await BlogTitle.findOneAndRemove({ _id: req.params.id })
        if(!deleteData) return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.BAD_REQUEST, 'message': "Unable to delete blog title." })

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, 'message': 'Blog Title deleted successfully.', data: {} })

    } catch (e) {
        // console.log(e) 
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}


// add blog
async function addBlog(req, res) {
    try {
        
        const { tag, sub_tag, title, description, general, author, other } = req.body
        console.log("🚀 ~ file: blog.controller.js:34 ~ addBlog ~ JSON.parse(other) ~", JSON.parse(other))
        
        if(!tag || !sub_tag || !title || !description /*|| !general*/ ) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': "All fields are required!" }) //|| req.files === undefined

        // for loop for general
        let generalData = []
        if(general){
            for(const data of JSON.parse(general)){
                
                let obj = { number: data.number, question: data.question, para1: data.para1, topBullet1: data.topBullet1, topBullet2: data.topBullet2, topBullet3: data.topBullet3, topBullet4: data.topBullet4,topBullet5: data.topBullet5, para2: data.para2, para3: data.para3, para4: data.para4, para5: data.para5,bottomBullet1: data.bottomBullet1, bottomBullet2: data.bottomBullet2, bottomBullet3: data.bottomBullet3,bottomBullet4: data.bottomBullet4, bottomBullet5: data.bottomBullet5 }
                generalData.push(obj)
    
            }
        }
        
        // console.log("🚀 ~ generalData", generalData)
        // console.log("🚀 ~ req.files", req.files)

        let outsideImg, image1, image2, image3, image4
        if(req.files.outsideImg){
            for(const data of req.files.outsideImg){
                outsideImg = "uploads/blogs" + data.filename
            }
        }
        if(req.files.image1){
            for(const data of req.files.image1){
                image1 = "uploads/blogs" + data.filename
            }
        }
        if(req.files.image2){
            for(const data of req.files.image2){
                image2 = "uploads/blogs" + data.filename
            }
        }
        if(req.files.image3){
            for(const data of req.files.image3){
                image3 = "uploads/blogs" + data.filename
            }
        }
        if(req.files.image4){
            for(const data of req.files.image4){
                image4 = "uploads/blogs" + data.filename
            } 
        }

        // verify tag in blogTitle
        const check = await BlogTitle.findOne({ tag, sub_tag })
        if(!check) return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.BAD_REQUEST, 'message': "Invalid tag added. Please add the tag before adding the blog.", data: {} })

        const data = await Blog({ tag, sub_tag, title, description, general: generalData, outsideImg, image1, image2, image3, image4, author, other: JSON.parse(other) }).save()
        if(!data) return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.NOT_FOUND, 'message': "Could not save data", data: {} })

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, 'message': "Blog added successfully.", data })

    } catch (e) {
        console.log(e) 
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

// edit blog
async function editBlog(req, res) {
    try {
        
        console.log( req.params.id, "     req.user.id editBlog");
        const { tag, sub_tag, title, description, general, author, other } = req.body
        // console.log("🚀 ~ file: blog.controller.js:98 ~ editBlog ~ other", other)
        // console.log("🚀 ~ file: blog.controller.js:121 ~ editBlog ~ general", general)
        // console.log("🚀 ~ file: blog.controller.js:121 ~ editBlog ~ description", description)
        // console.log("🚀 ~ file: blog.controller.js:121 ~ editBlog ~ title", title)
        // console.log("🚀 ~ file: blog.controller.js:121 ~ editBlog ~ sub_tag", sub_tag)
        // console.log("🚀 ~ file: blog.controller.js:121 ~ editBlog ~ tag", tag)
        
        let blog = await Blog.findById({ _id: req.params.id })
        if(!blog) return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.NOT_FOUND, "message": "Portfolio data does not exists!", data: {} })

        if(blog.publish){

            const checkData = await PublishBlog.find({ blog_id: blog._id })
            if(checkData.length == 2){
                const oldData = await PublishBlog.findOneAndRemove({ blog_id: blog._id }).sort({ createdAt: 1 })
            }
            let outsideImg
            if( req.files.outsideImg != undefined || req.files.outsideImg != null ){
                for(const data of req.files.outsideImg){
                    outsideImg = "uploads/blog" + data.filename
                }
            }else {
                outsideImg = blog.outsideImg
            }

            const data = await new PublishBlog({ blog_id: blog._id, tag, sub_tag, title, description, other }).save()

            if(!data) return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.BAD_REQUEST, "message": "Something went wrong while adding data.", data: {} })
        }



        let outsideImg, image1, image2, image3, image4
        console.log("🚀 ~ file: blog.controller.js:111 ~ editBlog ~ req.files.outsideImg", req.files.outsideImg)
        if(req.files.outsideImg != undefined){
            for(const data of req.files.outsideImg){
                outsideImg = "uploads/blogs" + data.filename
                console.log("🚀 ~ file: blog.controller.js:114 ~ editBlog ~ outsideImg", outsideImg)
                console.log("🚀 ~ file: blog.controller.js:116 ~ editBlog ~ blog.outsideImg", blog.outsideImg)
                if(blog.outsideImg){
                    let filename_ = "./" + blog.outsideImg
                    console.log("🚀 ~ file: blog.controller.js:118 ~ editBlog ~ filename_", filename_)
                    fs.unlinkSync( filename_, (err) => {
                        if(err) console.log(err);
                    })
                }

                const data_ = await Blog.findByIdAndUpdate({ _id: req.params.id }, { outsideImg }, { new: true})
                if(!data_) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'Unable to update data!', data: {} })
            }
        }

        if(req.files.image1 != undefined){
            for(const data of req.files.image1){
                image1 = "uploads/blogs" + data.filename
                if(blog.image1){
                    let filename_ = "./" + blog.image1
                    fs.unlinkSync( filename_, (err) => {
                        if(err) console.log(err);
                    })
                }

                const data_ = await Blog.findByIdAndUpdate({ _id: req.params.id }, { image1 }, { new: true})
                if(!data_) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'Unable to update data!', data: {} })
            }
        }

        if(req.files.image2 != undefined){
            for(const data of req.files.image2){
                image2 = "uploads/blogs" + data.filename
                if(blog.image2){
                    let filename_ = "./" + blog.image2
                    fs.unlinkSync( filename_, (err) => {
                        if(err) console.log(err);
                    })
                }

                const data_ = await Blog.findByIdAndUpdate({ _id: req.params.id }, { image2 }, { new: true})
                if(!data_) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'Unable to update data!', data: {} })
            }
        }

        if(req.files.image3 != undefined){
            for(const data of req.files.image3){
                image3 = "uploads/blogs" + data.filename
                if(blog.image3){
                    let filename_ = "./" + blog.image3
                    fs.unlinkSync( filename_, (err) => {
                        if(err) console.log(err);
                    })
                }

                const data_ = await Blog.findByIdAndUpdate({ _id: req.params.id }, { image3 }, { new: true})
                if(!data_) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'Unable to update data!', data: {} })
            }
        }

        if(req.files.image4 != undefined){
            for(const data of req.files.image4){
                image4 = "uploads/blogs" + data.filename
                if(blog.image4){
                    let filename_ = "./" + blog.image4
                    fs.unlinkSync( filename_, (err) => {
                        if(err) console.log(err);
                    })
                }

                const data_ = await Blog.findByIdAndUpdate({ _id: req.params.id }, { image4 }, { new: true})
                if(!data_) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'Unable to update data!', data: {} })
            }
        }

        // check tag
        const check_tag = await BlogTitle.findOne({ tag, sub_tags: sub_tag })
        // console.log("🚀 ~ file: blog.controller.js:208 ~ editBlog ~ check_tag", check_tag)
        if(!check_tag) return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.BAD_REQUEST, "message": "Invalid Tag.", data: {} })

        if(tag && tag != "" && sub_tag && sub_tag != "" && sub_tag != blog.sub_tag){
            blog.tag = tag
            blog.sub_tag = sub_tag
        }

        if(title && title != blog.title){
            blog.title = title
        }

        if(description && description != blog.description){
            blog.description = description
        }

        // edit general ================
        if(general) {
            for(const data of general){
                console.log(data.number, " ---- data.number");
                if( data.question && data.question != ""){
                    await Blog.updateOne({ _id: req.params.id, 'general.number': data.number }, { $set: { 'general.$.question': data.question } }, { new: true })
                }

                if( data.para1 && data.para1 != "" ){
                    await Blog.updateOne({ _id: req.params.id, 'general.number': data.number }, { $set: { 'general.$.para1': data.para1 }}, { new: true } )
                }

                if( data.topBullet1 && data.topBullet1 != "" ){
                    await Blog.updateOne({ _id: req.params.id, 'general.number': data.number }, { $set: { 'general.$.topBullet1': data.topBullet1 }}, { new: true } )
                }
                
                if( data.topBullet2 && data.topBullet2 != "" ){
                    await Blog.updateOne({ _id: req.params.id, 'general.number': data.number }, { $set: { 'general.$.topBullet2': data.topBullet2 }}, { new: true } )
                }

                if( data.topBullet3 && data.topBullet3 != "" ){
                    await Blog.updateOne({ _id: req.params.id, 'general.number': data.number }, { $set: { 'general.$.topBullet3': data.topBullet3 }}, { new: true } )
                }

                if( data.topBullet4 && data.topBullet4 != "" ){
                    await Blog.updateOne({ _id: req.params.id, 'general.number': data.number }, { $set: { 'general.$.topBullet4': data.topBullet4 }}, { new: true } )
                }

                if( data.topBullet5 && data.topBullet5 != "" ){
                    await Blog.updateOne({ _id: req.params.id, 'general.number': data.number }, { $set: { 'general.$.topBullet5': data.topBullet5 }}, { new: true } )
                }

                if( data.para2 && data.para2 != "" ){
                    await Blog.updateOne({ _id: req.params.id, 'general.number': data.number }, { $set: { 'general.$.para2': data.para2 }}, { new: true } )
                }

                if( data.para3 && data.para3 != "" ){
                    await Blog.updateOne({ _id: req.params.id, 'general.number': data.number }, { $set: { 'general.$.para3': data.para3 }}, { new: true } )
                }

                if( data.para4 && data.para4 != "" ){
                    await Blog.updateOne({ _id: req.params.id, 'general.number': data.number }, { $set: { 'general.$.para4': data.para4 }}, { new: true } )
                }

                if( data.para5 && data.para5 != "" ){
                    await Blog.updateOne({ _id: req.params.id, 'general.number': data.number }, { $set: { 'general.$.para5': data.para5 }}, { new: true } )
                }

                if( data.bottomBullet1 && data.bottomBullet1 != "" ){
                    await Blog.updateOne({ _id: req.params.id, 'general.number': data.number }, { $set: { 'general.$.bottomBullet1': data.bottomBullet1 }}, { new: true } )
                }

                if( data.bottomBullet2 && data.bottomBullet2 != "" ){
                    await Blog.updateOne({ _id: req.params.id, 'general.number': data.number }, { $set: { 'general.$.bottomBullet2': data.bottomBullet2 }}, { new: true } )
                }

                if( data.bottomBullet3 && data.bottomBullet3 != "" ){
                    await Blog.updateOne({ _id: req.params.id, 'general.number': data.number }, { $set: { 'general.$.bottomBullet3': data.bottomBullet3 }}, { new: true } )
                }

                if( data.bottomBullet4 && data.bottomBullet4 != "" ){
                    await Blog.updateOne({ _id: req.params.id, 'general.number': data.number }, { $set: { 'general.$.bottomBullet4': data.bottomBullet4 }}, { new: true } )
                }

                if( data.bottomBullet5 && data.bottomBullet5 != "" ){
                    await Blog.updateOne({ _id: req.params.id, 'general.number': data.number }, { $set: { 'general.$.bottomBullet5': data.bottomBullet5 }}, { new: true } )
                }

            }
        }

        if(author && author != blog.author){
            blog.author = author
        }

        if(other && other != blog.other){
            console.log("🚀 ~ BEFORE ~ blog.other >>>>>>>>>>>>>>>>>>>>>>>> ", blog.other)
            blog.other = JSON.parse(other)
            console.log("🚀 ~ AFTER ~ blog.other >>>>>>>>>>>>>>>>>>>>>>>>> ", blog.other)
        }

        await blog.save()
        if(!blog) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'Unable to update blog!', data: {} })

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, 'message': 'Blog edited.', data: { } })

    } catch (e) {
        console.log(e)
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

// delete blog
async function deleteBlog(req, res) {
    try {
        
        console.log("🚀 ~ deleteBlog ~ req.params.id", req.params.id)

        const updateData = await Blog.findOneAndUpdate({ _id: req.params.id }, { status: false }, { new: true })

        // const updateData = await Blog.findOneAndRemove({_id: req.params.id })
        if(!updateData) return res.status(HTTP.SUCCESS).send({ 'status': true, 'message': "Unable to delete blog." })
        
        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, 'message': "Deleted blog successfully.", 'data': {}})

    } catch (e) {
        console.log(e)
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

// view all blogs
async function viewBlogs(req, res) {
    try {
        
        const data = await Blog.find({ status: true })
        if(!data) return res.status(HTTP.SUCCESS).send({ 'status': true, 'message': "Unable to view blogs.", 'data': viewData })
        
        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, 'message': "blog data.", data })

    } catch (e) {
        console.log(e)
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}


async function viewBlogById(req, res) {
    try {
       const _id = req.params.id 
        const data = await Blog.findOne({_id})
        if(!data) return res.status(HTTP.SUCCESS).send({ 'status': true, 'message': "Could not view blog." })

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, 'message': "Blog data.", data })

    } catch (e) {
        console.log(e)
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

// viewBlogsTitle
async function viewBlogsTitle(req, res) {
    try {

        const data = await BlogTitle.find({})
        if(!data) return res.status(HTTP.SUCCESS).send({ 'status': true, 'message': "Could not view blog." })

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, 'message': "Blog data.", data })

    } catch (e) {
        console.log(e)
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

// viewBlogsTitleByID
async function viewBlogsTitleByID(req, res) {
    try {

        const data = await BlogTitle.findOne({ _id: req.params.id})
        if(!data) return res.status(HTTP.SUCCESS).send({ 'status': true, 'message': "Could not view blog title." })

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, 'message': "Blog Title data.", data })

    } catch (e) {
        console.log(e)
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}


// viewSubTags
async function viewSubTags(req, res) {
    try {

        const { tag } = req.body
        const data = await BlogTitle.findOne({ tag })
        if(!data) return res.status(HTTP.SUCCESS).send({ 'status': true, 'message': "Could not view blog." })

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, 'message': "Blog data.", data })

    } catch (e) {
        console.log(e)
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

// filterSubTag
async function filterSubTag(req, res) {
    try {

        const { sub_tag } = req.body
        const data = await Blog.find({ sub_tag, publish: true })
        if(!data) return res.status(HTTP.SUCCESS).send({ 'status': true, 'message': "Could not view blog." })

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, 'message': "Blog data.", data })

    } catch (e) {
        console.log(e)
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

// publishBlog
async function publishBlog(req, res) {
    try {

        const data = await Blog.findOne({ _id: req.params.id })

        if(data.publish === false){
            data.publish = true
            await data.save()
            return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, "message": "Blog Published", data: {} })
        }

        data.publish = false
        await data.save()
        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, 'message': "Blog Unpublished.", data })

    } catch (e) {
        console.log(e)
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

// viewPublishedBlogs
async function viewPublishedBlogs(req, res){
    try {

        const data = await Blog.find({ publish: true })

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, "message": "Published Blogs", data })
                        
    } catch (e) {
        console.log(e)
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    } 
}

// comparePublishedBlogs
async function comparePublishedBlogs(req, res){
    try {

        let current = await PublishBlog.find({ blog_id: req.params.id })
        
        if(current.length == 0){
            current = await Blog.findOne({ _id: req.params.id })
            let previous = current
            return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, "message": "Published Blog", previous, current })
        }
        if(current.length < 2){
            current = current[0]
            let previous = current
            return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, "message": "Published Blog", previous, current })
        }else{
            
            const previous = await PublishBlog.findOne({ blog_id: req.params.id }).sort({ createdAt: 1 })
            const current = await PublishBlog.findOne({ blog_id: req.params.id }).sort({ createdAt: -1 })
    
            return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, "message": "Published Blog", previous, current })

        }
                        
    } catch (e) {
        console.log(e)
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    } 
}

// deletePublishedBlogs
async function deletePublishedBlogs(req, res){
    try {

        const otpCheck = randomstring.generate({ length: 4, charset: 'numeric' })
        
        const data = await Blog.findByIdAndUpdate({ _id: req.params.id }, { otpCheck }, { new: true })
        if(!data) return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.BAD_REQUEST, "message": "Something went wrong while saving otp.", data: {} })

        var sendMailData = {
            "file_template": './public/EmailTemplates/verifyOtp.html',
            "subject": 'Verify Email',
            "to": 'admin001@yopmail.com' ? 'admin001@yopmail.com' : null,
            "otp": `${otpCheck}`
        }

        sendEmailOTP(sendMailData).then((val) => {
            return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, 'message': "Please check your email.", 'data': val })
        }).catch((err) => {
            console.log(err);
            return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.BAD_REQUEST, "message": "Unable to send email!", data: {} })
        })

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, 'message': "Please check your email.", 'data': {} })

    } catch (e) {
        console.log(e)
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    } 
}

// verifyBlogOtp
async function verifyBlogOtp(req, res){
    try {

        const { otp } = req.body
                
        const data = await Blog.findOne({ _id: req.params.id })
        
        if(data.otpCheck == otp){

            const data = await PublishBlog.deleteMany({ portfolio_id: req.params.id })
            const data_ = await Blog.findOneAndRemove({ _id: req.params.id })
            if( !data || !data_  ){
                return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, 'message': "could not delete data"  })
            }

            return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.BAD_REQUEST, 'message': "Deleted portfolio permanently." })
            
        }
        
        return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': "Invalid OTP." })
        
         
    } catch (e) {
        console.log(e)
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    } 
}



module.exports = {
   
    addBlogTitle,
    editBlogTitle,
    deleteBlogTitle,

    addBlog,
    editBlog,
    deleteBlog,
    viewBlogs,
    viewBlogById,
    viewBlogsTitle,
    viewBlogsTitleByID,
    viewSubTags,
    
    filterSubTag,
    
    publishBlog,
    viewPublishedBlogs,
    comparePublishedBlogs,
    deletePublishedBlogs,
    verifyBlogOtp,


}