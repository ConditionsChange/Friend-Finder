// Friend Finder Server Code

//Require packages and data
var express = require ("express");
var bodyParser = require("body-parser");
var path = require("path");
var friends = require("./app/data/friends.js"); //list of friends in the database
var htmlRoutes = require("./app/routing/htmlRoutes");
var apiRoutes = require("./app/routing/apiRoutes");

//Set up express
var app = express();
var PORT = process.env.PORT||3000;

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.text());
app.use(bodyParser.json({
  type: "application/vnd.api+json"
}));

// Routes
htmlRoutes(app,path); //function to handle all html routes found in /app/routing/htmlRoutes.js
friends.friends = apiRoutes(app,path,friends.friends); //function to handle all API routes found in /app/routing/apiRoutes.js. Also updates friend database with user submitted info.

//Listen on the server
app.listen(PORT, function() {
  console.log("Server initialized. App listening on PORT " + PORT);
});