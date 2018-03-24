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
	
	newGame.level = 2;
	
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
	var StrongerBrick = __webpack_require__(6);
	
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
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
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
	
	exports.Brick = Brick;
	exports.StrongerBrick = StrongerBrick;

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMzhkZDVkYzA3ZDk2NTZkNjA1ZDYiLCJ3ZWJwYWNrOi8vLy4vbGliL2luZGV4LmpzIiwid2VicGFjazovLy8uL2xpYi9QYWRkbGUuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL0tleWJvYXJkZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL0JhbGwuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL1Njb3Jlcy5qcyIsIndlYnBhY2s6Ly8vLi9saWIvR2FtZS5qcyIsIndlYnBhY2s6Ly8vLi9saWIvQnJpY2suanMiXSwibmFtZXMiOlsiY2FudmFzIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiUGFkZGxlIiwicmVxdWlyZSIsIktleWJvYXJkZXIiLCJCYWxsIiwiU2NvcmVzIiwiR2FtZSIsIkJyaWNrIiwiY3R4IiwiZ2V0Q29udGV4dCIsIm5ld0dhbWUiLCJib3VuY3lCYWxsIiwic3RhcnRQYWRkbGUiLCJrZXlib2FyZE1vbml0b3IiLCJNYXRoIiwicmFuZG9tIiwia2V5U3RhdGUiLCJicmlja3MiLCJyZXF1ZXN0SUQiLCJ1bmRlZmluZWQiLCJpc0RlYWQiLCJsZXZlbCIsImdlbmVyYXRlQnJpY2tzIiwic3RhcnRHYW1lIiwiZ2V0RnJvbVN0b3JhZ2UiLCJuZXdCcmlja3MiLCJjcmVhdGVCcmlja3NMdmxzT25lVHdvIiwiZm9yRWFjaCIsImdyYWJCcmlja3MiLCJicmljayIsImNyZWF0ZUJyaWNrc0x2bFRocmVlIiwid2luZG93IiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJrZXlEb3duIiwia2V5VXAiLCJyZXN0YXJ0R2FtZSIsImdhbWVMb29wIiwiZ2V0RWxlbWVudEJ5SWQiLCJpbm5lckhUTUwiLCJzY29yZSIsImxpdmVzIiwiZmlsbFN0eWxlIiwiY2xlYXJSZWN0Iiwid2lkdGgiLCJoZWlnaHQiLCJkcmF3IiwiZHkiLCJwYWRkbGVCYWxsQ29sbGlkaW5nIiwiZHgiLCJwYWRkbGVCYWxsWENoZWNrIiwiYnJpY2tCYWxsU2lkZUNvbGxpc2lvbiIsImJyaWNrQmFsbENvbGxpZGluZyIsIm1vdmUiLCJhbmltYXRlIiwiY2hlY2tCYWxsRGVhdGgiLCJiYWxsRGVhdGgiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJjaGVja0JyaWNrcyIsImNsZWFyQnJpY2tzIiwiY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJkZWxheWVkU3RhcnQiLCJlbmRHYW1lIiwic2V0VGltZW91dCIsInVzZXJTY29yZXMiLCJpbml0aWFscyIsInByb21wdCIsImNoZWNrSW5pdGlhbHMiLCJzY29yZVRvU3RvcmFnZSIsImxpdmVzSW5kaWNhdG9yIiwiaW5uZXJUZXh0IiwidGVzdCIsInMiLCJzbGljZSIsInRvVXBwZXJDYXNlIiwic2NvcmVzIiwic3RvcmVTY29yZXMiLCJzdHJpbmdpZnlTY29yZXMiLCJKU09OIiwic3RyaW5naWZ5IiwibG9jYWxTdG9yYWdlIiwic2V0SXRlbSIsImlkIiwidG9wU2NvcmVzIiwiaSIsImxlbmd0aCIsInJldHJpZXZlZEl0ZW0iLCJnZXRJdGVtIiwia2V5IiwicGFyc2VkSXRlbSIsInBhcnNlIiwicHVzaCIsInNvcnQiLCJhIiwiYiIsInNwbGljZSIsIkhUTUxJbml0aWFscyIsIkhUTUxTY29yZXMiLCJ4IiwieSIsImNvbnRleHQiLCJmaWxsUmVjdCIsIm1vZHVsZSIsImV4cG9ydHMiLCJrZXlzIiwibGVmdCIsInJpZ2h0Iiwia2V5Q29kZSIsInJhZGl1cyIsImJlZ2luUGF0aCIsImFyYyIsIlBJIiwic3Ryb2tlIiwiZmlsbCIsImNhbnZhc0hlaWdodCIsImNhbnZhc1dpZHRoIiwiRGF0ZSIsIm5vdyIsIlN0cm9uZ2VyQnJpY2siLCJiYWxsIiwicGFkZGxlIiwiZGlzY2FyZGVkQnJpY2tzIiwiYmFsbHMiLCJudW1Ccmlja3MiLCJicmlja3NBcnJheSIsImhlYWx0aCIsImZpbHRlciIsIm9iajEiLCJvYmoyIiwiYXJlQ29sbGlkaW5nIiwiY29sbGlzaW9uQ2hlY2siLCJwYWRkbGVGaXJzdEZpZnRoIiwicGFkZGxlU2Vjb25kRmlmdGgiLCJwYWRkbGVUaGlyZEZpZnRoIiwicGFkZGxlRm91cnRoRmlmdGgiLCJpbmRleCIsImluZGV4T2YiLCJiaW5kIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7O0FDdENBLEtBQU1BLFNBQVNDLFNBQVNDLGFBQVQsQ0FBdUIsY0FBdkIsQ0FBZjtBQUNBLEtBQU1DLFNBQVMsbUJBQUFDLENBQVEsQ0FBUixDQUFmO0FBQ0EsS0FBTUMsYUFBYSxtQkFBQUQsQ0FBUSxDQUFSLENBQW5CO0FBQ0EsS0FBTUUsT0FBTyxtQkFBQUYsQ0FBUSxDQUFSLENBQWI7QUFDQSxLQUFNRyxTQUFTLG1CQUFBSCxDQUFRLENBQVIsQ0FBZjtBQUNBLEtBQU1JLE9BQU8sbUJBQUFKLENBQVEsQ0FBUixDQUFiO0FBQ0EsS0FBTUssUUFBUSxtQkFBQUwsQ0FBUSxDQUFSLENBQWQ7QUFDQSxLQUFJTSxNQUFNVixPQUFPVyxVQUFQLENBQWtCLElBQWxCLENBQVY7QUFDQSxLQUFJQyxVQUFVLElBQUlKLElBQUosQ0FBU0ssVUFBVCxFQUFxQkMsV0FBckIsQ0FBZDtBQUNBLEtBQUlBLGNBQWMsSUFBSVgsTUFBSixDQUFXLEdBQVgsRUFBZ0IsR0FBaEIsRUFBcUIsRUFBckIsQ0FBbEI7QUFDQSxLQUFJWSxrQkFBa0IsSUFBSVYsVUFBSixFQUF0QjtBQUNBLEtBQUlRLGFBQWEsSUFBSVAsSUFBSixDQUFTLEdBQVQsRUFBYyxHQUFkLEVBQXFCVSxLQUFLQyxNQUFMLEtBQWdCLENBQWpCLEdBQXNCLEdBQTFDLEVBQWdELENBQWhELENBQWpCO0FBQ0EsS0FBSUMsV0FBVyxFQUFmO0FBQ0EsS0FBSUMsU0FBUyxJQUFJVixLQUFKLEVBQWI7QUFDQSxLQUFJ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QUFJbkUsT0FBT29FLE1BQTNCLEVBQW1DRCxHQUFuQyxFQUF3QztBQUFBLHlCQUNSbkUsT0FBT21FLENBQVAsQ0FEUTtBQUFBLGFBQy9CYyxDQUQrQixhQUMvQkEsQ0FEK0I7QUFBQSxhQUM1QkMsQ0FENEIsYUFDNUJBLENBRDRCO0FBQUEsYUFDekJ2RCxLQUR5QixhQUN6QkEsS0FEeUI7QUFBQSxhQUNsQkMsTUFEa0IsYUFDbEJBLE1BRGtCOztBQUV0QyxhQUFJNUIsT0FBT21FLENBQVAsRUFBVXlDLE1BQVYsS0FBcUIsQ0FBekIsRUFBNEI7QUFDMUJ6QixtQkFBUTFELFNBQVIsR0FBb0IsU0FBcEI7QUFDRCxVQUZELE1BRU8sSUFBSXpCLE9BQU9tRSxDQUFQLEVBQVV5QyxNQUFWLEtBQXFCLENBQXpCLEVBQTRCO0FBQ2pDekIsbUJBQVExRCxTQUFSLEdBQW9CLFNBQXBCO0FBQ0Q7QUFDRDBELGlCQUFRQyxRQUFSLENBQWlCSCxDQUFqQixFQUFvQkMsQ0FBcEIsRUFBdUJ2RCxLQUF2QixFQUE4QkMsTUFBOUI7QUFDRDtBQUNGOzs7Ozs7S0FHR3lFLGE7OztBQUNKLDBCQUFZcEIsQ0FBWixFQUFlQyxDQUFmLEVBQWtCMEIsTUFBbEIsRUFBMEI7QUFBQTs7QUFBQSwrSEFDbEIzQixDQURrQixFQUNmQyxDQURlOztBQUV4QixXQUFLMEIsTUFBTCxHQUFjQSxNQUFkO0FBRndCO0FBR3pCOzs7R0FKeUJ0SCxLOztTQVExQkEsSyxHQUFBQSxLO1NBQ0ErRyxhLEdBQUFBLGEiLCJmaWxlIjoibWFpbi5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAzOGRkNWRjMDdkOTY1NmQ2MDVkNiIsImNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNnYW1lLXNjcmVlbicpO1xuY29uc3QgUGFkZGxlID0gcmVxdWlyZSgnLi9QYWRkbGUnKTtcbmNvbnN0IEtleWJvYXJkZXIgPSByZXF1aXJlKCcuL0tleWJvYXJkZXInKTtcbmNvbnN0IEJhbGwgPSByZXF1aXJlKCcuL0JhbGwuanMnKTtcbmNvbnN0IFNjb3JlcyA9IHJlcXVpcmUoJy4vU2NvcmVzLmpzJyk7XG5jb25zdCBHYW1lID0gcmVxdWlyZSgnLi9HYW1lLmpzJyk7XG5jb25zdCBCcmljayA9IHJlcXVpcmUoJy4vQnJpY2suanMnKTtcbmxldCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbmxldCBuZXdHYW1lID0gbmV3IEdhbWUoYm91bmN5QmFsbCwgc3RhcnRQYWRkbGUpO1xubGV0IHN0YXJ0UGFkZGxlID0gbmV3IFBhZGRsZSgzNTAsIDEwMCwgMTUpO1xubGV0IGtleWJvYXJkTW9uaXRvciA9IG5ldyBLZXlib2FyZGVyKCk7XG5sZXQgYm91bmN5QmFsbCA9IG5ldyBCYWxsKDQwMCwgMjAwLCAoKE1hdGgucmFuZG9tKCkgKiAzKSAtIDEuNSksIDQpO1xubGV0IGtleVN0YXRlID0ge307XG5sZXQgYnJpY2tzID0gbmV3IEJyaWNrKCk7XG5sZXQgcmVxdWVzdElEID0gdW5kZWZpbmVkO1xubGV0IGlzRGVhZCA9IG51bGw7XG5cbm5ld0dhbWUubGV2ZWwgPSAyO1xuXG5nZW5lcmF0ZUJyaWNrcygpO1xuc3RhcnRHYW1lKCk7XG5nZXRGcm9tU3RvcmFnZSgpO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZUJyaWNrcygpIHtcbiAgaWYgKG5ld0dhbWUubGV2ZWwgPT09IDEgfHwgbmV3R2FtZS5sZXZlbCA9PT0gMikge1xuICAgIGxldCBuZXdCcmlja3MgPSBuZXdHYW1lLmNyZWF0ZUJyaWNrc0x2bHNPbmVUd28oNDAsIG5ld0dhbWUubGV2ZWwpO1xuICAgIG5ld0JyaWNrcy5mb3JFYWNoKCBicmljayA9PiBuZXdHYW1lLmdyYWJCcmlja3MoYnJpY2spICk7XG4gIH0gZWxzZSBpZiAobmV3R2FtZS5sZXZlbCA9PT0gMykge1xuICAgIGxldCBuZXdCcmlja3MgPSBuZXdHYW1lLmNyZWF0ZUJyaWNrc0x2bFRocmVlKDU0KTtcbiAgICBuZXdCcmlja3MuZm9yRWFjaCggYnJpY2sgPT4gbmV3R2FtZS5ncmFiQnJpY2tzKGJyaWNrKSApO1xuICB9XG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZnVuY3Rpb24oZSkge1xuICBrZXlTdGF0ZSA9IGtleWJvYXJkTW9uaXRvci5rZXlEb3duKGUpO1xufSk7XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGZ1bmN0aW9uKGUpIHtcbiAga2V5U3RhdGUgPSBrZXlib2FyZE1vbml0b3Iua2V5VXAoZSk7XG59KTtcblxuZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5ldy1nYW1lLWJ1dHRvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcmVzdGFydEdhbWUpO1xuXG5mdW5jdGlvbiBnYW1lTG9vcCgpIHtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VzZXItc2NvcmUnKS5pbm5lckhUTUwgPSBuZXdHYW1lLnNjb3JlO1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubGl2ZXMtaW5kaWNhdG9yJykuaW5uZXJIVE1MID0gbmV3R2FtZS5saXZlcztcbiAgY3R4LmZpbGxTdHlsZSA9ICcjMDAwJztcbiAgY3R4LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuICBzdGFydFBhZGRsZS5kcmF3KGN0eCk7XG4gIGJvdW5jeUJhbGwuZHJhdyhjdHgpO1xuICBib3VuY3lCYWxsLmR5ID0gbmV3R2FtZS5wYWRkbGVCYWxsQ29sbGlkaW5nKGJvdW5jeUJhbGwsIHN0YXJ0UGFkZGxlKTtcbiAgYm91bmN5QmFsbC5keCA9IG5ld0dhbWUucGFkZGxlQmFsbFhDaGVjayhib3VuY3lCYWxsLCBzdGFydFBhZGRsZSk7XG4gIGJvdW5jeUJhbGwuZHggPSBuZXdHYW1lLmJyaWNrQmFsbFNpZGVDb2xsaXNpb24oYm91bmN5QmFsbCwgbmV3R2FtZS5icmlja3MpO1xuICBib3VuY3lCYWxsLmR5ID0gbmV3R2FtZS5icmlja0JhbGxDb2xsaWRpbmcoYm91bmN5QmFsbCwgbmV3R2FtZS5icmlja3MpO1xuICBicmlja3MuZHJhdyhjdHgsIG5ld0dhbWUuYnJpY2tzKTtcbiAgYm91bmN5QmFsbC5tb3ZlKGNhbnZhcy5oZWlnaHQsIGNhbnZhcy53aWR0aCk7XG4gIHN0YXJ0UGFkZGxlLmFuaW1hdGUoa2V5U3RhdGUpO1xuICBpc0RlYWQgPSBuZXdHYW1lLmNoZWNrQmFsbERlYXRoKGJvdW5jeUJhbGwsIGNhbnZhcy5oZWlnaHQpO1xuICBpZiAoaXNEZWFkKSB7XG4gICAgYmFsbERlYXRoKCk7XG4gIH0gZWxzZSB7XG4gICAgcmVxdWVzdElEID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGdhbWVMb29wKTtcbiAgfVxuICBpZiAobmV3R2FtZS5jaGVja0JyaWNrcygpKSB7XG4gICAgYnJpY2tzLmNsZWFyQnJpY2tzKCk7XG4gICAgZ2VuZXJhdGVCcmlja3MoKTtcbiAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUocmVxdWVzdElEKTtcbiAgICByZXF1ZXN0SUQgPSBudWxsO1xuICAgIHN0YXJ0R2FtZSgpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlc3RhcnRHYW1lKCkge1xuICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUocmVxdWVzdElEKTtcbiAgcmVxdWVzdElEID0gbnVsbDtcbiAgbmV3R2FtZS5icmlja3MgPSBicmlja3MuY2xlYXJCcmlja3MoKTtcbiAgYm91bmN5QmFsbCA9IG5ldyBCYWxsKDQwMCwgMjAwLCAoKE1hdGgucmFuZG9tKCkgKiAzKSAtIDEuNSksIDQpO1xuICBuZXdHYW1lID0gbmV3IEdhbWUoYm91bmN5QmFsbCwgc3RhcnRQYWRkbGUpO1xuICBnZW5lcmF0ZUJyaWNrcygpO1xuICBzdGFydEdhbWUoKTtcbn1cblxuZnVuY3Rpb24gc3RhcnRHYW1lKCkge1xuICBjdHguZmlsbFN0eWxlID0gJyMwMDAnO1xuICBjdHguY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4gIGJvdW5jeUJhbGwgPSBuZXcgQmFsbCg0MDAsIDIwMCwgKChNYXRoLnJhbmRvbSgpICogMykgLSAxLjUpLCA0KTtcbiAgc3RhcnRQYWRkbGUgPSBuZXcgUGFkZGxlKDM1MCwgMTAwLCAxNSk7XG4gIHN0YXJ0UGFkZGxlLmRyYXcoY3R4KTtcbiAgYm91bmN5QmFsbC5kcmF3KGN0eCk7XG4gIGJyaWNrcy5kcmF3KGN0eCwgbmV3R2FtZS5icmlja3MpO1xuICBkZWxheWVkU3RhcnQoKTtcbiAgZW5kR2FtZSgpO1xufVxuXG5mdW5jdGlvbiBkZWxheWVkU3RhcnQoKSB7XG4gIGlmKCFyZXF1ZXN0SUQpIHtcbiAgICB3aW5kb3cuc2V0VGltZW91dChnYW1lTG9vcCwgMzAwMCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZW5kR2FtZSgpIHtcbiAgbGV0IHVzZXJTY29yZXMgPSBuZXcgU2NvcmVzKCk7XG4gIGlmKG5ld0dhbWUubGl2ZXMgPT09IDApIHtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXNlci1zY29yZScpLmlubmVySFRNTCA9IDA7XG4gICAgdXNlclNjb3Jlcy5pbml0aWFscyA9IHByb21wdCgnRW50ZXIgeW91ciBpbml0aWFscyEnLCAnJyk7XG4gICAgdXNlclNjb3Jlcy5zY29yZSA9IG5ld0dhbWUuc2NvcmU7XG4gICAgdXNlclNjb3Jlcy5pbml0aWFscyA9IGNoZWNrSW5pdGlhbHModXNlclNjb3Jlcy5pbml0aWFscyk7XG4gICAgc2NvcmVUb1N0b3JhZ2UodXNlclNjb3Jlcyk7XG4gICAgZ2V0RnJvbVN0b3JhZ2UodXNlclNjb3Jlcyk7XG4gICAgbmV3R2FtZSA9IG5ldyBHYW1lKGJvdW5jeUJhbGwsIHN0YXJ0UGFkZGxlKTtcbiAgICBicmlja3MgPSBuZXcgQnJpY2soKTtcbiAgICBnZW5lcmF0ZUJyaWNrcygpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGJhbGxEZWF0aCgpIHtcbiAgaWYocmVxdWVzdElEKSB7XG4gICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKHJlcXVlc3RJRCk7XG4gICAgcmVxdWVzdElEID0gbnVsbDtcbiAgICBpc0RlYWQgPSBmYWxzZTtcbiAgICBsZXQgbGl2ZXNJbmRpY2F0b3IgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubGl2ZXMtaW5kaWNhdG9yJyk7XG4gICAgbGl2ZXNJbmRpY2F0b3IuaW5uZXJUZXh0ID0gbmV3R2FtZS5saXZlcztcbiAgICBzdGFydEdhbWUoKTtcbiAgfVxufVxuXG5jb25zdCBjaGVja0luaXRpYWxzID0gcyA9PiAvW2Etel0qL2dpLnRlc3QocykgPyBzLnNsaWNlKDAsIDMpLnRvVXBwZXJDYXNlKCkgOiAnTi9BJztcblxuZnVuY3Rpb24gc2NvcmVUb1N0b3JhZ2Uoc2NvcmVzKSB7XG4gIGxldCBzdG9yZVNjb3JlcyA9IHNjb3JlcztcbiAgbGV0IHN0cmluZ2lmeVNjb3JlcyA9IEpTT04uc3RyaW5naWZ5KHN0b3JlU2NvcmVzKTtcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oc2NvcmVzLmlkLCBzdHJpbmdpZnlTY29yZXMpO1xufVxuXG5mdW5jdGlvbiBnZXRGcm9tU3RvcmFnZShzY29yZXMpIHtcbiAgbGV0IHRvcFNjb3JlcyA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGxvY2FsU3RvcmFnZS5sZW5ndGg7IGkrKyl7XG4gICAgbGV0IHJldHJpZXZlZEl0ZW0gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShsb2NhbFN0b3JhZ2Uua2V5KGkpKTtcbiAgICBsZXQgcGFyc2VkSXRlbSA9IEpTT04ucGFyc2UocmV0cmlldmVkSXRlbSk7XG4gICAgdG9wU2NvcmVzLnB1c2gocGFyc2VkSXRlbSk7XG4gIH1cbiAgdG9wU2NvcmVzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiBiLnNjb3JlIC0gYS5zY29yZTtcbiAgfSlcbiAgdG9wU2NvcmVzLnNwbGljZSgxMCwgMTAwMCk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdG9wU2NvcmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgbGV0IGluaXRpYWxzID0gdG9wU2NvcmVzW2ldLmluaXRpYWxzO1xuICAgIGxldCBzY29yZSA9IHRvcFNjb3Jlc1tpXS5zY29yZTtcbiAgICBsZXQgSFRNTEluaXRpYWxzID0gJ2hpZ2gtaW5pdGlhbHMtJyArIChpICsgMSk7XG4gICAgbGV0IEhUTUxTY29yZXMgPSAnaGlnaC1zY29yZS0nICsgKGkgKyAxKTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuJyArIEhUTUxJbml0aWFscykuaW5uZXJIVE1MID0gaW5pdGlhbHM7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLicgKyBIVE1MU2NvcmVzKS5pbm5lckhUTUwgPSBzY29yZTtcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbGliL2luZGV4LmpzIiwiY2xhc3MgUGFkZGxlIHtcbiAgY29uc3RydWN0b3IoeCwgd2lkdGgsIGhlaWdodCkge1xuICAgIHRoaXMueSA9IDQ3NTtcbiAgICB0aGlzLnggPSB4O1xuICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcbiAgfVxuICBkcmF3KGNvbnRleHQpIHtcbiAgICBjb250ZXh0LmZpbGxSZWN0KHRoaXMueCwgdGhpcy55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gIH1cbiAgYW5pbWF0ZShrZXlTdGF0ZSkge1xuICAgIGlmIChrZXlTdGF0ZVszN10gJiYgdGhpcy54ID4gMCkge1xuICAgICAgdGhpcy54IC09IDU7XG4gICAgfSBlbHNlIGlmIChrZXlTdGF0ZVszOV0gJiYgdGhpcy54IDwgNzAwKSB7XG4gICAgICB0aGlzLnggKz0gNTtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQYWRkbGU7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbGliL1BhZGRsZS5qcyIsImNsYXNzIEtleWJvYXJkZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmtleXMgPSB7XG4gICAgICBsZWZ0OiAzNyxcbiAgICAgIHJpZ2h0OiAzOSxcbiAgICB9O1xuICB9XG4gIGtleURvd24oZSkge1xuICAgIHZhciBrZXlTdGF0ZSA9IHt9O1xuICAgIGtleVN0YXRlW2Uua2V5Q29kZV0gPSB0cnVlO1xuICAgIHJldHVybiBrZXlTdGF0ZTtcbiAgfVxuXG4gIGtleVVwKGUpIHtcbiAgICB2YXIga2V5U3RhdGUgPSB7fTtcbiAgICBrZXlTdGF0ZVtlLmtleUNvZGVdID0gZmFsc2U7XG4gICAgcmV0dXJuIGtleVN0YXRlO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gS2V5Ym9hcmRlcjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2xpYi9LZXlib2FyZGVyLmpzIiwiY2xhc3MgQmFsbCB7XG4gIGNvbnN0cnVjdG9yKHgsIHksIGR4LCBkeSkge1xuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcbiAgICB0aGlzLmR4ID0gZHg7XG4gICAgdGhpcy5keSA9IGR5O1xuICAgIHRoaXMucmFkaXVzID0gNTtcbiAgICB0aGlzLndpZHRoID0gdGhpcy5yYWRpdXMgKiAyO1xuICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5yYWRpdXMgKiAyO1xuICB9XG4gIGRyYXcoY29udGV4dCkge1xuICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgY29udGV4dC5hcmModGhpcy54LCB0aGlzLnksIHRoaXMucmFkaXVzLCAwLCBNYXRoLlBJICogMiwgZmFsc2UpO1xuICAgIGNvbnRleHQuc3Ryb2tlKCk7XG4gICAgY29udGV4dC5maWxsU3R5bGUgPSBcIiMwMDBcIjtcbiAgICBjb250ZXh0LmZpbGwoKTtcbiAgfVxuICBtb3ZlKGNhbnZhc0hlaWdodCwgY2FudmFzV2lkdGgpIHtcbiAgICBpZiAoKHRoaXMueCArIHRoaXMucmFkaXVzKSA+PSBjYW52YXNXaWR0aCB8fCAodGhpcy54IC0gdGhpcy5yYWRpdXMpIDw9IDApIHtcbiAgICAgIHRoaXMuZHggPSAtdGhpcy5keDtcbiAgICB9XG4gICAgaWYgKCh0aGlzLnkgLSB0aGlzLnJhZGl1cykgPD0gMCkge1xuICAgICAgdGhpcy5keSA9IC10aGlzLmR5O1xuICAgIH1cbiAgICB0aGlzLnkgKz0gdGhpcy5keTtcbiAgICB0aGlzLnggKz0gdGhpcy5keDtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJhbGw7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9saWIvQmFsbC5qcyIsImNsYXNzIFNjb3JlcyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc2NvcmUgPSAwO1xuICAgIHRoaXMuaW5pdGlhbHMgPSAnWFhYJztcbiAgICB0aGlzLmlkID0gRGF0ZS5ub3coKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNjb3JlcztcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2xpYi9TY29yZXMuanMiLCJjb25zdCBCcmljayA9IHJlcXVpcmUoJy4vQnJpY2suanMnKTtcbmNvbnN0IFN0cm9uZ2VyQnJpY2sgPSByZXF1aXJlKCcuL0JyaWNrLmpzJyk7XG5cbmNsYXNzIEdhbWUge1xuICBjb25zdHJ1Y3RvcihiYWxsLCBwYWRkbGUpIHtcbiAgICB0aGlzLmJyaWNrcyA9IFtdO1xuICAgIHRoaXMuZGlzY2FyZGVkQnJpY2tzID0gW107XG4gICAgdGhpcy5iYWxscyA9IFtiYWxsXTtcbiAgICB0aGlzLnBhZGRsZSA9IHBhZGRsZTtcbiAgICB0aGlzLmxldmVsID0gMTtcbiAgICB0aGlzLmxpdmVzID0gMztcbiAgICB0aGlzLnNjb3JlID0gMDtcbiAgfVxuXG4gIGNyZWF0ZUJyaWNrc0x2bHNPbmVUd28obnVtQnJpY2tzLCBsZXZlbCkge1xuICAgIGxldCBicmlja3NBcnJheSA9IFtdO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1Ccmlja3M7IGkrKykge1xuICAgICAgICBpZiAoaSA8PSA5KSB7XG4gICAgICAgICAgbGV0IHggPSAyLjUgKyAoaSAqIDc1KSArIChpICogNSk7XG4gICAgICAgICAgbGV0IHkgPSAxNTtcbiAgICAgICAgICBicmlja3NBcnJheS5wdXNoKG5ldyBCcmljayh4LCB5KSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaSA8PSAxOSkge1xuICAgICAgICAgIGxldCB4ID0gMi41ICsgKChpIC0gMTApICogNzUpICsgKChpIC0gMTApICogNSk7XG4gICAgICAgICAgbGV0IHkgPSA0NTtcbiAgICAgICAgICBicmlja3NBcnJheS5wdXNoKG5ldyBCcmljayh4LCB5KSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaSA8PSAyOSkge1xuICAgICAgICAgIGxldCB4ID0gMi41ICsgKChpIC0gMjApICogNzUpICsgKChpIC0gMjApICogNSk7XG4gICAgICAgICAgbGV0IHkgPSA3NTtcbiAgICAgICAgICBicmlja3NBcnJheS5wdXNoKG5ldyBCcmljayh4LCB5KSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaSA8PSAzOSkge1xuICAgICAgICAgIGxldCB4ID0gMi41ICsgKChpIC0gMzApICogNzUpICsgKChpIC0gMzApICogNSk7XG4gICAgICAgICAgbGV0IHkgPSAxMDU7XG4gICAgICAgICAgaWYgKGxldmVsID09PSAyKSB7XG4gICAgICAgICAgICBsZXQgaGVhbHRoID0gMjtcbiAgICAgICAgICAgIGJyaWNrc0FycmF5LnB1c2gobmV3IFN0cm9uZ2VyQnJpY2soeCwgeSwgaGVhbHRoKSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gcmV0dXJuIGJyaWNrc0FycmF5O1xuICAgIH07XG5cbiAgY3JlYXRlQnJpY2tzTHZsVGhyZWUobnVtQnJpY2tzKSB7XG4gICAgbGV0IGJyaWNrc0FycmF5ID0gW11cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bUJyaWNrczsgaSsrKSB7XG4gICAgICBpZiAoaSA8PSA4KSB7XG4gICAgICAgIGxldCB4ID0gNDUgKyAoaSAqIDc1KSArIChpICogNSk7XG4gICAgICAgIGxldCB5ID0gMjU7XG4gICAgICAgIGxldCBoZWFsdGggPSAyO1xuICAgICAgICBicmlja3NBcnJheS5wdXNoKG5ldyBTdHJvbmdlckJyaWNrKHgsIHksIGhlYWx0aCkpO1xuICAgICAgfSBlbHNlIGlmIChpIDw9IDE3KSB7XG4gICAgICAgIGxldCB4ID0gNDUgKyAoKGkgLSA5KSAqIDc1KSArICgoaSAtIDkpICogNSk7XG4gICAgICAgIGxldCB5ID0gNTU7XG4gICAgICAgIGJyaWNrc0FycmF5LnB1c2gobmV3IEJyaWNrKHgsIHkpKTtcbiAgICAgIH0gZWxzZSBpZiAoaSA8PSAyNikge1xuICAgICAgICBsZXQgeCA9IDQ1ICsgKChpIC0gMTgpICogNzUpICsgKChpIC0gMTgpICogNSk7XG4gICAgICAgIGxldCB5ID0gODU7XG4gICAgICAgIGxldCBoZWFsdGggPSAyO1xuICAgICAgICBicmlja3NBcnJheS5wdXNoKG5ldyBTdHJvbmdlckJyaWNrKHgsIHksIGhlYWx0aCkpO1xuICAgICAgfSBlbHNlIGlmIChpIDw9IDM1KSB7XG4gICAgICAgIGxldCB4ID0gNDUgKyAoKGkgLSAyNykgKiA3NSkgKyAoKGkgLSAyNykgKiA1KTtcbiAgICAgICAgbGV0IHkgPSAxMTU7XG4gICAgICAgIGxldCBoZWFsdGggPSAyO1xuICAgICAgICBicmlja3NBcnJheS5wdXNoKG5ldyBTdHJvbmdlckJyaWNrKHgsIHksIGhlYWx0aCkpO1xuICAgICAgfSBlbHNlIGlmIChpIDw9IDQ0KSB7XG4gICAgICAgIGxldCB4ID0gNDUgKyAoKGkgLSAzNikgKiA3NSkgKyAoKGkgLSAzNikgKiA1KTtcbiAgICAgICAgbGV0IHkgPSAxNDU7XG4gICAgICAgIGJyaWNrc0FycmF5LnB1c2gobmV3IEJyaWNrKHgsIHkpKVxuICAgICAgfSBlbHNlIGlmIChpIDw9IDUzKSB7XG4gICAgICAgIGxldCB4ID0gNDUgKyAoKGkgLSA0NSkgKiA3NSkgKyAoKGkgLSA0NSkgKiA1KTtcbiAgICAgICAgbGV0IHkgPSAxNzU7XG4gICAgICAgIGxldCBoZWFsdGggPSAyO1xuICAgICAgICBicmlja3NBcnJheS5wdXNoKG5ldyBTdHJvbmdlckJyaWNrKHgsIHksIGhlYWx0aCkpO1xuICAgICAgfVxuICAgIH1cbiAgICBicmlja3NBcnJheSA9IGJyaWNrc0FycmF5LmZpbHRlcihicmljayA9PiBicmljay54ICE9PSAzNjUpO1xuICAgIHJldHVybiBicmlja3NBcnJheTtcbiAgfVxuXG4gIGNvbGxpc2lvbkNoZWNrKG9iajEsIG9iajIpIHtcbiAgICBpZiAob2JqMS54IDwgb2JqMi54ICsgb2JqMi53aWR0aCAgJiYgb2JqMS54ICsgb2JqMS53aWR0aCAgPiBvYmoyLnggJiZcbiAgICAgICAgb2JqMS55IDwgb2JqMi55ICsgb2JqMi5oZWlnaHQgJiYgb2JqMS55ICsgb2JqMS5oZWlnaHQgPiBvYmoyLnkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcGFkZGxlQmFsbENvbGxpZGluZyhiYWxsLCBwYWRkbGUpIHtcbiAgICBsZXQgYXJlQ29sbGlkaW5nID0gdGhpcy5jb2xsaXNpb25DaGVjayhiYWxsLCBwYWRkbGUpO1xuICAgIGxldCBkeSA9IGJhbGwuZHk7XG4gICAgaWYgKGFyZUNvbGxpZGluZykge1xuICAgICAgcmV0dXJuIGR5ID0gLWR5O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZHk7XG4gICAgfVxuICB9XG5cbiAgcGFkZGxlQmFsbFhDaGVjayhiYWxsLCBwYWRkbGUpIHtcbiAgICBsZXQgYXJlQ29sbGlkaW5nID0gdGhpcy5jb2xsaXNpb25DaGVjayhiYWxsLCBwYWRkbGUpO1xuICAgIGxldCBwYWRkbGVGaXJzdEZpZnRoID0gcGFkZGxlLnggKyAocGFkZGxlLndpZHRoIC8gNSk7XG4gICAgbGV0IHBhZGRsZVNlY29uZEZpZnRoID0gcGFkZGxlLnggKyAoKHBhZGRsZS53aWR0aCAvIDUpICogMik7XG4gICAgbGV0IHBhZGRsZVRoaXJkRmlmdGggPSBwYWRkbGUueCArICgocGFkZGxlLndpZHRoIC8gNSkgKiA0KTtcbiAgICBsZXQgcGFkZGxlRm91cnRoRmlmdGggPSBwYWRkbGUueCArIHBhZGRsZS53aWR0aDtcbiAgICBpZiAoYXJlQ29sbGlkaW5nKSB7XG4gICAgICBpZiAoYmFsbC54IDwgcGFkZGxlRmlyc3RGaWZ0aCkge1xuICAgICAgICBiYWxsLmR4IC09IDM7XG4gICAgICB9IGVsc2UgaWYgKGJhbGwueCA8IHBhZGRsZVNlY29uZEZpZnRoKSB7XG4gICAgICAgIGJhbGwuZHggLT0gMTtcbiAgICAgIH0gZWxzZSBpZiAoYmFsbC54IDwgcGFkZGxlVGhpcmRGaWZ0aCkge1xuICAgICAgICBiYWxsLmR4ICs9IDE7XG4gICAgICB9IGVsc2UgaWYgKGJhbGwueCA8IHBhZGRsZUZvdXJ0aEZpZnRoKSB7XG4gICAgICAgIGJhbGwuZHggKz0gMztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGJhbGwuZHggPiAxMCkge1xuICAgICAgYmFsbC5keCA9IDEwO1xuICAgIH0gZWxzZSBpZiAoYmFsbC5keCA8IC0xMCkge1xuICAgICAgYmFsbC5keCA9IC0xMDtcbiAgICB9XG4gICAgcmV0dXJuIGJhbGwuZHhcbiAgfVxuXG4gIGdyYWJCcmlja3MoYnJpY2tzKSB7XG4gICAgdGhpcy5icmlja3MucHVzaChicmlja3MpO1xuICB9XG5cbiAgYnJpY2tCYWxsQ29sbGlkaW5nKGJhbGwsIGJyaWNrcykge1xuICAgIGxldCBkeSA9IGJhbGwuZHk7XG4gICAgYnJpY2tzLmZvckVhY2goZnVuY3Rpb24oYnJpY2spIHtcbiAgICAgIGxldCBpbmRleCA9IHRoaXMuYnJpY2tzLmluZGV4T2YoYnJpY2spO1xuICAgICAgbGV0IGFyZUNvbGxpZGluZyA9IHRoaXMuY29sbGlzaW9uQ2hlY2soYmFsbCwgYnJpY2spO1xuICAgICAgaWYgKGFyZUNvbGxpZGluZykge1xuICAgICAgICB0aGlzLnNjb3JlICs9IDEwMDtcbiAgICAgICAgaWYgKGJyaWNrLmhlYWx0aCA9PT0gMSl7XG4gICAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5icmlja3MuaW5kZXhPZihicmljayk7XG4gICAgICAgICAgdGhpcy5kaXNjYXJkZWRCcmlja3MgPSB0aGlzLmJyaWNrcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9XG4gICAgICAgIGJyaWNrLmhlYWx0aC0tO1xuICAgICAgICBpZiAoYmFsbC54IDwgKGJyaWNrLnggKyBicmljay53aWR0aCkgJiYgYmFsbC54ID4gYnJpY2sueCkge1xuICAgICAgICAgIHJldHVybiBkeSA9IC1keTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZHk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LmJpbmQodGhpcykpXG4gICAgcmV0dXJuIGR5O1xuICB9XG5cbiAgY2hlY2tCcmlja3MoKSB7XG4gICAgaWYgKHRoaXMuYnJpY2tzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy5sZXZlbCsrO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgYnJpY2tCYWxsU2lkZUNvbGxpc2lvbihiYWxsLCBicmlja3MpIHtcbiAgICBicmlja3MuZm9yRWFjaChmdW5jdGlvbihicmljaykge1xuICAgICAgbGV0IGFyZUNvbGxpZGluZyA9IHRoaXMuY29sbGlzaW9uQ2hlY2soYmFsbCwgYnJpY2spO1xuICAgICAgaWYgKGFyZUNvbGxpZGluZykge1xuICAgICAgICBpZiAoYmFsbC54IDw9IGJyaWNrLnggfHwgYmFsbC54ID49IChicmljay54ICsgYnJpY2sud2lkdGgpKSB7XG4gICAgICAgICAgYmFsbC5keCA9IC1iYWxsLmR4O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfS5iaW5kKHRoaXMpKVxuICAgIHJldHVybiBiYWxsLmR4O1xuICB9XG5cbiAgY2hlY2tCYWxsRGVhdGgoYmFsbCwgY2FudmFzSGVpZ2h0KSB7XG4gICAgaWYgKGJhbGwueSA+PSBjYW52YXNIZWlnaHQpIHtcbiAgICAgIHRoaXMubGl2ZXMgLT0gMTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2xpYi9HYW1lLmpzIiwiY2xhc3MgQnJpY2sge1xuICBjb25zdHJ1Y3Rvcih4LCB5KSB7XG4gICAgdGhpcy54ID0geDtcbiAgICB0aGlzLnkgPSB5O1xuICAgIHRoaXMuaGVhbHRoID0gMTtcbiAgICB0aGlzLndpZHRoID0gNzU7XG4gICAgdGhpcy5oZWlnaHQgPSAyNTtcbiAgfVxuXG4gIGNsZWFyQnJpY2tzKCkge1xuICAgIGxldCBicmlja3NBcnJheSA9IFtdO1xuICAgIHJldHVybiBicmlja3NBcnJheTtcbiAgfVxuXG4gIGRyYXcoY29udGV4dCwgYnJpY2tzKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBicmlja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHt4LCB5LCB3aWR0aCwgaGVpZ2h0fSA9IGJyaWNrc1tpXTtcbiAgICAgIGlmIChicmlja3NbaV0uaGVhbHRoID09PSAyKSB7XG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJyMzNjA2MDAnXG4gICAgICB9IGVsc2UgaWYgKGJyaWNrc1tpXS5oZWFsdGggPT09IDEpIHtcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAnI0ZDMDAwOSdcbiAgICAgIH1cbiAgICAgIGNvbnRleHQuZmlsbFJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XG4gICAgfVxuICB9XG59XG5cbmNsYXNzIFN0cm9uZ2VyQnJpY2sgZXh0ZW5kcyBCcmljayB7XG4gIGNvbnN0cnVjdG9yKHgsIHksIGhlYWx0aCkge1xuICAgIHN1cGVyKHgsIHkpO1xuICAgIHRoaXMuaGVhbHRoID0gaGVhbHRoO1xuICB9XG59XG5cbmV4cG9ydCB7IFxuICBCcmljayxcbiAgU3Ryb25nZXJCcmljayxcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9saWIvQnJpY2suanMiXSwic291cmNlUm9vdCI6IiJ9