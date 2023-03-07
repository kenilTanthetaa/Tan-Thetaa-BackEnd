const express = require('express')
require('dotenv').config({ path: './config/.env' })
const http = require('http');
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const cors = require('cors')
const Emitter = require('events')
const passport = require('passport')
var mung = require('express-mung');
var bodyParser = require('body-parser');
const { decodeReqData, encodeResData } = require('./public/partials/cryptoJS')
const { checkSessionExpiration } = require('./public/partials/utils')
//importing the routes
const adminRouter = require('./app/routes/admin.route')
//initializing the port
const PORT = process.env.PORT || 3000
//creating the server
const app = express()
// Event emitter(for updating child)
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)

//socket.io config
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*", } })

//render image from public directory
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

//parse the data from the request
app.use(express.json())
// app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
require('./config/mongodb')
//passport config
app.use(passport.initialize())
require('./config/passport')

//parse cookies
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }))

// routes for encode and decode data (for development purpose only)
const adminControllers = require("./app/controllers/admin.controller")
app.post('/encodeData',cors(), adminControllers.encodeReqData)
app.post('/decodeData',cors(), adminControllers.decodeResData)

//decode the request body for every request
app.use(decodeReqData)

//encode the response body for every request
app.use(mung.json(encodeResData));

//accessing the routes
app.use(adminRouter);

//Expire user session 
checkSessionExpiration()

//default route
app.all('*', (req, res) => {
    return res.status(404).send("URL not found")
})

//listening the server
server.listen(PORT, () => {
    console.log('server is running on port ' + PORT)
})