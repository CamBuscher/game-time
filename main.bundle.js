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
	  if (newGame.level === 1) {
	    var newBricks = bricks.createBricks(40, 1);
	    newBricks.forEach(function (brick) {
	      return newGame.grabBricks(brick);
	    });
	  } else if (newGame.level === 2) {
	    var _newBricks = bricks.createBricks(40, 2);
	    _newBricks.forEach(function (brick) {
	      return newGame.grabBricks(brick);
	    });
	  } else if (newGame.level === 3) {
	    var _newBricks2 = bricks.createBricks(54, 3);
	    _newBricks2.forEach(function (brick) {
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
/***/ (function(module, exports) {

	"use strict";
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
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
	    key: "collisionCheck",
	    value: function collisionCheck(obj1, obj2) {
	      if (obj1.x < obj2.x + obj2.width && obj1.x + obj1.width > obj2.x && obj1.y < obj2.y + obj2.height && obj1.y + obj1.height > obj2.y) {
	        return true;
	      } else {
	        return false;
	      }
	    }
	  }, {
	    key: "paddleBallColliding",
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
	    key: "paddleBallXCheck",
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
	    key: "grabBricks",
	    value: function grabBricks(bricks) {
	      this.bricks.push(bricks);
	    }
	  }, {
	    key: "brickBallColliding",
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
	    key: "checkBricks",
	    value: function checkBricks() {
	      if (this.bricks.length === 0) {
	        this.level++;
	        return true;
	      }
	    }
	  }, {
	    key: "brickBallSideCollision",
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
	    key: "checkBallDeath",
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
	    this.bricks = [];
	  }
	
	  _createClass(Brick, [{
	    key: 'createBricks',
	    value: function createBricks(numBricks, level) {
	      if (level < 3) {
	        for (var i = 0; i < numBricks; i++) {
	          if (i <= 9) {
	            var x = 2.5 + i * 75 + i * 5;
	            var y = 15;
	            this.bricks.push(new Brick(x, y));
	          } else if (i <= 19) {
	            var _x = 2.5 + (i - 10) * 75 + (i - 10) * 5;
	            var _y = 45;
	            this.bricks.push(new Brick(_x, _y));
	          } else if (i <= 29) {
	            var _x2 = 2.5 + (i - 20) * 75 + (i - 20) * 5;
	            var _y2 = 75;
	            this.bricks.push(new Brick(_x2, _y2));
	          } else if (i <= 39) {
	            var _x3 = 2.5 + (i - 30) * 75 + (i - 30) * 5;
	            var _y3 = 105;
	            if (level === 2) {
	              var health = 2;
	              this.bricks.push(new StrongerBrick(_x3, _y3, health));
	            }
	          }
	        }
	      } else {
	        for (var i = 0; i < numBricks; i++) {
	          if (i <= 8) {
	            var _x4 = 45 + i * 75 + i * 5;
	            var _y4 = 25;
	            var _health = 2;
	            this.bricks.push(new StrongerBrick(_x4, _y4, _health));
	          } else if (i <= 17) {
	            var _x5 = 45 + (i - 9) * 75 + (i - 9) * 5;
	            var _y5 = 55;
	            this.bricks.push(new Brick(_x5, _y5));
	          } else if (i <= 26) {
	            var _x6 = 45 + (i - 18) * 75 + (i - 18) * 5;
	            var _y6 = 85;
	            var _health2 = 2;
	            this.bricks.push(new StrongerBrick(_x6, _y6, _health2));
	          } else if (i <= 35) {
	            var _x7 = 45 + (i - 27) * 75 + (i - 27) * 5;
	            var _y7 = 115;
	            var _health3 = 2;
	            this.bricks.push(new StrongerBrick(_x7, _y7, _health3));
	          } else if (i <= 44) {
	            var _x8 = 45 + (i - 36) * 75 + (i - 36) * 5;
	            var _y8 = 145;
	            this.bricks.push(new Brick(_x8, _y8));
	          } else if (i <= 53) {
	            var _x9 = 45 + (i - 45) * 75 + (i - 45) * 5;
	            var _y9 = 175;
	            var _health4 = 2;
	            this.bricks.push(new StrongerBrick(_x9, _y9, _health4));
	          }
	        }
	        this.bricks = this.bricks.filter(function (brick) {
	          return brick.x !== 365;
	        });
	      }
	      return this.bricks;
	    }
	  }, {
	    key: 'clearBricks',
	    value: function clearBricks() {
	      this.bricks = [];
	      return this.bricks;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgY2VhMzQ3ODAyNzQxNGM3MjZhZTQiLCJ3ZWJwYWNrOi8vLy4vbGliL2luZGV4LmpzIiwid2VicGFjazovLy8uL2xpYi9QYWRkbGUuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL0tleWJvYXJkZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL0JhbGwuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL1Njb3Jlcy5qcyIsIndlYnBhY2s6Ly8vLi9saWIvR2FtZS5qcyIsIndlYnBhY2s6Ly8vLi9saWIvQnJpY2tzLmpzIl0sIm5hbWVzIjpbImNhbnZhcyIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsIlBhZGRsZSIsInJlcXVpcmUiLCJLZXlib2FyZGVyIiwiQmFsbCIsIlNjb3JlcyIsIkdhbWUiLCJCcmljayIsImN0eCIsImdldENvbnRleHQiLCJuZXdHYW1lIiwiYm91bmN5QmFsbCIsInN0YXJ0UGFkZGxlIiwia2V5Ym9hcmRNb25pdG9yIiwiTWF0aCIsInJhbmRvbSIsImtleVN0YXRlIiwiYnJpY2tzIiwicmVxdWVzdElEIiwidW5kZWZpbmVkIiwiaXNEZWFkIiwiZ2VuZXJhdGVCcmlja3MiLCJzdGFydEdhbWUiLCJnZXRGcm9tU3RvcmFnZSIsImxldmVsIiwibmV3QnJpY2tzIiwiY3JlYXRlQnJpY2tzIiwiZm9yRWFjaCIsImdyYWJCcmlja3MiLCJicmljayIsIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwia2V5RG93biIsImtleVVwIiwicmVzdGFydEdhbWUiLCJnYW1lTG9vcCIsImdldEVsZW1lbnRCeUlkIiwiaW5uZXJIVE1MIiwic2NvcmUiLCJsaXZlcyIsImZpbGxTdHlsZSIsImNsZWFyUmVjdCIsIndpZHRoIiwiaGVpZ2h0IiwiZHJhdyIsImR5IiwicGFkZGxlQmFsbENvbGxpZGluZyIsImR4IiwicGFkZGxlQmFsbFhDaGVjayIsImJyaWNrQmFsbFNpZGVDb2xsaXNpb24iLCJicmlja0JhbGxDb2xsaWRpbmciLCJtb3ZlIiwiYW5pbWF0ZSIsImNoZWNrQmFsbERlYXRoIiwiYmFsbERlYXRoIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiY2hlY2tCcmlja3MiLCJjbGVhckJyaWNrcyIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwiZGVsYXllZFN0YXJ0IiwiZW5kR2FtZSIsInNldFRpbWVvdXQiLCJ1c2VyU2NvcmVzIiwiaW5pdGlhbHMiLCJwcm9tcHQiLCJjaGVja0luaXRpYWxzIiwic2NvcmVUb1N0b3JhZ2UiLCJsaXZlc0luZGljYXRvciIsImlubmVyVGV4dCIsInRlc3QiLCJzIiwic2xpY2UiLCJ0b1VwcGVyQ2FzZSIsInNjb3JlcyIsInN0b3JlU2NvcmVzIiwic3RyaW5naWZ5U2NvcmVzIiwiSlNPTiIsInN0cmluZ2lmeSIsImxvY2FsU3RvcmFnZSIsInNldEl0ZW0iLCJpZCIsInRvcFNjb3JlcyIsImkiLCJsZW5ndGgiLCJyZXRyaWV2ZWRJdGVtIiwiZ2V0SXRlbSIsImtleSIsInBhcnNlZEl0ZW0iLCJwYXJzZSIsInB1c2giLCJzb3J0IiwiYSIsImIiLCJzcGxpY2UiLCJIVE1MSW5pdGlhbHMiLCJIVE1MU2NvcmVzIiwieCIsInkiLCJjb250ZXh0IiwiZmlsbFJlY3QiLCJtb2R1bGUiLCJleHBvcnRzIiwia2V5cyIsImxlZnQiLCJyaWdodCIsImtleUNvZGUiLCJyYWRpdXMiLCJiZWdpblBhdGgiLCJhcmMiLCJQSSIsInN0cm9rZSIsImZpbGwiLCJjYW52YXNIZWlnaHQiLCJjYW52YXNXaWR0aCIsIkRhdGUiLCJub3ciLCJiYWxsIiwicGFkZGxlIiwiZGlzY2FyZGVkQnJpY2tzIiwiYmFsbHMiLCJvYmoxIiwib2JqMiIsImFyZUNvbGxpZGluZyIsImNvbGxpc2lvbkNoZWNrIiwicGFkZGxlRmlyc3RGaWZ0aCIsInBhZGRsZVNlY29uZEZpZnRoIiwicGFkZGxlVGhpcmRGaWZ0aCIsInBhZGRsZUZvdXJ0aEZpZnRoIiwiaW5kZXgiLCJpbmRleE9mIiwiaGVhbHRoIiwiYmluZCIsIm51bUJyaWNr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QUFDRCxjQUFPLEtBQUtoRixNQUFaO0FBQ0Q7OzttQ0FFYTtBQUNaLFlBQUtBLE1BQUwsR0FBYyxFQUFkO0FBQ0EsY0FBTyxLQUFLQSxNQUFaO0FBQ0Q7OzswQkFFSWtGLE8sRUFBU2xGLE0sRUFBUTtBQUNwQixZQUFLLElBQUlrRSxJQUFJLENBQWIsRUFBZ0JBLElBQUlsRSxPQUFPbUUsTUFBM0IsRUFBbUNELEdBQW5DLEVBQXdDO0FBQUEseUJBQ1JsRSxPQUFPa0UsQ0FBUCxDQURRO0FBQUEsYUFDL0JjLENBRCtCLGFBQy9CQSxDQUQrQjtBQUFBLGFBQzVCQyxDQUQ0QixhQUM1QkEsQ0FENEI7QUFBQSxhQUN6QnZELEtBRHlCLGFBQ3pCQSxLQUR5QjtBQUFBLGFBQ2xCQyxNQURrQixhQUNsQkEsTUFEa0I7O0FBRXRDLGFBQUkzQixPQUFPa0UsQ0FBUCxFQUFVZ0QsTUFBVixLQUFxQixDQUF6QixFQUE0QjtBQUMxQmhDLG1CQUFRMUQsU0FBUixHQUFvQixTQUFwQjtBQUNELFVBRkQsTUFFTyxJQUFJeEIsT0FBT2tFLENBQVAsRUFBVWdELE1BQVYsS0FBcUIsQ0FBekIsRUFBNEI7QUFDakNoQyxtQkFBUTFELFNBQVIsR0FBb0IsU0FBcEI7QUFDRDtBQUNEMEQsaUJBQVFDLFFBQVIsQ0FBaUJILENBQWpCLEVBQW9CQyxDQUFwQixFQUF1QnZELEtBQXZCLEVBQThCQyxNQUE5QjtBQUNEO0FBQ0Y7Ozs7OztLQUdHMEYsYTs7O0FBQ0osMEJBQVlyQyxDQUFaLEVBQWVDLENBQWYsRUFBa0JpQyxNQUFsQixFQUEwQjtBQUFBOztBQUFBLCtIQUNsQmxDLENBRGtCLEVBQ2ZDLENBRGU7O0FBRXhCLFdBQUtpQyxNQUFMLEdBQWNBLE1BQWQ7QUFGd0I7QUFHekI7OztHQUp5QjVILEs7O0FBTzVCOEYsUUFBT0MsT0FBUCxHQUFpQi9GLEtBQWpCLEMiLCJmaWxlIjoibWFpbi5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBjZWEzNDc4MDI3NDE0YzcyNmFlNCIsImNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNnYW1lLXNjcmVlbicpO1xuY29uc3QgUGFkZGxlID0gcmVxdWlyZSgnLi9QYWRkbGUnKTtcbmNvbnN0IEtleWJvYXJkZXIgPSByZXF1aXJlKCcuL0tleWJvYXJkZXInKTtcbmNvbnN0IEJhbGwgPSByZXF1aXJlKCcuL0JhbGwuanMnKTtcbmNvbnN0IFNjb3JlcyA9IHJlcXVpcmUoJy4vU2NvcmVzLmpzJyk7XG5jb25zdCBHYW1lID0gcmVxdWlyZSgnLi9HYW1lLmpzJyk7XG5jb25zdCBCcmljayA9IHJlcXVpcmUoJy4vQnJpY2tzLmpzJyk7XG5sZXQgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5sZXQgbmV3R2FtZSA9IG5ldyBHYW1lKGJvdW5jeUJhbGwsIHN0YXJ0UGFkZGxlKTtcbmxldCBzdGFydFBhZGRsZSA9IG5ldyBQYWRkbGUoMzUwLCAxMDAsIDE1KTtcbmxldCBrZXlib2FyZE1vbml0b3IgPSBuZXcgS2V5Ym9hcmRlcigpO1xubGV0IGJvdW5jeUJhbGwgPSBuZXcgQmFsbCg0MDAsIDIwMCwgKChNYXRoLnJhbmRvbSgpICogMykgLSAxLjUpLCA0KTtcbmxldCBrZXlTdGF0ZSA9IHt9O1xubGV0IGJyaWNrcyA9IG5ldyBCcmljaygpO1xubGV0IHJlcXVlc3RJRCA9IHVuZGVmaW5lZDtcbmxldCBpc0RlYWQgPSBudWxsO1xuXG5nZW5lcmF0ZUJyaWNrcygpO1xuc3RhcnRHYW1lKCk7XG5nZXRGcm9tU3RvcmFnZSgpO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZUJyaWNrcygpIHtcbiAgaWYgKG5ld0dhbWUubGV2ZWwgPT09IDEpIHtcbiAgICBsZXQgbmV3QnJpY2tzID0gYnJpY2tzLmNyZWF0ZUJyaWNrcyg0MCwgMSk7XG4gICAgbmV3QnJpY2tzLmZvckVhY2goIGJyaWNrID0+IG5ld0dhbWUuZ3JhYkJyaWNrcyhicmljaykgKTtcbiAgfSBlbHNlIGlmIChuZXdHYW1lLmxldmVsID09PSAyKSB7XG4gICAgbGV0IG5ld0JyaWNrcyA9IGJyaWNrcy5jcmVhdGVCcmlja3MoNDAsIDIpO1xuICAgIG5ld0JyaWNrcy5mb3JFYWNoKCBicmljayA9PiBuZXdHYW1lLmdyYWJCcmlja3MoYnJpY2spICk7XG4gIH0gZWxzZSBpZiAobmV3R2FtZS5sZXZlbCA9PT0gMykge1xuICAgIGxldCBuZXdCcmlja3MgPSBicmlja3MuY3JlYXRlQnJpY2tzKDU0LCAzKTtcbiAgICBuZXdCcmlja3MuZm9yRWFjaCggYnJpY2sgPT4gbmV3R2FtZS5ncmFiQnJpY2tzKGJyaWNrKSApO1xuICB9XG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZnVuY3Rpb24oZSkge1xuICBrZXlTdGF0ZSA9IGtleWJvYXJkTW9uaXRvci5rZXlEb3duKGUpO1xufSk7XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGZ1bmN0aW9uKGUpIHtcbiAga2V5U3RhdGUgPSBrZXlib2FyZE1vbml0b3Iua2V5VXAoZSk7XG59KTtcblxuZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5ldy1nYW1lLWJ1dHRvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcmVzdGFydEdhbWUpO1xuXG5mdW5jdGlvbiBnYW1lTG9vcCgpIHtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VzZXItc2NvcmUnKS5pbm5lckhUTUwgPSBuZXdHYW1lLnNjb3JlO1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubGl2ZXMtaW5kaWNhdG9yJykuaW5uZXJIVE1MID0gbmV3R2FtZS5saXZlcztcbiAgY3R4LmZpbGxTdHlsZSA9ICcjMDAwJztcbiAgY3R4LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuICBzdGFydFBhZGRsZS5kcmF3KGN0eCk7XG4gIGJvdW5jeUJhbGwuZHJhdyhjdHgpO1xuICBib3VuY3lCYWxsLmR5ID0gbmV3R2FtZS5wYWRkbGVCYWxsQ29sbGlkaW5nKGJvdW5jeUJhbGwsIHN0YXJ0UGFkZGxlKTtcbiAgYm91bmN5QmFsbC5keCA9IG5ld0dhbWUucGFkZGxlQmFsbFhDaGVjayhib3VuY3lCYWxsLCBzdGFydFBhZGRsZSk7XG4gIGJvdW5jeUJhbGwuZHggPSBuZXdHYW1lLmJyaWNrQmFsbFNpZGVDb2xsaXNpb24oYm91bmN5QmFsbCwgbmV3R2FtZS5icmlja3MpO1xuICBib3VuY3lCYWxsLmR5ID0gbmV3R2FtZS5icmlja0JhbGxDb2xsaWRpbmcoYm91bmN5QmFsbCwgbmV3R2FtZS5icmlja3MpO1xuICBicmlja3MuZHJhdyhjdHgsIG5ld0dhbWUuYnJpY2tzKTtcbiAgYm91bmN5QmFsbC5tb3ZlKGNhbnZhcy5oZWlnaHQsIGNhbnZhcy53aWR0aCk7XG4gIHN0YXJ0UGFkZGxlLmFuaW1hdGUoa2V5U3RhdGUpO1xuICBpc0RlYWQgPSBuZXdHYW1lLmNoZWNrQmFsbERlYXRoKGJvdW5jeUJhbGwsIGNhbnZhcy5oZWlnaHQpO1xuICBpZiAoaXNEZWFkKSB7XG4gICAgYmFsbERlYXRoKCk7XG4gIH0gZWxzZSB7XG4gICAgcmVxdWVzdElEID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGdhbWVMb29wKTtcbiAgfVxuICBpZiAobmV3R2FtZS5jaGVja0JyaWNrcygpKSB7XG4gICAgYnJpY2tzLmNsZWFyQnJpY2tzKCk7XG4gICAgZ2VuZXJhdGVCcmlja3MoKTtcbiAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUocmVxdWVzdElEKTtcbiAgICByZXF1ZXN0SUQgPSBudWxsO1xuICAgIHN0YXJ0R2FtZSgpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlc3RhcnRHYW1lKCkge1xuICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUocmVxdWVzdElEKTtcbiAgcmVxdWVzdElEID0gbnVsbDtcbiAgbmV3R2FtZS5icmlja3MgPSBicmlja3MuY2xlYXJCcmlja3MoKTtcbiAgYm91bmN5QmFsbCA9IG5ldyBCYWxsKDQwMCwgMjAwLCAoKE1hdGgucmFuZG9tKCkgKiAzKSAtIDEuNSksIDQpO1xuICBuZXdHYW1lID0gbmV3IEdhbWUoYm91bmN5QmFsbCwgc3RhcnRQYWRkbGUpO1xuICBnZW5lcmF0ZUJyaWNrcygpO1xuICBzdGFydEdhbWUoKTtcbn1cblxuZnVuY3Rpb24gc3RhcnRHYW1lKCkge1xuICBjdHguZmlsbFN0eWxlID0gJyMwMDAnO1xuICBjdHguY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4gIGJvdW5jeUJhbGwgPSBuZXcgQmFsbCg0MDAsIDIwMCwgKChNYXRoLnJhbmRvbSgpICogMykgLSAxLjUpLCA0KTtcbiAgc3RhcnRQYWRkbGUgPSBuZXcgUGFkZGxlKDM1MCwgMTAwLCAxNSk7XG4gIHN0YXJ0UGFkZGxlLmRyYXcoY3R4KTtcbiAgYm91bmN5QmFsbC5kcmF3KGN0eCk7XG4gIGJyaWNrcy5kcmF3KGN0eCwgbmV3R2FtZS5icmlja3MpO1xuICBkZWxheWVkU3RhcnQoKTtcbiAgZW5kR2FtZSgpO1xufVxuXG5mdW5jdGlvbiBkZWxheWVkU3RhcnQoKSB7XG4gIGlmKCFyZXF1ZXN0SUQpIHtcbiAgICB3aW5kb3cuc2V0VGltZW91dChnYW1lTG9vcCwgMzAwMCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZW5kR2FtZSgpIHtcbiAgbGV0IHVzZXJTY29yZXMgPSBuZXcgU2NvcmVzKCk7XG4gIGlmKG5ld0dhbWUubGl2ZXMgPT09IDApIHtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXNlci1zY29yZScpLmlubmVySFRNTCA9IDA7XG4gICAgdXNlclNjb3Jlcy5pbml0aWFscyA9IHByb21wdCgnRW50ZXIgeW91ciBpbml0aWFscyEnLCAnJyk7XG4gICAgdXNlclNjb3Jlcy5zY29yZSA9IG5ld0dhbWUuc2NvcmU7XG4gICAgdXNlclNjb3Jlcy5pbml0aWFscyA9IGNoZWNrSW5pdGlhbHModXNlclNjb3Jlcy5pbml0aWFscyk7XG4gICAgc2NvcmVUb1N0b3JhZ2UodXNlclNjb3Jlcyk7XG4gICAgZ2V0RnJvbVN0b3JhZ2UodXNlclNjb3Jlcyk7XG4gICAgbmV3R2FtZSA9IG5ldyBHYW1lKGJvdW5jeUJhbGwsIHN0YXJ0UGFkZGxlKTtcbiAgICBicmlja3MgPSBuZXcgQnJpY2soKTtcbiAgICBnZW5lcmF0ZUJyaWNrcygpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGJhbGxEZWF0aCgpIHtcbiAgaWYocmVxdWVzdElEKSB7XG4gICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKHJlcXVlc3RJRCk7XG4gICAgcmVxdWVzdElEID0gbnVsbDtcbiAgICBpc0RlYWQgPSBmYWxzZTtcbiAgICBsZXQgbGl2ZXNJbmRpY2F0b3IgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubGl2ZXMtaW5kaWNhdG9yJyk7XG4gICAgbGl2ZXNJbmRpY2F0b3IuaW5uZXJUZXh0ID0gbmV3R2FtZS5saXZlcztcbiAgICBzdGFydEdhbWUoKTtcbiAgfVxufVxuXG5jb25zdCBjaGVja0luaXRpYWxzID0gcyA9PiAvW2Etel0qL2dpLnRlc3QocykgPyBzLnNsaWNlKDAsIDMpLnRvVXBwZXJDYXNlKCkgOiAnTi9BJztcblxuZnVuY3Rpb24gc2NvcmVUb1N0b3JhZ2Uoc2NvcmVzKSB7XG4gIGxldCBzdG9yZVNjb3JlcyA9IHNjb3JlcztcbiAgbGV0IHN0cmluZ2lmeVNjb3JlcyA9IEpTT04uc3RyaW5naWZ5KHN0b3JlU2NvcmVzKTtcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oc2NvcmVzLmlkLCBzdHJpbmdpZnlTY29yZXMpO1xufVxuXG5mdW5jdGlvbiBnZXRGcm9tU3RvcmFnZShzY29yZXMpIHtcbiAgbGV0IHRvcFNjb3JlcyA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGxvY2FsU3RvcmFnZS5sZW5ndGg7IGkrKyl7XG4gICAgbGV0IHJldHJpZXZlZEl0ZW0gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShsb2NhbFN0b3JhZ2Uua2V5KGkpKTtcbiAgICBsZXQgcGFyc2VkSXRlbSA9IEpTT04ucGFyc2UocmV0cmlldmVkSXRlbSk7XG4gICAgdG9wU2NvcmVzLnB1c2gocGFyc2VkSXRlbSk7XG4gIH1cbiAgdG9wU2NvcmVzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiBiLnNjb3JlIC0gYS5zY29yZTtcbiAgfSlcbiAgdG9wU2NvcmVzLnNwbGljZSgxMCwgMTAwMCk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdG9wU2NvcmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgbGV0IGluaXRpYWxzID0gdG9wU2NvcmVzW2ldLmluaXRpYWxzO1xuICAgIGxldCBzY29yZSA9IHRvcFNjb3Jlc1tpXS5zY29yZTtcbiAgICBsZXQgSFRNTEluaXRpYWxzID0gJ2hpZ2gtaW5pdGlhbHMtJyArIChpICsgMSk7XG4gICAgbGV0IEhUTUxTY29yZXMgPSAnaGlnaC1zY29yZS0nICsgKGkgKyAxKTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuJyArIEhUTUxJbml0aWFscykuaW5uZXJIVE1MID0gaW5pdGlhbHM7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLicgKyBIVE1MU2NvcmVzKS5pbm5lckhUTUwgPSBzY29yZTtcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbGliL2luZGV4LmpzIiwiY2xhc3MgUGFkZGxlIHtcbiAgY29uc3RydWN0b3IoeCwgd2lkdGgsIGhlaWdodCkge1xuICAgIHRoaXMueSA9IDQ3NTtcbiAgICB0aGlzLnggPSB4O1xuICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcbiAgfVxuICBkcmF3KGNvbnRleHQpIHtcbiAgICBjb250ZXh0LmZpbGxSZWN0KHRoaXMueCwgdGhpcy55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gIH1cbiAgYW5pbWF0ZShrZXlTdGF0ZSkge1xuICAgIGlmIChrZXlTdGF0ZVszN10gJiYgdGhpcy54ID4gMCkge1xuICAgICAgdGhpcy54IC09IDU7XG4gICAgfSBlbHNlIGlmIChrZXlTdGF0ZVszOV0gJiYgdGhpcy54IDwgNzAwKSB7XG4gICAgICB0aGlzLnggKz0gNTtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQYWRkbGU7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbGliL1BhZGRsZS5qcyIsImNsYXNzIEtleWJvYXJkZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmtleXMgPSB7XG4gICAgICBsZWZ0OiAzNyxcbiAgICAgIHJpZ2h0OiAzOSxcbiAgICB9O1xuICB9XG4gIGtleURvd24oZSkge1xuICAgIHZhciBrZXlTdGF0ZSA9IHt9O1xuICAgIGtleVN0YXRlW2Uua2V5Q29kZV0gPSB0cnVlO1xuICAgIHJldHVybiBrZXlTdGF0ZTtcbiAgfVxuXG4gIGtleVVwKGUpIHtcbiAgICB2YXIga2V5U3RhdGUgPSB7fTtcbiAgICBrZXlTdGF0ZVtlLmtleUNvZGVdID0gZmFsc2U7XG4gICAgcmV0dXJuIGtleVN0YXRlO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gS2V5Ym9hcmRlcjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2xpYi9LZXlib2FyZGVyLmpzIiwiY2xhc3MgQmFsbCB7XG4gIGNvbnN0cnVjdG9yKHgsIHksIGR4LCBkeSkge1xuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcbiAgICB0aGlzLmR4ID0gZHg7XG4gICAgdGhpcy5keSA9IGR5O1xuICAgIHRoaXMucmFkaXVzID0gNTtcbiAgICB0aGlzLndpZHRoID0gdGhpcy5yYWRpdXMgKiAyO1xuICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5yYWRpdXMgKiAyO1xuICB9XG4gIGRyYXcoY29udGV4dCkge1xuICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgY29udGV4dC5hcmModGhpcy54LCB0aGlzLnksIHRoaXMucmFkaXVzLCAwLCBNYXRoLlBJICogMiwgZmFsc2UpO1xuICAgIGNvbnRleHQuc3Ryb2tlKCk7XG4gICAgY29udGV4dC5maWxsU3R5bGUgPSBcIiMwMDBcIjtcbiAgICBjb250ZXh0LmZpbGwoKTtcbiAgfVxuICBtb3ZlKGNhbnZhc0hlaWdodCwgY2FudmFzV2lkdGgpIHtcbiAgICBpZiAoKHRoaXMueCArIHRoaXMucmFkaXVzKSA+PSBjYW52YXNXaWR0aCB8fCAodGhpcy54IC0gdGhpcy5yYWRpdXMpIDw9IDApIHtcbiAgICAgIHRoaXMuZHggPSAtdGhpcy5keDtcbiAgICB9XG4gICAgaWYgKCh0aGlzLnkgLSB0aGlzLnJhZGl1cykgPD0gMCkge1xuICAgICAgdGhpcy5keSA9IC10aGlzLmR5O1xuICAgIH1cbiAgICB0aGlzLnkgKz0gdGhpcy5keTtcbiAgICB0aGlzLnggKz0gdGhpcy5keDtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJhbGw7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9saWIvQmFsbC5qcyIsImNsYXNzIFNjb3JlcyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc2NvcmUgPSAwO1xuICAgIHRoaXMuaW5pdGlhbHMgPSAnWFhYJztcbiAgICB0aGlzLmlkID0gRGF0ZS5ub3coKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNjb3JlcztcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2xpYi9TY29yZXMuanMiLCJjbGFzcyBHYW1lIHtcbiAgY29uc3RydWN0b3IoYmFsbCwgcGFkZGxlKSB7XG4gICAgdGhpcy5icmlja3MgPSBbXTtcbiAgICB0aGlzLmRpc2NhcmRlZEJyaWNrcyA9IFtdO1xuICAgIHRoaXMuYmFsbHMgPSBbYmFsbF07XG4gICAgdGhpcy5wYWRkbGUgPSBwYWRkbGU7XG4gICAgdGhpcy5sZXZlbCA9IDE7XG4gICAgdGhpcy5saXZlcyA9IDM7XG4gICAgdGhpcy5zY29yZSA9IDA7XG4gIH1cblxuICBjb2xsaXNpb25DaGVjayhvYmoxLCBvYmoyKSB7XG4gICAgaWYgKG9iajEueCA8IG9iajIueCArIG9iajIud2lkdGggICYmIG9iajEueCArIG9iajEud2lkdGggID4gb2JqMi54ICYmXG4gICAgICAgIG9iajEueSA8IG9iajIueSArIG9iajIuaGVpZ2h0ICYmIG9iajEueSArIG9iajEuaGVpZ2h0ID4gb2JqMi55KSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHBhZGRsZUJhbGxDb2xsaWRpbmcoYmFsbCwgcGFkZGxlKSB7XG4gICAgbGV0IGFyZUNvbGxpZGluZyA9IHRoaXMuY29sbGlzaW9uQ2hlY2soYmFsbCwgcGFkZGxlKTtcbiAgICBsZXQgZHkgPSBiYWxsLmR5O1xuICAgIGlmIChhcmVDb2xsaWRpbmcpIHtcbiAgICAgIHJldHVybiBkeSA9IC1keTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGR5O1xuICAgIH1cbiAgfVxuXG4gIHBhZGRsZUJhbGxYQ2hlY2soYmFsbCwgcGFkZGxlKSB7XG4gICAgbGV0IGFyZUNvbGxpZGluZyA9IHRoaXMuY29sbGlzaW9uQ2hlY2soYmFsbCwgcGFkZGxlKTtcbiAgICBsZXQgcGFkZGxlRmlyc3RGaWZ0aCA9IHBhZGRsZS54ICsgKHBhZGRsZS53aWR0aCAvIDUpO1xuICAgIGxldCBwYWRkbGVTZWNvbmRGaWZ0aCA9IHBhZGRsZS54ICsgKChwYWRkbGUud2lkdGggLyA1KSAqIDIpO1xuICAgIGxldCBwYWRkbGVUaGlyZEZpZnRoID0gcGFkZGxlLnggKyAoKHBhZGRsZS53aWR0aCAvIDUpICogNCk7XG4gICAgbGV0IHBhZGRsZUZvdXJ0aEZpZnRoID0gcGFkZGxlLnggKyBwYWRkbGUud2lkdGg7XG4gICAgaWYgKGFyZUNvbGxpZGluZykge1xuICAgICAgaWYgKGJhbGwueCA8IHBhZGRsZUZpcnN0RmlmdGgpIHtcbiAgICAgICAgYmFsbC5keCAtPSAzO1xuICAgICAgfSBlbHNlIGlmIChiYWxsLnggPCBwYWRkbGVTZWNvbmRGaWZ0aCkge1xuICAgICAgICBiYWxsLmR4IC09IDE7XG4gICAgICB9IGVsc2UgaWYgKGJhbGwueCA8IHBhZGRsZVRoaXJkRmlmdGgpIHtcbiAgICAgICAgYmFsbC5keCArPSAxO1xuICAgICAgfSBlbHNlIGlmIChiYWxsLnggPCBwYWRkbGVGb3VydGhGaWZ0aCkge1xuICAgICAgICBiYWxsLmR4ICs9IDM7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChiYWxsLmR4ID4gMTApIHtcbiAgICAgIGJhbGwuZHggPSAxMDtcbiAgICB9IGVsc2UgaWYgKGJhbGwuZHggPCAtMTApIHtcbiAgICAgIGJhbGwuZHggPSAtMTA7XG4gICAgfVxuICAgIHJldHVybiBiYWxsLmR4XG4gIH1cblxuICBncmFiQnJpY2tzKGJyaWNrcykge1xuICAgIHRoaXMuYnJpY2tzLnB1c2goYnJpY2tzKTtcbiAgfVxuXG4gIGJyaWNrQmFsbENvbGxpZGluZyhiYWxsLCBicmlja3MpIHtcbiAgICBsZXQgZHkgPSBiYWxsLmR5O1xuICAgIGJyaWNrcy5mb3JFYWNoKGZ1bmN0aW9uKGJyaWNrKSB7XG4gICAgICBsZXQgaW5kZXggPSB0aGlzLmJyaWNrcy5pbmRleE9mKGJyaWNrKTtcbiAgICAgIGxldCBhcmVDb2xsaWRpbmcgPSB0aGlzLmNvbGxpc2lvbkNoZWNrKGJhbGwsIGJyaWNrKTtcbiAgICAgIGlmIChhcmVDb2xsaWRpbmcpIHtcbiAgICAgICAgdGhpcy5zY29yZSArPSAxMDA7XG4gICAgICAgIGlmIChicmljay5oZWFsdGggPT09IDEpe1xuICAgICAgICAgIGxldCBpbmRleCA9IHRoaXMuYnJpY2tzLmluZGV4T2YoYnJpY2spO1xuICAgICAgICAgIHRoaXMuZGlzY2FyZGVkQnJpY2tzID0gdGhpcy5icmlja3Muc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgICAgICBicmljay5oZWFsdGgtLTtcbiAgICAgICAgaWYgKGJhbGwueCA8IChicmljay54ICsgYnJpY2sud2lkdGgpICYmIGJhbGwueCA+IGJyaWNrLngpIHtcbiAgICAgICAgICByZXR1cm4gZHkgPSAtZHk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGR5O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfS5iaW5kKHRoaXMpKVxuICAgIHJldHVybiBkeTtcbiAgfVxuXG4gIGNoZWNrQnJpY2tzKCkge1xuICAgIGlmICh0aGlzLmJyaWNrcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRoaXMubGV2ZWwrKztcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGJyaWNrQmFsbFNpZGVDb2xsaXNpb24oYmFsbCwgYnJpY2tzKSB7XG4gICAgYnJpY2tzLmZvckVhY2goZnVuY3Rpb24oYnJpY2spIHtcbiAgICAgIGxldCBhcmVDb2xsaWRpbmcgPSB0aGlzLmNvbGxpc2lvbkNoZWNrKGJhbGwsIGJyaWNrKTtcbiAgICAgIGlmIChhcmVDb2xsaWRpbmcpIHtcbiAgICAgICAgaWYgKGJhbGwueCA8PSBicmljay54IHx8IGJhbGwueCA+PSAoYnJpY2sueCArIGJyaWNrLndpZHRoKSkge1xuICAgICAgICAgIGJhbGwuZHggPSAtYmFsbC5keDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0uYmluZCh0aGlzKSlcbiAgICByZXR1cm4gYmFsbC5keDtcbiAgfVxuXG4gIGNoZWNrQmFsbERlYXRoKGJhbGwsIGNhbnZhc0hlaWdodCkge1xuICAgIGlmIChiYWxsLnkgPj0gY2FudmFzSGVpZ2h0KSB7XG4gICAgICB0aGlzLmxpdmVzIC09IDE7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWU7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9saWIvR2FtZS5qcyIsImNsYXNzIEJyaWNrIHtcbiAgY29uc3RydWN0b3IoeCwgeSkge1xuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcbiAgICB0aGlzLmhlYWx0aCA9IDE7XG4gICAgdGhpcy53aWR0aCA9IDc1O1xuICAgIHRoaXMuaGVpZ2h0ID0gMjU7XG4gICAgdGhpcy5icmlja3MgPSBbXTtcbiAgfVxuXG4gIGNyZWF0ZUJyaWNrcyhudW1Ccmlja3MsIGxldmVsKSB7XG4gICAgaWYgKGxldmVsIDwgMykge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1Ccmlja3M7IGkrKykge1xuICAgICAgICBpZiAoaSA8PSA5KSB7XG4gICAgICAgICAgbGV0IHggPSAyLjUgKyAoaSAqIDc1KSArIChpICogNSk7XG4gICAgICAgICAgbGV0IHkgPSAxNTtcbiAgICAgICAgICB0aGlzLmJyaWNrcy5wdXNoKG5ldyBCcmljayh4LCB5KSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaSA8PSAxOSkge1xuICAgICAgICAgIGxldCB4ID0gMi41ICsgKChpIC0gMTApICogNzUpICsgKChpIC0gMTApICogNSk7XG4gICAgICAgICAgbGV0IHkgPSA0NTtcbiAgICAgICAgICB0aGlzLmJyaWNrcy5wdXNoKG5ldyBCcmljayh4LCB5KSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaSA8PSAyOSkge1xuICAgICAgICAgIGxldCB4ID0gMi41ICsgKChpIC0gMjApICogNzUpICsgKChpIC0gMjApICogNSk7XG4gICAgICAgICAgbGV0IHkgPSA3NTtcbiAgICAgICAgICB0aGlzLmJyaWNrcy5wdXNoKG5ldyBCcmljayh4LCB5KSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaSA8PSAzOSkge1xuICAgICAgICAgIGxldCB4ID0gMi41ICsgKChpIC0gMzApICogNzUpICsgKChpIC0gMzApICogNSk7XG4gICAgICAgICAgbGV0IHkgPSAxMDU7XG4gICAgICAgICAgaWYgKGxldmVsID09PSAyKSB7XG4gICAgICAgICAgICBsZXQgaGVhbHRoID0gMjtcbiAgICAgICAgICAgIHRoaXMuYnJpY2tzLnB1c2gobmV3IFN0cm9uZ2VyQnJpY2soeCwgeSwgaGVhbHRoKSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1Ccmlja3M7IGkrKykge1xuICAgICAgICBpZiAoaSA8PSA4KSB7XG4gICAgICAgICAgbGV0IHggPSA0NSArIChpICogNzUpICsgKGkgKiA1KTtcbiAgICAgICAgICBsZXQgeSA9IDI1O1xuICAgICAgICAgIGxldCBoZWFsdGggPSAyO1xuICAgICAgICAgIHRoaXMuYnJpY2tzLnB1c2gobmV3IFN0cm9uZ2VyQnJpY2soeCwgeSwgaGVhbHRoKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaSA8PSAxNykge1xuICAgICAgICAgIGxldCB4ID0gNDUgKyAoKGkgLSA5KSAqIDc1KSArICgoaSAtIDkpICogNSk7XG4gICAgICAgICAgbGV0IHkgPSA1NTtcbiAgICAgICAgICB0aGlzLmJyaWNrcy5wdXNoKG5ldyBCcmljayh4LCB5KSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaSA8PSAyNikge1xuICAgICAgICAgIGxldCB4ID0gNDUgKyAoKGkgLSAxOCkgKiA3NSkgKyAoKGkgLSAxOCkgKiA1KTtcbiAgICAgICAgICBsZXQgeSA9IDg1O1xuICAgICAgICAgIGxldCBoZWFsdGggPSAyO1xuICAgICAgICAgIHRoaXMuYnJpY2tzLnB1c2gobmV3IFN0cm9uZ2VyQnJpY2soeCwgeSwgaGVhbHRoKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaSA8PSAzNSkge1xuICAgICAgICAgIGxldCB4ID0gNDUgKyAoKGkgLSAyNykgKiA3NSkgKyAoKGkgLSAyNykgKiA1KTtcbiAgICAgICAgICBsZXQgeSA9IDExNTtcbiAgICAgICAgICBsZXQgaGVhbHRoID0gMjtcbiAgICAgICAgICB0aGlzLmJyaWNrcy5wdXNoKG5ldyBTdHJvbmdlckJyaWNrKHgsIHksIGhlYWx0aCkpO1xuICAgICAgICB9IGVsc2UgaWYgKGkgPD0gNDQpIHtcbiAgICAgICAgICBsZXQgeCA9IDQ1ICsgKChpIC0gMzYpICogNzUpICsgKChpIC0gMzYpICogNSk7XG4gICAgICAgICAgbGV0IHkgPSAxNDU7XG4gICAgICAgICAgdGhpcy5icmlja3MucHVzaChuZXcgQnJpY2soeCwgeSkpXG4gICAgICAgIH0gZWxzZSBpZiAoaSA8PSA1Mykge1xuICAgICAgICAgIGxldCB4ID0gNDUgKyAoKGkgLSA0NSkgKiA3NSkgKyAoKGkgLSA0NSkgKiA1KTtcbiAgICAgICAgICBsZXQgeSA9IDE3NTtcbiAgICAgICAgICBsZXQgaGVhbHRoID0gMjtcbiAgICAgICAgICB0aGlzLmJyaWNrcy5wdXNoKG5ldyBTdHJvbmdlckJyaWNrKHgsIHksIGhlYWx0aCkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLmJyaWNrcyA9IHRoaXMuYnJpY2tzLmZpbHRlcihicmljayA9PiBicmljay54ICE9PSAzNjUpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5icmlja3M7XG4gIH1cblxuICBjbGVhckJyaWNrcygpIHtcbiAgICB0aGlzLmJyaWNrcyA9IFtdO1xuICAgIHJldHVybiB0aGlzLmJyaWNrcztcbiAgfVxuXG4gIGRyYXcoY29udGV4dCwgYnJpY2tzKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBicmlja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHt4LCB5LCB3aWR0aCwgaGVpZ2h0fSA9IGJyaWNrc1tpXTtcbiAgICAgIGlmIChicmlja3NbaV0uaGVhbHRoID09PSAyKSB7XG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJyMzNjA2MDAnXG4gICAgICB9IGVsc2UgaWYgKGJyaWNrc1tpXS5oZWFsdGggPT09IDEpIHtcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAnI0ZDMDAwOSdcbiAgICAgIH1cbiAgICAgIGNvbnRleHQuZmlsbFJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XG4gICAgfVxuICB9XG59XG5cbmNsYXNzIFN0cm9uZ2VyQnJpY2sgZXh0ZW5kcyBCcmljayB7XG4gIGNvbnN0cnVjdG9yKHgsIHksIGhlYWx0aCkge1xuICAgIHN1cGVyKHgsIHkpO1xuICAgIHRoaXMuaGVhbHRoID0gaGVhbHRoO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQnJpY2s7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9saWIvQnJpY2tzLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==