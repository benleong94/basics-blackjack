// Global Variables
var players = []
var carddeck, dealButton, hitButton, standButtonm, revealButton

// Functions 
var initializeDeck = function () {

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

  carddeck = cardDeck;
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

var initializeButtons = function(){
  dealButton = document.querySelector("#deal-button");
  hitButton = document.querySelector("#hit-button");
  standButton = document.querySelector("#stand-button");
  revealButton = document.querySelector("#reveal-button");

  disableButton(hitButton);
  disableButton(standButton);
  disableButton(revealButton);

  dealButton.addEventListener("click", function () {
    var card = chooseRandomCard();    
    var cardsLeftNum = carddeck.length;

    if (cardsLeftNum == 0){
      var cardOutput = "No Cards Left!"
    } else{
      var cardOutput = card.name + " of " + card.suit;
    }

    var output = document.querySelector("#output-div");
    output.innerHTML = cardOutput + "<br>" + cardsLeftNum;
  })

};

var disableButton = function (buttonType) {
  var button = buttonType;
  button.disabled = true;
  button.style.opacity = "0.5"; 
}

var enableButton = function (buttonType) {
  var button = buttonType; 
  button.disabled = false;
  button.style.opacity = "1"; // Restores the button's appearance
}

var chooseRandomCard = function () {
  
  var card = carddeck[Math.floor(Math.random() * carddeck.length)]
  carddeck = carddeck.filter(item => item !== card)

  return card;
}

var checkCards = function () {
  var cards = ""; 
  for (let i=0; i< carddeck.length; i++){
    cards += carddeck[i].name + " of " + carddeck[i].suit + "<br>";
  }
  return cards;
}

var main = function(playerNum)
{
  initializeDeck();
  initializePlayers(playerNum);
  initializeButtons();
}

main(2);