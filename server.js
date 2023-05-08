const express = require("express");
const app = express();
const path = require("path");

const ejs = require("ejs");

const compression = require("compression");
// Eerst alle uses doen
app.use(compression());
app.use(express.static("public"));

// Weergave engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("partials", path.join(__dirname, "partials"));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/about", (req, res) => {
  res.render("index");
});

// When getting an error
app.get("/error", (req, res) => {
  res.send("<h1>ERROR 404 NOT FOUND</h1>");
});

// Error 404
app.use(function (req, res) {
  res.status(404);

  res.render("error");
});

// Server has started text
app.listen(3000, () => {
  console.log("Whats up! The server has started on port 3000. Have fun!");
});
