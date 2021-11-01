'use-strict';
const express = require('express');
const app = express();
const parser = require('./parser.js');
const path = require('path');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(express.json())
const router = express.Router();


 // Apply express middlewares
 app.use(cors())
 cors({credentials: true, origin: true})
 app.options('*', cors()) // Enable CORs for all origins
 app.use(bodyParser.json())
 app.use(bodyParser.urlencoded({ extended: true }))

 app.all('', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  //Auth Each API Request created by user.
  next();
});



//Set up routes
app.use('/.netlify/functions/index', router);  // path must route to lambda

// Define Routes
router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1> Tiger Scheduler Google Chrome Extension</h1>');
  res.end();
});


router.post('/api/ratings', async (req, res) => {
console.log("Received post request from client" + JSON.stringify(req.body));
  
  // Retrieve instructor's data from RateMyProfessors.com
  var instructorData = await parser.fetchInstructorProfiles(req.body);
  console.log("Sending post response to client " + JSON.stringify(instructorData));
  
  return res.send(instructorData);
});

router.put('/', (req, res) => {
  return res.send('Received a PUT HTTP method');
});
 
router.delete('/', (req, res) => {
  return res.send('Received a DELETE HTTP method');
});


module.exports = app;
module.exports.handler = serverless(app);