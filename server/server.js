var express = require("express"),
  app = express(),
  port = process.env.PORT || 3300,
  mongoose = require("mongoose"),
  bodyParser = require("body-parser");

let path = require("path");
const cors = require("cors");
const sockets = require("./socket.js");

// mongoose instance connection url connection
mongoose.connect("mongodb://localhost:27017/chat", {});
mongoose.Promise = global.Promise;

//Adding body parser for handling request and response objects.
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(cors());

//Enabling CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,Content-Length, Authorization, Accept,X-Requested-With"
  );
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", " 3.2.1");
  next();
});

const initApp = require("./app/app");
initApp(app);

app.use(express.static(path.join(__dirname, "public")));

var server = app.listen(port);
var io = require("socket.io").listen(server);
sockets.connect(io, port);

console.log("Task RESTful API server started on: " + port);
module.exports = app;
