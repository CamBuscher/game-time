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

  collisionCheck(obj1, obj2) {
    if (obj1.x < obj2.x + obj2.width  && obj1.x + obj1.width  > obj2.x &&
        obj1.y < obj2.y + obj2.height && obj1.y + obj1.height > obj2.y) {
      return true;
    } else {
      return false;
    }
  }

  paddleBallColliding(ball, paddle) {
    let boolean = this.collisionCheck(ball, paddle);
    let dy = ball.dy;
    if (boolean === true) {
      return dy = -dy;
    } else {
      return dy;
    }
  }

  paddleBallXCheck(ball, paddle) {
    let boolean = this.collisionCheck(ball, paddle);
    let paddleFirstFifth = paddle.x + (paddle.width / 5);
    let paddleSecondFifth = paddle.x + ((paddle.width / 5) * 2);
    let paddleThirdFifth = paddle.x + ((paddle.width / 5) * 4);
    let paddleFourthFifth = paddle.x + paddle.width;
    if (boolean === true) {
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
      let boolean = this.collisionCheck(ball, brick);
      if (boolean === true) {
        this.score += 100;
        if (brick.health === 1) {
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
      let boolean = this.collisionCheck(ball, brick);
      if (boolean === true) {
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
