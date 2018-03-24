const Brick = require('./Brick.js');
const Paddle = require('./Paddle');
const Ball = require('./Ball.js');
const Scores = require('./Scores.js');
const Keyboarder = require('./Keyboarder.js');

class Game {
  constructor(ball, paddle) {
    this.bricks = [];
    this.discardedBricks = [];
    this.ball = ball;
    this.paddle = paddle;
    this.level = 1;
    this.lives = 3;
    this.score = 0;
    this.requestID = undefined;
  }

  startGame(ctx, canvas) {
    this.ball = new Ball(400, 200, ((Math.random() * 3) - 1.5), 4);
    this.paddle = new Paddle(350, 100, 15);
    let newGame = new Game(this.ball, this.paddle);
    this.bricks = new Brick();
    let keyboardMonitor = new Keyboarder();
    ctx.fillStyle = '#000';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.paddle.draw(ctx);
    this.ball.draw(ctx);
    this.bricks.draw(ctx, newGame.bricks);
    this.ball.move(canvas.height, canvas.width);
    this.paddle.animate(keyboardMonitor["keyState"]);
    this.ball.dy = newGame.paddleBallColliding(this.ball, this.paddle);
    this.ball.dx = newGame.paddleBallXCheck(this.ball, this.paddle);
    this.ball.dx = newGame.brickBallSideCollision(this.ball, newGame.bricks);
    this.ball.dy = newGame.brickBallColliding(this.ball, newGame.bricks);
    if (this.ball.isDead) {
      ballDeath();
    } else {
      this.requestID = requestAnimationFrame(this.gameLoop);
    }
    if (this.checkBricks()) {
      bricks.clearBricks();
      this.generateBricks();
      this.requestID = null;
      this.restartGame();
    }
    this.delayedStart();
    this.endGame();
  }

  ballDeath(requestID) {
    if(this.requestID) {
      this.requestID = null;
      isDead = false;
      this.startGame();
    }
  }

  delayedStart(requestID) {
    if(!this.requestID) {
      window.setTimeout(this.gameLoop, 3000)
    }
  }

  checkInitials(s) {
    return /[a-z]*/gi.test(s) ? s.slice(0, 3).toUpperCase() : 'N/A';
  }

  endGame() {
    let userScores = new Scores();
    if(this.lives === 0) {
      userScores.score = this.score;
      userScores.initials = checkInitials(userScores.initials);
      newGame = new Game(bouncyBall, startPaddle);
      bricks = new Brick();
      this.generateBricks;
    }
  }

  restartGame(requestID) {
    this.requestID = null;
    bouncyBall = new Ball(400, 200, ((Math.random() * 3) - 1.5), 4);
    newGame = new Game(bouncyBall, startPaddle);
    this.generateBricks();
    this.startGame();
  }

  // gameLoop() {

    // let bouncyBall = new Ball(400, 200, ((Math.random() * 3) - 1.5), 4);
    // let startPaddle = new Paddle(350, 100, 15);
    // let newGame = new Game(bouncyBall, startPaddle);
    // let brikcs = new Brick();
    // newGame.startGame(ctx, canvas);
    // ctx.fillStyle = '#000';
    // ctx.clearReact(0, 0, canvas.width, canvas.height);
    // startPaddle.draw(ctx);
    // bouncyBall.draw(ctx);
    // bouncyBall.dy = newGame.paddleBallColliding(bouncyBall, startPaddle);
    // bouncyBall.dx = newGame.paddleBallXCheck(bouncyBall, startPaddle);
    // bouncyBall.dx = newGame.brickBallSideCollision(bouncyBall, newGame.bricks);
    // bouncyBall.dy = newGame.brickBallColliding(bouncyBall, newGame.bricks);
    // bricks.draw(ctx, this.bricks);
    // bouncyBall.move(canvas.height, canvas.width);
    // startPaddle.animate(keyState);
    // if (bouncyBall.isDead) {
    //   ballDeath();
    // } else {
    //   requestID = requestAnimationFrame(this.gameLoop);
    // }
    // if (this.checkBricks()) {
    //   bricks.clearBricks();
    //   this.generateBricks();
    //   this.requestID = null;
    //   this.startGame();
    // }
  // }

  generateBricks() {
    let bouncyBall = new Ball(400, 200, ((Math.random() * 3) - 1.5), 4);
    let startPaddle = new Paddle(350, 100, 15);
    let newGame = new Game(bouncyBall, startPaddle);
    let bricks = new Brick();
    if (this.level === 1 || this.level === 2) {
      let newBricks = bricks.createBricksLvlsOneTwo(40, newGame.level);
      newBricks.forEach( brick => newGame.grabBricks(brick) );
    } else if (newGame.level === 3) {
      let newBricks = bricks.createBricksLvlThree(54);
      newBricks.forEach( brick => newGame.grabBricks(brick) );
    }
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
