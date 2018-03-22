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

  it('paddle should move when correct key is pressed', function() {
    var paddle = new Paddle(10, 100, 15);

    paddle.animate({37: true});
    assert.equal(paddle.x, 5)

    paddle.animate({39: true});
    assert.equal(paddle.x, 10);
  });
})
