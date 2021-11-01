const express = require('express');
const app = express();
const parser = require('./parser.js');
const cors = require('cors');
const bodyParser = require('body-parser');


app.use(express.json())

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


//Routes
app.get('/', (req, res) => {
  return res.send('Received a GET HTTP method');
});
 
app.post('/api/ratings', async (req, res) => {
  console.log("Received post request from client" + JSON.stringify(req.body));
  
  // Retrieve instructor's data from RateMyProfessors.com
  var instructorData = await parser.fetchInstructorProfiles(req.body);
  console.log("Sending post response to client " + JSON.stringify(instructorData));
  
  return res.send(instructorData);
});

app.put('/', (req, res) => {
  return res.send('Received a PUT HTTP method');
});
 
app.delete('/', (req, res) => {
  return res.send('Received a DELETE HTTP method');
});


// TODO: Figure out how to set environment variable for server
var port = process.env.PORT || 3000;

app.listen(port, () =>
  console.log(`Express server started on ${port}!`),
);