const Brick = require('./Brick.js');

class Game {
  constructor(ball, paddle) {
    this.bricks = [];
    this.discardedBricks = [];
    this.balls = [ball];
    this.paddle = paddle;
    this.level = 1;
    this.lives = 3;
    this.score = 0;
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

  collisionCheck(obj1, obj2) {
    if (obj1.x < obj2.x + obj2.width  && obj1.x + obj1.width  > obj2.x &&
        obj1.y < obj2.y + obj2.height && obj1.y + obj1.height > obj2.y) {
      return true;
    } else {
      return false;
    }
  }

  paddleBallColliding(ball, paddle) {
    let areColliding = this.collisionCheck(ball, paddle);
    let dy = ball.dy;
    if (areColliding) {
      return dy = -dy;
    } else {
      return dy;
    }
  }

  paddleBallXCheck(ball, paddle) {
    let areColliding = this.collisionCheck(ball, paddle);
    let paddleFirstFifth = paddle.x + (paddle.width / 5);
    let paddleSecondFifth = paddle.x + ((paddle.width / 5) * 2);
    let paddleThirdFifth = paddle.x + ((paddle.width / 5) * 4);
    let paddleFourthFifth = paddle.x + paddle.width;
    if (areColliding) {
      if (ball.x < paddleFirstFifth) {
        ball.dx -= 3;
      } else if (ball.x < paddleSecondFifth) {
        ball.dx -= 1;
      } else if (ball.x < paddleThirdFifth) {
        ball.dx += 1;
      } else if (ball.x < paddleFourthFifth) {
        ball.dx += 3;
      }
    }
    if (ball.dx > 10) {
      ball.dx = 10;
    } else if (ball.dx < -10) {
      ball.dx = -10;
    }
    return ball.dx
  }

  grabBricks(bricks) {
    this.bricks.push(bricks);
  }

  brickBallColliding(ball, bricks) {
    let dy = ball.dy;
    bricks.forEach(function(brick) {
      let index = this.bricks.indexOf(brick);
      let areColliding = this.collisionCheck(ball, brick);
      if (areColliding) {
        this.score += 100;
        if (brick.health === 1){
          let index = this.bricks.indexOf(brick);
          this.discardedBricks = this.bricks.splice(index, 1);
        }
        brick.health--;
        if (ball.x < (brick.x + brick.width) && ball.x > brick.x) {
          return dy = -dy;
        } else {
          return dy;
        }
      }
    }.bind(this))
    return dy;
  }

  checkBricks() {
    if (this.bricks.length === 0) {
      this.level++;
      return true;
    }
  }

  brickBallSideCollision(ball, bricks) {
    bricks.forEach(function(brick) {
      let areColliding = this.collisionCheck(ball, brick);
      if (areColliding) {
        if (ball.x <= brick.x || ball.x >= (brick.x + brick.width)) {
          ball.dx = -ball.dx;
        }
      }
    }.bind(this))
    return ball.dx;
  }

  checkBallDeath(ball, canvasHeight) {
    if (ball.y >= canvasHeight) {
      this.lives -= 1;
      return true;
    } else {
      return false;
    }
  }
}

module.exports = Game;
