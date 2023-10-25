// Global Variables
var players = [];
var winList = [];
var loseList = [];
var carddeck, dealButton, hitButton, standButton, revealButton, output, playerNum, cardOutput;
var playerNum = 2; 
var playerTurn = 0; 

// Functions 
var initializeDeck = function () {

  carddeck = [];
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

      carddeck.push(card);
      rankCounter += 1;
    }

    suitIndex += 1;
  }
};

var initializePlayers = function(playerNum){
  for (let i = 1; i <= playerNum; i++) {
    var player = {
      name: "",
      playerHand: [],
      currentScore: [],
      status: ""
    };

    if(i == playerNum){
      player.name = "Computer";
    } else {
      player.name = "Player #" + i;
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
    cardOutput = "";

    if (carddeck.length == 0){
      cardOutput = "No Cards Left!"
    } else {
      dealFirstHand();
      displayFullList(); 
      validationMessage();
    }
  })

  hitButton.addEventListener("click", function () {    
    cardOutput = "";
    players[playerTurn].status = "Hit"; 
    dealHit();
    displayFullList();
    validationMessage();
  })

  standButton.addEventListener("click", function () {
    cardOutput = "";

  })
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
  var pickCard = chooseRandomCard();
  players.forEach(player => {
    if(player.status == "Hit"){
      player.playerHand.push(pickCard);
      player.status = ""; 
    }
  })
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

var displayFullList = function () {
  for (let i=0; i<players.length; i++){
    var playerName = "<b>" + players[i].name + " Hand </b>"; 
    players[i].currentScore = calculateHand(players[i]);
    var playerHandOutput = listOutHand(players[i]);
    cardOutput += playerName + ": <br>" + playerHandOutput + "<b> Score(s): </b>" + players[i].currentScore + 
                  "<br> Chosen Score To Display: " + selectBestNumber(players[i].currentScore) + "<br><br>";    
  };
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

var checkWin = function() {
  var checkWinResult = false; 
  for (let i=0; i<players.length; i++){
    players[i].currentScore.forEach(score => {
      if (score == 21) {
        winList.push(players[i].name);
        checkWinResult = true; 
      } 
    })
  };
  return checkWinResult;
}

var checkLose = function() {
  checkLoseResult = false; 
  for (let i=0; i<players.length; i++){
    if(checkforNumberNotLargerThan21(players[i].currentScore)){
    } else {
      checkLoseResult = true; 
      loseList.push(players[i].name);
    }
  };
  return checkLoseResult;
}

var checkforNumberNotLargerThan21 = function (array) {
  var check = false;  
  array.forEach(element => {
    if (element <= 21) {
      check = true;
    }
  });
  return check; 
}

var selectBestNumber = function (scores) {
  max = 0; 
  scores.forEach(score => {
    if (score == 21) {
      max = score
      return max
    } else if (score > 21) {
      //pass
    } else if (score > max) {
      max = score; 
    }
  })
  return max; 
}

var validationMessage = function() {
  if(checkWin() == true) {
    cardOutput += winList + " wins!"  
    output.innerHTML = cardOutput;
    resetGame();
  } else if (checkLose() == true) {
    cardOutput += loseList + " loses!"
    output.innerHTML = cardOutput;
    resetGame();
  } else {
    cardOutput += players[playerTurn].name + ", please select <b>'Hit'</b> to draw another card or <b>'Stand'</b> to move to next player's turn."
    output.innerHTML = cardOutput;
    disableCase(2);     
  }
}

var resetGame = function() {
  players = []
  winList = []
  loseList = []
  playerTurn = 0; 
  cardOutput = "";
  initializeDeck();
  initializePlayers(playerNum);
  disableCase(1); 
}

var main = function (playerNum) {
  initializeDeck();
  initializePlayers(playerNum);
  initializeButtons();
  disableCase(1); 
}

main(playerNum)