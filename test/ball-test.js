const chai = require('chai');
const assert = chai.assert;
const Ball = require('../lib/Ball');

describe('Ball', function() {

  it('should be a constructor', function() {
    assert.isFunction(Ball, true);
  })

  it('should instantiate a new ball', function() {
    var ball = new Ball(0, 0, 10, 10);
  })

  it('should have x and y coordinates', function(){
    var ball = new Ball(0, 0, 10, 10);
    assert.equal(ball.x, 0);
    assert.equal(ball.y, 0);
  })

  it('should have velocity', function() {
    var ball = new Ball(0, 0, 10, 10);
    assert.equal(ball.dx, 10);
    assert.equal(ball.dy, 10);
  })

  it('should move', function() {
    var ball = new Ball(50, 50, 10, 10);
    ball.move(400, 400);
    ball.move(400, 400);
    ball.move(400, 400);
    ball.move(400, 400);
    assert.equal(ball.x, 90);
    assert.equal(ball.y, 90);
  })
})
