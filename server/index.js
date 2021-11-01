const express = require('express');
const app = express();
const parser = require('./parser.js');


app.use(express.json())

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