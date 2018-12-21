const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const app = express();
var mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
var userSessionController = require('../controller/user-session-controller.js');
var authController = require('../controller/login-controller.js');
 require('../constant/constant.js');
// Connect

mongoose.Promise=global.Promise;
console.log(mongoUrl);
mongoose.connect(mongoUrl).then(()=>
console.log("con"))
.catch(err=>console.log(err));

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use("/auth",authController);
app.use("/reports",userSessionController);

module.exports = app;