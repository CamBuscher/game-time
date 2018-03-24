/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var canvas = document.querySelector('#game-screen');
	var Paddle = __webpack_require__(1);
	var Keyboarder = __webpack_require__(2);
	var Ball = __webpack_require__(3);
	var Scores = __webpack_require__(4);
	var Game = __webpack_require__(5);
	var Brick = __webpack_require__(6);
	var ctx = canvas.getContext('2d');
	var newGame = new Game(bouncyBall, startPaddle);
	var startPaddle = new Paddle(350, 100, 15);
	var keyboardMonitor = new Keyboarder();
	var bouncyBall = new Ball(400, 200, Math.random() * 3 - 1.5, 4);
	var keyState = {};
	var bricks = new Brick();
	var requestID = undefined;
	var isDead = null;
	
	generateBricks();
	startGame();
	getFromStorage();
	
	function generateBricks() {
	  if (newGame.level === 1 || newGame.level === 2) {
	    var newBricks = newGame.createBricksLvlsOneTwo(40, newGame.level);
	    newBricks.forEach(function (brick) {
	      return newGame.grabBricks(brick);
	    });
	  } else if (newGame.level === 3) {
	    var _newBricks = newGame.createBricksLvlThree(54);
	    _newBricks.forEach(function (brick) {
	      return newGame.grabBricks(brick);
	    });
	  }
	}
	
	window.addEventListener('keydown', function (e) {
	  keyState = keyboardMonitor.keyDown(e);
	});
	
	window.addEventListener('keyup', function (e) {
	  keyState = keyboardMonitor.keyUp(e);
	});
	
	document.querySelector('.new-game-button').addEventListener('click', restartGame);
	
	function gameLoop() {
	  document.getElementById('user-score').innerHTML = newGame.score;
	  document.querySelector('.lives-indicator').innerHTML = newGame.lives;
	  ctx.fillStyle = '#000';
	  ctx.clearRect(0, 0, canvas.width, canvas.height);
	  startPaddle.draw(ctx);
	  bouncyBall.draw(ctx);
	  bouncyBall.dy = newGame.paddleBallColliding(bouncyBall, startPaddle);
	  bouncyBall.dx = newGame.paddleBallXCheck(bouncyBall, startPaddle);
	  bouncyBall.dx = newGame.brickBallSideCollision(bouncyBall, newGame.bricks);
	  bouncyBall.dy = newGame.brickBallColliding(bouncyBall, newGame.bricks);
	  bricks.draw(ctx, newGame.bricks);
	  bouncyBall.move(canvas.height, canvas.width);
	  startPaddle.animate(keyState);
	  isDead = newGame.checkBallDeath(bouncyBall, canvas.height);
	  if (isDead) {
	    ballDeath();
	  } else {
	    requestID = requestAnimationFrame(gameLoop);
	  }
	  if (newGame.checkBricks()) {
	    bricks.clearBricks();
	    generateBricks();
	    window.cancelAnimationFrame(requestID);
	    requestID = null;
	    startGame();
	  }
	}
	
	function restartGame() {
	  window.cancelAnimationFrame(requestID);
	  requestID = null;
	  newGame.bricks = bricks.clearBricks();
	  bouncyBall = new Ball(400, 200, Math.random() * 3 - 1.5, 4);
	  newGame = new Game(bouncyBall, startPaddle);
	  generateBricks();
	  startGame();
	}
	
	function startGame() {
	  ctx.fillStyle = '#000';
	  ctx.clearRect(0, 0, canvas.width, canvas.height);
	  bouncyBall = new Ball(400, 200, Math.random() * 3 - 1.5, 4);
	  startPaddle = new Paddle(350, 100, 15);
	  startPaddle.draw(ctx);
	  bouncyBall.draw(ctx);
	  bricks.draw(ctx, newGame.bricks);
	  delayedStart();
	  endGame();
	}
	
	function delayedStart() {
	  if (!requestID) {
	    window.setTimeout(gameLoop, 3000);
	  }
	}
	
	function endGame() {
	  var userScores = new Scores();
	  if (newGame.lives === 0) {
	    document.getElementById('user-score').innerHTML = 0;
	    userScores.initials = prompt('Enter your initials!', '');
	    userScores.score = newGame.score;
	    userScores.initials = checkInitials(userScores.initials);
	    scoreToStorage(userScores);
	    getFromStorage(userScores);
	    newGame = new Game(bouncyBall, startPaddle);
	    bricks = new Brick();
	    generateBricks();
	  }
	}
	
	function ballDeath() {
	  if (requestID) {
	    window.cancelAnimationFrame(requestID);
	    requestID = null;
	    isDead = false;
	    var livesIndicator = document.querySelector('.lives-indicator');
	    livesIndicator.innerText = newGame.lives;
	    startGame();
	  }
	}
	
	var checkInitials = function checkInitials(s) {
	  return (/[a-z]*/gi.test(s) ? s.slice(0, 3).toUpperCase() : 'N/A'
	  );
	};
	
	function scoreToStorage(scores) {
	  var storeScores = scores;
	  var stringifyScores = JSON.stringify(storeScores);
	  localStorage.setItem(scores.id, stringifyScores);
	}
	
	function getFromStorage(scores) {
	  var topScores = [];
	  for (var i = 0; i < localStorage.length; i++) {
	    var retrievedItem = localStorage.getItem(localStorage.key(i));
	    var parsedItem = JSON.parse(retrievedItem);
	    topScores.push(parsedItem);
	  }
	  topScores.sort(function (a, b) {
	    return b.score - a.score;
	  });
	  topScores.splice(10, 1000);
	  for (var _i = 0; _i < topScores.length; _i++) {
	    var initials = topScores[_i].initials;
	    var score = topScores[_i].score;
	    var HTMLInitials = 'high-initials-' + (_i + 1);
	    var HTMLScores = 'high-score-' + (_i + 1);
	    document.querySelector('.' + HTMLInitials).innerHTML = initials;
	    document.querySelector('.' + HTMLScores).innerHTML = score;
	  }
	}

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	"use strict";
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Paddle = function () {
	  function Paddle(x, width, height) {
	    _classCallCheck(this, Paddle);
	
	    this.y = 475;
	    this.x = x;
	    this.width = width;
	    this.height = height;
	  }
	
	  _createClass(Paddle, [{
	    key: "draw",
	    value: function draw(context) {
	      context.fillRect(this.x, this.y, this.width, this.height);
	    }
	  }, {
	    key: "animate",
	    value: function animate(keyState) {
	      if (keyState[37] && this.x > 0) {
	        this.x -= 5;
	      } else if (keyState[39] && this.x < 700) {
	        this.x += 5;
	      }
	    }
	  }]);
	
	  return Paddle;
	}();
	
	module.exports = Paddle;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	"use strict";
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Keyboarder = function () {
	  function Keyboarder() {
	    _classCallCheck(this, Keyboarder);
	
	    this.keys = {
	      left: 37,
	      right: 39
	    };
	  }
	
	  _createClass(Keyboarder, [{
	    key: "keyDown",
	    value: function keyDown(e) {
	      var keyState = {};
	      keyState[e.keyCode] = true;
	      return keyState;
	    }
	  }, {
	    key: "keyUp",
	    value: function keyUp(e) {
	      var keyState = {};
	      keyState[e.keyCode] = false;
	      return keyState;
	    }
	  }]);
	
	  return Keyboarder;
	}();
	
	module.exports = Keyboarder;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	"use strict";
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Ball = function () {
	  function Ball(x, y, dx, dy) {
	    _classCallCheck(this, Ball);
	
	    this.x = x;
	    this.y = y;
	    this.dx = dx;
	    this.dy = dy;
	    this.radius = 5;
	    this.width = this.radius * 2;
	    this.height = this.radius * 2;
	  }
	
	  _createClass(Ball, [{
	    key: "draw",
	    value: function draw(context) {
	      context.beginPath();
	      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
	      context.stroke();
	      context.fillStyle = "#000";
	      context.fill();
	    }
	  }, {
	    key: "move",
	    value: function move(canvasHeight, canvasWidth) {
	      if (this.x + this.radius >= canvasWidth || this.x - this.radius <= 0) {
	        this.dx = -this.dx;
	      }
	      if (this.y - this.radius <= 0) {
	        this.dy = -this.dy;
	      }
	      this.y += this.dy;
	      this.x += this.dx;
	    }
	  }]);
	
	  return Ball;
	}();
	
	module.exports = Ball;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Scores = function Scores() {
	  _classCallCheck(this, Scores);
	
	  this.score = 0;
	  this.initials = 'XXX';
	  this.id = Date.now();
	};
	
	module.exports = Scores;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Brick = __webpack_require__(6);
	
	var Game = function () {
	  function Game(ball, paddle) {
	    _classCallCheck(this, Game);
	
	    this.bricks = [];
	    this.discardedBricks = [];
	    this.balls = [ball];
	    this.paddle = paddle;
	    this.level = 1;
	    this.lives = 3;
	    this.score = 0;
	  }
	
	  _createClass(Game, [{
	    key: 'createBricksLvlsOneTwo',
	    value: function createBricksLvlsOneTwo(numBricks, level) {
	      var bricksArray = [];
	      for (var i = 0; i < numBricks; i++) {
	        if (i <= 9) {
	          var x = 2.5 + i * 75 + i * 5;
	          var y = 15;
	          bricksArray.push(new Brick(x, y));
	        } else if (i <= 19) {
	          var _x = 2.5 + (i - 10) * 75 + (i - 10) * 5;
	          var _y = 45;
	          bricksArray.push(new Brick(_x, _y));
	        } else if (i <= 29) {
	          var _x2 = 2.5 + (i - 20) * 75 + (i - 20) * 5;
	          var _y2 = 75;
	          bricksArray.push(new Brick(_x2, _y2));
	        } else if (i <= 39) {
	          var _x3 = 2.5 + (i - 30) * 75 + (i - 30) * 5;
	          var _y3 = 105;
	          if (level === 2) {
	            var health = 2;
	            bricksArray.push(new StrongerBrick(_x3, _y3, health));
	          }
	        }
	      }return bricksArray;
	    }
	  }, {
	    key: 'createBricksLvlThree',
	    value: function createBricksLvlThree(numBricks) {
	      var bricksArray = [];
	      for (var i = 0; i < numBricks; i++) {
	        if (i <= 8) {
	          var x = 45 + i * 75 + i * 5;
	          var y = 25;
	          var health = 2;
	          bricksArray.push(new StrongerBrick(x, y, health));
	        } else if (i <= 17) {
	          var _x4 = 45 + (i - 9) * 75 + (i - 9) * 5;
	          var _y4 = 55;
	          bricksArray.push(new Brick(_x4, _y4));
	        } else if (i <= 26) {
	          var _x5 = 45 + (i - 18) * 75 + (i - 18) * 5;
	          var _y5 = 85;
	          var _health = 2;
	          bricksArray.push(new StrongerBrick(_x5, _y5, _health));
	        } else if (i <= 35) {
	          var _x6 = 45 + (i - 27) * 75 + (i - 27) * 5;
	          var _y6 = 115;
	          var _health2 = 2;
	          bricksArray.push(new StrongerBrick(_x6, _y6, _health2));
	        } else if (i <= 44) {
	          var _x7 = 45 + (i - 36) * 75 + (i - 36) * 5;
	          var _y7 = 145;
	          bricksArray.push(new Brick(_x7, _y7));
	        } else if (i <= 53) {
	          var _x8 = 45 + (i - 45) * 75 + (i - 45) * 5;
	          var _y8 = 175;
	          var _health3 = 2;
	          bricksArray.push(new StrongerBrick(_x8, _y8, _health3));
	        }
	      }
	      bricksArray = bricksArray.filter(function (brick) {
	        return brick.x !== 365;
	      });
	      return bricksArray;
	    }
	  }, {
	    key: 'collisionCheck',
	    value: function collisionCheck(obj1, obj2) {
	      if (obj1.x < obj2.x + obj2.width && obj1.x + obj1.width > obj2.x && obj1.y < obj2.y + obj2.height && obj1.y + obj1.height > obj2.y) {
	        return true;
	      } else {
	        return false;
	      }
	    }
	  }, {
	    key: 'paddleBallColliding',
	    value: function paddleBallColliding(ball, paddle) {
	      var areColliding = this.collisionCheck(ball, paddle);
	      var dy = ball.dy;
	      if (areColliding) {
	        return dy = -dy;
	      } else {
	        return dy;
	      }
	    }
	  }, {
	    key: 'paddleBallXCheck',
	    value: function paddleBallXCheck(ball, paddle) {
	      var areColliding = this.collisionCheck(ball, paddle);
	      var paddleFirstFifth = paddle.x + paddle.width / 5;
	      var paddleSecondFifth = paddle.x + paddle.width / 5 * 2;
	      var paddleThirdFifth = paddle.x + paddle.width / 5 * 4;
	      var paddleFourthFifth = paddle.x + paddle.width;
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
	      return ball.dx;
	    }
	  }, {
	    key: 'grabBricks',
	    value: function grabBricks(bricks) {
	      this.bricks.push(bricks);
	    }
	  }, {
	    key: 'brickBallColliding',
	    value: function brickBallColliding(ball, bricks) {
	      var dy = ball.dy;
	      bricks.forEach(function (brick) {
	        var index = this.bricks.indexOf(brick);
	        var areColliding = this.collisionCheck(ball, brick);
	        if (areColliding) {
	          this.score += 100;
	          if (brick.health === 1) {
	            var _index = this.bricks.indexOf(brick);
	            this.discardedBricks = this.bricks.splice(_index, 1);
	          }
	          brick.health--;
	          if (ball.x < brick.x + brick.width && ball.x > brick.x) {
	            return dy = -dy;
	          } else {
	            return dy;
	          }
	        }
	      }.bind(this));
	      return dy;
	    }
	  }, {
	    key: 'checkBricks',
	    value: function checkBricks() {
	      if (this.bricks.length === 0) {
	        this.level++;
	        return true;
	      }
	    }
	  }, {
	    key: 'brickBallSideCollision',
	    value: function brickBallSideCollision(ball, bricks) {
	      bricks.forEach(function (brick) {
	        var areColliding = this.collisionCheck(ball, brick);
	        if (areColliding) {
	          if (ball.x <= brick.x || ball.x >= brick.x + brick.width) {
	            ball.dx = -ball.dx;
	          }
	        }
	      }.bind(this));
	      return ball.dx;
	    }
	  }, {
	    key: 'checkBallDeath',
	    value: function checkBallDeath(ball, canvasHeight) {
	      if (ball.y >= canvasHeight) {
	        this.lives -= 1;
	        return true;
	      } else {
	        return false;
	      }
	    }
	  }]);
	
	  return Game;
	}();
	
	module.exports = Game;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Brick = function () {
	  function Brick(x, y) {
	    _classCallCheck(this, Brick);
	
	    this.x = x;
	    this.y = y;
	    this.health = 1;
	    this.width = 75;
	    this.height = 25;
	  }
	
	  // createBricksLvlsOneTwo(numBricks, level) {
	  //   let bricksArray = [];
	  //     for (var i = 0; i < numBricks; i++) {
	  //       if (i <= 9) {
	  //         let x = 2.5 + (i * 75) + (i * 5);
	  //         let y = 15;
	  //         bricksArray.push(new Brick(x, y));
	  //       } else if (i <= 19) {
	  //         let x = 2.5 + ((i - 10) * 75) + ((i - 10) * 5);
	  //         let y = 45;
	  //         bricksArray.push(new Brick(x, y));
	  //       } else if (i <= 29) {
	  //         let x = 2.5 + ((i - 20) * 75) + ((i - 20) * 5);
	  //         let y = 75;
	  //         bricksArray.push(new Brick(x, y));
	  //       } else if (i <= 39) {
	  //         let x = 2.5 + ((i - 30) * 75) + ((i - 30) * 5);
	  //         let y = 105;
	  //         if (level === 2) {
	  //           let health = 2;
	  //           bricksArray.push(new StrongerBrick(x, y, health))
	  //         }
	  //       }
	  //     } return bricksArray;
	  //   };
	
	  // createBricksLvlThree(numBricks) {
	  //   let bricksArray = []
	  //   for (var i = 0; i < numBricks; i++) {
	  //     if (i <= 8) {
	  //       let x = 45 + (i * 75) + (i * 5);
	  //       let y = 25;
	  //       let health = 2;
	  //       bricksArray.push(new StrongerBrick(x, y, health));
	  //     } else if (i <= 17) {
	  //       let x = 45 + ((i - 9) * 75) + ((i - 9) * 5);
	  //       let y = 55;
	  //       bricksArray.push(new Brick(x, y));
	  //     } else if (i <= 26) {
	  //       let x = 45 + ((i - 18) * 75) + ((i - 18) * 5);
	  //       let y = 85;
	  //       let health = 2;
	  //       bricksArray.push(new StrongerBrick(x, y, health));
	  //     } else if (i <= 35) {
	  //       let x = 45 + ((i - 27) * 75) + ((i - 27) * 5);
	  //       let y = 115;
	  //       let health = 2;
	  //       bricksArray.push(new StrongerBrick(x, y, health));
	  //     } else if (i <= 44) {
	  //       let x = 45 + ((i - 36) * 75) + ((i - 36) * 5);
	  //       let y = 145;
	  //       bricksArray.push(new Brick(x, y))
	  //     } else if (i <= 53) {
	  //       let x = 45 + ((i - 45) * 75) + ((i - 45) * 5);
	  //       let y = 175;
	  //       let health = 2;
	  //       bricksArray.push(new StrongerBrick(x, y, health));
	  //     }
	  //   }
	  //   bricksArray = bricksArray.filter(brick => brick.x !== 365);
	  //   return bricksArray;
	  // }
	
	  _createClass(Brick, [{
	    key: 'clearBricks',
	    value: function clearBricks() {
	      var bricksArray = [];
	      return bricksArray;
	    }
	  }, {
	    key: 'draw',
	    value: function draw(context, bricks) {
	      for (var i = 0; i < bricks.length; i++) {
	        var _bricks$i = bricks[i],
	            x = _bricks$i.x,
	            y = _bricks$i.y,
	            width = _bricks$i.width,
	            height = _bricks$i.height;
	
	        if (bricks[i].health === 2) {
	          context.fillStyle = '#360600';
	        } else if (bricks[i].health === 1) {
	          context.fillStyle = '#FC0009';
	        }
	        context.fillRect(x, y, width, height);
	      }
	    }
	  }]);
	
	  return Brick;
	}();
	
	var StrongerBrick = function (_Brick) {
	  _inherits(StrongerBrick, _Brick);
	
	  function StrongerBrick(x, y, health) {
	    _classCallCheck(this, StrongerBrick);
	
	    var _this = _possibleConstructorReturn(this, (StrongerBrick.__proto__ || Object.getPrototypeOf(StrongerBrick)).call(this, x, y));
	
	    _this.health = health;
	    return _this;
	  }
	
	  return StrongerBrick;
	}(Brick);
	
	module.exports = Brick;

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNDBjZTdiYTNjYmM5NmE4MmE0NWMiLCJ3ZWJwYWNrOi8vLy4vbGliL2luZGV4LmpzIiwid2VicGFjazovLy8uL2xpYi9QYWRkbGUuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL0tleWJvYXJkZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL0JhbGwuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL1Njb3Jlcy5qcyIsIndlYnBhY2s6Ly8vLi9saWIvR2FtZS5qcyIsIndlYnBhY2s6Ly8vLi9saWIvQnJpY2suanMiXSwibmFtZXMiOlsiY2FudmFzIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiUGFkZGxlIiwicmVxdWlyZSIsIktleWJvYXJkZXIiLCJCYWxsIiwiU2NvcmVzIiwiR2FtZSIsIkJyaWNrIiwiY3R4IiwiZ2V0Q29udGV4dCIsIm5ld0dhbWUiLCJib3VuY3lCYWxsIiwic3RhcnRQYWRkbGUiLCJrZXlib2FyZE1vbml0b3IiLCJNYXRoIiwicmFuZG9tIiwia2V5U3RhdGUiLCJicmlja3MiLCJyZXF1ZXN0SUQiLCJ1bmRlZmluZWQiLCJpc0RlYWQiLCJnZW5lcmF0ZUJyaWNrcyIsInN0YXJ0R2FtZSIsImdldEZyb21TdG9yYWdlIiwibGV2ZWwiLCJuZXdCcmlja3MiLCJjcmVhdGVCcmlja3NMdmxzT25lVHdvIiwiZm9yRWFjaCIsImdyYWJCcmlja3MiLCJicmljayIsImNyZWF0ZUJyaWNrc0x2bFRocmVlIiwid2luZG93IiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJrZXlEb3duIiwia2V5VXAiLCJyZXN0YXJ0R2FtZSIsImdhbWVMb29wIiwiZ2V0RWxlbWVudEJ5SWQiLCJpbm5lckhUTUwiLCJzY29yZSIsImxpdmVzIiwiZmlsbFN0eWxlIiwiY2xlYXJSZWN0Iiwid2lkdGgiLCJoZWlnaHQiLCJkcmF3IiwiZHkiLCJwYWRkbGVCYWxsQ29sbGlkaW5nIiwiZHgiLCJwYWRkbGVCYWxsWENoZWNrIiwiYnJpY2tCYWxsU2lkZUNvbGxpc2lvbiIsImJyaWNrQmFsbENvbGxpZGluZyIsIm1vdmUiLCJhbmltYXRlIiwiY2hlY2tCYWxsRGVhdGgiLCJiYWxsRGVhdGgiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJjaGVja0JyaWNrcyIsImNsZWFyQnJpY2tzIiwiY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJkZWxheWVkU3RhcnQiLCJlbmRHYW1lIiwic2V0VGltZW91dCIsInVzZXJTY29yZXMiLCJpbml0aWFscyIsInByb21wdCIsImNoZWNrSW5pdGlhbHMiLCJzY29yZVRvU3RvcmFnZSIsImxpdmVzSW5kaWNhdG9yIiwiaW5uZXJUZXh0IiwidGVzdCIsInMiLCJzbGljZSIsInRvVXBwZXJDYXNlIiwic2NvcmVzIiwic3RvcmVTY29yZXMiLCJzdHJpbmdpZnlTY29yZXMiLCJKU09OIiwic3RyaW5naWZ5IiwibG9jYWxTdG9yYWdlIiwic2V0SXRlbSIsImlkIiwidG9wU2NvcmVzIiwiaSIsImxlbmd0aCIsInJldHJpZXZlZEl0ZW0iLCJnZXRJdGVtIiwia2V5IiwicGFyc2VkSXRlbSIsInBhcnNlIiwicHVzaCIsInNvcnQiLCJhIiwiYiIsInNwbGljZSIsIkhUTUxJbml0aWFscyIsIkhUTUxTY29yZXMiLCJ4IiwieSIsImNvbnRleHQiLCJmaWxsUmVjdCIsIm1vZHVsZSIsImV4cG9ydHMiLCJrZXlzIiwibGVmdCIsInJpZ2h0Iiwia2V5Q29kZSIsInJhZGl1cyIsImJlZ2luUGF0aCIsImFyYyIsIlBJIiwic3Ryb2tlIiwiZmlsbCIsImNhbnZhc0hlaWdodCIsImNhbnZhc1dpZHRoIiwiRGF0ZSIsIm5vdyIsImJhbGwiLCJwYWRkbGUiLCJkaXNjYXJkZWRCcmlja3MiLCJiYWxscyIsIm51bUJyaWNrcyIsImJyaWNrc0FycmF5IiwiaGVhbHRoIiwiU3Ryb25nZXJCcmljayIsImZpbHRlciIsIm9iajEiLCJvYmoyIiwiYXJlQ29sbGlkaW5nIiwiY29sbGlzaW9uQ2hlY2siLCJwYWRkbGVGaXJzdEZpZnRoIiwicGFkZGxlU2Vjb25kRmlmdGgiLCJwYWRkbGVUaGlyZEZpZnRoIiwicGFkZGxlRm91cnRoRmlmdGgiLCJpbmRleCIsImluZGV4T2YiLCJiaW5kIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7O0FDdENBLEtBQU1BLFNBQVNDLFNBQVNDLGFBQVQsQ0FBdUIsY0FBdkIsQ0FBZjtBQUNBLEtBQU1DLFNBQVMsbUJBQUFDLENBQVEsQ0FBUixDQUFmO0FBQ0EsS0FBTUMsYUFBYSxtQkFBQUQsQ0FBUSxDQUFSLENBQW5CO0FBQ0EsS0FBTUUsT0FBTyxtQkFBQUYsQ0FBUSxDQUFSLENBQWI7QUFDQSxLQUFNRyxTQUFTLG1CQUFBSCxDQUFRLENBQVIsQ0FBZjtBQUNBLEtBQU1JLE9BQU8sbUJBQUFKLENBQVEsQ0FBUixDQUFiO0FBQ0EsS0FBTUssUUFBUSxtQkFBQUwsQ0FBUSxDQUFSLENBQWQ7QUFDQSxLQUFJTSxNQUFNVixPQUFPVyxVQUFQLENBQWtCLElBQWxCLENBQVY7QUFDQSxLQUFJQyxVQUFVLElBQUlKLElBQUosQ0FBU0ssVUFBVCxFQUFxQkMsV0FBckIsQ0FBZDtBQUNBLEtBQUlBLGNBQWMsSUFBSVgsTUFBSixDQUFXLEdBQVgsRUFBZ0IsR0FBaEIsRUFBcUIsRUFBckIsQ0FBbEI7QUFDQSxLQUFJWSxrQkFBa0IsSUFBSVYsVUFBSixFQUF0QjtBQUNBLEtBQUlRLGFBQWEsSUFBSVAsSUFBSixDQUFTLEdBQVQsRUFBYyxHQUFkLEVBQXFCVSxLQUFLQyxNQUFMLEtBQWdCLENBQWpCLEdBQXNCLEdBQTFDLEVBQWdELENBQWhELENBQWpCO0FBQ0EsS0FBSUMsV0FBVyxFQUFmO0FBQ0EsS0FBSUMsU0FBUyxJQUFJVixLQUFKLEVBQWI7QUFDQSxLQUFJ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aW4uYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNDBjZTdiYTNjYmM5NmE4MmE0NWMiLCJjb25zdCBjYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZ2FtZS1zY3JlZW4nKTtcbmNvbnN0IFBhZGRsZSA9IHJlcXVpcmUoJy4vUGFkZGxlJyk7XG5jb25zdCBLZXlib2FyZGVyID0gcmVxdWlyZSgnLi9LZXlib2FyZGVyJyk7XG5jb25zdCBCYWxsID0gcmVxdWlyZSgnLi9CYWxsLmpzJyk7XG5jb25zdCBTY29yZXMgPSByZXF1aXJlKCcuL1Njb3Jlcy5qcycpO1xuY29uc3QgR2FtZSA9IHJlcXVpcmUoJy4vR2FtZS5qcycpO1xuY29uc3QgQnJpY2sgPSByZXF1aXJlKCcuL0JyaWNrLmpzJyk7XG5sZXQgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5sZXQgbmV3R2FtZSA9IG5ldyBHYW1lKGJvdW5jeUJhbGwsIHN0YXJ0UGFkZGxlKTtcbmxldCBzdGFydFBhZGRsZSA9IG5ldyBQYWRkbGUoMzUwLCAxMDAsIDE1KTtcbmxldCBrZXlib2FyZE1vbml0b3IgPSBuZXcgS2V5Ym9hcmRlcigpO1xubGV0IGJvdW5jeUJhbGwgPSBuZXcgQmFsbCg0MDAsIDIwMCwgKChNYXRoLnJhbmRvbSgpICogMykgLSAxLjUpLCA0KTtcbmxldCBrZXlTdGF0ZSA9IHt9O1xubGV0IGJyaWNrcyA9IG5ldyBCcmljaygpO1xubGV0IHJlcXVlc3RJRCA9IHVuZGVmaW5lZDtcbmxldCBpc0RlYWQgPSBudWxsO1xuXG5nZW5lcmF0ZUJyaWNrcygpO1xuc3RhcnRHYW1lKCk7XG5nZXRGcm9tU3RvcmFnZSgpO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZUJyaWNrcygpIHtcbiAgaWYgKG5ld0dhbWUubGV2ZWwgPT09IDEgfHwgbmV3R2FtZS5sZXZlbCA9PT0gMikge1xuICAgIGxldCBuZXdCcmlja3MgPSBuZXdHYW1lLmNyZWF0ZUJyaWNrc0x2bHNPbmVUd28oNDAsIG5ld0dhbWUubGV2ZWwpO1xuICAgIG5ld0JyaWNrcy5mb3JFYWNoKCBicmljayA9PiBuZXdHYW1lLmdyYWJCcmlja3MoYnJpY2spICk7XG4gIH0gZWxzZSBpZiAobmV3R2FtZS5sZXZlbCA9PT0gMykge1xuICAgIGxldCBuZXdCcmlja3MgPSBuZXdHYW1lLmNyZWF0ZUJyaWNrc0x2bFRocmVlKDU0KTtcbiAgICBuZXdCcmlja3MuZm9yRWFjaCggYnJpY2sgPT4gbmV3R2FtZS5ncmFiQnJpY2tzKGJyaWNrKSApO1xuICB9XG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZnVuY3Rpb24oZSkge1xuICBrZXlTdGF0ZSA9IGtleWJvYXJkTW9uaXRvci5rZXlEb3duKGUpO1xufSk7XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGZ1bmN0aW9uKGUpIHtcbiAga2V5U3RhdGUgPSBrZXlib2FyZE1vbml0b3Iua2V5VXAoZSk7XG59KTtcblxuZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5ldy1nYW1lLWJ1dHRvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcmVzdGFydEdhbWUpO1xuXG5mdW5jdGlvbiBnYW1lTG9vcCgpIHtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VzZXItc2NvcmUnKS5pbm5lckhUTUwgPSBuZXdHYW1lLnNjb3JlO1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubGl2ZXMtaW5kaWNhdG9yJykuaW5uZXJIVE1MID0gbmV3R2FtZS5saXZlcztcbiAgY3R4LmZpbGxTdHlsZSA9ICcjMDAwJztcbiAgY3R4LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuICBzdGFydFBhZGRsZS5kcmF3KGN0eCk7XG4gIGJvdW5jeUJhbGwuZHJhdyhjdHgpO1xuICBib3VuY3lCYWxsLmR5ID0gbmV3R2FtZS5wYWRkbGVCYWxsQ29sbGlkaW5nKGJvdW5jeUJhbGwsIHN0YXJ0UGFkZGxlKTtcbiAgYm91bmN5QmFsbC5keCA9IG5ld0dhbWUucGFkZGxlQmFsbFhDaGVjayhib3VuY3lCYWxsLCBzdGFydFBhZGRsZSk7XG4gIGJvdW5jeUJhbGwuZHggPSBuZXdHYW1lLmJyaWNrQmFsbFNpZGVDb2xsaXNpb24oYm91bmN5QmFsbCwgbmV3R2FtZS5icmlja3MpO1xuICBib3VuY3lCYWxsLmR5ID0gbmV3R2FtZS5icmlja0JhbGxDb2xsaWRpbmcoYm91bmN5QmFsbCwgbmV3R2FtZS5icmlja3MpO1xuICBicmlja3MuZHJhdyhjdHgsIG5ld0dhbWUuYnJpY2tzKTtcbiAgYm91bmN5QmFsbC5tb3ZlKGNhbnZhcy5oZWlnaHQsIGNhbnZhcy53aWR0aCk7XG4gIHN0YXJ0UGFkZGxlLmFuaW1hdGUoa2V5U3RhdGUpO1xuICBpc0RlYWQgPSBuZXdHYW1lLmNoZWNrQmFsbERlYXRoKGJvdW5jeUJhbGwsIGNhbnZhcy5oZWlnaHQpO1xuICBpZiAoaXNEZWFkKSB7XG4gICAgYmFsbERlYXRoKCk7XG4gIH0gZWxzZSB7XG4gICAgcmVxdWVzdElEID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGdhbWVMb29wKTtcbiAgfVxuICBpZiAobmV3R2FtZS5jaGVja0JyaWNrcygpKSB7XG4gICAgYnJpY2tzLmNsZWFyQnJpY2tzKCk7XG4gICAgZ2VuZXJhdGVCcmlja3MoKTtcbiAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUocmVxdWVzdElEKTtcbiAgICByZXF1ZXN0SUQgPSBudWxsO1xuICAgIHN0YXJ0R2FtZSgpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlc3RhcnRHYW1lKCkge1xuICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUocmVxdWVzdElEKTtcbiAgcmVxdWVzdElEID0gbnVsbDtcbiAgbmV3R2FtZS5icmlja3MgPSBicmlja3MuY2xlYXJCcmlja3MoKTtcbiAgYm91bmN5QmFsbCA9IG5ldyBCYWxsKDQwMCwgMjAwLCAoKE1hdGgucmFuZG9tKCkgKiAzKSAtIDEuNSksIDQpO1xuICBuZXdHYW1lID0gbmV3IEdhbWUoYm91bmN5QmFsbCwgc3RhcnRQYWRkbGUpO1xuICBnZW5lcmF0ZUJyaWNrcygpO1xuICBzdGFydEdhbWUoKTtcbn1cblxuZnVuY3Rpb24gc3RhcnRHYW1lKCkge1xuICBjdHguZmlsbFN0eWxlID0gJyMwMDAnO1xuICBjdHguY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4gIGJvdW5jeUJhbGwgPSBuZXcgQmFsbCg0MDAsIDIwMCwgKChNYXRoLnJhbmRvbSgpICogMykgLSAxLjUpLCA0KTtcbiAgc3RhcnRQYWRkbGUgPSBuZXcgUGFkZGxlKDM1MCwgMTAwLCAxNSk7XG4gIHN0YXJ0UGFkZGxlLmRyYXcoY3R4KTtcbiAgYm91bmN5QmFsbC5kcmF3KGN0eCk7XG4gIGJyaWNrcy5kcmF3KGN0eCwgbmV3R2FtZS5icmlja3MpO1xuICBkZWxheWVkU3RhcnQoKTtcbiAgZW5kR2FtZSgpO1xufVxuXG5mdW5jdGlvbiBkZWxheWVkU3RhcnQoKSB7XG4gIGlmKCFyZXF1ZXN0SUQpIHtcbiAgICB3aW5kb3cuc2V0VGltZW91dChnYW1lTG9vcCwgMzAwMCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZW5kR2FtZSgpIHtcbiAgbGV0IHVzZXJTY29yZXMgPSBuZXcgU2NvcmVzKCk7XG4gIGlmKG5ld0dhbWUubGl2ZXMgPT09IDApIHtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXNlci1zY29yZScpLmlubmVySFRNTCA9IDA7XG4gICAgdXNlclNjb3Jlcy5pbml0aWFscyA9IHByb21wdCgnRW50ZXIgeW91ciBpbml0aWFscyEnLCAnJyk7XG4gICAgdXNlclNjb3Jlcy5zY29yZSA9IG5ld0dhbWUuc2NvcmU7XG4gICAgdXNlclNjb3Jlcy5pbml0aWFscyA9IGNoZWNrSW5pdGlhbHModXNlclNjb3Jlcy5pbml0aWFscyk7XG4gICAgc2NvcmVUb1N0b3JhZ2UodXNlclNjb3Jlcyk7XG4gICAgZ2V0RnJvbVN0b3JhZ2UodXNlclNjb3Jlcyk7XG4gICAgbmV3R2FtZSA9IG5ldyBHYW1lKGJvdW5jeUJhbGwsIHN0YXJ0UGFkZGxlKTtcbiAgICBicmlja3MgPSBuZXcgQnJpY2soKTtcbiAgICBnZW5lcmF0ZUJyaWNrcygpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGJhbGxEZWF0aCgpIHtcbiAgaWYocmVxdWVzdElEKSB7XG4gICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKHJlcXVlc3RJRCk7XG4gICAgcmVxdWVzdElEID0gbnVsbDtcbiAgICBpc0RlYWQgPSBmYWxzZTtcbiAgICBsZXQgbGl2ZXNJbmRpY2F0b3IgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubGl2ZXMtaW5kaWNhdG9yJyk7XG4gICAgbGl2ZXNJbmRpY2F0b3IuaW5uZXJUZXh0ID0gbmV3R2FtZS5saXZlcztcbiAgICBzdGFydEdhbWUoKTtcbiAgfVxufVxuXG5jb25zdCBjaGVja0luaXRpYWxzID0gcyA9PiAvW2Etel0qL2dpLnRlc3QocykgPyBzLnNsaWNlKDAsIDMpLnRvVXBwZXJDYXNlKCkgOiAnTi9BJztcblxuZnVuY3Rpb24gc2NvcmVUb1N0b3JhZ2Uoc2NvcmVzKSB7XG4gIGxldCBzdG9yZVNjb3JlcyA9IHNjb3JlcztcbiAgbGV0IHN0cmluZ2lmeVNjb3JlcyA9IEpTT04uc3RyaW5naWZ5KHN0b3JlU2NvcmVzKTtcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oc2NvcmVzLmlkLCBzdHJpbmdpZnlTY29yZXMpO1xufVxuXG5mdW5jdGlvbiBnZXRGcm9tU3RvcmFnZShzY29yZXMpIHtcbiAgbGV0IHRvcFNjb3JlcyA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGxvY2FsU3RvcmFnZS5sZW5ndGg7IGkrKyl7XG4gICAgbGV0IHJldHJpZXZlZEl0ZW0gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShsb2NhbFN0b3JhZ2Uua2V5KGkpKTtcbiAgICBsZXQgcGFyc2VkSXRlbSA9IEpTT04ucGFyc2UocmV0cmlldmVkSXRlbSk7XG4gICAgdG9wU2NvcmVzLnB1c2gocGFyc2VkSXRlbSk7XG4gIH1cbiAgdG9wU2NvcmVzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiBiLnNjb3JlIC0gYS5zY29yZTtcbiAgfSlcbiAgdG9wU2NvcmVzLnNwbGljZSgxMCwgMTAwMCk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdG9wU2NvcmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgbGV0IGluaXRpYWxzID0gdG9wU2NvcmVzW2ldLmluaXRpYWxzO1xuICAgIGxldCBzY29yZSA9IHRvcFNjb3Jlc1tpXS5zY29yZTtcbiAgICBsZXQgSFRNTEluaXRpYWxzID0gJ2hpZ2gtaW5pdGlhbHMtJyArIChpICsgMSk7XG4gICAgbGV0IEhUTUxTY29yZXMgPSAnaGlnaC1zY29yZS0nICsgKGkgKyAxKTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuJyArIEhUTUxJbml0aWFscykuaW5uZXJIVE1MID0gaW5pdGlhbHM7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLicgKyBIVE1MU2NvcmVzKS5pbm5lckhUTUwgPSBzY29yZTtcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbGliL2luZGV4LmpzIiwiY2xhc3MgUGFkZGxlIHtcbiAgY29uc3RydWN0b3IoeCwgd2lkdGgsIGhlaWdodCkge1xuICAgIHRoaXMueSA9IDQ3NTtcbiAgICB0aGlzLnggPSB4O1xuICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcbiAgfVxuICBkcmF3KGNvbnRleHQpIHtcbiAgICBjb250ZXh0LmZpbGxSZWN0KHRoaXMueCwgdGhpcy55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gIH1cbiAgYW5pbWF0ZShrZXlTdGF0ZSkge1xuICAgIGlmIChrZXlTdGF0ZVszN10gJiYgdGhpcy54ID4gMCkge1xuICAgICAgdGhpcy54IC09IDU7XG4gICAgfSBlbHNlIGlmIChrZXlTdGF0ZVszOV0gJiYgdGhpcy54IDwgNzAwKSB7XG4gICAgICB0aGlzLnggKz0gNTtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQYWRkbGU7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbGliL1BhZGRsZS5qcyIsImNsYXNzIEtleWJvYXJkZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmtleXMgPSB7XG4gICAgICBsZWZ0OiAzNyxcbiAgICAgIHJpZ2h0OiAzOSxcbiAgICB9O1xuICB9XG4gIGtleURvd24oZSkge1xuICAgIHZhciBrZXlTdGF0ZSA9IHt9O1xuICAgIGtleVN0YXRlW2Uua2V5Q29kZV0gPSB0cnVlO1xuICAgIHJldHVybiBrZXlTdGF0ZTtcbiAgfVxuXG4gIGtleVVwKGUpIHtcbiAgICB2YXIga2V5U3RhdGUgPSB7fTtcbiAgICBrZXlTdGF0ZVtlLmtleUNvZGVdID0gZmFsc2U7XG4gICAgcmV0dXJuIGtleVN0YXRlO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gS2V5Ym9hcmRlcjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2xpYi9LZXlib2FyZGVyLmpzIiwiY2xhc3MgQmFsbCB7XG4gIGNvbnN0cnVjdG9yKHgsIHksIGR4LCBkeSkge1xuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcbiAgICB0aGlzLmR4ID0gZHg7XG4gICAgdGhpcy5keSA9IGR5O1xuICAgIHRoaXMucmFkaXVzID0gNTtcbiAgICB0aGlzLndpZHRoID0gdGhpcy5yYWRpdXMgKiAyO1xuICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5yYWRpdXMgKiAyO1xuICB9XG4gIGRyYXcoY29udGV4dCkge1xuICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgY29udGV4dC5hcmModGhpcy54LCB0aGlzLnksIHRoaXMucmFkaXVzLCAwLCBNYXRoLlBJICogMiwgZmFsc2UpO1xuICAgIGNvbnRleHQuc3Ryb2tlKCk7XG4gICAgY29udGV4dC5maWxsU3R5bGUgPSBcIiMwMDBcIjtcbiAgICBjb250ZXh0LmZpbGwoKTtcbiAgfVxuICBtb3ZlKGNhbnZhc0hlaWdodCwgY2FudmFzV2lkdGgpIHtcbiAgICBpZiAoKHRoaXMueCArIHRoaXMucmFkaXVzKSA+PSBjYW52YXNXaWR0aCB8fCAodGhpcy54IC0gdGhpcy5yYWRpdXMpIDw9IDApIHtcbiAgICAgIHRoaXMuZHggPSAtdGhpcy5keDtcbiAgICB9XG4gICAgaWYgKCh0aGlzLnkgLSB0aGlzLnJhZGl1cykgPD0gMCkge1xuICAgICAgdGhpcy5keSA9IC10aGlzLmR5O1xuICAgIH1cbiAgICB0aGlzLnkgKz0gdGhpcy5keTtcbiAgICB0aGlzLnggKz0gdGhpcy5keDtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJhbGw7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9saWIvQmFsbC5qcyIsImNsYXNzIFNjb3JlcyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc2NvcmUgPSAwO1xuICAgIHRoaXMuaW5pdGlhbHMgPSAnWFhYJztcbiAgICB0aGlzLmlkID0gRGF0ZS5ub3coKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNjb3JlcztcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2xpYi9TY29yZXMuanMiLCJjb25zdCBCcmljayA9IHJlcXVpcmUoJy4vQnJpY2suanMnKTtcblxuY2xhc3MgR2FtZSB7XG4gIGNvbnN0cnVjdG9yKGJhbGwsIHBhZGRsZSkge1xuICAgIHRoaXMuYnJpY2tzID0gW107XG4gICAgdGhpcy5kaXNjYXJkZWRCcmlja3MgPSBbXTtcbiAgICB0aGlzLmJhbGxzID0gW2JhbGxdO1xuICAgIHRoaXMucGFkZGxlID0gcGFkZGxlO1xuICAgIHRoaXMubGV2ZWwgPSAxO1xuICAgIHRoaXMubGl2ZXMgPSAzO1xuICAgIHRoaXMuc2NvcmUgPSAwO1xuICB9XG5cbiAgY3JlYXRlQnJpY2tzTHZsc09uZVR3byhudW1Ccmlja3MsIGxldmVsKSB7XG4gICAgbGV0IGJyaWNrc0FycmF5ID0gW107XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bUJyaWNrczsgaSsrKSB7XG4gICAgICAgIGlmIChpIDw9IDkpIHtcbiAgICAgICAgICBsZXQgeCA9IDIuNSArIChpICogNzUpICsgKGkgKiA1KTtcbiAgICAgICAgICBsZXQgeSA9IDE1O1xuICAgICAgICAgIGJyaWNrc0FycmF5LnB1c2gobmV3IEJyaWNrKHgsIHkpKTtcbiAgICAgICAgfSBlbHNlIGlmIChpIDw9IDE5KSB7XG4gICAgICAgICAgbGV0IHggPSAyLjUgKyAoKGkgLSAxMCkgKiA3NSkgKyAoKGkgLSAxMCkgKiA1KTtcbiAgICAgICAgICBsZXQgeSA9IDQ1O1xuICAgICAgICAgIGJyaWNrc0FycmF5LnB1c2gobmV3IEJyaWNrKHgsIHkpKTtcbiAgICAgICAgfSBlbHNlIGlmIChpIDw9IDI5KSB7XG4gICAgICAgICAgbGV0IHggPSAyLjUgKyAoKGkgLSAyMCkgKiA3NSkgKyAoKGkgLSAyMCkgKiA1KTtcbiAgICAgICAgICBsZXQgeSA9IDc1O1xuICAgICAgICAgIGJyaWNrc0FycmF5LnB1c2gobmV3IEJyaWNrKHgsIHkpKTtcbiAgICAgICAgfSBlbHNlIGlmIChpIDw9IDM5KSB7XG4gICAgICAgICAgbGV0IHggPSAyLjUgKyAoKGkgLSAzMCkgKiA3NSkgKyAoKGkgLSAzMCkgKiA1KTtcbiAgICAgICAgICBsZXQgeSA9IDEwNTtcbiAgICAgICAgICBpZiAobGV2ZWwgPT09IDIpIHtcbiAgICAgICAgICAgIGxldCBoZWFsdGggPSAyO1xuICAgICAgICAgICAgYnJpY2tzQXJyYXkucHVzaChuZXcgU3Ryb25nZXJCcmljayh4LCB5LCBoZWFsdGgpKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSByZXR1cm4gYnJpY2tzQXJyYXk7XG4gICAgfTtcblxuICBjcmVhdGVCcmlja3NMdmxUaHJlZShudW1Ccmlja3MpIHtcbiAgICBsZXQgYnJpY2tzQXJyYXkgPSBbXVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtQnJpY2tzOyBpKyspIHtcbiAgICAgIGlmIChpIDw9IDgpIHtcbiAgICAgICAgbGV0IHggPSA0NSArIChpICogNzUpICsgKGkgKiA1KTtcbiAgICAgICAgbGV0IHkgPSAyNTtcbiAgICAgICAgbGV0IGhlYWx0aCA9IDI7XG4gICAgICAgIGJyaWNrc0FycmF5LnB1c2gobmV3IFN0cm9uZ2VyQnJpY2soeCwgeSwgaGVhbHRoKSk7XG4gICAgICB9IGVsc2UgaWYgKGkgPD0gMTcpIHtcbiAgICAgICAgbGV0IHggPSA0NSArICgoaSAtIDkpICogNzUpICsgKChpIC0gOSkgKiA1KTtcbiAgICAgICAgbGV0IHkgPSA1NTtcbiAgICAgICAgYnJpY2tzQXJyYXkucHVzaChuZXcgQnJpY2soeCwgeSkpO1xuICAgICAgfSBlbHNlIGlmIChpIDw9IDI2KSB7XG4gICAgICAgIGxldCB4ID0gNDUgKyAoKGkgLSAxOCkgKiA3NSkgKyAoKGkgLSAxOCkgKiA1KTtcbiAgICAgICAgbGV0IHkgPSA4NTtcbiAgICAgICAgbGV0IGhlYWx0aCA9IDI7XG4gICAgICAgIGJyaWNrc0FycmF5LnB1c2gobmV3IFN0cm9uZ2VyQnJpY2soeCwgeSwgaGVhbHRoKSk7XG4gICAgICB9IGVsc2UgaWYgKGkgPD0gMzUpIHtcbiAgICAgICAgbGV0IHggPSA0NSArICgoaSAtIDI3KSAqIDc1KSArICgoaSAtIDI3KSAqIDUpO1xuICAgICAgICBsZXQgeSA9IDExNTtcbiAgICAgICAgbGV0IGhlYWx0aCA9IDI7XG4gICAgICAgIGJyaWNrc0FycmF5LnB1c2gobmV3IFN0cm9uZ2VyQnJpY2soeCwgeSwgaGVhbHRoKSk7XG4gICAgICB9IGVsc2UgaWYgKGkgPD0gNDQpIHtcbiAgICAgICAgbGV0IHggPSA0NSArICgoaSAtIDM2KSAqIDc1KSArICgoaSAtIDM2KSAqIDUpO1xuICAgICAgICBsZXQgeSA9IDE0NTtcbiAgICAgICAgYnJpY2tzQXJyYXkucHVzaChuZXcgQnJpY2soeCwgeSkpXG4gICAgICB9IGVsc2UgaWYgKGkgPD0gNTMpIHtcbiAgICAgICAgbGV0IHggPSA0NSArICgoaSAtIDQ1KSAqIDc1KSArICgoaSAtIDQ1KSAqIDUpO1xuICAgICAgICBsZXQgeSA9IDE3NTtcbiAgICAgICAgbGV0IGhlYWx0aCA9IDI7XG4gICAgICAgIGJyaWNrc0FycmF5LnB1c2gobmV3IFN0cm9uZ2VyQnJpY2soeCwgeSwgaGVhbHRoKSk7XG4gICAgICB9XG4gICAgfVxuICAgIGJyaWNrc0FycmF5ID0gYnJpY2tzQXJyYXkuZmlsdGVyKGJyaWNrID0+IGJyaWNrLnggIT09IDM2NSk7XG4gICAgcmV0dXJuIGJyaWNrc0FycmF5O1xuICB9XG5cbiAgY29sbGlzaW9uQ2hlY2sob2JqMSwgb2JqMikge1xuICAgIGlmIChvYmoxLnggPCBvYmoyLnggKyBvYmoyLndpZHRoICAmJiBvYmoxLnggKyBvYmoxLndpZHRoICA+IG9iajIueCAmJlxuICAgICAgICBvYmoxLnkgPCBvYmoyLnkgKyBvYmoyLmhlaWdodCAmJiBvYmoxLnkgKyBvYmoxLmhlaWdodCA+IG9iajIueSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBwYWRkbGVCYWxsQ29sbGlkaW5nKGJhbGwsIHBhZGRsZSkge1xuICAgIGxldCBhcmVDb2xsaWRpbmcgPSB0aGlzLmNvbGxpc2lvbkNoZWNrKGJhbGwsIHBhZGRsZSk7XG4gICAgbGV0IGR5ID0gYmFsbC5keTtcbiAgICBpZiAoYXJlQ29sbGlkaW5nKSB7XG4gICAgICByZXR1cm4gZHkgPSAtZHk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBkeTtcbiAgICB9XG4gIH1cblxuICBwYWRkbGVCYWxsWENoZWNrKGJhbGwsIHBhZGRsZSkge1xuICAgIGxldCBhcmVDb2xsaWRpbmcgPSB0aGlzLmNvbGxpc2lvbkNoZWNrKGJhbGwsIHBhZGRsZSk7XG4gICAgbGV0IHBhZGRsZUZpcnN0RmlmdGggPSBwYWRkbGUueCArIChwYWRkbGUud2lkdGggLyA1KTtcbiAgICBsZXQgcGFkZGxlU2Vjb25kRmlmdGggPSBwYWRkbGUueCArICgocGFkZGxlLndpZHRoIC8gNSkgKiAyKTtcbiAgICBsZXQgcGFkZGxlVGhpcmRGaWZ0aCA9IHBhZGRsZS54ICsgKChwYWRkbGUud2lkdGggLyA1KSAqIDQpO1xuICAgIGxldCBwYWRkbGVGb3VydGhGaWZ0aCA9IHBhZGRsZS54ICsgcGFkZGxlLndpZHRoO1xuICAgIGlmIChhcmVDb2xsaWRpbmcpIHtcbiAgICAgIGlmIChiYWxsLnggPCBwYWRkbGVGaXJzdEZpZnRoKSB7XG4gICAgICAgIGJhbGwuZHggLT0gMztcbiAgICAgIH0gZWxzZSBpZiAoYmFsbC54IDwgcGFkZGxlU2Vjb25kRmlmdGgpIHtcbiAgICAgICAgYmFsbC5keCAtPSAxO1xuICAgICAgfSBlbHNlIGlmIChiYWxsLnggPCBwYWRkbGVUaGlyZEZpZnRoKSB7XG4gICAgICAgIGJhbGwuZHggKz0gMTtcbiAgICAgIH0gZWxzZSBpZiAoYmFsbC54IDwgcGFkZGxlRm91cnRoRmlmdGgpIHtcbiAgICAgICAgYmFsbC5keCArPSAzO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoYmFsbC5keCA+IDEwKSB7XG4gICAgICBiYWxsLmR4ID0gMTA7XG4gICAgfSBlbHNlIGlmIChiYWxsLmR4IDwgLTEwKSB7XG4gICAgICBiYWxsLmR4ID0gLTEwO1xuICAgIH1cbiAgICByZXR1cm4gYmFsbC5keFxuICB9XG5cbiAgZ3JhYkJyaWNrcyhicmlja3MpIHtcbiAgICB0aGlzLmJyaWNrcy5wdXNoKGJyaWNrcyk7XG4gIH1cblxuICBicmlja0JhbGxDb2xsaWRpbmcoYmFsbCwgYnJpY2tzKSB7XG4gICAgbGV0IGR5ID0gYmFsbC5keTtcbiAgICBicmlja3MuZm9yRWFjaChmdW5jdGlvbihicmljaykge1xuICAgICAgbGV0IGluZGV4ID0gdGhpcy5icmlja3MuaW5kZXhPZihicmljayk7XG4gICAgICBsZXQgYXJlQ29sbGlkaW5nID0gdGhpcy5jb2xsaXNpb25DaGVjayhiYWxsLCBicmljayk7XG4gICAgICBpZiAoYXJlQ29sbGlkaW5nKSB7XG4gICAgICAgIHRoaXMuc2NvcmUgKz0gMTAwO1xuICAgICAgICBpZiAoYnJpY2suaGVhbHRoID09PSAxKXtcbiAgICAgICAgICBsZXQgaW5kZXggPSB0aGlzLmJyaWNrcy5pbmRleE9mKGJyaWNrKTtcbiAgICAgICAgICB0aGlzLmRpc2NhcmRlZEJyaWNrcyA9IHRoaXMuYnJpY2tzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJpY2suaGVhbHRoLS07XG4gICAgICAgIGlmIChiYWxsLnggPCAoYnJpY2sueCArIGJyaWNrLndpZHRoKSAmJiBiYWxsLnggPiBicmljay54KSB7XG4gICAgICAgICAgcmV0dXJuIGR5ID0gLWR5O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBkeTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0uYmluZCh0aGlzKSlcbiAgICByZXR1cm4gZHk7XG4gIH1cblxuICBjaGVja0JyaWNrcygpIHtcbiAgICBpZiAodGhpcy5icmlja3MubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLmxldmVsKys7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBicmlja0JhbGxTaWRlQ29sbGlzaW9uKGJhbGwsIGJyaWNrcykge1xuICAgIGJyaWNrcy5mb3JFYWNoKGZ1bmN0aW9uKGJyaWNrKSB7XG4gICAgICBsZXQgYXJlQ29sbGlkaW5nID0gdGhpcy5jb2xsaXNpb25DaGVjayhiYWxsLCBicmljayk7XG4gICAgICBpZiAoYXJlQ29sbGlkaW5nKSB7XG4gICAgICAgIGlmIChiYWxsLnggPD0gYnJpY2sueCB8fCBiYWxsLnggPj0gKGJyaWNrLnggKyBicmljay53aWR0aCkpIHtcbiAgICAgICAgICBiYWxsLmR4ID0gLWJhbGwuZHg7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LmJpbmQodGhpcykpXG4gICAgcmV0dXJuIGJhbGwuZHg7XG4gIH1cblxuICBjaGVja0JhbGxEZWF0aChiYWxsLCBjYW52YXNIZWlnaHQpIHtcbiAgICBpZiAoYmFsbC55ID49IGNhbnZhc0hlaWdodCkge1xuICAgICAgdGhpcy5saXZlcyAtPSAxO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbGliL0dhbWUuanMiLCJjbGFzcyBCcmljayB7XG4gIGNvbnN0cnVjdG9yKHgsIHkpIHtcbiAgICB0aGlzLnggPSB4O1xuICAgIHRoaXMueSA9IHk7XG4gICAgdGhpcy5oZWFsdGggPSAxO1xuICAgIHRoaXMud2lkdGggPSA3NTtcbiAgICB0aGlzLmhlaWdodCA9IDI1O1xuICB9XG5cbiAgLy8gY3JlYXRlQnJpY2tzTHZsc09uZVR3byhudW1Ccmlja3MsIGxldmVsKSB7XG4gIC8vICAgbGV0IGJyaWNrc0FycmF5ID0gW107XG4gIC8vICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bUJyaWNrczsgaSsrKSB7XG4gIC8vICAgICAgIGlmIChpIDw9IDkpIHtcbiAgLy8gICAgICAgICBsZXQgeCA9IDIuNSArIChpICogNzUpICsgKGkgKiA1KTtcbiAgLy8gICAgICAgICBsZXQgeSA9IDE1O1xuICAvLyAgICAgICAgIGJyaWNrc0FycmF5LnB1c2gobmV3IEJyaWNrKHgsIHkpKTtcbiAgLy8gICAgICAgfSBlbHNlIGlmIChpIDw9IDE5KSB7XG4gIC8vICAgICAgICAgbGV0IHggPSAyLjUgKyAoKGkgLSAxMCkgKiA3NSkgKyAoKGkgLSAxMCkgKiA1KTtcbiAgLy8gICAgICAgICBsZXQgeSA9IDQ1O1xuICAvLyAgICAgICAgIGJyaWNrc0FycmF5LnB1c2gobmV3IEJyaWNrKHgsIHkpKTtcbiAgLy8gICAgICAgfSBlbHNlIGlmIChpIDw9IDI5KSB7XG4gIC8vICAgICAgICAgbGV0IHggPSAyLjUgKyAoKGkgLSAyMCkgKiA3NSkgKyAoKGkgLSAyMCkgKiA1KTtcbiAgLy8gICAgICAgICBsZXQgeSA9IDc1O1xuICAvLyAgICAgICAgIGJyaWNrc0FycmF5LnB1c2gobmV3IEJyaWNrKHgsIHkpKTtcbiAgLy8gICAgICAgfSBlbHNlIGlmIChpIDw9IDM5KSB7XG4gIC8vICAgICAgICAgbGV0IHggPSAyLjUgKyAoKGkgLSAzMCkgKiA3NSkgKyAoKGkgLSAzMCkgKiA1KTtcbiAgLy8gICAgICAgICBsZXQgeSA9IDEwNTtcbiAgLy8gICAgICAgICBpZiAobGV2ZWwgPT09IDIpIHtcbiAgLy8gICAgICAgICAgIGxldCBoZWFsdGggPSAyO1xuICAvLyAgICAgICAgICAgYnJpY2tzQXJyYXkucHVzaChuZXcgU3Ryb25nZXJCcmljayh4LCB5LCBoZWFsdGgpKVxuICAvLyAgICAgICAgIH1cbiAgLy8gICAgICAgfVxuICAvLyAgICAgfSByZXR1cm4gYnJpY2tzQXJyYXk7XG4gIC8vICAgfTtcblxuICAvLyBjcmVhdGVCcmlja3NMdmxUaHJlZShudW1Ccmlja3MpIHtcbiAgLy8gICBsZXQgYnJpY2tzQXJyYXkgPSBbXVxuICAvLyAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtQnJpY2tzOyBpKyspIHtcbiAgLy8gICAgIGlmIChpIDw9IDgpIHtcbiAgLy8gICAgICAgbGV0IHggPSA0NSArIChpICogNzUpICsgKGkgKiA1KTtcbiAgLy8gICAgICAgbGV0IHkgPSAyNTtcbiAgLy8gICAgICAgbGV0IGhlYWx0aCA9IDI7XG4gIC8vICAgICAgIGJyaWNrc0FycmF5LnB1c2gobmV3IFN0cm9uZ2VyQnJpY2soeCwgeSwgaGVhbHRoKSk7XG4gIC8vICAgICB9IGVsc2UgaWYgKGkgPD0gMTcpIHtcbiAgLy8gICAgICAgbGV0IHggPSA0NSArICgoaSAtIDkpICogNzUpICsgKChpIC0gOSkgKiA1KTtcbiAgLy8gICAgICAgbGV0IHkgPSA1NTtcbiAgLy8gICAgICAgYnJpY2tzQXJyYXkucHVzaChuZXcgQnJpY2soeCwgeSkpO1xuICAvLyAgICAgfSBlbHNlIGlmIChpIDw9IDI2KSB7XG4gIC8vICAgICAgIGxldCB4ID0gNDUgKyAoKGkgLSAxOCkgKiA3NSkgKyAoKGkgLSAxOCkgKiA1KTtcbiAgLy8gICAgICAgbGV0IHkgPSA4NTtcbiAgLy8gICAgICAgbGV0IGhlYWx0aCA9IDI7XG4gIC8vICAgICAgIGJyaWNrc0FycmF5LnB1c2gobmV3IFN0cm9uZ2VyQnJpY2soeCwgeSwgaGVhbHRoKSk7XG4gIC8vICAgICB9IGVsc2UgaWYgKGkgPD0gMzUpIHtcbiAgLy8gICAgICAgbGV0IHggPSA0NSArICgoaSAtIDI3KSAqIDc1KSArICgoaSAtIDI3KSAqIDUpO1xuICAvLyAgICAgICBsZXQgeSA9IDExNTtcbiAgLy8gICAgICAgbGV0IGhlYWx0aCA9IDI7XG4gIC8vICAgICAgIGJyaWNrc0FycmF5LnB1c2gobmV3IFN0cm9uZ2VyQnJpY2soeCwgeSwgaGVhbHRoKSk7XG4gIC8vICAgICB9IGVsc2UgaWYgKGkgPD0gNDQpIHtcbiAgLy8gICAgICAgbGV0IHggPSA0NSArICgoaSAtIDM2KSAqIDc1KSArICgoaSAtIDM2KSAqIDUpO1xuICAvLyAgICAgICBsZXQgeSA9IDE0NTtcbiAgLy8gICAgICAgYnJpY2tzQXJyYXkucHVzaChuZXcgQnJpY2soeCwgeSkpXG4gIC8vICAgICB9IGVsc2UgaWYgKGkgPD0gNTMpIHtcbiAgLy8gICAgICAgbGV0IHggPSA0NSArICgoaSAtIDQ1KSAqIDc1KSArICgoaSAtIDQ1KSAqIDUpO1xuICAvLyAgICAgICBsZXQgeSA9IDE3NTtcbiAgLy8gICAgICAgbGV0IGhlYWx0aCA9IDI7XG4gIC8vICAgICAgIGJyaWNrc0FycmF5LnB1c2gobmV3IFN0cm9uZ2VyQnJpY2soeCwgeSwgaGVhbHRoKSk7XG4gIC8vICAgICB9XG4gIC8vICAgfVxuICAvLyAgIGJyaWNrc0FycmF5ID0gYnJpY2tzQXJyYXkuZmlsdGVyKGJyaWNrID0+IGJyaWNrLnggIT09IDM2NSk7XG4gIC8vICAgcmV0dXJuIGJyaWNrc0FycmF5O1xuICAvLyB9XG5cbiAgY2xlYXJCcmlja3MoKSB7XG4gICAgbGV0IGJyaWNrc0FycmF5ID0gW107XG4gICAgcmV0dXJuIGJyaWNrc0FycmF5O1xuICB9XG5cbiAgZHJhdyhjb250ZXh0LCBicmlja3MpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJyaWNrcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3Qge3gsIHksIHdpZHRoLCBoZWlnaHR9ID0gYnJpY2tzW2ldO1xuICAgICAgaWYgKGJyaWNrc1tpXS5oZWFsdGggPT09IDIpIHtcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAnIzM2MDYwMCdcbiAgICAgIH0gZWxzZSBpZiAoYnJpY2tzW2ldLmhlYWx0aCA9PT0gMSkge1xuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICcjRkMwMDA5J1xuICAgICAgfVxuICAgICAgY29udGV4dC5maWxsUmVjdCh4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgU3Ryb25nZXJCcmljayBleHRlbmRzIEJyaWNrIHtcbiAgY29uc3RydWN0b3IoeCwgeSwgaGVhbHRoKSB7XG4gICAgc3VwZXIoeCwgeSk7XG4gICAgdGhpcy5oZWFsdGggPSBoZWFsdGg7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCcmljaztcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2xpYi9Ccmljay5qcyJdLCJzb3VyY2VSb290IjoiIn0=