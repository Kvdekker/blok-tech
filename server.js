const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const session = require("express-session");

const ejs = require("ejs");

const compression = require("compression");

// Eerst alle uses doen
app.use(bodyparser.urlencoded({ extended: false }));
app.use(
  session({
    secret: "geheim-woord",
    resave: false,
    saveUninitialized: false,
  })
);
app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn;
  next();
});

app.use(compression());
app.use(express.static("public"));

// Weergave engine
app.set("view engine", "ejs");
app.set("views", "views");
app.set("partials", "partials");

// Homepagina
app.get("/home", (req, res) => {
  const isLoggedIn = req.session.isLoggedIn;
  res.render("index");
});

// login
app.get("/loginpagina", (req, res) => {
  res.render("loginpagina");
});

// login route
app.post("/login", (req, res) => {
  const gebruikersnaam = req.body.gebruikersnaam;
  const wachtwoord = req.body.wachtwoord;

  if (req.session.isLoggedIn) {
    return res.redirect("/home");
  }
  if (gebruikersnaam === "admin" && wachtwoord === "password") {
    req.session.isLoggedIn = true; //Sla inlog op
    res.redirect("/home"); //Stuur naar home
  } else {
    res.send("Verkeerde inloggegevens");
  }
});

//User pagina
app.get("/user", (req, res) => {
  res.render("user");
});

//Logout
app.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/home");
});

// Error 404
app.use(function (req, res) {
  res.status(404);
  res.render("error");
});

// Render errorpage
app.get("/error", (req, res) => {
  res.render("<h1>ERROR 404 NOT FOUND</h1>");
});

// Server has started text
app.listen(3000, () => {
  console.log("Whats up! The server has started on port 3000. Have fun!");
});
