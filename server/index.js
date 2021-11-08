const express = require('express');
const app = express();
const router = require('./routes/router');

// Load config file
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 3000;

const dbo = require("./db/conn"); // get db driver connection
app.use('/', router); // Handle api endpoint routes in ./routes/router.js
app.use(express.json()) // Apply express middlewares


// Start server
app.listen(port, () => {
   // perform a database connection when server starts
   dbo.connectToServer(function (err) {
    if (err) console.error(err);
  });
  console.log(`Express server started on ${port}!`)
});