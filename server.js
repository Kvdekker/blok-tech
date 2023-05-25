const express = require("express");
const app = express();
const bodyparser = require("body-parser"); // nodig om HTTP-verzoekbodies te analyseren, bijvoorbeeld voor het verwerken van gegevens van een HTML-formulier
const session = require("express-session"); // nodig om sessies te gebruiken
const ejs = require("ejs");
const compression = require("compression"); //Deze module is een middleware voor Express die compressie toepast op de HTTP-responsen. Het helpt bij het verkleinen van de bestandsgrootte van de verzonden gegevens
const Parse = require("parse/node"); //biedt een Node.js Software development kit waarmee je verbinding kunt maken met en interactie kunt hebben met de Parse-server vanuit een Node.js-omgeving
require("dotenv").config(); //Use dotenv to read .env

const AppID = process.env.APPID; //Haal ww uit .env
const JavascriptKey = process.env.JSKEY; //Haal ww uit .env
Parse.serverURL = "https://parseapi.back4app.com"; //API server url
Parse.initialize(AppID, JavascriptKey);

// ************************//
// Eerst alle uses doen
// ************************//
app.use(bodyparser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "geheim-woord",
    resave: false,
    saveUninitialized: false,
  })
);
app.use((req, res, next) => {
  res.locals.isIngelogd = req.session.isIngelogd;
  next();
});

app.use(compression());
app.use(express.static("public"));

// ************************//
//MongoDB
// ************************//
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.MONGODB_URI;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    console.log("You have been connected to the database, YAY!");
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

// ************************//
// Weergave engine
// ************************//
app.set("view engine", "ejs");
app.set("views", "views");
app.set("partials", "partials");

// ************************//
// Homepagina
// ************************//
app.get("/home", (req, res) => {
  const isIngelogd = req.session.isIngelogd;
  res.render("index");
});

// ************************//
// login
// ************************//
app.get("/login", (req, res) => {
  res.render("login");
});

const gebruikers = [
  { gebruikersnaam: "admin", wachtwoord: "password" },
  { gebruikersnaam: "Koen", wachtwoord: "password" },
  { gebruikersnaam: "Ivo", wachtwoord: "password" },
  { gebruikersnaam: "Robert", wachtwoord: "password" },
];

app.post("/login", (req, res) => {
  // Haal de gebruikersnaam en het wachtwoord op uit het verzoek
  const gebruikersnaam = req.body.gebruikersnaam;
  const wachtwoord = req.body.wachtwoord;

  // Controleer of de gebruiker al is ingelogd, indien ja, stuur naar de homepagina
  if (req.session.isIngelogd) {
    return res.redirect("/home");
  }

  // Zoek de gebruiker in de lijst van gebruikers op basis van gebruikersnaam en wachtwoord
  const gebruiker = gebruikers.find(
    (gebruiker) =>
      gebruiker.gebruikersnaam === gebruikersnaam &&
      gebruiker.wachtwoord == wachtwoord
  );

  // Als de gebruiker is gevonden, stel de sessiegegevens in en stuur naar de gebruikerspagina
  if (gebruiker) {
    req.session.isIngelogd = true;
    req.session.username = gebruikersnaam;
    res.redirect("/user");
  } else {
    // Als de gebruiker niet is gevonden, stuur een foutmelding
    res.send("Verkeerde inloggegevens");
  }
});

// ************************//
//User pagina
// ************************//
app.get("/user", (req, res) => {
  const gebruikersnaam = req.session.username;

  res.render("user", { gebruikersnaam });
});

// ************************//
//Register
// ************************//
app.get("/register", (req, res) => {
  res.render("register");
});

// ************************//
//Logout
// ************************//
app.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/home");
});

// ************************//
// zoekresultaten
// ************************//
app.get("/zoekresultaten", async function (req, res) {
  try {
    // Haal de geselecteerde autotype en automerk op uit de queryparameters van de request
    const selectedCarType = req.query["soort-auto"];
    const selectedCarBrand = req.query["soort-merk"];

    // Definieer een Parse-object voor de klasse "Carmodels_Car_Model_List"
    const Carmodels_Car_Model_List = Parse.Object.extend(
      "Carmodels_Car_Model_List"
    );

    // Maak een query voor objecten van de klasse "Carmodels_Car_Model_List"
    const query = new Parse.Query(Carmodels_Car_Model_List);

    // Voeg voorwaarden toe aan de query om alleen auto's van het geselecteerde merk en type op te halen
    query.equalTo("Make", selectedCarBrand);
    query.equalTo("Category", selectedCarType);

    // Voer de query uit en wacht op het resultaat
    const results = await query.find();

    // Maak een lijst van auto-objecten op basis van de queryresultaten
    const carList = results.map((object) => {
      return {
        make: object.get("Make"), // Haal de waarde van het veld "Make" op
        year: object.get("Year"), // Haal de waarde van het veld "Year" op
        model: object.get("Model"), // Haal de waarde van het veld "Model" op
        category: object.get("Category"), // Haal de waarde van het veld "Category" op
      };
    });

    // Rendert de "zoekresultaten" view en stuurt de auto-lijst naar de view
    res.render("zoekresultaten", { carList });
  } catch (error) {
    // Als er een fout optreedt, log de fout en stuur een HTTP 500-foutmelding terug met een foutbericht
    console.error(error);
    res
      .status(500)
      .send("Er is een fout opgetreden bij het ophalen van de gegevens.");
  }
});

// ************************//
// Error 404
// ************************//
app.use(function (req, res) {
  res.status(404);
  res.render("error");
});

// ************************//
// Render errorpage
// ************************//
app.get("/error", (req, res) => {
  res.render("<h1>ERROR 404 NOT FOUND</h1>");
});

// ************************//
// Server has started text
// ************************//
app.listen(3000, () => {
  console.log("Whats up! The server has started on port 3000. Have fun!");
});
