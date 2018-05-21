/**
 * server.js
 * Author: Diego Kourchenko
 *
 * Server side code using ExpressJS
 * for a web application.
 */

// Set up server code with expressJS
var express = require('express');
// Set up unique, anonymous user ID
var cookieParser = require('cookie-parser');
var http = require('http');
// Easy form submissions, for web chat
var bodyParser = require('body-parser');
var postgreSQLDB = require('pg');

// Error Codes
var HTTP_CODE_OK = 200;
var HTTP_CODE_CREATED = 201;
var HTTP_CODE_NO_CONTENT = 204;
var HTTP_CODE_CLIENT_ERR = 400;
var HTTP_CODE_NOT_FOUND = 404;
var HTTP_CODE_SERVER_ERR = 500;

// Application
var app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({
	extended: true
}));

var router = express.Router();
router.use(function(req, res, next() {
	next();
});
