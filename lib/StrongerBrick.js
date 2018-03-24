const Brick = require('./Brick.js');

class StrongerBrick extends Brick {
  constructor(x, y, health) {
    super(x, y);
    this.health = health;
  }
}

module.exports = StrongerBrick