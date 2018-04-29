'use strict';
const config = require('./config');
var express = require('express');
var app = express();
var mysql = require('mysql');
//var model = require('./api/models/aasModel');
var bodyParser = require('body-parser');
var session = require('express-session');
var helmet = require('helmet');

// init helmet (header security)
app.use(helmet());

// init bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
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

app.listen(config.httpPort);

console.log('AAS RESTful API server started on: ' + config.httpPort);
