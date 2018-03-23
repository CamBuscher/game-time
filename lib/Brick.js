class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.health = 1;
    this.width = 75;
    this.height = 25;
  }

  createBricksLvlsOneTwo(numBricks, level) {
    let bricksArray = [];
      for (var i = 0; i < numBricks; i++) {
        if (i <= 9) {
          let x = 2.5 + (i * 75) + (i * 5);
          let y = 15;
          bricksArray.push(new Brick(x, y));
        } else if (i <= 19) {
          let x = 2.5 + ((i - 10) * 75) + ((i - 10) * 5);
          let y = 45;
          bricksArray.push(new Brick(x, y));
        } else if (i <= 29) {
          let x = 2.5 + ((i - 20) * 75) + ((i - 20) * 5);
          let y = 75;
          bricksArray.push(new Brick(x, y));
        } else if (i <= 39) {
          let x = 2.5 + ((i - 30) * 75) + ((i - 30) * 5);
          let y = 105;
          if (level === 2) {
            let health = 2;
            bricksArray.push(new StrongerBrick(x, y, health))
          }
        }
      } return bricksArray;
    };

  createBricksLvlThree(numBricks) {
    let bricksArray = []
    for (var i = 0; i < numBricks; i++) {
      if (i <= 8) {
        let x = 45 + (i * 75) + (i * 5);
        let y = 25;
        let health = 2;
        bricksArray.push(new StrongerBrick(x, y, health));
      } else if (i <= 17) {
        let x = 45 + ((i - 9) * 75) + ((i - 9) * 5);
        let y = 55;
        bricksArray.push(new Brick(x, y));
      } else if (i <= 26) {
        let x = 45 + ((i - 18) * 75) + ((i - 18) * 5);
        let y = 85;
        let health = 2;
        bricksArray.push(new StrongerBrick(x, y, health));
      } else if (i <= 35) {
        let x = 45 + ((i - 27) * 75) + ((i - 27) * 5);
        let y = 115;
        let health = 2;
        bricksArray.push(new StrongerBrick(x, y, health));
      } else if (i <= 44) {
        let x = 45 + ((i - 36) * 75) + ((i - 36) * 5);
        let y = 145;
        bricksArray.push(new Brick(x, y))
      } else if (i <= 53) {
        let x = 45 + ((i - 45) * 75) + ((i - 45) * 5);
        let y = 175;
        let health = 2;
        bricksArray.push(new StrongerBrick(x, y, health));
      }
    }
    bricksArray = bricksArray.filter(brick => brick.x !== 365);
    return bricksArray;
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

class StrongerBrick extends Brick {
  constructor(x, y, health) {
    super(x, y);
    this.health = health;
  }
}

module.exports = Brick;
