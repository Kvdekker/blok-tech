console.log("Script geladen");

//Zoekfucntie op de homepagina
document.addEventListener("DOMContentLoaded", function () {
  // Wachten tot het DOM is geladen voordat de code wordt uitgevoerd
  const zoekKnop = document.getElementById("searchButton");

  console.log("DOMContentLoaded event afgevuurd");

  zoekKnop.addEventListener("click", function (event) {
    // Voorkomen dat het standaardgedrag van het klikken op de zoekknop wordt uitgevoerd
    event.preventDefault();

    // Het ophalen van de geselecteerde autotype en automerk uit de HTML-elementen
    const selectedCarType = document.getElementById("car-type").value;
    const selectedCarBrand = document.getElementById("car-brand").value;

    // Doorsturen naar een nieuwe URL met de geselecteerde autotype en automerk als queryparameters
    window.location.href =
      "/carlist?car-type=" + selectedCarType + "&car-brand=" + selectedCarBrand;
  });
});

// Voor het groen maken van de selects op de homepagina
const selected = document.querySelectorAll("select");
//Voor elke select op de pagina
selected.forEach(function (selected) {
  //Als er een optie is geselecteerd
  selected.addEventListener("change", function () {
    if (this.value != "") {
      this.classList.add("is_selected");
      //Als er geen optie is geselecteerd
    } else {
      this.classList.remove("is_selected");
    }
  });
});

// Locatie via Geolocation API
document.addEventListener("DOMContentLoaded", function () {
  // Wacht tot het DOM is geladen voordat de code wordt uitgevoerd

  if (navigator.geolocation) {
    // Controleer of de browser geolocatie ondersteunt

    navigator.geolocation.getCurrentPosition(showUserLocation);
    // Als geolocatie wordt ondersteund, vraag dan de huidige positie van de gebruiker op
    // en roep de functie showUserLocation aan met de verkregen positie
  } else {
    console.log("Geolocation wordt niet ondersteund door de huidige browser.");
    // Als geolocatie niet wordt ondersteund, log dan een bericht in de console
  }

  function showUserLocation(position) {
    // Definieer een functie genaamd showUserLocation die wordt aangeroepen wanneer de positie van de gebruiker wordt verkregen

    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    // Haal de breedtegraad en lengtegraad op van de positie van de gebruiker

    const locationElement = document.getElementById("userLocation");
    // Zoek het HTML-element met de id "userLocation"

    if (locationElement) {
      locationElement.textContent = `${latitude}, ${longitude}`;
      // Als het HTML-element is gevonden, bijwerk dan de tekstinhoud ervan met de breedtegraad en lengtegraad van de gebruiker
    } else {
      console.log("Element met id 'userLocation' niet gevonden.");
      // Als het HTML-element niet is gevonden, log dan een bericht in de console
    }
  }
});
