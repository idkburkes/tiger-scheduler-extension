const express = require("express");

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

// This section will help you get a single record by id
recordRoutes.route("/record/:id").get(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id )};
  db_connect
      .collection("records")
      .findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result);
      });
});

// This section will help you create a new record.
recordRoutes.route("/instructor/add").post(function (req, response) {
  let db_connect = dbo.getDb();
  let instructor = {
    name: req.body.name,
    custom_reviews: [],
    difficulty_total: req.body.difficulty,
    overall_total: req.body.overall,
    review_count: 10,
    would_take_again: 90.0
  };
  db_connect.collection("reviews").insertOne(instructor, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});

// This section will help you update a record by name.
recordRoutes.route("/update/:name").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { "name": req.body.review.name };

  let newReview = {
    overall: req.body.review.overall,
    difficulty: req.body.review.difficulty,
    comment: req.body.review.comment,
    would_take_again: req.body.review.would_take_again
  }

  let document = {
    custom_reviews: [],
    difficulty_total: 0,
    overall_total: 0.0,
    review_count: 0,
    would_take_again: 0.0
  }

  // Find previous values of existing document
  db_connect
  .collection("reviews")
  .findOne(myquery, function (err, result) {
    if (err) throw err;
  
    //Update all review totals including this new review
    document.review_count = result.review_count + 1;
    document.difficulty_total = (result.difficulty_total * 1.0) + (newReview.difficulty * 1.0);
    document.overall_total = (result.overall_total * 1.0) + (newReview.overall * 1.0);
    var take_again_count = (result.would_take_again * result.review_count)/100.0;
    console.log('take again count' + take_again_count)
   
    if(newReview.would_take_again) {
       // plus sign and toFixed() handles converting perfect to 2 decimal places
      var new_take_again_percent = +((take_again_count + 1)/(result.review_count + 1)*100).toFixed(2);
      document.would_take_again = new_take_again_percent;
    } else {
       // plus sign and toFixed() handles converting perfect to 2 decimal places
      var new_take_again_percent = +(((take_again_count)/(result.review_count + 1))*100).toFixed(2);
    document.would_take_again = new_take_again_percent;
    }
    
    // Update values for this document
    let newvalues = {
      $set: {
        review_count: document.review_count,
        would_take_again: document.would_take_again,
        difficulty_total: document.difficulty_total,
        overall_total: document.overall_total
      },
      $push: {
        custom_reviews: newReview
      }
    };
    db_connect
      .collection("reviews")
      .updateOne(myquery, newvalues, function (err, res) {
        if (err) throw err;
        console.log("1 document updated");
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