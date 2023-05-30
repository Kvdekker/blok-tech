const express = require("express"); // Importeer de 'express' module, waarmee we een webserver kunnen maken.
const app = express(); // Initialiseer een Express-applicatie.

const bodyparser = require("body-parser"); // Importeer de 'body-parser' module, die HTTP-verzoeklichamen analyseert.
const session = require("express-session"); // Importeer de 'express-session' module, die sessiebeheer mogelijk maakt.
const ejs = require("ejs"); // Importeer de 'ejs' module, die ons in staat stelt sjablonen te gebruiken voor het genereren van HTML-pagina's.
const compression = require("compression"); // Importeer de 'compression' module, die response-compressie biedt voor verbeterde prestaties.
const Parse = require("parse/node"); // Importeer de 'parse/node' module, die het Parse-platform voor backend-services mogelijk maakt.
const bcrypt = require("bcrypt"); // Importeer de 'bcrypt' module, die functies biedt voor het hashen en vergelijken van passworden.

require("dotenv").config();

// Parse Server configuratie
const AppID = process.env.APPID; // Parse-app-ID uit de omgevingsvariabele
const JavascriptKey = process.env.JSKEY; // Parse-JavaScript-sleutel uit de omgevingsvariabele
const ParseServerURL = process.env.API_SERVERURL; // Parse Server URL uit de omgevingsvariabele

Parse.serverURL = ParseServerURL; // Parse Server URL instellen
Parse.initialize(AppID, JavascriptKey); // Parse-initialisatie met App ID en JavaScript-sleutel

// Middleware configuratie
app.use(bodyparser.urlencoded({ extended: true })); // body-parser middleware voor het analyseren van aanvraagbody's
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Geheime sleutel voor het beveiligen van de sessie
    resave: false,
    saveUninitialized: false,
  })
);
app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn; // Lokale variabele voor het bijhouden van de sessiestatus
  next();
});
app.use(compression()); // compressie van de respons voor betere prestaties
app.use(express.static("public")); // Statische bestanden (CSS, afbeeldingen, enz.) serveren vanuit de "public" map

// MongoDB configuratie
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.MONGODB_URI; // MongoDB-verbinding URI uit de omgevingsvariabele
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// MongoDB verbinding maken
async function connectMongoDB() {
  try {
    await client.connect(); // Verbinding maken met de MongoDB-database
    await client.db("admin").command({ ping: 1 }); // Ping de database om te controleren of de verbinding succesvol is
    console.log("Verbonden met MongoDB!");
  } finally {
    console.log("Je bent verbonden met de database!");
  }
}
connectMongoDB().catch(console.dir);

// Weergave engine configuratie
app.set("view engine", "ejs"); // Instellen van EJS als de weergave-engine
app.set("views", "views"); // Map voor de weergavesjablonen

// Homepagina route
app.get("/home", (req, res) => {
  const isLoggedIn = req.session.isLoggedIn; // Controleren of de user is ingelogd
  res.render("index"); // Het index.ejs sjabloon renderen
});

// Login routes
app.get("/login", (req, res) => {
  res.render("login", { loginFailed: "" }); // Het login.ejs sjabloon renderen met een optioneel bericht voor mislukte login
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body; // username en password ophalen uit het aanvraaglichaam

  try {
    const collection = client.db("register").collection("users"); // Verwijzing naar de userscollectie in MongoDB
    const user = await collection.findOne({ username }); // De user opzoeken in de database

    if (user) {
      const match = await bcrypt.compare(password, user.password); // Het ingevoerde password vergelijken met de gehashte versie in de database
      if (match) {
        req.session.isLoggedIn = true; // Sessie markeren als ingelogd
        req.session.username = username; // username opslaan in de sessie
        return res.redirect("/user"); // Doorsturen naar de userspagina
      }
    }

    res.render("login", {
      loginFailed: "Deze username en/of password is onjuist!", // Foutbericht weergeven op de loginpagina
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Er is een fout opgetreden bij het inloggen"); // Foutbericht weergeven als er een fout optreedt
  }
});

// User pagina routes
app.get("/user", (req, res) => {
  const username = req.session.username; // username ophalen uit de sessie
  res.render("user", { username }); // Het user.ejs sjabloon renderen en de username doorgeven aan de weergave
});

app.post("/user/delete", async (req, res) => {
  const username = req.session.username; // username ophalen uit de sessie

  try {
    const collection = client.db("register").collection("users"); // Verwijzing naar de userscollectie in MongoDB
    await collection.deleteOne({ username }); // Het usersaccount verwijderen uit de database

    req.session.destroy(); // Sessie vernietigen

    res.redirect("/home"); // Terugsturen naar de homepagina
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("Er is een fout opgetreden bij het verwijderen van het account"); // Foutbericht weergeven als er een fout optreedt
  }
});
app.post("/user/update-username", async (req, res, next) => {
  // Endpoint voor het bijwerken van de username via een POST-verzoek
  const username = req.session.username;
  // De huidige username wordt opgehaald uit de sessie

  const newUsername = req.body.newUsername;
  // De nieuwe username wordt opgehaald uit het verzoeklichaam (request body)

  try {
    const collection = client.db("register").collection("users");
    // De collectie "users" in de MongoDB-database wordt geopend

    await collection.updateOne(
      { username: username },
      { $set: { username: newUsername } }
    );
    // Een update-operatie wordt uitgevoerd om de username bij te werken.
    // De username in de collectie wordt vervangen door de nieuwe username

    req.session.username = newUsername;
    // De nieuwe username wordt bijgewerkt in de sessie

    res.redirect("/user");
    // De gebruiker wordt doorgestuurd naar de "user" pagina
  } catch (error) {
    next(error);
    // De fout wordt doorgegeven aan de volgende middleware (fallback-functie)
  }
});

// Fallback-functie voor error
app.use(function (err, req, res, next) {
  console.error(err);
  res.status(500).send("Er is een interne serverfout opgetreden.");
});

// Register routes
app.get("/register", (req, res) => {
  res.render("register", { userExistsMessage: "", successMessage: "" }); // Het register.ejs sjabloon renderen met optionele berichten voor bestaande user en succesvolle registratie
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body; // username en password ophalen uit het aanvraaglichaam

  try {
    const collection = client.db("register").collection("users"); // Verwijzing naar de userscollectie in MongoDB
    const existingUser = await collection.findOne({ username }); // Controleren of de user al bestaat in de database

    if (existingUser) {
      return res.render("register", {
        userExistsMessage: "Deze user bestaat al!", // Foutbericht weergeven op de registratiepagina
        successMessage: "",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Het password hashen met bcrypt
    const newUser = {
      username,
      password: hashedPassword,
    };

    await collection.insertOne(newUser); // Het nieuwe usersaccount toevoegen aan de database

    return res.render("register", {
      userExistsMessage: "",
      successMessage: "Je bent succesvol geregistreerd!", // Succesbericht weergeven op de registratiepagina
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Er is een fout opgetreden bij de registratie"); // Foutbericht weergeven als er een fout optreedt
  }
});

// Logout route
app.post("/logout", (req, res) => {
  req.session.destroy(); // Sessie vernietigen
  res.redirect("/home"); // Terugsturen naar de homepagina
});

// Carlist route
app.get("/carlist", async function (req, res) {
  try {
    const selectedCarType = req.query["car-type"]; // Geselecteerd auto-type ophalen uit queryparameters
    const selectedCarBrand = req.query["car-brand"]; // Geselecteerd automerk ophalen uit queryparameters

    const Carmodels_Car_Model_List = Parse.Object.extend(
      "Carmodels_Car_Model_List"
    );

    const query = new Parse.Query(Carmodels_Car_Model_List);

    query.equalTo("Make", selectedCarBrand); // Filteren op automerk
    query.equalTo("Category", selectedCarType); // Filteren op auto-type

    const results = await query.find(); // Query uitvoeren

    const carList = results.map((object) => {
      return {
        make: object.get("Make"),
        year: object.get("Year"),
        model: object.get("Model"),
        category: object.get("Category"),
      };
    });

    res.render("carlist", { carList }); // Het carlist.ejs sjabloon renderen en de autolijst doorgeven aan de weergave
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("Er is een fout opgetreden bij het ophalen van de gegevens."); // Foutbericht weergeven als er een fout optreedt
  }
});

// Error 404 route
app.use(function (req, res) {
  res.status(404);
  res.render("error"); // Het error.ejs sjabloon renderen bij een 404-fout
});

// Errorpage route
app.get("/error", (req, res) => {
  res.render("<h1>ERROR 404 NOT FOUND</h1>"); // Een eenvoudige foutpagina weergeven voor /error route
});

// Start de server
app.listen(3000, () => {
  console.log("De server is gestart op poort 3000. Veel plezier!"); // Server starten en een bericht weergeven wanneer de server actief is
});
