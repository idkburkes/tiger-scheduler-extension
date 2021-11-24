const express = require("express");
const formatter = require('../format.js');
const parser = require('../parser.js');


// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;


// This section will help you get a list of all the records.
recordRoutes.route("/record").get(function (req, res) {
  let db_connect = dbo.getDb("tiger-scheduler-extension");
  db_connect
    .collection("reviews")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});


// This section will help you get a single instructor by name
recordRoutes.route("/api/instructor/:name").get(function (req, res) {
  let db_connect = dbo.getDb();
  //Format names received from client before query
  var formattedName = formatter.formatName(req.params.name);
  let myquery = { "name": formattedName };
  db_connect
      .collection("reviews")
      .findOne(myquery, function (err, result) {
        if (err) throw err;
        
        let instructorData = {
          name: formattedName,
          rating: 0.0,
          wouldTakeAgain: '',
          difficulty: 0.0,
          ratingsCount: 0,
          link: ''
      }

        if(result !== null) {
           //Client is pulling instructor data directly from database
        var totalCount = result.rmp_ratings_count + result.custom_reviews.length;
        instructorData.rating = +(result.current_overall / totalCount).toFixed(2);
        instructorData.difficulty = +(result.current_difficulty / totalCount).toFixed(2);
        instructorData.ratingsCount = result.rmp_ratings_count;
        instructorData.link = result.link;

        //Calculate "would-take-again" percentage
        instructorData.wouldTakeAgain = result.current_wta;
        
        console.log('Sucessfully pulled instructor data from database ' + JSON.stringify(instructorData));
        res.json(instructorData);
        return;
        } 

        //Instructor not found in db, returns null result
        res.json(result);
      });
});



// Add a new instructor to database
recordRoutes.route("/api/instructor/add").post(async (req, response) => {
  let db_connect = dbo.getDb();
  
  var instructorData = await parser.fetchOneProfile(req.body.name);
  var ratings_count = parseInt(instructorData.ratingsCount);

  //Handle difficulty
  var difficulty_string = instructorData.difficulty.substring(0,3);
  if(difficulty_string === 'N/A') {
    var rmp_difficulty = 0.0;
  } else {
    var rmp_difficulty = parseFloat(difficulty_string);
    var cur_difficulty = rmp_difficulty === 0.0 ? 0.0 : Math.round(rmp_difficulty * ratings_count);
  }

  // Handle Rating
  var rating_string = instructorData.rating.substring(0, 3);
  if(rating_string === 'N/A') {
    var rmp_overall = 0.0;
  } else {
    var rmp_overall = parseFloat(rating_string);
    var cur_overall = rmp_overall === 0.0 ? 0.0 : Math.round(rmp_overall * ratings_count);
  }

  // Handle would-take-again percentage
  if(instructorData.wouldTakeAgain === 'N/A') {
    var rmp_wta = 0.0;
  } else {
    var wta_string_len = instructorData.wouldTakeAgain.length; //strip off percent sign
    var rmp_wta = parseFloat(instructorData.wouldTakeAgain.substring(0, wta_string_len));
  }

  var document = {
    name: instructorData.name,
    custom_reviews:[],
    current_difficulty: cur_difficulty,
    current_overall: cur_overall,
    current_wta_true: 0,
    rmp_difficulty: rmp_difficulty,
    rmp_wta: rmp_wta,
    current_wta_false: 0,
    current_wta: rmp_wta,
    rmp_overall: rmp_overall,
    link: instructorData.link,
    rmp_ratings_count: ratings_count
  }


  db_connect.collection("reviews").insertOne(document, function (err, res) {
    if (err) throw err;
    console.log('Inserted document into db ' + JSON.stringify(document));
    response.json(res); 
  });
});


// Update a document by name
recordRoutes.route("/api/instructor/update/:name").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { "name": req.body.review.name };

  let newReview = {
    overall: req.body.review.overall,
    difficulty: req.body.review.difficulty,
    comment: req.body.review.comment,
    would_take_again: req.body.review.would_take_again
  }

  // Find previous values of existing document
  db_connect
  .collection("reviews")
  .findOne(myquery, function (err, result) {
    if (err) throw err;
  
     // Increment ratings count
    var total_ratings_count = result.rmp_ratings_count + result.custom_reviews.length + 1;

    // Calculate current difficulty
    var current_difficulty = result.current_difficulty + newReview.difficulty;

    // Calculate current overall
    var current_overall = result.current_overall + newReview.overall;

    // Increment would-take-again true/false counts
    let current_wta_true = 0;
    let current_wta_false = 0;

   if(newReview.would_take_again === true) {
    current_wta_true = result.current_wta_true + 1;
    current_wta_false = result.current_wta_false;

   } else {
    current_wta_true = result.current_wta_true + 1;
    current_wta_false = result.current_wta_false;
   }

   // Calculate would-take-again percentages
   let rmp_true_count =  Math.round((result.rmp_wta / 100) * result.rmp_ratings_count);
   let total_true_count = rmp_true_count + current_wta_true;
   console.log('rmp_true_count: ' + rmp_true_count);
   let current_wta = Math.round((total_true_count/total_ratings_count) * 100);


    // Update values for this document
    let newvalues = {
      $set: {
        current_difficulty: current_difficulty,
        current_overall: current_overall,
        current_wta: current_wta,
        current_wta_true: current_wta_true,
        current_wta_false: current_wta_false
      },
      $push: {
        custom_reviews: newReview
      }
    };
    db_connect
      .collection("reviews")
      .updateOne(myquery, newvalues, function (err, res) {
        if (err) throw err;
        console.log('1 document updated [' + myquery.name + ']');
        response.json(res);
      });
  });


});

// This section will help you delete a record
recordRoutes.route("/:id").delete((req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id )};
  db_connect.collection("records").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    response.status(obj);
  });
});

module.exports = recordRoutes;