export default {
  init: function(className, text, onClick) {
    let button = document.createElement("button");
    button.classList.add(className);
    button.textContent = text;
    button.addEventListener("click", onClick);

    return button;
  }
};