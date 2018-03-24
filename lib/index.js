const canvas = document.querySelector('#game-screen');
const Paddle = require('./Paddle');
const Keyboarder = require('./Keyboarder');
const Ball = require('./Ball.js');
const Scores = require('./Scores.js');
const Game = require('./Game.js');
const Brick = require('./Brick.js');
let ctx = canvas.getContext('2d');
let keyboardMonitor = new Keyboarder();
let newGame = new Game();
let requestID = undefined;
let isDead = null;

newGame.startGame(ctx, canvas);
getFromStorage();
documentContext();

function documentContext() {
  document.getElementById('user-score').innerHTML = newGame.score;
  document.querySelector('.lives-indicator').innerHTML = newGame.lives;
}


window.addEventListener('keydown', function(e) {
  newGame.keyboarder.keyState = newGame.keyboarder.keyDown(e);
});

window.addEventListener('keyup', function(e) {
  newGame.keyboarder.keyState = newGame.keyboarder.keyUp(e);
});

document.querySelector('.new-game-button').addEventListener('click', newGame.restartGame);
documentContext();

function scoreToStorage(scores) {
  let storeScores = scores;
  let stringifyScores = JSON.stringify(storeScores);
  localStorage.setItem(scores.id, stringifyScores);
}

function getFromStorage(scores) {
  let topScores = [];
  for (let i = 0; i < localStorage.length; i++){
    let retrievedItem = localStorage.getItem(localStorage.key(i));
    let parsedItem = JSON.parse(retrievedItem);
    topScores.push(parsedItem);
  }
  topScores.sort(function(a, b) {
    return b.score - a.score;
  })
  topScores.splice(10, 1000);
  for (let i = 0; i < topScores.length; i++) {
    let initials = topScores[i].initials;
    let score = topScores[i].score;
    let HTMLInitials = 'high-initials-' + (i + 1);
    let HTMLScores = 'high-score-' + (i + 1);
    document.querySelector('.' + HTMLInitials).innerHTML = initials;
    document.querySelector('.' + HTMLScores).innerHTML = score;
  }
}
