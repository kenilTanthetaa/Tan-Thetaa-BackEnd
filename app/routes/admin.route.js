const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller')
// const { authAdmin } = require("../middlewares/verifyToken")
const multer = require('multer')
const path = require('path')
const upload = require('../middlewares/portfolioUpload'); // Change 1 (Import your middleware here rather than declaring it in manage team section)
const uploadContact = require('../middlewares/contactUpload');


// --------------------------------------AUTHENTICATION------------------------------------------
router.post('/admin/login', adminController.signin)

// --------------------------------------MANAGE BLOGS--------------------------------------------
const blogController = require("../controllers/blog.controller")
const uploadBlog = require('../middlewares/blogUpload')
router.post("/addBlogTitle", blogController.addBlogTitle)
router.post("/editBlogTitle/:id", blogController.editBlogTitle )
router.get("/deleteBlogTitle/:id", blogController.deleteBlogTitle )

router.post("/addblogs", /*authAdmin,*/ uploadBlog.fields([ { name: 'outsideImg', maxCount: 1 }, { name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 } ]), blogController.addBlog)
router.post("/editblogs/:id", /*authAdmin,*/ uploadBlog.fields([ { name: 'outsideImg', maxCount: 1 }, { name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 } ]), blogController.editBlog) 
router.get("/deleteblogs/:id", /*authAdmin,*/ blogController.deleteBlog) 
router.get("/viewblogs",  blogController.viewBlogs) 
router.get("/viewblogs/:id" ,blogController.viewBlogById)

router.get("/viewBlogsTitle", blogController.viewBlogsTitle)
router.get("/viewBlogsTitle/:id", blogController.viewBlogsTitleByID)

router.post("/viewSubTags", blogController.viewSubTags)
router.post("/filterSubTag", blogController.filterSubTag)

router.get("/isPublishBlog/:id", blogController.publishBlog)
router.get("/viewPublishedBlogs", blogController.viewPublishedBlogs)
router.get("/comparePublishedBlogs/:id", blogController.comparePublishedBlogs )
router.get("/deletePublishedBlogs/:id", blogController.deletePublishedBlogs)
router.post("/verifyBlogOtp/:id", blogController.verifyBlogOtp)



// --------------------------------------MANAGE PORTFOLIO-----------------------------------------
const portfolioController = require("../controllers/portfolio.controller")
router.post("/addPortfolio", upload.fields( [ { name: 'bgImg', maxCount: 1 }, { name: 'aboutImg', maxCount: 1 }, { name: 'quoteImg', maxCount: 1 }, { name: 'projectImg', maxCount: 1 }, { name: 'outsideImg', maxCount: 1 } ] ), /*authAdmin,*/ portfolioController.addPortfolio ) // (Add your middleware as second arg)
// router.post("/addPortfolioImages/:id", /*authAdmin,*/ portfolioController.addPortfolioImages)
// router.post("/addPortfolioImg/:id", /*authAdmin,*/ portfolioController.addPortfolioImg)
router.post("/editPortfolio/:id", upload.fields([ { name: 'bgImg', maxCount: 1 }, { name: 'aboutImg', maxCount: 1 }, { name: 'quoteImg', maxCount: 1 }, { name: 'projectImg', maxCount: 1 }, { name: 'outsideImg', maxCount: 1 } ]), /*authAdmin,*/ portfolioController.editPortfolio)
router.get("/deletePorfolio/:id", /*authAdmin,*/ portfolioController.deletePorfolio)
router.post("/viewPortfolios", portfolioController.viewPortfolios)
router.get("/viewPortfolio/:id", portfolioController.viewPortfolio)
router.post("/addTag", portfolioController.addTag)// add sub tags
router.post("/viewTag", portfolioController.viewTag)

router.get("/isPublishPortfolio/:id", portfolioController.publishPortfolio )
router.post("/viewPublishedPortfolios", portfolioController.viewPublishedPortfolios)
router.get("/comparePublishedPortfolios/:id", portfolioController.comparePublishedPortfolios)
router.get("/deletePublishedPortfolio/:id", portfolioController.deletePublishedPortfolio )
router.post("/verifyPortfolioOtp/:id", portfolioController.verifyPortfolioOtp)


// --------------------------------------MANAGE jobOpportunity--------------------------------------------
const jobOpportunityController = require("../controllers/jobOpportunity.controller")
const uploadJobApply = require('../middlewares/jobApplyUpload');
router.post("/addOpportunity", /*authAdmin,*/ jobOpportunityController.addOpportunity)
router.get("/deleteOpportunity/:id", /*authAdmin,*/ jobOpportunityController.deleteOpportunity )
router.post("/editOpportunity/:id", /*authAdmin,*/ jobOpportunityController.editOpportunity)
router.get("/viewOpportunity",  jobOpportunityController.viewOpportunity)
router.get("/viewOpportunity/:id", jobOpportunityController.viewOpportunity_id)
router.post("/searchJob", jobOpportunityController.searchJob)
router.post("/searchData", jobOpportunityController.searchData)
router.post("/jobApply", uploadJobApply, jobOpportunityController.jobApply)
router.get("/viewJobsApplied", jobOpportunityController.viewJobsApplied)
router.get("/viewJobsApplied/:id", jobOpportunityController.viewJobsAppliedbyId)
router.get("/deleteJobsApplied/:id", jobOpportunityController.deleteJobsApplied)


// --------------------------------------MANAGE TEAM---------------------------------------------
const teamController = require("../controllers/team.controller");
const uploadTeam = require("../middlewares/teamUpload");
const blog = require('../models/blog.model');
router.post("/addTeamMember", /*authAdmin,*/ uploadTeam.fields([{ name: 'profileImg', maxCount: 1 }, { name: 'editedImg', maxCount: 1 }]), teamController.addTeamMember)
router.post("/editTeamMember/:id", /*authAdmin,*/ uploadTeam.fields([{ name: 'profileImg', maxCount: 1 }, { name: 'editedImg', maxCount: 1 }]), teamController.editTeamMember)
router.get("/deleteTeamMember/:id", /*authAdmin,*/ teamController.deleteTeamMember)

router.get("/viewTeamMember/:id", teamController.viewTeamMemberById)
router.get("/viewTeamMember", teamController.viewTeamMember)
// router.post("/viewTeamMemberCategory/:category", teamController.viewTeamMemberCategory)
router.post("/viewTeamMemberCategory", teamController.viewTeamMemberCategory)



// --------------------------------------CONTACT US---------------------------------------------
router.post("/contactUs", uploadContact, adminController.contactUs)
router.get("/viewContactUs", adminController.viewContactUs)
router.get("/viewContactUs/:id", adminController.viewContactUsById)
router.get("/deleteContactUs/:id", adminController.deleteContactUs)


module.exports = router