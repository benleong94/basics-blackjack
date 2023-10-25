// Global Variables
var players = []
var winList = []
var loseList = []
var carddeck, dealButton, hitButton, standButton, revealButton, output

// Functions 
var initializeDeck = function () {

  var cardDeck = [];
  var suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];

  var suitIndex = 0;
  while (suitIndex < suits.length) {
    var currentSuit = suits[suitIndex];
    var rankCounter = 1;
    while (rankCounter <= 13) {
      var cardName = rankCounter;
      if (cardName == 1) {
        cardName = 'Ace';
      } else if (cardName == 11) {
        cardName = 'Jack';
      } else if (cardName == 12) {
        cardName = 'Queen';
      } else if (cardName == 13) {
        cardName = 'King';
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
  for (let i = 1; i <= playerNum; i++) {
    if(i == playerNum){
      var player = {
        name: "Computer",
        playerHand: [],
        currentScore: []
      };
    } else {
      var player = {
        name: "Player #" + i,
        playerHand: [],
        currentScore: []
      };
    }    
    players.push(player);
  }
}

var initializeButtons = function(){

  dealButton = document.querySelector("#deal-button");
  hitButton = document.querySelector("#hit-button");
  standButton = document.querySelector("#stand-button");
  revealButton = document.querySelector("#reveal-button");
  output = document.querySelector("#output-div");

  dealButton.addEventListener("click", function () {
    var cardOutput = "";
    if (carddeck.length == 0){
      cardOutput = "No Cards Left!"
    } else {

      dealFirstHand();

      for (let i=0; i<players.length; i++){
        var playerName = "<b>" + players[i].name + " Hand </b>"; 
        players[i].currentScore = calculateHand(players[i]);
        var playerHandOutput = listOutHand(players[i]);
        cardOutput += playerName + ": <br>" + playerHandOutput + "<b> Score(s): </b>" + players[i].currentScore + "<br><br>";    
      };

      if(checkWinOrLose() == true) {
        cardOutput += "Winners: " + winList
        output.innerHTML = cardOutput;
        resetGame();
      } else {
        output.innerHTML = cardOutput;
        resetGame();     
      }
    }
  })

  disableCase(1); 
};

var disableCase = function(num){
  switch(num){
    case 1:
      enableButton(dealButton);
      disableButton(hitButton);
      disableButton(standButton);
      disableButton(revealButton);
      return;
    case 2:
      disableButton(dealButton);
      enableButton(hitButton);
      enableButton(standButton);
      disableButton(revealButton);
      return; 
    default: 
      disableButton(dealButton);
      disableButton(hitButton);
      disableButton(standButton);
      disableButton(revealButton);
      return;
  }
}

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

var dealFirstHand = function () {
  for (let i = 0; i < players.length; i++){
    var cardOne = chooseRandomCard(); 
    var cardTwo = chooseRandomCard();
    players[i].playerHand.push(cardOne);
    players[i].playerHand.push(cardTwo);          
  }
}

var dealHit = function () {

}

var checkCards = function () {
  var cards = ""; 
  for (let i=0; i< carddeck.length; i++){
    cards += carddeck[i].name + " of " + carddeck[i].suit + "<br>";
  }
  return cards;
}

var listOutHand = function (player) {
  var hand = "";
  for (let i=0; i<player.playerHand.length; i++){
    hand += player.playerHand[i].name + " of " + player.playerHand[i].suit + "<br>"
  }
  return hand; 
}

var calculateHand = function (player) {
  let hand = player.playerHand;
  let scores = new Set([0]); 
    
  hand.forEach(card => {
    const newScores = new Set(); 
    scores.forEach(score => {
        if (card.name === 'Ace') { 
            newScores.add(score + 1);
            newScores.add(score + 11);
        } else if (['King', 'Queen', 'Jack'].includes(card.name)) { 
            newScores.add(score + 10);
        } else if (!isNaN(parseInt(card.name))) { 
            newScores.add(score + parseInt(card.name));
        } 
    });
    scores = newScores;
  });

  return Array.from(scores); 
}

var checkWinOrLose = function() {
  var check = false; 
  for (let i=0; i<players.length; i++){
    players[i].currentScore.forEach(score => {
      if (score == 21) {
        winList.push(players[i].name);
        check = true; 
      } else if (score > 21) {
        loseList.push(players[i].name)
        check = true;
      } 
    })
  };
  return check;
}

var resetGame = function() {
  players = []
  winList = []
  loseList = []
  main(2);
}

var main = function(playerNum)
{
  initializeDeck();
  initializePlayers(playerNum);
  initializeButtons();
}

main(2);