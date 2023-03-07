const HTTP = require("../../constants/responseCode.constant");
const User = require('../models/user.model')
const jwt = require('jsonwebtoken');
const { encodeData, decodeData } = require('../../public/partials/cryptoJS')
const { hashSync, compareSync } = require('bcrypt');
const ContactUs = require("../models/contactus.model");
const fs = require('fs');

//Add default admin
(async function deafultAdminsignup(req, res) {
    try {
        
        const adminData = { email: "admin@gmail.com", role:"admin"}
        const password = "Admin@123"
        
        const existsAdmin = await User.findOne({ email: adminData.email, role: adminData.role })
        //Admin exist 
        if (existsAdmin) return

        const userData = await new User({ ...adminData, password: hashSync(password.trim(), 8), isVerified: true }).save()
        if (!userData) console.log("Unable to add default admin")

        return
    } catch (e) {
        console.log(e);
        return
    }
})();

//signin
async function signin(req, res) {
    try {
        
        let { password, email } = req.body
        console.log("🚀 ~ file: admin.controller.js:34 ~ signin ~ email", email)
        console.log("🚀 ~ file: admin.controller.js:34 ~ signin ~ password", password)
        if (!req.body || !password || !email) {
            return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.NOT_ALLOWED, "message": "Email or password is invalid", data: {} })
        }
        
        const adminExists = await User.findOne({ email })
        if (!adminExists) {
            return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.NOT_ALLOWED, "message": "Email is incorrect", data: {} })
        }

        if(adminExists.role !== "admin") return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'Invalid credentials.', data: {} })

        if (!compareSync(password, adminExists.password)) {
            return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.BAD_REQUEST, "message": "Password is incorrect", data: {} })
        }
      
        const token = jwt.sign({ id: adminExists._id }, process.env.JWT_SECRET, { expiresIn: "24h" })
        return res.status(HTTP.SUCCESS).send({ 'status': true, 'message': "Logged in successfully!", 'data': "Bearer " + token })

    } catch (e) {
        console.log(e)
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}


// contactUs
async function contactUs(req, res){
    try {

        const { name, email, skypeId, contact, budgetRange, description, ndaCopy } = req.body
        console.log("🚀 ~ file: admin.controller.js:66 ~ contactUs ~ req.body", req.body)
        console.log(req.files, "------------------");
        if( !name || !email || !skypeId || !contact || !budgetRange || !description || !ndaCopy) return res.status(HTTP.SUCCESS).send({ "success": false, 'code': HTTP.NOT_ALLOWED, "message": "All fields are required!", data: {} })

        const files = []
        for(const data_ of req.files){
            // console.log("🚀 ~ file: admin.controller.js:73 ~ contactUs ~ data_", data_)
            files.push("uploads/contactus"+data_.filename)
            // console.log("🚀 ~ file: admin.controller.js:74 ~ contactUs ~ data_.filename", data_.filename)
        }
        console.log(files, "files........");
        const data = await ContactUs({ name, email, skypeId, contact, budgetRange, description, ndaCopy, files }).save()
        if(!data) return res.status(HTTP.SUCCESS).send({ "success": false, 'code': HTTP.BAD_REQUEST, "message": "Could not save data.", data: {} })
    
        return res.status(HTTP.SUCCESS).send({ 'status': true, 'message': "The contact form has been submitted.", data })

    } catch (e) {
        console.log(e)
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

// contact view
async function viewContactUs( req, res){
    try {

        const data = await ContactUs.find({ status: true })
        return res.status(HTTP.SUCCESS).send({ 'status': true, 'message': "Contact Us data", data })

    } catch (e) {
        console.log(e)
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

async function viewContactUsById( req, res){
    try {

        console.log("🚀 ~ file: admin.controller.js:107 ~ viewContactUsById ~  req.params.id",  req.params.id)
        const data = await ContactUs.findOne({ _id: req.params.id })
        return res.status(HTTP.SUCCESS).send({ 'status': true, 'message': "Contact Us data", data })

    } catch (e) {
        console.log(e)
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

async function deleteContactUs( req, res){
    try {

        const findData = await ContactUs.findOne({ _id: req.params.id })
        if(findData.files){
            for(const data of findData.files){
                console.log("🚀 ~ deleteContactUs ~ data", data)
                let filename_ = "./" + data
                fs.unlinkSync( filename_, (err) => {
                    if(err) console.log(err);
                })
            }
        }

        const data = await ContactUs.findOneAndUpdate({ _id: req.params.id }, { status: false }, {new: true})
        // const data = await ContactUs.findOneAndRemove({ _id: req.params.id })
        return res.status(HTTP.SUCCESS).send({ 'status': true, 'message': "Contact Us data", 'data': {} })

    } catch (e) {
        console.log(e)
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}


/***********************************************/
//-------------- for development only ----------/
/***********************************************/


//Decode data(only for developement)
function encodeReqData(req, res) {
    try {
        if (req.body.decData) {
            return res.status(200).send({ 'status': true, 'message': 'encoded data', data: encodeData(req.body.decData) })
        } else {
            return res.status(401).send({ "status": false, "message": "Please provide data", data: {} })
        }

    } catch (e) {
        console.log(e)
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

//Decode data(only for developement)
function decodeResData(req, res) {
    try {
        if (req.body.encData) {
            // return res.status(200).send({ 'status': true, 'message': 'Decoded data', data: decodeData(req.body.encData) })
            return res.send(decodeData(req.body.encData))
        } else {
            return res.status(401).send({ "status": false, "message": "Please provide data", data: {} })
        }
    } catch (e) {
        console.log(e)
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}



module.exports = {
    
    signin,
    contactUs,
    viewContactUs,
    viewContactUsById,
    deleteContactUs,

    encodeReqData,
    decodeResData,

}