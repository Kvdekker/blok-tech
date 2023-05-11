const hamburger = document.querySelector(".hamburger");
const navButton = document.querySelector(".navbutton");

hamburger.addEventListener("click", function () {
  hamburger.classList.toggle("active");
  navButton.classList.toggle("active");
});

