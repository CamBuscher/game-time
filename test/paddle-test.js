const chai = require('chai');
const assert = chai.assert;
const Paddle = require('../lib/Paddle');

describe('Paddle', function() {

  it('should be a constructor', function(){
    assert.isFunction(Paddle, true);
  });

  it('should instantiate a new paddle', function() {
    var paddle = new Paddle(10, 100, 15);
    assert.isObject(paddle);
  });

  it('should have dimensions and x and y values', function() {
    var paddle = new Paddle(10, 100, 15);
    assert.equal(paddle.x, 10);
    assert.equal(paddle.width, 100);
    assert.equal(paddle.height, 15);
  });

  it('should be animated', function() {
    var paddle = new Paddle(10, 100, 15);

    paddle.animate({37: true});
    assert.equal(paddle.x, 5)

    paddle.animate({39: true});
    assert.equal(paddle.x, 10);
  })
})
