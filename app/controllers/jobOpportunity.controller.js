const JobOpportunity = require("../models/jobOpportunity.model")
const HTTP = require("../../constants/responseCode.constant");
const JobApply = require("../models/jobApply.model");
const { fs } = require("file-system");


async function addOpportunity(req, res) {
    try {
        
        const { job_name, job_title, job_location, job_experience, job_description_1, job_description_2, job_description_3, job_description_4, job_description_5, job_description_6, job_description_7, job_description_8, job_description_9, job_description_10, job_description_11, job_description_12, job_requirement_1, job_requirement_2, job_requirement_3, job_requirement_4, job_requirement_5, job_requirement_6, job_requirement_7, job_requirement_8 } = req.body
        console.log("🚀 ~ file: jobOpportunity.controller.js:10 ~ addOpportunity ~ req.body", req.body)
        console.log("🚀 ~ file: jobOpportunity.controller.js:10 ~ addOpportunity ~ job_name", job_name)

        if( !job_name || !job_title || !job_location || !job_experience ) return res.status(HTTP.SUCCESS).send({ 'status': false, 'message': "All fields are required!" })

        const data = await JobOpportunity({ job_name, job_title, job_location, job_experience, job_description_1, job_description_2, job_description_3, job_description_4, job_description_5, job_description_6, job_description_7, job_description_8, job_description_9, job_description_10, job_description_11, job_description_12, job_requirement_1, job_requirement_2, job_requirement_3, job_requirement_4, job_requirement_5, job_requirement_6, job_requirement_7, job_requirement_8 }).save()
        if(!data) return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.BAD_REQUEST, "message": "Something went wrong while adding data.", data: {} })

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'message': "Added opportunity successfully.", data })

    } catch (e) {
        console.log(e)
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

async function viewOpportunity(req, res) {
    try {
        
        const data = await JobOpportunity.find()
        if(!data) return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.BAD_REQUEST, "message": "Something went wrong while fetching data.", data: {} })

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'message': "Job Opportunity data.", data })

    } catch (e) {
        console.log(e)
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

async function viewOpportunity_id(req, res) {
    try {
        
        const data = await JobOpportunity.findOne({_id: req.params.id})
        if(!data) return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.BAD_REQUEST, "message": "Something went wrong while fetching data.", data: {} })

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'message': "Job Opportunity data.", data })

    } catch (e) {
        console.log(e)
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

async function deleteOpportunity(req, res) {
    try {
       
        const removeData = await JobOpportunity.findOneAndUpdate({ _id: req.params.id }, { status: false }, {new: true})
        // const removeData = await JobOpportunity.findOneAndRemove({ _id: req.params.id })

        if(!removeData) return res.status(HTTP.SUCCESS).send({ 'status': true, 'message': "Unable to delete data.", 'data': {} })


        return res.status(HTTP.SUCCESS).send({ 'status': true, 'message': "deleted Job Opportunity data.", 'data': {}})

    } catch (e) {
        console.log(e)
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

async function editOpportunity(req, res) {
    try {
        
        let { job_name, job_title, job_location, job_experience, job_description_1, job_description_2, job_description_3, job_description_4, job_description_5, job_description_6, job_description_7, job_description_8, job_description_9, job_description_10, job_description_11, job_description_12, job_requirement_1, job_requirement_2, job_requirement_3, job_requirement_4, job_requirement_5, job_requirement_6, job_requirement_7, job_requirement_8 } = req.body

        if(Object.keys(req.body).length === 0) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.NOT_ALLOWED, 'message': 'No changes are available for update.', data: {} })

        let jobOpportunity = await JobOpportunity.findById({ _id: req.params.id })
        if(!jobOpportunity) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.NOT_FOUND, 'message': 'Job Opportunity data does not exist!', data: {} })

        if(job_name && job_name != jobOpportunity.job_name){
            jobOpportunity.job_name = job_name
        }

        if(job_title && job_title != jobOpportunity.job_title) {
            jobOpportunity.job_title = job_title
        }

        if(job_location && job_location != jobOpportunity.job_location){
            jobOpportunity.job_location = job_location
        }

        if(job_experience && job_experience != jobOpportunity.job_experience){
            jobOpportunity.job_experience = job_experience
        }

        if(job_description_1 && job_description_1 != jobOpportunity.job_description_1) {
            jobOpportunity.job_description_1 = job_description_1
        }

        if(job_description_2 && job_description_2 != jobOpportunity.job_description_2) {
            jobOpportunity.job_description_2 = job_description_2
        }

        if(job_description_3 && job_description_3 != jobOpportunity.job_description_3) {
            jobOpportunity.job_description_3 = job_description_3
        }

        if(job_description_4 && job_description_4 != jobOpportunity.job_description_4) {
            jobOpportunity.job_description_4 = job_description_4
        }

        if(job_description_5 && job_description_5 != jobOpportunity.job_description_5) {
            jobOpportunity.job_description_5 = job_description_5
        }

        if(job_description_6 && job_description_6 != jobOpportunity.job_description_6) {
            jobOpportunity.job_description_6 = job_description_6
        }

        if(job_description_7 && job_description_7 != jobOpportunity.job_description_7) {
            jobOpportunity.job_description_7 = job_description_7
        }

        if(job_description_8 && job_description_8 != jobOpportunity.job_description_8) {
            jobOpportunity.job_description_8 = job_description_8
        }

        if(job_description_9 && job_description_9 != jobOpportunity.job_description_9) {
            jobOpportunity.job_description_9 = job_description_9
        }

        if(job_description_10 && job_description_10 != jobOpportunity.job_description_10) {
            jobOpportunity.job_description_10 = job_description_10
        }

        if(job_description_11 && job_description_11 != jobOpportunity.job_description_11) {
            jobOpportunity.job_description_11 = job_description_11
        }

        if(job_description_12 && job_description_12 != jobOpportunity.job_description_12) {
            jobOpportunity.job_description_12 = job_description_12
        }

        if(job_requirement_1 && job_requirement_1 != jobOpportunity.job_requirement_1){
            jobOpportunity.job_requirement_1 = job_requirement_1
        }

        if(job_requirement_2 && job_requirement_2 != jobOpportunity.job_requirement_2){
            jobOpportunity.job_requirement_2 = job_requirement_2
        }

        if(job_requirement_3 && job_requirement_3 != jobOpportunity.job_requirement_3){
            jobOpportunity.job_requirement_3 = job_requirement_3
        }

        if(job_requirement_4 && job_requirement_4 != jobOpportunity.job_requirement_4){
            jobOpportunity.job_requirement_4 = job_requirement_4
        }

        if(job_requirement_5 && job_requirement_5 != jobOpportunity.job_requirement_5){
            jobOpportunity.job_requirement_5 = job_requirement_5
        }

        if(job_requirement_6 && job_requirement_6 != jobOpportunity.job_requirement_6){
            jobOpportunity.job_requirement_6 = job_requirement_6
        }
        if(job_requirement_7 && job_requirement_7 != jobOpportunity.job_requirement_7){
            jobOpportunity.job_requirement_7 = job_requirement_7
        }

        if(job_requirement_8 && job_requirement_8 != jobOpportunity.job_requirement_8){
            jobOpportunity.job_requirement_8 = job_requirement_8
        }

        await jobOpportunity.save()
        if(!jobOpportunity) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'Unable to update job Opportunity data!', data: {} })

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, 'message': 'Job Opportunity data updated.', data: { jobOpportunity } })

    } catch (e) {
        console.log(e)
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

async function searchJob(req, res) {
    try {

        let { search } = req.body
        console.log("🚀 ~ file: jobOpportunity.controller.js:191 ~ searchJob ~ search", search)
        // const data = await JobOpportunity.find( { job_title: {$regex: search} })
        const data = await JobOpportunity.find( { job_title: new RegExp(search, 'i') })
        // console.log("🚀 ~ file: jobOpportunity.controller.js:190 ~ searchJob ~ data", data)

        if(!data || data == []){
            const data = await JobOpportunity.find()
            return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, 'message': 'Search results.', data })
        }

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, 'message': 'Search results.', data })


    } catch (e) {
        console.log(e)
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

async function searchData(req, res) {
    try {

        let { job_title, job_location, job_experience } = req.body
        console.log("🚀 ~ file: jobOpportunity.controller.js:214 ~ searchData ~ job_title", job_title)
        // const data = await JobOpportunity.find({ job_title: {$in: job_title} })

        const data = await JobOpportunity.find({$and: [{job_title: {$in: job_title}}, {job_location: {$in: job_location}}, {job_experience: {$in: job_experience}}]  })

        if(job_title && job_location && job_experience){
            const data = await JobOpportunity.find({$and: [{job_title: {$in: job_title}}, {job_location: {$in: job_location}}, {job_experience: {$in: job_experience}}]  })
        }
        
        
        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, 'message': 'Search results.', data })


    } catch (e) {
        console.log(e)
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}



async function jobApply(req, res) {
    try {
 
        const { name, email, contact, message } = req.body
        if( !name || !email || !contact || !message) return res.status(HTTP.SUCCESS).send({ "success": false, 'code': HTTP.NOT_ALLOWED, "message": "All fields are required!", data: {} })
        
        let file = ""
                
        for(const data_ of req.files){
            console.log("🚀 ~ file: jobOpportunity.controller.js:210 ~ jobApply ~ data_", data_)
            
            file = "uploads/jobapply" + data_.filename
        }
        console.log(file, " ~ files ");

        const data = await JobApply({ name, email, contact, message, file }).save()
        if(!data) return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.BAD_REQUEST, "message": "Could not save data.", data: {} })
    
        return res.status(HTTP.SUCCESS).send({ 'status': true, 'message': "Job Applied.", data: {} })
        
    } catch (e) {
        console.log(e)
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

// viewJobsApplied
async function viewJobsApplied(req, res) {
    try {
 
        const data = await JobApply.find({ status: true })
        if(!data) return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.BAD_REQUEST, "message": "Could not save data.", data: {} })
    
        return res.status(HTTP.SUCCESS).send({ 'status': true, 'message': "View jobs applied.", data })
        
    } catch (e) {
        console.log(e)
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

async function viewJobsAppliedbyId(req, res) {
    try {
 
        console.log("🚀 ~ file: jobOpportunity.controller.js:248 ~ viewJobsAppliedbyId ~ req.params.id", req.params.id)
        
        const data = await JobApply.findOne({ _id: req.params.id })
        if(!data) return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.BAD_REQUEST, "message": "Could not save data.", data: {} })
    
        return res.status(HTTP.SUCCESS).send({ 'status': true, 'message': "View jobs applied.", data })
        
    } catch (e) {
        console.log(e)
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

async function deleteJobsApplied(req, res) {
    try {
 
        const findData = await JobApply.findOne({ _id: req.params.id })
        if(findData.file) {
           let filename_ = "./" + findData.file
           fs.unlinkSync( filename_, (err) => {
            if(err) console.log(err);
           } ) 
        }

        const data = await JobApply.findOneAndUpdate({ _id: req.params.id }, { status: false }, {new: true})
        // const data = await JobApply.findOneAndRemove({ _id: req.params.id })

        if(!data) return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.BAD_REQUEST, "message": "Could not save data.", data: {} })
    
        return res.status(HTTP.SUCCESS).send({ 'status': true, 'message': "View jobs applied.", 'data': {} })
        
    } catch (e) {
        console.log(e)
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}


module.exports = {
   
    addOpportunity,
    viewOpportunity_id,
    viewOpportunity,
    deleteOpportunity,     
    editOpportunity,
    searchJob,
    searchData,
    jobApply,
    viewJobsApplied,
    viewJobsAppliedbyId,
    deleteJobsApplied,


}