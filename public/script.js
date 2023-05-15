const hambuger_menu = document.querySelector(".hambuger_menu");
const nav_buttons = document.querySelector(".nav_buttons");
const selecteer = document.querySelectorAll("select");

hambuger_menu.addEventListener("click", function () {
  hambuger_menu.classList.toggle("active");
  nav_buttons.classList.toggle("active");
});

selecteer.forEach(function (selecteer) {
  selecteer.addEventListener("change", function () {
    if (this.value != "") {
      this.classList.add("isgeselecteerd");
    } else {
      this.classList.remove("isgeselecteerd");
    }
  });
});
