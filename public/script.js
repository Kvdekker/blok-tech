const zoekKnop = document.getElementById("searchButton");

console.log("Script geladen");

document.addEventListener("DOMContentLoaded", function () {
  // Wachten tot het DOM is geladen voordat de code wordt uitgevoerd
  console.log("DOMContentLoaded event afgevuurd");

  zoekKnop.addEventListener("click", function (event) {
    // Voorkomen dat het standaardgedrag van het klikken op de zoekknop wordt uitgevoerd
    event.preventDefault();

    // Het ophalen van de geselecteerde autotype en automerk uit de HTML-elementen
    const selectedCarType = document.getElementById("soort-auto").value;
    const selectedCarBrand = document.getElementById("soort-merk").value;

    // Doorsturen naar een nieuwe URL met de geselecteerde autotype en automerk als queryparameters
    window.location.href =
      "/zoekresultaten?soort-auto=" +
      selectedCarType +
      "&soort-merk=" +
      selectedCarBrand;
  });
});

// Voor het groen maken van de selects op de homepagina
const selecteer = document.querySelectorAll("select");

selecteer.forEach(function (selecteer) {
  selecteer.addEventListener("change", function () {
    if (this.value != "") {
      this.classList.add("isgeselecteerd");
    } else {
      this.classList.remove("isgeselecteerd");
    }
  });
});
