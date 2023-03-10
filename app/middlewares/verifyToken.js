const jwt = require("jsonwebtoken");
const HTTP = require("../../constants/responseCode.constant");
const { users } = require('../models/user.model')
const passport = require("passport")
const UserSession = require("../models/userSession.model")


var ObjectId = require('mongoose').Types.ObjectId;

const http = require('http')

//admin authorization
function authAdmin(req, res, next) { 
  passport.authenticate('jwt',{ session: false },async function (err, user, info, status) {
      try {

        if (err) {
          console.log(err);
          return next(err);
        }
        
        console.log("--------------------------------authAdmin---------------------------------")
        if (!user) return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.UNAUTHORIZED, message: "Please authenticate your-self", data: {},});

        req.user = user;
        return next();

      } catch(e) {
          console.log("error from admin middleware", e);
          return next();
      }
    }
  )(req, res, next);
}

//user authorization
function authUser(req, res, next) {
  passport.authenticate('jwt', { session: false }, async function (err, userData, info, status) {
      try {
          if (err) {
              console.log(err)
              return next(err)
          }

          const { user, sessionId } = userData
          console.log(" ---------------authUser------------------- ")
          // console.log("🚀 ~ user", user)

          if (!user || user.role !== "user") return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.UNAUTHORIZED, 'message': 'Please authenticate your-self', data: {} });

          if (!sessionId || !ObjectId.isValid(sessionId)) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.NOT_ALLOWED, 'message': 'Invalid session!', data: {} })

          const userSession = await UserSession.findOne({ _id: sessionId, userid: user._id, isActive: true })
          if (!userSession) {
              return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'User session is expired!', data: {} })
          }

          req.user = user
          req.user.sessionId = sessionId
          return next()
      } catch (e) {
          console.log("error from user middleware", e);
          return next()
      }
  })(req, res, next);
}

module.exports = { authAdmin, authUser}