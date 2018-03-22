const chai = require('chai');
const assert = chai.assert;
const Brick = require('../lib/bricks');

describe('Brick', function() {
  it('should be a constructor', function() {
    assert.isFunction(Brick, true);
  })

  it('should instantiate a new brick', function() {
    let brick = new Brick(5, 5);
    assert.isObject(brick);
  })

  it('should have an x and y value, and an empty bricks array', function() {
    let brick = new Brick(5, 5);
    assert.equal(brick.x, 5);
    assert.equal(brick.y, 5);
    assert.deepEqual(brick.bricks, []);
  })

  it('should create a lot of bricks', function() {
    let brick = new Brick(5, 5);
    brick.createBricks(20, 1);
    assert.equal(brick.bricks.length, 20);
  })

  it('should create 16 normal bricks on level 3', function() {
    let brick = new Brick();
    brick.createBricks(60, 3);
    assert.equal(brick.bricks.length, 48);
    let normalBricks = brick.bricks.filter( brick => brick.health === 1)
    assert.equal(normalBricks.length, 16);
  })

  it('should create 32 strong bricks on level 3', function() {
    let brick = new Brick();
    brick.createBricks(60, 3);
    assert.equal(brick.bricks.length, 48);
    let strongerBricks = brick.bricks.filter( brick => brick.health === 2)
    assert.equal(strongerBricks.length, 32);
  })

})
