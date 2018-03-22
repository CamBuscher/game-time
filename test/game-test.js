const Paddle = require('../lib/Paddle');
const Keyboarder = require('../lib/Keyboarder.js');
const Ball = require('../lib/Ball.js');
const Scores = require('../lib/Scores.js');
const Game = require('../lib/Game.js');
const Brick = require('../lib/Brick.js');
const chai = require('chai');
const assert = chai.assert;

describe('Game', function() {

  it('should be a function', function() {
    assert.isFunction(Game, true);
  })

  it('should instantiate a new game', function() {
    let ball = new Ball(10, 10, 5, 5);
    let paddle = new Paddle(375, 150, 15)
    let newGame = new Game(ball, paddle)
    assert.isObject(newGame);
  })

  it('should detect collision', function() {
    let ball = new Ball(375, 475, 5, 5);
    let paddle = new Paddle(375, 150, 15)
    let newGame = new Game(ball, paddle);

    let boolean = newGame.collisionCheck(ball, paddle);
    assert.equal(boolean, true);
  })

  it('should check if ball is alive', function() {
    let ball = new Ball(10, 10, 5, 5);
    let paddle = new Paddle(375, 150, 15)
    let newGame = new Game(ball, paddle);

    let ballIsDead = newGame.checkBallDeath(ball, 10)

    assert.equal(ballIsDead, true);
  })

  it('should count lives', function() {
    let ball = new Ball(10, 10, 5, 5);
    let paddle = new Paddle(375, 150, 15)
    let newGame = new Game(ball, paddle);

    assert.equal(newGame.lives, 3);

    newGame.checkBallDeath(ball, 10);
    assert.equal(newGame.lives, 2);
  })

  it('should keep track of level', function() {
    let ball = new Ball(10, 10, 5, 5);
    let paddle = new Paddle(375, 150, 15)
    let newGame = new Game(ball, paddle);
    let brick = new Brick();

    assert.equal(newGame.level, 1);

    newGame.checkBricks();

    assert.equal(newGame.level, 2)
  })

  it('should count score', function() {
    let ball = new Ball(10, 10, 5, 5);
    let paddle = new Paddle(375, 150, 15)
    let newGame = new Game(ball, paddle);
    let brick = new Brick()
    let testBrick = new Brick( 10, 10);
    let bricksArray = []
    bricksArray.push(testBrick);

    assert.equal(newGame.score, 0);

    newGame.brickBallColliding(ball, bricksArray)
    assert.equal(newGame.score, 100);
  })

  it('should bounce off paddle', function() {
    let ball = new Ball(375, 475, 5, 5);
    let paddle = new Paddle(375, 150, 15)
    let newGame = new Game(ball, paddle);

    assert.equal(ball.dy, 5);

    ball.dy = newGame.paddleBallColliding(ball, paddle);

    assert.equal(ball.dy, -5)
  })

  it('should manipulate ball velocity based where ball hits paddle', function() {
    let ball = new Ball(520, 475, 5, 5);
    let paddle = new Paddle(375, 150, 15)
    let newGame = new Game(ball, paddle);

    assert.equal(ball.dx, 5);

    newGame.paddleBallXCheck(ball, paddle);
    assert.equal(ball.dx, 8);

    ball.x = 380;
    newGame.paddleBallXCheck(ball, paddle);
    assert.equal(ball.dx, 5);
  })

  it('should detect when ball hits side of brick', function() {
    let ball = new Ball(10, 10, 5, 5);
    let paddle = new Paddle(375, 150, 15)
    let newGame = new Game(ball, paddle);
    let brick = new Brick()
    let testBrick = new Brick( 10, 10 );
    let bricksArray = []
    bricksArray.push(testBrick);

    let boolean = newGame.collisionCheck(ball, testBrick);
    assert.equal(boolean, true);

    assert.equal(ball.dx, 5)
    ball.dx = newGame.brickBallSideCollision(ball, bricksArray)
    assert.equal(ball.dx, -5)
  })

})
