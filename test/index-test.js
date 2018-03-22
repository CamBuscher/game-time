const Paddle = require('../lib/Paddle');
const Keyboarder = require('../lib/keyboarder.js');
const Ball = require('../lib/ball.js');
const Scores = require('../lib/scores.js');
const Game = require('../lib/Game.js');
const Brick = require('../lib/bricks.js');
const Index = require('../lib/index.js');
const chai = require('chai');
const assert = chai.assert;

describe('Index', function() {
  it('should generate bricks', function() {
    let ball = new Ball(10, 10, 5, 5);
    let paddle = new Paddle(375, 150, 15);
    let newGame = new Game(ball, paddle);

    generateBricks();
    assert.equal(newGame.level, 1);
    assert.deepEqual(newGame.grabBricks, []);
  })
})
