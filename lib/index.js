const canvas = document.querySelector('#game-screen');
const Paddle = require('./Paddle');
const Keyboarder = require('./keyboarder');
const Ball = require('./ball.js');
const Scores = require('./scores.js');
const Game = require('./Game.js');
const Brick = require('./bricks.js');
let ctx = canvas.getContext('2d');
let newGame = new Game(bouncyBall, startPaddle);
let startPaddle = new Paddle(350, 100, 15);
let keyboardMonitor = new Keyboarder();
let bouncyBall = new Ball(400, 200, ((Math.random() * 3) - 1.5), 4);
let keyState = {};
let bricks = new Brick();
let requestID = undefined;
let isDead = null;

generateBricks();
startGame();
getFromStorage();

function generateBricks() {
  if (newGame.level === 1) {
    let newBricks = bricks.createBricks(40, 1);
    newBricks.forEach( brick => newGame.grabBricks(brick) );
  } else if (newGame.level === 2) {
    let newBricks = bricks.createBricks(40, 2);
    newBricks.forEach( brick => newGame.grabBricks(brick) );
  } else if (newGame.level === 3) {
    let newBricks = bricks.createBricks(54, 3);
    newBricks.forEach( brick => newGame.grabBricks(brick) );
  }
}

window.addEventListener('keydown', function(e) {
  keyState = keyboardMonitor.keyDown(e);
});

window.addEventListener('keyup', function(e) {
  keyState = keyboardMonitor.keyUp(e);
});

document.querySelector('.new-game-button').addEventListener('click', restartGame);

function gameLoop() {
  document.getElementById('user-score').innerHTML = newGame.score;
  document.querySelector('.lives-indicator').innerHTML = newGame.lives;
  ctx.fillStyle = '#000';
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  startPaddle.draw(ctx);
  bouncyBall.draw(ctx);
  bouncyBall.dy = newGame.paddleBallColliding(bouncyBall, startPaddle);
  bouncyBall.dx = newGame.paddleBallXCheck(bouncyBall, startPaddle);
  bouncyBall.dx = newGame.brickBallSideCollision(bouncyBall, newGame.bricks);
  bouncyBall.dy = newGame.brickBallColliding(bouncyBall, newGame.bricks);
  bricks.draw(ctx, newGame.bricks);
  bouncyBall.move(canvas.height, canvas.width);
  startPaddle.animate(keyState);
  isDead = newGame.checkBallDeath(bouncyBall, canvas.height);
  if (isDead) {
    ballDeath();
  } else {
    requestID = requestAnimationFrame(gameLoop);
  }
  if (newGame.checkBricks()) {
    bricks.clearBricks();
    generateBricks();
    window.cancelAnimationFrame(requestID);
    requestID = null;
    startGame();
  }
}

function restartGame() {
  window.cancelAnimationFrame(requestID);
  requestID = null;
  newGame.bricks = bricks.clearBricks();
  bouncyBall = new Ball(400, 200, ((Math.random() * 3) - 1.5), 4);
  newGame = new Game(bouncyBall, startPaddle);
  generateBricks();
  startGame();
}

function startGame() {
  ctx.fillStyle = '#000';
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  bouncyBall = new Ball(400, 200, ((Math.random() * 3) - 1.5), 4);
  startPaddle = new Paddle(350, 100, 15);
  startPaddle.draw(ctx);
  bouncyBall.draw(ctx);
  bricks.draw(ctx, newGame.bricks);
  delayedStart();
  endGame();
}

function delayedStart() {
  if (!requestID) {
    window.setTimeout(gameLoop, 3000);
  }
}

function endGame() {
  var userScores = new Scores();
  if (newGame.lives === 0) {
    document.getElementById('user-score').innerHTML = 0;
    userScores.initials = prompt('Enter your initials!', '');
    userScores.score = newGame.score;
    userScores.initials = checkInitials(userScores.initials);
    scoreToStorage(userScores);
    getFromStorage(userScores);
    newGame = new Game(bouncyBall, startPaddle);
    bricks = new Brick();
    generateBricks();
  }
}

function ballDeath() {
  if (requestID) {
    window.cancelAnimationFrame(requestID);
    requestID = null;
    isDead = false;
    var livesIndicator = document.querySelector('.lives-indicator');
    livesIndicator.innerText = newGame.lives;
    startGame();
  }
}

const checkInitials = s => /[a-z]*/gi.test(s) ? s.slice(0, 3).toUpperCase() : 'N/A';

function scoreToStorage(scores) {
  var storeScores = scores;
  var stringifyScores = JSON.stringify(storeScores);
  localStorage.setItem(scores.id, stringifyScores);
}

function getFromStorage() {
  let topScores = [];
  for (var i = 0; i < localStorage.length; i++) {
    let retrievedItem = localStorage.getItem(localStorage.key(i));
    let parsedItem = JSON.parse(retrievedItem);
    topScores.push(parsedItem);
  }
  topScores.sort(function(a, b) {
    return b.score - a.score;
  })
  topScores.splice(10, 1000);
  for (var i = 0; i < topScores.length; i++) {
    let initials = topScores[i].initials;
    let score = topScores[i].score;
    let HTMLInitials = 'high-initials-' + (i + 1);
    let HTMLScores = 'high-score-' + (i + 1);
    document.querySelector('.' + HTMLInitials).innerHTML = initials;
    document.querySelector('.' + HTMLScores).innerHTML = score;
  }
}
