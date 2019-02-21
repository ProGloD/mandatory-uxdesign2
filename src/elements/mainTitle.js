export default {
  init: function(className, text) {
    let h1 = document.createElement("h1");
    h1.classList.add(className);
    h1.textContent = text;

    return h1;
  }
};