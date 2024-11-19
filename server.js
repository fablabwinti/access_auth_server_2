/*
 * Access Auth Server
 * Server for Labmanager Bookeeping
 */
"use strict";
const fs = require('fs');
const https = require('https');
const express = require('express');
const config = require('./config');
const os = require('os');

const options = {
  key: fs.readFileSync("keys/privkey.pem"),
  cert: fs.readFileSync("keys/cert.pem")
};
/*const options = {
    key: fs.readFileSync("keys/localhost.key"),
    cert: fs.readFileSync("keys/localhost.pem")
};*/
//const mysql = require('mysql');
//const model = require('./api/models/aasModel');
const bodyParser = require('body-parser');
const session = require('express-session');
const helmet = require('helmet');
var app = express();

// init helmet (header security);
app.use(helmet());

// init bodyParser
app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));
app.use(bodyParser.json());

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

// serve static content
app.use(express.static('public'));

// prepare session
app.use(session({secret: "FLW@tpw", resave: true, saveUninitialized: true}));

// set view engine and views folder
app.set('view engine', 'pug');
app.set('views', './views');

// init routes
var routes = require('./api/routes/aasRoutes');
routes(app);

//app.listen(config.httpPort);

var secureServer = https.createServer(options, app);
secureServer.listen(config.httpsPort);
const networkInterfaces = os.networkInterfaces();

Object.keys(networkInterfaces).forEach((interfaceName) => { 
  networkInterfaces[interfaceName].forEach((iface) => {
    if ('IPv4' === iface.family && iface.internal === false) {
      console.log('AAS RESTful API server started on: https://' + iface.address + ':' + config.httpsPort);
    }
  });
});