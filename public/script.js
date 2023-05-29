console.log("Script geladen");
const zoekKnop = document.getElementById("searchButton");

document.addEventListener("DOMContentLoaded", function () {
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
