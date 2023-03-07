const Portfolio = require("../models/portfolio.model")
const HTTP = require("../../constants/responseCode.constant");
const fs = require('fs');
const upload = require("../middlewares/portfolioUpload")
const PortfolioTags = require('../models/porfolioTags.model')
const PublishPortfolio = require('../models/publishPortfolio.model')
var randomstring = require("randomstring");
const { sendEmailOTP } = require("../../public/partials/utils")
const multer = require("multer");

async function addPortfolio(req, res) {
    try{
        console.log("🚀 ~~~~~~~~~~~~~~~~~~~~~~~ addPortfolio ~~~~~~~~~~~~~~~~~~~~~~~")
                
        const { title, sub_title, industry, services, businessType, buildYourIdea, description, websiteLink, question, answer, answer2, quote, projectGoals, tag, sub_tag } = req.body
        // console.log("🚀 ~ file: portfolio.controller.js:16 ~ addPortfolio ~ projectGoals", projectGoals)
        // console.log("🚀 ~ file: portfolio.controller.js:16 ~ addPortfolio ~ industry", industry)
        // console.log("🚀 ~ file: portfolio.controller.js:16 ~ addPortfolio ~ sub_title", sub_title)
        // console.log("🚀 ~ file: portfolio.controller.js:16 ~ addPortfolio ~ title", title)
        // console.log("🚀 ~ file: portfolio.controller.js:16 ~ addPortfolio ~ req.body", req.body)
        // console.log("🚀 ~ file: portfolio.controller.js:21 ~ addPortfolio ~ req.files", req.files)
        const general = [{ industry, services, businessType, buildYourIdea }]
        
            
        if( !title || !sub_title || !industry || !services || !businessType || !buildYourIdea || !description || !websiteLink || !question || !answer || !answer2 || !quote || !projectGoals || !tag || !sub_tag || req.files === undefined ) return res.status(HTTP.SUCCESS).send({ 'status': false, 'message': "All fields are required!" });
        
        let bgImg, aboutImg, quoteImg, projectImg, outsideImg
        for(const data of req.files.bgImg){
            bgImg = "uploads/portfolio" + data.filename
        }
        for(const data of req.files.aboutImg){
            aboutImg = "uploads/portfolio" + data.filename
        }
        for(const data of req.files.quoteImg){
            quoteImg = "uploads/portfolio" + data.filename
        }
        for(const data of req.files.projectImg){
            projectImg = "uploads/portfolio" + data.filename
        }
        for(const data of req.files.outsideImg){
            outsideImg = "uploads/portfolio" + data.filename
        }
        
        // check tag
        const check_tag = await PortfolioTags.findOne({ tag, sub_tag })
        if(!check_tag) return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.BAD_REQUEST, "message": "Invalid Tag.", data: {} })
    
        const data = await new Portfolio({ title, sub_title, general, description, websiteLink, bgImg, aboutImg, quoteImg, projectImg, outsideImg, question, answer, answer2, quote, projectGoals: JSON.parse(projectGoals), tag, sub_tag }).save()
        if(!data) return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.BAD_REQUEST, "message": "Something went wrong while adding data.", data: {} })
    
        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, "message": "Portfolio added successfully!", data })

    } catch (e) {
        console.log(e)
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }


}

async function addPortfolioImages(req, res) {
    upload(req, res, function (err) {      
        if (err instanceof multer.MulterError) {
            console.log("🚀 ~ file: portfolio.controller.js:32 ~ err", err)
            return res.status(HTTP.SUCCESS).send({ "status": false, ' code': HTTP.BAD_REQUEST, "message": 'A Multer error occurred when uploading.', data: {} })
        } else if (err) {
            console.log("🚀 ~ file: portfolio.controller.js:44 ~ err", err)
            return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": 'An unknown error occurred when uploading.', data: {} })
        }
        // file.originalname.split(".")[0]
        let image = []
        for(const img of req.files){
            // console.log(img.filename)
            image.push(img.filename)
        }
        // console.log(image, " 🚀 ~ image ~ ");
        
        Portfolio.findByIdAndUpdate({ _id: req.params.id }, { image }, { new: true }).then(() => {
            return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, "message": "Portfolio Images added successfully!", data: {} })
        }).catch(e => {
            console.log(e);
            return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
        })

      })    
}

async function addPortfolioImg(req, res){
    console.log(req.params.id, "req.params.id -------------- addPortfolioImg");
    upload(req, res, function (err) {      
        if (err instanceof multer.MulterError) {
            console.log("🚀 ~ file: portfolio.controller.js:32 ~ err", err)
            return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.BAD_REQUEST, "message": 'A Multer error occurred when uploading.', data: {} })
        } else if (err) {
            console.log("🚀 ~ file: portfolio.controller.js:70 ~ err", err)
            return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": 'An unknown error occurred when uploading.', data: {} }) 
        }
        console.log("🚀 ~ file: portfolio.controller.js:78 ~ req.file", req.files)

        let image1 = []
        for(const img of req.files){
            console.log(img.filename)
            image1.push(img.filename)
        }
        console.log(image1, " 🚀 ~ image1 ~ ");
        
        Portfolio.findByIdAndUpdate({ _id: req.params.id }, { image1 }, { new: true }).then(() => {
            return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, "message": "Portfolio Image added successfully!", data: {} })
        }).catch(e => {
            console.log(e);
            return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
        })

      }) 
}

async function editPortfolio(req, res){
    try {
        
        console.log( req.params.id, "   req.user.id editPortfolio");
        let { title, sub_title, industry, services, businessType, buildYourIdea, description, websiteLink, question, answer, answer2, quote, projectGoals, tag, sub_tag } = req.body
        console.log("🚀 ~ file: portfolio.controller.js:113 ~ editPortfolio ~ req.body", req.body)
        console.log("🚀 ~ file: portfolio.controller.js:114 ~ editPortfolio ~ projectGoals", projectGoals)

        
                
        let portfolio = await Portfolio.findById({ _id: req.params.id })
        if(!portfolio) return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.NOT_FOUND, "message": "Portfolio data does not exists!", data: {} })                                                                                                
        
        
        if(portfolio.publish){
            console.log("🚀 ~ file: portfolio.controller.js:121 ~ editPortfolio ~ portfolio.publish", portfolio.publish)
            
            // check for prev edit ======
            const checkData = await PublishPortfolio.find({ portfolio_id: portfolio._id })
            console.log("🚀 ~ file: portfolio.controller.js:126 ~ editPortfolio ~ checkData", checkData)
            console.log("🚀 ~ file: portfolio.controller.js:126 ~ editPortfolio ~ checkData", checkData.length)
            
            if(checkData.length == 2){
                const oldData = await PublishPortfolio.findOneAndRemove({ portfolio_id: portfolio._id }).sort({ createdAt: 1 })
                console.log("🚀 ~ file: portfolio.controller.js:133 ~ editPortfolio ~ oldData", oldData)
            }

            // return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, 'message': 'checking', data: { } })            
            
            let bgImg, aboutImg, quoteImg, projectImg, outsideImg;
            if( req.files.bgImg != undefined || req.files.bgImg != null ){
                for(const data of req.files.bgImg){
                   bgImg = "uploads/portfolio" + data.filename
                }
            }else{
                bgImg = portfolio.bgImg
            }

            if( req.files.aboutImg != undefined || req.files.aboutImg != null ){
                for(const data of req.files.aboutImg){
                    aboutImg = "uploads/portfolio" + data.filename
                }
            }else{
                aboutImg = portfolio.aboutImg
            }

            if( req.files.quoteImg != undefined || req.files.quoteImg != null ){
                for(const data of req.files.quoteImg){
                    quoteImg = "uploads/portfolio" + data.filename
                }
            }else{
                quoteImg = portfolio.quoteImg
            }

            if( req.files.projectImg != undefined || req.files.projectImg != null ){
                for(const data of req.files.projectImg){
                    projectImg = "uploads/portfolio" + data.filename
                }
            }else{
                projectImg = portfolio.projectImg
            }

            if( req.files.outsideImg != undefined || req.files.outsideImg != null ){
                for(const data of req.files.outsideImg){
                    outsideImg = "uploads/portfolio" + data.filename
                }
            }else{
                outsideImg = portfolio.outsideImg
            }

            
            const general = [{ industry, services, businessType, buildYourIdea }]
            const data = await new PublishPortfolio({ portfolio_id: portfolio._id, title, sub_title, general, description, websiteLink, bgImg, aboutImg, quoteImg, projectImg, outsideImg, question, answer, answer2, quote, projectGoals: JSON.parse(projectGoals), tag, sub_tag }).save()

            if(!data) return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.BAD_REQUEST, "message": "Something went wrong while adding data.", data: {} })
            
        }

       
        let bgImg, aboutImg, quoteImg, projectImg, outsideImg
        console.log("🚀 ~  bgImg", req.files.bgImg)
        if( req.files.bgImg != undefined || req.files.bgImg != null ){
            for(const data of req.files.bgImg){
    
                bgImg = "uploads/portfolio" + data.filename 
                if(portfolio.bgImg){
                    let filename_ = "./" + portfolio.bgImg
                    
                    fs.unlinkSync( filename_ ,(err) => {
                        if (err) console.log(err);
                    });
                }
    
                const data_ = await Portfolio.findByIdAndUpdate({ _id: req.params.id }, { bgImg }, { new: true })
                if(!data_) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'Unable to update data!', data: {} })
    
            }
        }
        
        console.log("🚀 ~ req.files.aboutImg", req.files.aboutImg)
        if( req.files.aboutImg != undefined || req.files.aboutImg != null ){
            for(const data of req.files.aboutImg) {
                
                aboutImg = "uploads/portfolio" + data.filename     
                if(portfolio.aboutImg){
                    let filename_ = "./" + portfolio.aboutImg
                    
                    fs.unlinkSync( filename_, (err) => {
                        if(err) console.log(err);
                    })
                    
                }           
                const data_ = await Portfolio.findByIdAndUpdate({ _id: req.params.id }, { aboutImg }, { new: true })
                if(!data_) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'Unable to update data!', data: {} })
            }
        }
        
        console.log("🚀 ~ req.files.quoteImg", req.files.quoteImg)
        if(req.files.quoteImg != undefined || req.files.quoteImg != null ){
            for(const data of req.files.quoteImg) {
                
                quoteImg = "uploads/portfolio" + data.filename
                if(portfolio.quoteImg) {
                    let filename_ = "./" + portfolio.quoteImg
                    
                    fs.unlinkSync( filename_, (err) => {
                        if(err) console.log(err);
                    })
                }
                
                
                const data_ = await Portfolio.findByIdAndUpdate({ _id: req.params.id }, { quoteImg }, { new: true })
                if(!data_) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'Unable to update data!', data: {} })
            }        
        }
        
        console.log("🚀 ~ req.files.projectImg", req.files.projectImg)
        if( req.files.projectImg != undefined || req.files.projectImg != null ){
            for(const data of req.files.projectImg) {
                
                projectImg = "uploads/portfolio" + data.filename      
                if(portfolio.projectImg) {
                    let filename_ = "./" + portfolio.projectImg
                    
                    fs.unlinkSync( filename_, (err) => {
                        if(err) console.log(err);
                    })
                }
    
                const data_ = await Portfolio.findByIdAndUpdate({ _id: req.params.id }, { projectImg }, { new: true })
                if(!data_) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'Unable to update data!', data: {} })    
            }
        }

        console.log("🚀 ~ req.files.outsideImg", req.files.outsideImg)
        if( req.files.outsideImg != undefined || req.files.outsideImg != null ){
            for(const data of req.files.outsideImg) {
    
                outsideImg = "uploads/portfolio" + data.filename
                if(portfolio.outsideImg) {
                    let filename_ = "./" + portfolio.outsideImg
                    
                    fs.unlinkSync( filename_, (err) => {
                        if(err) console.log(err);
                    })
                }            
                
                const data_ = await Portfolio.findByIdAndUpdate({ _id: req.params.id }, { outsideImg }, { new: true })
                if(!data_) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'Unable to update data!', data: {} })
            }
        }
        
        // check tag
        const check_tag = await PortfolioTags.findOne({ tag, sub_tag })
        if(!check_tag) return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.BAD_REQUEST, "message": "Invalid Tag.", data: {} })
        
        if(tag && tag != "" && sub_tag && sub_tag != "" && sub_tag != portfolio.sub_tag){
            portfolio.tag = tag
            portfolio.sub_tag = sub_tag
        }

        if(industry && industry !== "") {
            for (const data of portfolio.general) {
                await Portfolio.updateOne({ _id: req.params.id, 'general.industry': data.industry }, { $set: { 'general.$.industry': industry } }) 
            }
        }
        if(services && services !== "") {
            for (const data of portfolio.general) {
                await Portfolio.updateOne({ _id: req.params.id, 'general.services': data.services }, { $set: { 'general.$.services': services } })
            }
        }
        if(businessType && businessType !== "") {
            for (const data of portfolio.general) {
                await Portfolio.updateOne({ _id: req.params.id, 'general.businessType': data.businessType}, { $set: { 'general.$.businessType': businessType } })
            }
        }
        if(buildYourIdea && buildYourIdea !== "") {
            for (const data of portfolio.general) {
                await Portfolio.updateOne({ _id: req.params.id, 'general.buildYourIdea': data.buildYourIdea }, { $set: { 'general.$.buildYourIdea': buildYourIdea } }) 
            }
        }
        
        if(title && title != portfolio.title) {
            portfolio.title = title 
        }
        
        if(sub_title && sub_title != portfolio.sub_title){ 
            portfolio.sub_title = sub_title
        }
        
        if(description && description != portfolio.description) {
            portfolio.description = description
        }
        
        if(websiteLink && websiteLink != portfolio.websiteLink) {
            portfolio.websiteLink = websiteLink
        }

        if(question && question != portfolio.question) {
            portfolio.question = question
        }
        
        if(answer && answer != portfolio.answer) {
            portfolio.answer = answer
        }
        
        if(answer2 && answer2 != portfolio.answer2) {
            portfolio.answer2 = answer2
        }
        
        if(quote && quote != portfolio.quote) {
            portfolio.quote = quote
        }
        
        if(projectGoals){
            // console.log("🚀 ~ file: portfolio.controller.js:274 ~ editPortfolio ~ projectGoals", projectGoals)
            
            for(const data of projectGoals){ //JSON.parse(projectGoals)
                // console.log("🚀 ~ file: portfolio.controller.js:277 ~ editPortfolio ~ data", data)
                if(data.goal_title && data.goal_title != ""){
                    
                    // console.log("🚀 ~ editPortfolio ~ data.number", data.number)
                    await Portfolio.updateOne({ _id: req.params.id, 'projectGoals.number': data.number}, { $set: {
                        'projectGoals.$.goal_title': data.goal_title
                    } })
                }
    
                if(data.goal_desc && data.goal_desc != ""){
                    // console.log("🚀 ~ editPortfolio ~ data.number", data.number)
                    await Portfolio.updateOne({ _id: req.params.id, 'projectGoals.number': data.number}, { $set: {
                        'projectGoals.$.goal_desc': data.goal_desc
                    } })
                }    
            }
        }
        
        await portfolio.save()
        if (!portfolio) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'Unable to update portfolio!', data: {} })
                
        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, 'message': 'Porfolio updated.', data: { } })
        
    } catch (e) {
        console.log(e)
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

async function deletePorfolio(req, res){
    try {

        const data_ = await Portfolio.findOne({ _id: req.params.id })
        if(data_.bgImg){
            let filename_ = "./" + data_.bgImg
            fs.unlinkSync( filename_, (err) => {
                if(err) console.log(err);
            } )
        }
        if(data_.aboutImg){
            let filename_ = "./" + data_.aboutImg
            fs.unlinkSync( filename_, (err) => {
                if(err) console.log(err);
            } )
        }
        if(data_.quoteImg){
            let filename_ = "./" + data_.quoteImg
            fs.unlinkSync( filename_, (err) => {
                if(err) console.log(err);
            } )
        }
        if(data_.projectImg){
            let filename_ = "./" + data_.projectImg
            fs.unlinkSync( filename_, (err) => {
                if(err) console.log(err);
            } )
        }
        if(data_.outsideImg){
            let filename_ = "./" + data_.outsideImg
            fs.unlinkSync( filename_, (err) => {
                if(err) console.log(err);
            } )
        }
        
        const data = await Portfolio.findOneAndUpdate({ _id: req.params.id }, { status: false }, {new: true})
        // const data = await Portfolio.findOneAndRemove({_id: req.params.id })
        if(!data) return res.status(HTTP.SUCCESS).send({ 'status': true, 'message': "Unable to delete data.",  })       

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'message': "Deleted portfolio successfully.", data })

    } catch (e) {
        console.log(e)
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    } 
}


async function viewPortfolio(req, res){
    try {

        const data = await Portfolio.findOne({ _id: req.params.id , status: true } )
        if(!data) return res.status(HTTP.SUCCESS).send({ 'status': true, 'message': "Unable to view data." })
        

        let url = "uploads/portfolio"
        let bgImg = url + data.bgImg
        let aboutImg = url + data.aboutImg
        let quoteImg = url + data.quoteImg
        let projectImg = url + data.projectImg
                
        return res.status(HTTP.SUCCESS).send({ 'status': true, 'message': "Portfolio data.", data })

    } catch (e) {
        console.log(e)
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    } 
}

async function viewPortfolios(req, res){
    try {

        const { tag } = req.body
        if(tag == "All") {
            const data = await Portfolio.find({ status: true },{ title: 1, sub_title: 1, _id: 1, description: 1, outsideImg: 1, publish: 1 })
            if(!data) return res.status(HTTP.SUCCESS).send({ 'status': true, 'message': "Unable to view data.", 'data': {} })

            let formattedData = []
            for(const data_ of data){
                formattedData.push({ _id: data_._id, title: data_.title, sub_title: data_.sub_title, description: data_.description, outsideImg : data_.outsideImg, publish: data_.publish })
            }
            
            return res.status(HTTP.SUCCESS).send({ 'status': true, 'message': "Portfolio data.", formattedData })

        }

        const data = await Portfolio.find({ tag, status: true },{ title: 1, sub_title: 1, _id: 1, description: 1, outsideImg: 1, publish: 1 })
        if(!data) return res.status(HTTP.SUCCESS).send({ 'status': true, 'message': "Unable to view data.", 'data': {} })

        let formattedData = []
        for(const data_ of data){
            formattedData.push({ _id: data_._id, title: data_.title, sub_title: data_.sub_title, description: data_.description, outsideImg : data_.outsideImg, publish: data_.publish })
        }
        
        return res.status(HTTP.SUCCESS).send({ 'status': true, 'message': "Portfolio data.", formattedData })

    } catch (e) {
        console.log(e)
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    } 
}

// addTag
async function addTag(req, res){
    try {

        const { tag, name } = req.body
        if(!tag || !name) return res.status(HTTP.SUCCESS).send({ 'status': false, 'message': "All fields are required!" })

        // check if tag already added
        const check = await PortfolioTags.findOne({ tag, sub_tag: name })
        if(check) return res.status(HTTP.SUCCESS).send({ 'status': true, 'message': `${name} already added.` })

        const exist = await PortfolioTags.findOne({ tag })
        console.log(exist, "---------exist");
        if(exist) {
            
            console.log("🚀 ~ before exist.sub_tag", exist.sub_tag)
            exist.sub_tag.push(name)
            console.log("🚀 ~ after exist.sub_tag", exist.sub_tag)
            exist.save()
            return res.status(HTTP.SUCCESS).send({ 'status': true, 'message': `Added new ${tag} tag.` })
        }

        let sub_tag = [ name ]
        console.log("🚀 ~ file: portfolio.controller.js:384 ~ addTag ~ sub_tag", sub_tag)
        const data = await new PortfolioTags({ tag, sub_tag }).save()
        if(!data) return res.status(HTTP.SUCCESS).send({ 'status': true, 'message': "Unable to add data.",  })
        
        return res.status(HTTP.SUCCESS).send({ 'status': true, 'message': `Added new ${tag} tag.` })

    } catch (e) {
        console.log(e)
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    } 
}

// viewTag
async function viewTag(req, res){
    try {

        const { tag } = req.body
        // console.log("🚀 ~ file: portfolio.controller.js:431 ~ viewTag ~ tag", tag)
        if(tag == "All"){
            const data = await PortfolioTags.find()
            return res.status(HTTP.SUCCESS).send({ 'status': true, 'message': `All tags data.`, data })
        }
        
        const data = await PortfolioTags.find({ tag })
        // console.log("🚀 ~ file: portfolio.controller.js:423 ~ viewTag ~ data", data)
                        
        return res.status(HTTP.SUCCESS).send({ 'status': true, 'message': `${tag} tags data.`, data })

    } catch (e) {
        console.log(e)
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    } 
}

// publishPortfolio
async function publishPortfolio(req, res){
    try {

        const data = await Portfolio.findOne({ _id: req.params.id })

        if(data.publish === false){
            data.publish = true

            // add to publish portfolio

            await data.save()
            return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, "message": "Portfolio Published", data: {} })
        }
        
        data.publish = false
        await data.save()
        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, "message": "Portfolio Unpublished", data: {} })
                        
    } catch (e) {
        console.log(e)
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    } 
}

// viewPublishedPortfolios
async function viewPublishedPortfolios(req, res){
    try {

        // const data = await Portfolio.find({ publish: true })

        // return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, "message": "Published Portfolios", data })

        const { tag } = req.body
        if(tag == "All") {
            const data = await Portfolio.find({ status: true, publish: true },{ title: 1, sub_title: 1, _id: 1, description: 1, outsideImg: 1, publish: 1 })
            if(!data) return res.status(HTTP.SUCCESS).send({ 'status': true, 'message': "Unable to view data.", 'data': {} })

            let formattedData = []
            for(const data_ of data){
                formattedData.push({ _id: data_._id, title: data_.title, sub_title: data_.sub_title, description: data_.description, outsideImg : data_.outsideImg, publish: data_.publish })
            }
            
            return res.status(HTTP.SUCCESS).send({ 'status': true, 'message': "Portfolio data.", formattedData })

        }

        const data = await Portfolio.find({ tag, status: true, publish: true },{ title: 1, sub_title: 1, _id: 1, description: 1, outsideImg: 1, publish: 1 })
        if(!data) return res.status(HTTP.SUCCESS).send({ 'status': true, 'message': "Unable to view data.", 'data': {} })

        let formattedData = []
        for(const data_ of data){
            formattedData.push({ _id: data_._id, title: data_.title, sub_title: data_.sub_title, description: data_.description, outsideImg : data_.outsideImg, publish: data_.publish })
        }
        
        return res.status(HTTP.SUCCESS).send({ 'status': true, 'message': "Portfolio data.", formattedData })

                        
    } catch (e) {
        console.log(e)
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    } 
}

// comparePublishedPortfolios
async function comparePublishedPortfolios(req, res){
    try {

        let current = await PublishPortfolio.find({ portfolio_id: req.params.id })
        // console.log("🚀 ~ file: portfolio.controller.js:578 ~ comparePublishedPortfolios ~ req.params.id", req.params.id)
        // console.log("🚀 ~ file: portfolio.controller.js:578 ~ comparePublishedPortfolios ~ current", current)
        // console.log("🚀 ~ file: portfolio.controller.js:591 ~ comparePublishedPortfolios ~ current.length", current.length)
        
        if(current.length == 0){
            current = await Portfolio.findOne({ _id: req.params.id })
            let previous = current
            return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, "message": "Published Portfolios", current, previous})
        }

        if(current.length < 2){
            current = current[0]
            let previous = current
            return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, "message": "Published Portfolios", current, previous})
        }else{
            
            const previous = await PublishPortfolio.findOne({ portfolio_id: req.params.id }).sort({ createdAt: 1 })
            const current = await PublishPortfolio.findOne({ portfolio_id: req.params.id }).sort({ createdAt: -1 })
    
            return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, "message": "Published Portfolios", previous, current })

        }
                        
    } catch (e) {
        console.log(e)
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    } 
}

// deletePublishedPortfolio
async function deletePublishedPortfolio(req, res){
    try {

        const otpCheck = randomstring.generate({ length: 4, charset: 'numeric' })
        console.log("🚀 ~ file: portfolio.controller.js:603 ~ deletePublishedPortfolio ~ otpCheck", otpCheck)

        // const data = await PublishPortfolio.findByIdAndUpdate({ _id: req.params.id }, { otpCheck }, { new: true })
        const data = await Portfolio.findByIdAndUpdate({ _id: req.params.id }, { otpCheck }, { new: true })
        if(!data) return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.BAD_REQUEST, "message": "Something went wrong while saving otp.", data: {} })

        var sendMailData = {
            "file_template": './public/EmailTemplates/verifyOtp.html',
            "subject": 'Verify Email',
            "to": 'admin001@yopmail.com' ? 'admin001@yopmail.com' : null,
            "otp": `${otpCheck}`
        }

        
        // const emailotp = sendEmailOTP(sendMailData)
        // emailotp.then(val => { console.log(val, "val"); })
        // emailotp.catch((err) => {
        //     console.log(err);
        //     return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.BAD_REQUEST, "message": "Unable to send email!", data: {} })
        // })

        sendEmailOTP(sendMailData).then((val) => {
            console.log("🚀 ~ file: portfolio.controller.js:617 ~ awaitsendEmailOTP ~ val", val)
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

// verifyPortfolioOtp
async function verifyPortfolioOtp(req, res){
    try {

        const { otp } = req.body
                
        const data = await Portfolio.findOne({ _id: req.params.id })
        
        if(data.otpCheck == otp){

            const data = await PublishPortfolio.deleteMany({ portfolio_id: req.params.id })
            const data_ = await Portfolio.findOneAndRemove({ _id: req.params.id })
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
   
    addPortfolio,
    addPortfolioImages,
    addPortfolioImg,
    editPortfolio,
    deletePorfolio,
    viewPortfolio,
    viewPortfolios,

    addTag,
    viewTag,

    publishPortfolio,
    viewPublishedPortfolios,
    comparePublishedPortfolios,
    deletePublishedPortfolio,
    verifyPortfolioOtp,
    


}