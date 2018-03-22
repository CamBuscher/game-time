const chai = require('chai');
const assert = chai.assert;
const Brick = require('../lib/Brick');

describe('Brick', function() {
  it('should be a constructor', function() {
    assert.isFunction(Brick, true);
  })

  it('create bricks function should create a lot of bricks', function() {
    let brick = new Brick(5, 5);
    let bricksArray = brick.createBricks(20, 1);
    assert.equal(bricksArray.length, 20);
  })

  it('should create 16 normal bricks on level 3', function() {
    let brick = new Brick();
    let bricksArray = brick.createBricks(60, 3);
    assert.equal(bricksArray.length, 48);
    let normalBricks = bricksArray.filter( brick => brick.health === 1)
    assert.equal(normalBricks.length, 16);
  })

  it('should create 32 strong bricks on level 3', function() {
    let brick = new Brick();
    let bricksArray = brick.createBricks(60, 3);
    assert.equal(bricksArray.length, 48);
    let strongerBricks = bricksArray.filter( brick => brick.health === 2)
    assert.equal(strongerBricks.length, 32);
  })

  it('clear bricks function should be able to clear it\'s bricks array', function() {
    let brick = new Brick();
    let bricksArray = brick.createBricks(60, 3);
    assert.equal(bricksArray.length, 48);
    bricksArray = brick.clearBricks();
    assert.equal(bricksArray.length, 0);
  })

})
