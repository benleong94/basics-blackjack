// let carddeck = JSON.parse(localStorage.getItem('deck_of_cards'));
// Global Variables
var players = []

// Functions 
var makeDeck = function () {

  var cardDeck = [];
  var suits = ['hearts', 'diamonds', 'clubs', 'spades'];

  var suitIndex = 0;
  while (suitIndex < suits.length) {
    var currentSuit = suits[suitIndex];
    var rankCounter = 1;
    while (rankCounter <= 13) {
      var cardName = rankCounter;
      if (cardName == 1) {
        cardName = 'ace';
      } else if (cardName == 11) {
        cardName = 'jack';
      } else if (cardName == 12) {
        cardName = 'queen';
      } else if (cardName == 13) {
        cardName = 'king';
      }
    
      var card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
      };

      cardDeck.push(card);
      rankCounter += 1;
    }

    suitIndex += 1;
  }
  return cardDeck;
};

var initializePlayers = function(playerNum){
  for (let i = 1; i <= playerNum.length; i++) {
    var player = {
      name: "player" + i,
      playerhand: []
    };
    players.push(player);
  }
}

var initializeButtons = function()
{
  var dealButton = document.querySelector("#deal-button");
  var hitButton = document.querySelector("#hit-button");
  var standButton = document.querySelector("#stand-button");
  var revealButton = document.querySelector("#reveal-button");

  disableButton(dealButton);
  disableButton(hitButton);
  disableButton(standButton);
  disableButton(revealButton);

  // deal-button.addEventListener("click", function () {
  //   var input = document.querySelector("#input-field");
  //   var result = main(input.value);
  //   var output = document.querySelector("#output-div");
  //   output.innerHTML = result;
  //   input.value = "";
  // })

  };

function disableButton(buttonType) {
  var button = buttonType;
  button.disabled = true;
  button.style.opacity = "0.5"; 
}

function enableButton(buttonType) {
  var button = buttonType; 
  button.disabled = false;
  button.style.opacity = "1"; // Restores the button's appearance
}

// var main = function (input) {
//   var myOutputValue = 'hello world';
//   return myOutputValue;
// };

var cardeck = makeDeck();
initializePlayers(2);
initializeButtons();
