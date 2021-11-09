const express = require('express');
const router = express.Router();
const parser = require('../parser.js');
const cors = require('cors');
const bodyParser = require('body-parser');

router.use(cors())
cors({credentials: true, origin: true})
router.options('*', cors()) // Enable CORs for all origins
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))


router.all('', function(req, res, next) {
 res.header("Access-Control-Allow-Origin", "*");
 res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
 res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, Authorization");
 //Auth Each API Request created by user.
 next();
});

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
  

module.exports = router;