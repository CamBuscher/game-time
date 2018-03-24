class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.health = 1;
    this.width = 75;
    this.height = 25;
  }

  clearBricks() {
    let bricksArray = [];
    return bricksArray;
  }

  draw(context, bricks) {
    for (let i = 0; i < bricks.length; i++) {
      const {x, y, width, height} = bricks[i];
      if (bricks[i].health === 2) {
        context.fillStyle = '#360600'
      } else if (bricks[i].health === 1) {
        context.fillStyle = '#FC0009'
      }
      context.fillRect(x, y, width, height);
    }
  }
}

module.exports = Brick
