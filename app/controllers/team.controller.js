const Team = require("../models/team.model")
const HTTP = require("../../constants/responseCode.constant");
const upload = require("../middlewares/teamUpload");
const { fs } = require("file-system");
const team = require("../models/team.model");

async function addTeamMember(req, res) {
    try {

        const { category, name, position, about, linkedin, gmail, twitter } = req.body
        // console.log("🚀 ~ file: team.controller.js:10 ~ addTeamMember ~ req.body:", req.body)

        // if(!name || !position || !about || !linkedin || !gmail || !twitter || !req.file) return res.status(HTTP.SUCCESS).send({ 'status': false, 'message': "All fields are required!" })

        // console.log("🚀 ~ file: team.controller.js:15 ~ addTeamMember ~ req.file.filename:", req.file)
        let profileImg, editedImg


        if (req.files.profileImg != undefined || req.files.profileImg != null) {
            for (const data of req.files.profileImg) {
                profileImg = "uploads/team" + data.filename
            }
        }

        if (req.files.editedImg != undefined || req.files.editedImg != null) {
            for (const data of req.files.editedImg) {
                editedImg = "uploads/team" + data.filename
            }
        }

        var find = await Team.count({})
        var number = find + 2
        // console.log(num)


        // if(name) 

        const data = await Team({ number, category, name, position, about, linkedin, gmail, twitter, profileImg, editedImg }).save()
        if (!data) return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.BAD_REQUEST, "message": "Something went wrong while adding data.", data: {}, })

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'message': "Added team data successfully.", data })

    } catch (e) {
        console.log(e)
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

async function editTeamMember(req, res) {
    try {

        let { category, name, position, about, linkedin, gmail, twitter } = req.body

        let team = await Team.findById({ _id: req.params.id })
        if (!team) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.NOT_FOUND, 'message': 'Team data does not exist.', data: {} })

        if (category && team.category) {
            team.category = category
        }
        if (name && team.name) {
            team.name = name
        }
        if (position && team.position) {
            team.position = position
        }
        if (about && team.about) {
            team.about = about
        }
        if (linkedin || linkedin == "") {
            team.linkedin = linkedin
        }
        if (gmail && team.gmail) {
            team.gmail = gmail
        }
        if (twitter || twitter == "") {
            team.twitter = twitter
        }
        let profileImg, editedImg
        // if(req.file != undefined){
        //     profileImg = "uploads/team" + req.file.filename
        //     if(team.profileImg){
        //         let filename_ = "./" + team.profileImg

        //         fs.unlinkSync( filename_, (err) => {
        //             if(err) console.log(err);
        //         })
        //     }

        //     team.profileImg = profileImg
        // }

        if (req.files.profileImg != undefined || req.files.profileImg != null) {
            for (const data of req.files.profileImg) {

                profileImg = "uploads/team" + data.filename
                if (team.profileImg) {
                    let filename_ = "./" + team.profileImg

                    fs.unlinkSync(filename_, (err) => {
                        if (err) console.log(err);
                    })
                }

                const data_ = await Team.findByIdAndUpdate({ _id: req.params.id }, { profileImg }, { new: true })
                if (!data_) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'Unable to update data!', data: {} })

            }
        }

        if (req.files.editedImg != undefined || req.files.editedImg != null) {
            for (const data of req.files.editedImg) {

                editedImg = "uploads/team" + data.filename
                if (team.editedImg) {
                    let filename_ = "./" + team.editedImg

                    fs.unlinkSync(filename_, (err) => {
                        if (err) console.log(err);
                    })
                }

                const data_ = await Team.findByIdAndUpdate({ _id: req.params.id }, { editedImg }, { new: true })
                if (!data_) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'Unable to update data!', data: {} })

            }
        }

        await team.save()
        if (!team) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'Unable to update team!', data: {} })

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'code': HTTP.SUCCESS, 'message': 'Team Data Updated.', data: {} })

    } catch (e) {
        console.log(e)
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

async function deleteTeamMember(req, res) {
    try {

        console.log("🚀 ~ file: team.controller.js:82 ~ deleteTeamMember ~ req.params.id", req.params.id)

        const data = await Team.findOne({ _id: req.params.id })
        if (data.profileImg) {
            let filename_ = "./" + data.profileImg
            fs.unlinkSync(filename_, (err) => {
                if (err) console.log(err);
            })
        }

        const updateData = await Team.findOneAndUpdate({ _id: req.params.id }, { status: false }, { new: true })
        // const updateData = await Team.findOneAndRemove({ _id: req.params.id })
        if (!updateData) return res.status(HTTP.SUCCESS).send({ 'status': true, 'message': "Unable to delete data." })

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'message': "Deleted Team Data.", 'data': {} })

    } catch (e) {
        console.log(e)
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

async function viewTeamMemberById(req, res) {
    try {

        const data = await Team.findOne({ _id: req.params.id })
        if (!data) return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.BAD_REQUEST, "message": "Something went wrong while fetching data.", data: {} })

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'message': "team data.", data })


    } catch (e) {
        console.log(e)
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

async function viewTeamMember(req, res) {
    try {

        const data = await Team.find({ status: true }).sort({number: 1})
        // console.log(data)

        if (!data) return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.BAD_REQUEST, "message": "Something went wrong while fetching data.", data: {} })

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'message': "team data.", data })


    } catch (e) {
        console.log(e)
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

// ----------------------------------------------kenil's code---------------------------------------------------
async function viewTeamMemberCategory(req, res) {
    try {
        var cat = req.query.category
        // console.log(cat)
        const data = await Team.find({ category: cat })
        console.log(data);

        if (cat == "all") {
            const data = await Team.find({})
            console.log(data);

            return res.status(HTTP.SUCCESS).send({ 'status': true, 'message': "team data.", data })
        }

        if (!data) return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.BAD_REQUEST, "message": "Something went wrong while fetching data.", data: {} })

        return res.status(HTTP.SUCCESS).send({ 'status': true, 'message': "team data.", data })

    } catch (error) {
        console.log(e)
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

async function reorderTeamMember(req, res) {

    try {

        // var result = req.body
        var { AllTeamMemberData } = req.body
        console.log("reorderTeamMember--> ",AllTeamMemberData );
        
        for(const data of AllTeamMemberData){
            // console.log(data, "-----< in loop");
            console.log(data._id, "-----< in loop");
            console.log(data.number, "-----< in loop");
    
            await Team.findByIdAndUpdate({ _id: data._id }, { number:data.number }, { new:true })
    
        }
    
        return res.status(HTTP.SUCCESS).send({ 'status': true, 'message': "successfully reordered data.", })

        
    } catch (e) {
        console.log(e)
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }


    // var data;
    // // for (let data of result) {
    //     // console.log(data._id)
    // // console.log("unsort data", data.number)}
    // // console.log("===============================> RE ORDER",result);
    
    // for (let i = 0; i < result.length; i++) {
    //     // console.log({_id:result[i]._id})
    //     data = await Team.findOneAndUpdate({ _id: result[i]._id }, { number: i }, { new: true })
    //     // console.log(data)
    // }
    // // console.log("===============================>",data);
    // // if (!data) return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.BAD_REQUEST, "message": "Something went wrong while fetching data.", data: {} })
    
    // return res.status(HTTP.SUCCESS).send({ 'status': true, 'message': "successfully reordered data.", })

}



module.exports = {

    addTeamMember,
    editTeamMember,
    deleteTeamMember,
    viewTeamMember,
    viewTeamMemberById,
    viewTeamMemberCategory,
    reorderTeamMember
}
