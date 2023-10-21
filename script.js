let carddeck = JSON.parse(localStorage.getItem('deck_of_cards'));
console.log(carddeck[2]);

var button = document.querySelector("#submit-button");
button.addEventListener("click", function () {
  var input = document.querySelector("#input-field");
  var result = main(input.value);
  var output = document.querySelector("#output-div");
  output.innerHTML = result;

  input.value = "";
});

var main = function (input) {
  var myOutputValue = 'hello world';
  return myOutputValue;
};

