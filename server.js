const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
var cors = require('cors');
const app = express();


var url = require("url");
 var swagger = require("swagger-node-express");
// API file for interacting with MongoDB
 const route = require('./router/route.js');

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

//cors
app.use(cors());


// Base Routing location
 app.use('/route', route);

//Set Port
const port = process.env.PORT || '3000';
app.set('port', port);

swagger.setAppHandler(app);


const server = http.createServer(app);

server.listen(port, () => console.log(`Running on ${process.env.port}:${port}`));