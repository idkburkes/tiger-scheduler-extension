'use-strict';
const express = require('express');
const app = express();
const parser = require('./parser.js');
const path = require('path');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(express.json())
app.use(cors({
  origin: '*'
}));


const router = express.Router();

//Routes
router.get('/', (req, res) => {
  return res.send('Received a GET HTTP method');
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


app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));
app.use(bodyParser);


// TODO: Figure out how to set environment variable for server
var port = process.env.PORT || 3000;

app.listen(port, () =>
  console.log(`Express server started on ${port}!`),
);

module.exports.handler = serverless(app);