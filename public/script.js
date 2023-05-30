console.log("Script geladen");

//Zoekfucntie op de homepagina
document.addEventListener("DOMContentLoaded", function () {
  const zoekKnop = document.getElementById("searchButton");
  // Wachten tot het DOM is geladen voordat de code wordt uitgevoerd
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
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showUserLocation);
  } else {
    console.log("Geolocation wordt niet ondersteund door de huidige browser.");
  }

  function showUserLocation(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    const locationElement = document.getElementById("userLocation");
    if (locationElement) {
      locationElement.textContent = `${latitude}, ${longitude}`;
    } else {
      console.log("Element met id 'userLocation' niet gevonden.");
    }
  }
});
