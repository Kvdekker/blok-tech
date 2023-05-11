const express = require("express");
const app = express();

const ejs = require("ejs");

const compression = require("compression");

// Eerst alle uses doen
app.use(compression());
app.use(express.static("public"));

// Weergave engine
app.set("view engine", "ejs");
app.set("views", "views");
app.set("partials", "partials");

// Homepagina
app.get("/home", (req, res) => {
  res.render("index");
});

// login
app.get("/login", (req, res) => {
  res.render("login");
});

// Error 404
app.use(function (req, res) {
  res.status(404);
  res.render("error");
});

// Render errorpage
app.get("/error", (req, res) => {
  res.send("<h1>ERROR 404 NOT FOUND</h1>");
});

// Server has started text
app.listen(3000, () => {
  console.log("Whats up! The server has started on port 3000. Have fun!");
});
