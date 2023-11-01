// Global Variables
var players = [];
var playerNameList = []; 
var winList = [];
var loseList = [];
var carddeck, dealButton, hitButton, standButton, revealButton, resetButton, output, playerNum, cardOutput, imageContainer, changePicture;
var playerNum = 2; 
var playerTurn = 0; 
var blackPink = ['lisa', 'rose', 'jennie', 'jisoo', 'jisoo2', 'lisa2','rose2','jennie2']; 

// Functions 
var initializeDeck = function () {

  carddeck = [];
  var suits = ['♥', '♦', '♣', '♠'];

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
      bestScore: 0, 
      status: ""
    };

    if(i == playerNum){
      player.name = "BlackPink";
    } else {
      player.name = "Player #" + i;
    }

    players.push(player);
    playerNameList.push(player.name);
  }
}

var initializeButtons = function(){

  dealButton = document.querySelector("#deal-button");
  hitButton = document.querySelector("#hit-button");
  standButton = document.querySelector("#stand-button");
  revealButton = document.querySelector("#reveal-button");
  resetButton = document.querySelector("#reset-button");
  welcomeHeader = document.querySelector("#welcomeHeader");
  imageContainer = document.querySelector("#image-container");
  changePicButton = document.querySelector("#changePicture")
  changePicButton.style.display = 'none';
  output = document.querySelector("#output-div");

  dealButton.addEventListener("click", function () {
    cardOutput = "";

    if (carddeck.length == 0){
      cardOutput = "No Cards Left!"
    } else {
      dealFirstHand();
      updateAllPlayersProfile();
      validationMessage();
      welcomeHeader.innerHTML = "Let's Go!" 
      var randomPicture = randomBpPicture();
      changePicButton.style.display = 'block';
      imageContainer.innerHTML = '<img class="blackpink-image" id="'+ randomPicture +'"src="blackpink/'+ randomPicture +'.gif" alt="'+ randomPicture +'">'
    }
  })

  hitButton.addEventListener("click", function () {    
    cardOutput = "";
    players[playerTurn].status = "Hit"; 
    dealHit();
    updateAllPlayersProfile();
    validationMessage();
  })

  standButton.addEventListener("click", function () {
    cardOutput = "";
    players[playerTurn].status = "Stand"; 
    playerTurn++;
    displayPlayerList();
    cardOutput += "Please click 'Reveal' to see Blackpink's hand."; 
    output.innerHTML = cardOutput; 

    if(playerTurn == playerNum - 1){
      disableCase(3);
    } else {
      disableCase(2);
    }
  })

  revealButton.addEventListener("click", function () {
    cardOutput = "";
    dealComputer();
    updateAllPlayersProfile();
    displayFullList();
    finalValidationMessage();
    disableCase(4); 
  })

  resetButton.addEventListener("click", function () {
    resetGame(); 
    changePicButton.style.display = 'none';
    welcomeHeader.innerHTML = "Welcome, Hit 'Deal' To Start Game!"; 
    imageContainer.innerHTML = '<img class="blackpink-image" id="bp-main" src="blackpink/blackpink-main.jpg" alt="BlackPink Main">';
  })

  changePicButton.addEventListener("click", function () {
    var randomPicture = randomBpPicture();
    imageContainer.innerHTML = '<img class="blackpink-image" id="'+ randomPicture +'"src="blackpink/'+ randomPicture +'.gif" alt="'+ randomPicture +'">';
  })
};

var disableCase = function(num){
  switch(num){
    case 1:
      enableButton(dealButton);
      disableButton(hitButton);
      disableButton(standButton);
      disableButton(revealButton);
      disableButton(resetButton);
      return;
    case 2:
      disableButton(dealButton);
      enableButton(hitButton);
      enableButton(standButton);
      disableButton(revealButton);
      enableButton(resetButton);
      return; 
    case 3:
      disableButton(dealButton);
      disableButton(hitButton);
      disableButton(standButton);
      enableButton(revealButton);
      enableButton(resetButton);
      return; 
    case 4:
      disableButton(dealButton);
      disableButton(hitButton);
      disableButton(standButton);
      disableButton(revealButton);
      enableButton(resetButton);
      return; 
    default: 
      disableButton(dealButton);
      disableButton(hitButton);
      disableButton(standButton);
      disableButton(revealButton);
      disableButton(resetButton);
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

var dealComputer = function () {
  var computer = players[players.length - 1];
  var computerChoiceNum = 0; 
  if (computer.bestScore < 13){
    computerChoiceNum = 2;
    for (let i=1; i<=computerChoiceNum; i++) {
      var computerChoice = Math.floor(Math.random() * 2);
      if (computer.bestScore > 21){
        return
      } else if(computerChoice == 0) {
        console.log("Computer chooses to hit!");
        computer.status = "Hit";
        dealHit()
        computer.bestScore = updateScoreForUse(computer.currentScore);
      } else if (computerChoice == 1) {
        console.log("Computer chooses to stand!");
        return 
      }
    }
  } else {
    computerChoiceNum = Math.floor(Math.random() * 3);  
    if (computerChoiceNum == 0){
      return ;
    } else {
      for (let i=1; i<=computerChoiceNum; i++) {
        var computerChoice = Math.floor(Math.random() * 2);
        if (computer.bestScore > 21){
          return
        } else if(computerChoice == 0) {
          console.log("Computer chooses to hit!");
          computer.status = "Hit";
          dealHit()
          computer.bestScore = updateScoreForUse(computer.currentScore);
        } else if (computerChoice == 1) {
          console.log("Computer chooses to stand!");
          return 
        }
      }
    }
  }
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

var updateAllPlayersProfile = function () {
  for (let i=0; i<players.length; i++){
    players[i].currentScore = calculateHand(players[i]);
    players[i].bestScore = updateScoreForUse(players[i].currentScore);
  };
}

var displayFullList = function () {
  for (let i=0; i<players.length; i++){
    var playerName = "<b>" + players[i].name + " Hand </b>"; 
    var playerHandOutput = listOutHand(players[i]);
    cardOutput += playerName + ": <br>" + playerHandOutput + "<b> Possible Scores: </b>" + players[i].currentScore + 
                  "<br> <b> Best Score: </b>" + players[i].bestScore + "<br><br>";    
  };
}

var displayPlayerList = function () {
  for (let i=0; i<players.length-1; i++){
    var playerName = "<b>" + players[i].name + " Hand </b>"; 
    var playerHandOutput = listOutHand(players[i]);
    cardOutput += playerName + ": <br>" + playerHandOutput + "<b> Possible Scores: </b>" + players[i].currentScore + 
                  "<br> <b> Best Score: </b>" + players[i].bestScore + "<br><br>";    
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

var updateScoreForUse = function (scores) {
  if (scores.length == 1){
    return scores[0];
  } else {
    return selectBestNumber(scores);
  }
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
    displayFullList();
    for(let i=0; i<winList.length; i++){
      for(let j=0; j<playerNameList.length; j++){
        if(playerNameList[j] !== winList[i]){
          loseList.push(playerNameList[j]);
        }
      }
    }
    cardOutput += "<b>"+ winList + " wins! </b> <br>" +
                  loseList + " loses!";
    output.innerHTML = cardOutput;
    checkBlackpinkResult(winList,loseList)
    disableCase(4);  
  } else if (checkLose() == true) {
    displayFullList();
    for(let i=0; i<loseList.length; i++){
      for(let j=0; j<playerNameList.length; j++){
        if(playerNameList[j] !== loseList[i]){
          winList.push(playerNameList[j]);
        }
      }
    }
    cardOutput += "<b>"+ winList + " wins! </b> <br>" +
                  loseList + " loses!";
    output.innerHTML = cardOutput;
    checkBlackpinkResult(winList,loseList)
    disableCase(4);  
  } else {
    displayPlayerList();
    cardOutput += players[playerTurn].name + ", please select <b>'Hit'</b> to draw another card or <b>'Stand'</b> to move to next player's turn."
    output.innerHTML = cardOutput;
    var randomPicture = randomBpPicture()
    imageContainer.innerHTML = '<img class="blackpink-image" id="'+ randomPicture +'"src="blackpink/'+ randomPicture +'.gif" alt="'+ randomPicture +'">'
    disableCase(2);     
  }
}

var finalValidationMessage = function() {
  if(checkWin() == true) {  
    for(let i=0; i<winList.length; i++){
      for(let j=0; j<playerNameList.length; j++){
        if(playerNameList[j] !== winList[i]){
          loseList.push(playerNameList[j]);
        }
      }
    }
    cardOutput += "<b>"+ winList + " wins! </b> <br>" +
                  loseList + " loses!";
    output.innerHTML = cardOutput;
    checkBlackpinkResult(winList,loseList)
    disableCase(4);  
  } else if (checkLose() == true) {
    for(let i=0; i<loseList.length; i++){
      for(let j=0; j<playerNameList.length; j++){
        if(playerNameList[j] !== loseList[i]){
          winList.push(playerNameList[j]);
        }
      }
    }
    cardOutput += "<b>"+ winList + " wins! </b> <br>" +
                  loseList + " loses!";
    output.innerHTML = cardOutput;
    checkBlackpinkResult(winList,loseList)
    disableCase(4);   
  } else {
    var arrayOfScores = []
    var maxScore = players[0].bestScore;
    var bestPlayer = players[0].name; 

    for (let i=0; i<players.length; i++){
      arrayOfScores.push(players[i].bestScore);
      if (players[i].bestScore > maxScore){
        maxScore = players[i].bestScore;
        bestPlayer = players[i].name; 
      }
    }
    if (allAreEqual(arrayOfScores)){
      cardOutput += "<b>It's a Draw!</b>";
      output.innerHTML = cardOutput; 
      checkBlackpinkResult(winList,loseList)
      return;
    } else {
      winList.push(bestPlayer);

      for(let i=0; i<winList.length; i++){
        for(let j=0; j<playerNameList.length; j++){
          if(playerNameList[j] !== winList[i]){
            loseList.push(playerNameList[j]);
          }
        }
      }
      cardOutput += "<b>"+ winList + " wins! </b> <br>" +
                    loseList + " loses!";

      output.innerHTML = cardOutput;
      checkBlackpinkResult(winList,loseList)
      return; 
    }
  }
}

var checkBlackpinkResult = function(winList, loseList){
  if (winList[0] == "BlackPink" || loseList[0] == "Player #1") {
    imageContainer.innerHTML = '<img class="blackpink-image" id="bp-main" src="blackpink/blackpink-happy.gif" alt="bp-main">';
  } else if(loseList[0] == "BlackPink" || winList[0] == "Player #1"){
    imageContainer.innerHTML = '<img class="blackpink-image" id="bp-sad" src="blackpink/blackpink-sad.gif" alt="bp-sad">';
  } else {
    imageContainer.innerHTML = '<img class="blackpink-image" id="bp-main" src="blackpink/blackpink-main.jpg" alt="bp-main">';
  }
}

var randomBpPicture = function() {
  var random = blackPink[Math.floor(Math.random() * (blackPink.length))];
  return random
}

var allAreEqual = function (array) {
  const result = array.every(element => {
    if (element === array[0]) {
      return true;
    }
  });
  return result;
}

var resetGame = function() {
  players = []
  playerNameList = []; 
  winList = []
  loseList = []
  playerTurn = 0; 
  cardOutput = "";
  output.innerHTML = "";
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