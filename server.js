var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var mysql = require('mysql');
//var model = require('./api/models/aasModel');
var bodyParser = require('body-parser');
  
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var routes = require('./api/routes/aasRoutes');
routes(app);


app.listen(port);


console.log('AAS RESTful API server started on: ' + port);
