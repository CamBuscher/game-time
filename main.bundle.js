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
	    var newBricks = bricks.createBricksLvlsOneTwo(40, newGame.level);
	    newBricks.forEach(function (brick) {
	      return newGame.grabBricks(brick);
	    });
	  } else if (newGame.level === 3) {
	    var _newBricks = bricks.createBricksLvlThree(54);
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
	  }
	
	  _createClass(Brick, [{
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMTljY2MzYmQwYjZhOGJmN2EzOGEiLCJ3ZWJwYWNrOi8vLy4vbGliL2luZGV4LmpzIiwid2VicGFjazovLy8uL2xpYi9QYWRkbGUuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL0tleWJvYXJkZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL0JhbGwuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL1Njb3Jlcy5qcyIsIndlYnBhY2s6Ly8vLi9saWIvR2FtZS5qcyIsIndlYnBhY2s6Ly8vLi9saWIvQnJpY2suanMiXSwibmFtZXMiOlsiY2FudmFzIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiUGFkZGxlIiwicmVxdWlyZSIsIktleWJvYXJkZXIiLCJCYWxsIiwiU2NvcmVzIiwiR2FtZSIsIkJyaWNrIiwiY3R4IiwiZ2V0Q29udGV4dCIsIm5ld0dhbWUiLCJib3VuY3lCYWxsIiwic3RhcnRQYWRkbGUiLCJrZXlib2FyZE1vbml0b3IiLCJNYXRoIiwicmFuZG9tIiwia2V5U3RhdGUiLCJicmlja3MiLCJyZXF1ZXN0SUQiLCJ1bmRlZmluZWQiLCJpc0RlYWQiLCJnZW5lcmF0ZUJyaWNrcyIsInN0YXJ0R2FtZSIsImdldEZyb21TdG9yYWdlIiwibGV2ZWwiLCJuZXdCcmlja3MiLCJjcmVhdGVCcmlja3NMdmxzT25lVHdvIiwiZm9yRWFjaCIsImdyYWJCcmlja3MiLCJicmljayIsImNyZWF0ZUJyaWNrc0x2bFRocmVlIiwid2luZG93IiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJrZXlEb3duIiwia2V5VXAiLCJyZXN0YXJ0R2FtZSIsImdhbWVMb29wIiwiZ2V0RWxlbWVudEJ5SWQiLCJpbm5lckhUTUwiLCJzY29yZSIsImxpdmVzIiwiZmlsbFN0eWxlIiwiY2xlYXJSZWN0Iiwid2lkdGgiLCJoZWlnaHQiLCJkcmF3IiwiZHkiLCJwYWRkbGVCYWxsQ29sbGlkaW5nIiwiZHgiLCJwYWRkbGVCYWxsWENoZWNrIiwiYnJpY2tCYWxsU2lkZUNvbGxpc2lvbiIsImJyaWNrQmFsbENvbGxpZGluZyIsIm1vdmUiLCJhbmltYXRlIiwiY2hlY2tCYWxsRGVhdGgiLCJiYWxsRGVhdGgiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJjaGVja0JyaWNrcyIsImNsZWFyQnJpY2tzIiwiY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJkZWxheWVkU3RhcnQiLCJlbmRHYW1lIiwic2V0VGltZW91dCIsInVzZXJTY29yZXMiLCJpbml0aWFscyIsInByb21wdCIsImNoZWNrSW5pdGlhbHMiLCJzY29yZVRvU3RvcmFnZSIsImxpdmVzSW5kaWNhdG9yIiwiaW5uZXJUZXh0IiwidGVzdCIsInMiLCJzbGljZSIsInRvVXBwZXJDYXNlIiwic2NvcmVzIiwic3RvcmVTY29yZXMiLCJzdHJpbmdpZnlTY29yZXMiLCJKU09OIiwic3RyaW5naWZ5IiwibG9jYWxTdG9yYWdlIiwic2V0SXRlbSIsImlkIiwidG9wU2NvcmVzIiwiaSIsImxlbmd0aCIsInJldHJpZXZlZEl0ZW0iLCJnZXRJdGVtIiwia2V5IiwicGFyc2VkSXRlbSIsInBhcnNlIiwicHVzaCIsInNvcnQiLCJhIiwiYiIsInNwbGljZSIsIkhUTUxJbml0aWFscyIsIkhUTUxTY29yZXMiLCJ4IiwieSIsImNvbnRleHQiLCJmaWxsUmVjdCIsIm1vZHVsZSIsImV4cG9ydHMiLCJrZXlzIiwibGVmdCIsInJpZ2h0Iiwia2V5Q29kZSIsInJhZGl1cyIsImJlZ2luUGF0aCIsImFyYyIsIlBJIiwic3Ryb2tlIiwiZmlsbCIsImNhbnZhc0hlaWdodCIsImNhbnZhc1dpZHRoIiwiRGF0ZSIsIm5vdyIsImJhbGwiLCJwYWRkbGUiLCJkaXNjYXJkZWRCcmlja3MiLCJiYWxscyIsIm9iajEiLCJvYmoyIiwiYXJlQ29sbGlkaW5nIiwiY29sbGlzaW9uQ2hlY2siLCJwYWRkbGVGaXJzdEZpZnRoIiwicGFkZGxlU2Vjb25kRmlmdGgiLCJwYWRkbGVUaGlyZEZpZnRoIiwicGFkZGxlRm91cnRoRmlmdGgiLCJpbmRleCIsImluZGV4T2YiLCJoZWFsdGgiLCJiaW5kIiwibnVtQnJpY2tzIiwiYnJpY2tzQXJyYXkiLCJTdHJvbmdlckJyaWNrIiwiZmlsdGVyIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7O0FDdENBLEtBQU1BLFNBQVNDLFNBQVNDLGFBQVQsQ0FBdUIsY0FBdkIsQ0FBZjtBQUNBLEtBQU1DLFNBQVMsbUJBQUFDLENBQVEsQ0FBUixDQUFmO0FBQ0EsS0FBTUMsYUFBYSxtQkFBQUQsQ0FBUSxDQUFSLENBQW5CO0FBQ0EsS0FBTUUsT0FBTyxtQkFBQUYsQ0FBUSxDQUFSLENBQWI7QUFDQSxLQUFNRyxTQUFTLG1CQUFBSCxDQUFRLENBQVIsQ0FBZjtBQUNBLEtBQU1JLE9BQU8sbUJBQUFKLENBQVEsQ0FBUixDQUFiO0FBQ0EsS0FBTUssUUFBUSxtQkFBQUwsQ0FBUSxDQUFSLENBQWQ7QUFDQSxLQUFJTSxNQUFNVixPQUFPVyxVQUFQLENBQWtCLElBQWxCLENBQVY7QUFDQSxLQUFJQyxVQUFVLElBQUlKLElBQUosQ0FBU0ssVUFBVCxFQUFxQkMsV0FBckIsQ0FBZDtBQUNBLEtBQUlBLGNBQWMsSUFBSVgsTUFBSixDQUFXLEdBQVgsRUFBZ0IsR0FBaEIsRUFBcUIsRUFBckIsQ0FBbEI7QUFDQSxLQUFJWSxrQkFBa0IsSUFBSVYsVUFBSixFQUF0QjtBQUNBLEtBQUlRLGFBQWEsSUFBSVAsSUFBSixDQUFTLEdBQVQsRUFBYyxHQUFkLEVBQXFCVSxLQUFLQyxNQUFMLEtBQWdCLENBQWpCLEdBQXNCLEdBQTFDLEVBQWdELENBQWhELENBQWpCO0FBQ0EsS0FBSUMsV0FBVyxFQUFmO0FBQ0EsS0FBSUMsU0FBUyxJQUFJVixLQUFKLEVBQWI7QUFDQSxLQUFJ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QzVCQSxDQUQ0QjtBQUFBLGFBQ3pCdkQsS0FEeUIsYUFDekJBLEtBRHlCO0FBQUEsYUFDbEJDLE1BRGtCLGFBQ2xCQSxNQURrQjs7QUFFdEMsYUFBSTVCLE9BQU9tRSxDQUFQLEVBQVVnRCxNQUFWLEtBQXFCLENBQXpCLEVBQTRCO0FBQzFCaEMsbUJBQVExRCxTQUFSLEdBQW9CLFNBQXBCO0FBQ0QsVUFGRCxNQUVPLElBQUl6QixPQUFPbUUsQ0FBUCxFQUFVZ0QsTUFBVixLQUFxQixDQUF6QixFQUE0QjtBQUNqQ2hDLG1CQUFRMUQsU0FBUixHQUFvQixTQUFwQjtBQUNEO0FBQ0QwRCxpQkFBUUMsUUFBUixDQUFpQkgsQ0FBakIsRUFBb0JDLENBQXBCLEVBQXVCdkQsS0FBdkIsRUFBOEJDLE1BQTlCO0FBQ0Q7QUFDRjs7Ozs7O0tBR0cyRixhOzs7QUFDSiwwQkFBWXRDLENBQVosRUFBZUMsQ0FBZixFQUFrQmlDLE1BQWxCLEVBQTBCO0FBQUE7O0FBQUEsK0hBQ2xCbEMsQ0FEa0IsRUFDZkMsQ0FEZTs7QUFFeEIsV0FBS2lDLE1BQUwsR0FBY0EsTUFBZDtBQUZ3QjtBQUd6Qjs7O0dBSnlCN0gsSzs7QUFPNUIrRixRQUFPQyxPQUFQLEdBQWlCaEcsS0FBakIsQyIsImZpbGUiOiJtYWluLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDE5Y2NjM2JkMGI2YThiZjdhMzhhIiwiY29uc3QgY2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2dhbWUtc2NyZWVuJyk7XG5jb25zdCBQYWRkbGUgPSByZXF1aXJlKCcuL1BhZGRsZScpO1xuY29uc3QgS2V5Ym9hcmRlciA9IHJlcXVpcmUoJy4vS2V5Ym9hcmRlcicpO1xuY29uc3QgQmFsbCA9IHJlcXVpcmUoJy4vQmFsbC5qcycpO1xuY29uc3QgU2NvcmVzID0gcmVxdWlyZSgnLi9TY29yZXMuanMnKTtcbmNvbnN0IEdhbWUgPSByZXF1aXJlKCcuL0dhbWUuanMnKTtcbmNvbnN0IEJyaWNrID0gcmVxdWlyZSgnLi9Ccmljay5qcycpO1xubGV0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xubGV0IG5ld0dhbWUgPSBuZXcgR2FtZShib3VuY3lCYWxsLCBzdGFydFBhZGRsZSk7XG5sZXQgc3RhcnRQYWRkbGUgPSBuZXcgUGFkZGxlKDM1MCwgMTAwLCAxNSk7XG5sZXQga2V5Ym9hcmRNb25pdG9yID0gbmV3IEtleWJvYXJkZXIoKTtcbmxldCBib3VuY3lCYWxsID0gbmV3IEJhbGwoNDAwLCAyMDAsICgoTWF0aC5yYW5kb20oKSAqIDMpIC0gMS41KSwgNCk7XG5sZXQga2V5U3RhdGUgPSB7fTtcbmxldCBicmlja3MgPSBuZXcgQnJpY2soKTtcbmxldCByZXF1ZXN0SUQgPSB1bmRlZmluZWQ7XG5sZXQgaXNEZWFkID0gbnVsbDtcblxuZ2VuZXJhdGVCcmlja3MoKTtcbnN0YXJ0R2FtZSgpO1xuZ2V0RnJvbVN0b3JhZ2UoKTtcblxuZnVuY3Rpb24gZ2VuZXJhdGVCcmlja3MoKSB7XG4gIGlmIChuZXdHYW1lLmxldmVsID09PSAxIHx8IG5ld0dhbWUubGV2ZWwgPT09IDIpIHtcbiAgICBsZXQgbmV3QnJpY2tzID0gYnJpY2tzLmNyZWF0ZUJyaWNrc0x2bHNPbmVUd28oNDAsIG5ld0dhbWUubGV2ZWwpO1xuICAgIG5ld0JyaWNrcy5mb3JFYWNoKCBicmljayA9PiBuZXdHYW1lLmdyYWJCcmlja3MoYnJpY2spICk7XG4gIH0gZWxzZSBpZiAobmV3R2FtZS5sZXZlbCA9PT0gMykge1xuICAgIGxldCBuZXdCcmlja3MgPSBicmlja3MuY3JlYXRlQnJpY2tzTHZsVGhyZWUoNTQpO1xuICAgIG5ld0JyaWNrcy5mb3JFYWNoKCBicmljayA9PiBuZXdHYW1lLmdyYWJCcmlja3MoYnJpY2spICk7XG4gIH1cbn1cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBmdW5jdGlvbihlKSB7XG4gIGtleVN0YXRlID0ga2V5Ym9hcmRNb25pdG9yLmtleURvd24oZSk7XG59KTtcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgZnVuY3Rpb24oZSkge1xuICBrZXlTdGF0ZSA9IGtleWJvYXJkTW9uaXRvci5rZXlVcChlKTtcbn0pO1xuXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmV3LWdhbWUtYnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCByZXN0YXJ0R2FtZSk7XG5cbmZ1bmN0aW9uIGdhbWVMb29wKCkge1xuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXNlci1zY29yZScpLmlubmVySFRNTCA9IG5ld0dhbWUuc2NvcmU7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5saXZlcy1pbmRpY2F0b3InKS5pbm5lckhUTUwgPSBuZXdHYW1lLmxpdmVzO1xuICBjdHguZmlsbFN0eWxlID0gJyMwMDAnO1xuICBjdHguY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4gIHN0YXJ0UGFkZGxlLmRyYXcoY3R4KTtcbiAgYm91bmN5QmFsbC5kcmF3KGN0eCk7XG4gIGJvdW5jeUJhbGwuZHkgPSBuZXdHYW1lLnBhZGRsZUJhbGxDb2xsaWRpbmcoYm91bmN5QmFsbCwgc3RhcnRQYWRkbGUpO1xuICBib3VuY3lCYWxsLmR4ID0gbmV3R2FtZS5wYWRkbGVCYWxsWENoZWNrKGJvdW5jeUJhbGwsIHN0YXJ0UGFkZGxlKTtcbiAgYm91bmN5QmFsbC5keCA9IG5ld0dhbWUuYnJpY2tCYWxsU2lkZUNvbGxpc2lvbihib3VuY3lCYWxsLCBuZXdHYW1lLmJyaWNrcyk7XG4gIGJvdW5jeUJhbGwuZHkgPSBuZXdHYW1lLmJyaWNrQmFsbENvbGxpZGluZyhib3VuY3lCYWxsLCBuZXdHYW1lLmJyaWNrcyk7XG4gIGJyaWNrcy5kcmF3KGN0eCwgbmV3R2FtZS5icmlja3MpO1xuICBib3VuY3lCYWxsLm1vdmUoY2FudmFzLmhlaWdodCwgY2FudmFzLndpZHRoKTtcbiAgc3RhcnRQYWRkbGUuYW5pbWF0ZShrZXlTdGF0ZSk7XG4gIGlzRGVhZCA9IG5ld0dhbWUuY2hlY2tCYWxsRGVhdGgoYm91bmN5QmFsbCwgY2FudmFzLmhlaWdodCk7XG4gIGlmIChpc0RlYWQpIHtcbiAgICBiYWxsRGVhdGgoKTtcbiAgfSBlbHNlIHtcbiAgICByZXF1ZXN0SUQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZ2FtZUxvb3ApO1xuICB9XG4gIGlmIChuZXdHYW1lLmNoZWNrQnJpY2tzKCkpIHtcbiAgICBicmlja3MuY2xlYXJCcmlja3MoKTtcbiAgICBnZW5lcmF0ZUJyaWNrcygpO1xuICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZShyZXF1ZXN0SUQpO1xuICAgIHJlcXVlc3RJRCA9IG51bGw7XG4gICAgc3RhcnRHYW1lKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVzdGFydEdhbWUoKSB7XG4gIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZShyZXF1ZXN0SUQpO1xuICByZXF1ZXN0SUQgPSBudWxsO1xuICBuZXdHYW1lLmJyaWNrcyA9IGJyaWNrcy5jbGVhckJyaWNrcygpO1xuICBib3VuY3lCYWxsID0gbmV3IEJhbGwoNDAwLCAyMDAsICgoTWF0aC5yYW5kb20oKSAqIDMpIC0gMS41KSwgNCk7XG4gIG5ld0dhbWUgPSBuZXcgR2FtZShib3VuY3lCYWxsLCBzdGFydFBhZGRsZSk7XG4gIGdlbmVyYXRlQnJpY2tzKCk7XG4gIHN0YXJ0R2FtZSgpO1xufVxuXG5mdW5jdGlvbiBzdGFydEdhbWUoKSB7XG4gIGN0eC5maWxsU3R5bGUgPSAnIzAwMCc7XG4gIGN0eC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgYm91bmN5QmFsbCA9IG5ldyBCYWxsKDQwMCwgMjAwLCAoKE1hdGgucmFuZG9tKCkgKiAzKSAtIDEuNSksIDQpO1xuICBzdGFydFBhZGRsZSA9IG5ldyBQYWRkbGUoMzUwLCAxMDAsIDE1KTtcbiAgc3RhcnRQYWRkbGUuZHJhdyhjdHgpO1xuICBib3VuY3lCYWxsLmRyYXcoY3R4KTtcbiAgYnJpY2tzLmRyYXcoY3R4LCBuZXdHYW1lLmJyaWNrcyk7XG4gIGRlbGF5ZWRTdGFydCgpO1xuICBlbmRHYW1lKCk7XG59XG5cbmZ1bmN0aW9uIGRlbGF5ZWRTdGFydCgpIHtcbiAgaWYoIXJlcXVlc3RJRCkge1xuICAgIHdpbmRvdy5zZXRUaW1lb3V0KGdhbWVMb29wLCAzMDAwKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBlbmRHYW1lKCkge1xuICBsZXQgdXNlclNjb3JlcyA9IG5ldyBTY29yZXMoKTtcbiAgaWYobmV3R2FtZS5saXZlcyA9PT0gMCkge1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1c2VyLXNjb3JlJykuaW5uZXJIVE1MID0gMDtcbiAgICB1c2VyU2NvcmVzLmluaXRpYWxzID0gcHJvbXB0KCdFbnRlciB5b3VyIGluaXRpYWxzIScsICcnKTtcbiAgICB1c2VyU2NvcmVzLnNjb3JlID0gbmV3R2FtZS5zY29yZTtcbiAgICB1c2VyU2NvcmVzLmluaXRpYWxzID0gY2hlY2tJbml0aWFscyh1c2VyU2NvcmVzLmluaXRpYWxzKTtcbiAgICBzY29yZVRvU3RvcmFnZSh1c2VyU2NvcmVzKTtcbiAgICBnZXRGcm9tU3RvcmFnZSh1c2VyU2NvcmVzKTtcbiAgICBuZXdHYW1lID0gbmV3IEdhbWUoYm91bmN5QmFsbCwgc3RhcnRQYWRkbGUpO1xuICAgIGJyaWNrcyA9IG5ldyBCcmljaygpO1xuICAgIGdlbmVyYXRlQnJpY2tzKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gYmFsbERlYXRoKCkge1xuICBpZihyZXF1ZXN0SUQpIHtcbiAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUocmVxdWVzdElEKTtcbiAgICByZXF1ZXN0SUQgPSBudWxsO1xuICAgIGlzRGVhZCA9IGZhbHNlO1xuICAgIGxldCBsaXZlc0luZGljYXRvciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5saXZlcy1pbmRpY2F0b3InKTtcbiAgICBsaXZlc0luZGljYXRvci5pbm5lclRleHQgPSBuZXdHYW1lLmxpdmVzO1xuICAgIHN0YXJ0R2FtZSgpO1xuICB9XG59XG5cbmNvbnN0IGNoZWNrSW5pdGlhbHMgPSBzID0+IC9bYS16XSovZ2kudGVzdChzKSA/IHMuc2xpY2UoMCwgMykudG9VcHBlckNhc2UoKSA6ICdOL0EnO1xuXG5mdW5jdGlvbiBzY29yZVRvU3RvcmFnZShzY29yZXMpIHtcbiAgbGV0IHN0b3JlU2NvcmVzID0gc2NvcmVzO1xuICBsZXQgc3RyaW5naWZ5U2NvcmVzID0gSlNPTi5zdHJpbmdpZnkoc3RvcmVTY29yZXMpO1xuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShzY29yZXMuaWQsIHN0cmluZ2lmeVNjb3Jlcyk7XG59XG5cbmZ1bmN0aW9uIGdldEZyb21TdG9yYWdlKHNjb3Jlcykge1xuICBsZXQgdG9wU2NvcmVzID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbG9jYWxTdG9yYWdlLmxlbmd0aDsgaSsrKXtcbiAgICBsZXQgcmV0cmlldmVkSXRlbSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGxvY2FsU3RvcmFnZS5rZXkoaSkpO1xuICAgIGxldCBwYXJzZWRJdGVtID0gSlNPTi5wYXJzZShyZXRyaWV2ZWRJdGVtKTtcbiAgICB0b3BTY29yZXMucHVzaChwYXJzZWRJdGVtKTtcbiAgfVxuICB0b3BTY29yZXMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIGIuc2NvcmUgLSBhLnNjb3JlO1xuICB9KVxuICB0b3BTY29yZXMuc3BsaWNlKDEwLCAxMDAwKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b3BTY29yZXMubGVuZ3RoOyBpKyspIHtcbiAgICBsZXQgaW5pdGlhbHMgPSB0b3BTY29yZXNbaV0uaW5pdGlhbHM7XG4gICAgbGV0IHNjb3JlID0gdG9wU2NvcmVzW2ldLnNjb3JlO1xuICAgIGxldCBIVE1MSW5pdGlhbHMgPSAnaGlnaC1pbml0aWFscy0nICsgKGkgKyAxKTtcbiAgICBsZXQgSFRNTFNjb3JlcyA9ICdoaWdoLXNjb3JlLScgKyAoaSArIDEpO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy4nICsgSFRNTEluaXRpYWxzKS5pbm5lckhUTUwgPSBpbml0aWFscztcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuJyArIEhUTUxTY29yZXMpLmlubmVySFRNTCA9IHNjb3JlO1xuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9saWIvaW5kZXguanMiLCJjbGFzcyBQYWRkbGUge1xuICBjb25zdHJ1Y3Rvcih4LCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgdGhpcy55ID0gNDc1O1xuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy53aWR0aCA9IHdpZHRoO1xuICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuICB9XG4gIGRyYXcoY29udGV4dCkge1xuICAgIGNvbnRleHQuZmlsbFJlY3QodGhpcy54LCB0aGlzLnksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgfVxuICBhbmltYXRlKGtleVN0YXRlKSB7XG4gICAgaWYgKGtleVN0YXRlWzM3XSAmJiB0aGlzLnggPiAwKSB7XG4gICAgICB0aGlzLnggLT0gNTtcbiAgICB9IGVsc2UgaWYgKGtleVN0YXRlWzM5XSAmJiB0aGlzLnggPCA3MDApIHtcbiAgICAgIHRoaXMueCArPSA1O1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBhZGRsZTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9saWIvUGFkZGxlLmpzIiwiY2xhc3MgS2V5Ym9hcmRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMua2V5cyA9IHtcbiAgICAgIGxlZnQ6IDM3LFxuICAgICAgcmlnaHQ6IDM5LFxuICAgIH07XG4gIH1cbiAga2V5RG93bihlKSB7XG4gICAgdmFyIGtleVN0YXRlID0ge307XG4gICAga2V5U3RhdGVbZS5rZXlDb2RlXSA9IHRydWU7XG4gICAgcmV0dXJuIGtleVN0YXRlO1xuICB9XG5cbiAga2V5VXAoZSkge1xuICAgIHZhciBrZXlTdGF0ZSA9IHt9O1xuICAgIGtleVN0YXRlW2Uua2V5Q29kZV0gPSBmYWxzZTtcbiAgICByZXR1cm4ga2V5U3RhdGU7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBLZXlib2FyZGVyO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbGliL0tleWJvYXJkZXIuanMiLCJjbGFzcyBCYWxsIHtcbiAgY29uc3RydWN0b3IoeCwgeSwgZHgsIGR5KSB7XG4gICAgdGhpcy54ID0geDtcbiAgICB0aGlzLnkgPSB5O1xuICAgIHRoaXMuZHggPSBkeDtcbiAgICB0aGlzLmR5ID0gZHk7XG4gICAgdGhpcy5yYWRpdXMgPSA1O1xuICAgIHRoaXMud2lkdGggPSB0aGlzLnJhZGl1cyAqIDI7XG4gICAgdGhpcy5oZWlnaHQgPSB0aGlzLnJhZGl1cyAqIDI7XG4gIH1cbiAgZHJhdyhjb250ZXh0KSB7XG4gICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICBjb250ZXh0LmFyYyh0aGlzLngsIHRoaXMueSwgdGhpcy5yYWRpdXMsIDAsIE1hdGguUEkgKiAyLCBmYWxzZSk7XG4gICAgY29udGV4dC5zdHJva2UoKTtcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IFwiIzAwMFwiO1xuICAgIGNvbnRleHQuZmlsbCgpO1xuICB9XG4gIG1vdmUoY2FudmFzSGVpZ2h0LCBjYW52YXNXaWR0aCkge1xuICAgIGlmICgodGhpcy54ICsgdGhpcy5yYWRpdXMpID49IGNhbnZhc1dpZHRoIHx8ICh0aGlzLnggLSB0aGlzLnJhZGl1cykgPD0gMCkge1xuICAgICAgdGhpcy5keCA9IC10aGlzLmR4O1xuICAgIH1cbiAgICBpZiAoKHRoaXMueSAtIHRoaXMucmFkaXVzKSA8PSAwKSB7XG4gICAgICB0aGlzLmR5ID0gLXRoaXMuZHk7XG4gICAgfVxuICAgIHRoaXMueSArPSB0aGlzLmR5O1xuICAgIHRoaXMueCArPSB0aGlzLmR4O1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQmFsbDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2xpYi9CYWxsLmpzIiwiY2xhc3MgU2NvcmVzIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zY29yZSA9IDA7XG4gICAgdGhpcy5pbml0aWFscyA9ICdYWFgnO1xuICAgIHRoaXMuaWQgPSBEYXRlLm5vdygpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2NvcmVzO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbGliL1Njb3Jlcy5qcyIsImNsYXNzIEdhbWUge1xuICBjb25zdHJ1Y3RvcihiYWxsLCBwYWRkbGUpIHtcbiAgICB0aGlzLmJyaWNrcyA9IFtdO1xuICAgIHRoaXMuZGlzY2FyZGVkQnJpY2tzID0gW107XG4gICAgdGhpcy5iYWxscyA9IFtiYWxsXTtcbiAgICB0aGlzLnBhZGRsZSA9IHBhZGRsZTtcbiAgICB0aGlzLmxldmVsID0gMTtcbiAgICB0aGlzLmxpdmVzID0gMztcbiAgICB0aGlzLnNjb3JlID0gMDtcbiAgfVxuXG4gIGNvbGxpc2lvbkNoZWNrKG9iajEsIG9iajIpIHtcbiAgICBpZiAob2JqMS54IDwgb2JqMi54ICsgb2JqMi53aWR0aCAgJiYgb2JqMS54ICsgb2JqMS53aWR0aCAgPiBvYmoyLnggJiZcbiAgICAgICAgb2JqMS55IDwgb2JqMi55ICsgb2JqMi5oZWlnaHQgJiYgb2JqMS55ICsgb2JqMS5oZWlnaHQgPiBvYmoyLnkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcGFkZGxlQmFsbENvbGxpZGluZyhiYWxsLCBwYWRkbGUpIHtcbiAgICBsZXQgYXJlQ29sbGlkaW5nID0gdGhpcy5jb2xsaXNpb25DaGVjayhiYWxsLCBwYWRkbGUpO1xuICAgIGxldCBkeSA9IGJhbGwuZHk7XG4gICAgaWYgKGFyZUNvbGxpZGluZykge1xuICAgICAgcmV0dXJuIGR5ID0gLWR5O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZHk7XG4gICAgfVxuICB9XG5cbiAgcGFkZGxlQmFsbFhDaGVjayhiYWxsLCBwYWRkbGUpIHtcbiAgICBsZXQgYXJlQ29sbGlkaW5nID0gdGhpcy5jb2xsaXNpb25DaGVjayhiYWxsLCBwYWRkbGUpO1xuICAgIGxldCBwYWRkbGVGaXJzdEZpZnRoID0gcGFkZGxlLnggKyAocGFkZGxlLndpZHRoIC8gNSk7XG4gICAgbGV0IHBhZGRsZVNlY29uZEZpZnRoID0gcGFkZGxlLnggKyAoKHBhZGRsZS53aWR0aCAvIDUpICogMik7XG4gICAgbGV0IHBhZGRsZVRoaXJkRmlmdGggPSBwYWRkbGUueCArICgocGFkZGxlLndpZHRoIC8gNSkgKiA0KTtcbiAgICBsZXQgcGFkZGxlRm91cnRoRmlmdGggPSBwYWRkbGUueCArIHBhZGRsZS53aWR0aDtcbiAgICBpZiAoYXJlQ29sbGlkaW5nKSB7XG4gICAgICBpZiAoYmFsbC54IDwgcGFkZGxlRmlyc3RGaWZ0aCkge1xuICAgICAgICBiYWxsLmR4IC09IDM7XG4gICAgICB9IGVsc2UgaWYgKGJhbGwueCA8IHBhZGRsZVNlY29uZEZpZnRoKSB7XG4gICAgICAgIGJhbGwuZHggLT0gMTtcbiAgICAgIH0gZWxzZSBpZiAoYmFsbC54IDwgcGFkZGxlVGhpcmRGaWZ0aCkge1xuICAgICAgICBiYWxsLmR4ICs9IDE7XG4gICAgICB9IGVsc2UgaWYgKGJhbGwueCA8IHBhZGRsZUZvdXJ0aEZpZnRoKSB7XG4gICAgICAgIGJhbGwuZHggKz0gMztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGJhbGwuZHggPiAxMCkge1xuICAgICAgYmFsbC5keCA9IDEwO1xuICAgIH0gZWxzZSBpZiAoYmFsbC5keCA8IC0xMCkge1xuICAgICAgYmFsbC5keCA9IC0xMDtcbiAgICB9XG4gICAgcmV0dXJuIGJhbGwuZHhcbiAgfVxuXG4gIGdyYWJCcmlja3MoYnJpY2tzKSB7XG4gICAgdGhpcy5icmlja3MucHVzaChicmlja3MpO1xuICB9XG5cbiAgYnJpY2tCYWxsQ29sbGlkaW5nKGJhbGwsIGJyaWNrcykge1xuICAgIGxldCBkeSA9IGJhbGwuZHk7XG4gICAgYnJpY2tzLmZvckVhY2goZnVuY3Rpb24oYnJpY2spIHtcbiAgICAgIGxldCBpbmRleCA9IHRoaXMuYnJpY2tzLmluZGV4T2YoYnJpY2spO1xuICAgICAgbGV0IGFyZUNvbGxpZGluZyA9IHRoaXMuY29sbGlzaW9uQ2hlY2soYmFsbCwgYnJpY2spO1xuICAgICAgaWYgKGFyZUNvbGxpZGluZykge1xuICAgICAgICB0aGlzLnNjb3JlICs9IDEwMDtcbiAgICAgICAgaWYgKGJyaWNrLmhlYWx0aCA9PT0gMSl7XG4gICAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5icmlja3MuaW5kZXhPZihicmljayk7XG4gICAgICAgICAgdGhpcy5kaXNjYXJkZWRCcmlja3MgPSB0aGlzLmJyaWNrcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9XG4gICAgICAgIGJyaWNrLmhlYWx0aC0tO1xuICAgICAgICBpZiAoYmFsbC54IDwgKGJyaWNrLnggKyBicmljay53aWR0aCkgJiYgYmFsbC54ID4gYnJpY2sueCkge1xuICAgICAgICAgIHJldHVybiBkeSA9IC1keTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZHk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LmJpbmQodGhpcykpXG4gICAgcmV0dXJuIGR5O1xuICB9XG5cbiAgY2hlY2tCcmlja3MoKSB7XG4gICAgaWYgKHRoaXMuYnJpY2tzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy5sZXZlbCsrO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgYnJpY2tCYWxsU2lkZUNvbGxpc2lvbihiYWxsLCBicmlja3MpIHtcbiAgICBicmlja3MuZm9yRWFjaChmdW5jdGlvbihicmljaykge1xuICAgICAgbGV0IGFyZUNvbGxpZGluZyA9IHRoaXMuY29sbGlzaW9uQ2hlY2soYmFsbCwgYnJpY2spO1xuICAgICAgaWYgKGFyZUNvbGxpZGluZykge1xuICAgICAgICBpZiAoYmFsbC54IDw9IGJyaWNrLnggfHwgYmFsbC54ID49IChicmljay54ICsgYnJpY2sud2lkdGgpKSB7XG4gICAgICAgICAgYmFsbC5keCA9IC1iYWxsLmR4O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfS5iaW5kKHRoaXMpKVxuICAgIHJldHVybiBiYWxsLmR4O1xuICB9XG5cbiAgY2hlY2tCYWxsRGVhdGgoYmFsbCwgY2FudmFzSGVpZ2h0KSB7XG4gICAgaWYgKGJhbGwueSA+PSBjYW52YXNIZWlnaHQpIHtcbiAgICAgIHRoaXMubGl2ZXMgLT0gMTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2xpYi9HYW1lLmpzIiwiY2xhc3MgQnJpY2sge1xuICBjb25zdHJ1Y3Rvcih4LCB5KSB7XG4gICAgdGhpcy54ID0geDtcbiAgICB0aGlzLnkgPSB5O1xuICAgIHRoaXMuaGVhbHRoID0gMTtcbiAgICB0aGlzLndpZHRoID0gNzU7XG4gICAgdGhpcy5oZWlnaHQgPSAyNTtcbiAgfVxuXG4gIGNyZWF0ZUJyaWNrc0x2bHNPbmVUd28obnVtQnJpY2tzLCBsZXZlbCkge1xuICAgIGxldCBicmlja3NBcnJheSA9IFtdO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1Ccmlja3M7IGkrKykge1xuICAgICAgICBpZiAoaSA8PSA5KSB7XG4gICAgICAgICAgbGV0IHggPSAyLjUgKyAoaSAqIDc1KSArIChpICogNSk7XG4gICAgICAgICAgbGV0IHkgPSAxNTtcbiAgICAgICAgICBicmlja3NBcnJheS5wdXNoKG5ldyBCcmljayh4LCB5KSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaSA8PSAxOSkge1xuICAgICAgICAgIGxldCB4ID0gMi41ICsgKChpIC0gMTApICogNzUpICsgKChpIC0gMTApICogNSk7XG4gICAgICAgICAgbGV0IHkgPSA0NTtcbiAgICAgICAgICBicmlja3NBcnJheS5wdXNoKG5ldyBCcmljayh4LCB5KSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaSA8PSAyOSkge1xuICAgICAgICAgIGxldCB4ID0gMi41ICsgKChpIC0gMjApICogNzUpICsgKChpIC0gMjApICogNSk7XG4gICAgICAgICAgbGV0IHkgPSA3NTtcbiAgICAgICAgICBicmlja3NBcnJheS5wdXNoKG5ldyBCcmljayh4LCB5KSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaSA8PSAzOSkge1xuICAgICAgICAgIGxldCB4ID0gMi41ICsgKChpIC0gMzApICogNzUpICsgKChpIC0gMzApICogNSk7XG4gICAgICAgICAgbGV0IHkgPSAxMDU7XG4gICAgICAgICAgaWYgKGxldmVsID09PSAyKSB7XG4gICAgICAgICAgICBsZXQgaGVhbHRoID0gMjtcbiAgICAgICAgICAgIGJyaWNrc0FycmF5LnB1c2gobmV3IFN0cm9uZ2VyQnJpY2soeCwgeSwgaGVhbHRoKSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gcmV0dXJuIGJyaWNrc0FycmF5O1xuICAgIH07XG5cbiAgY3JlYXRlQnJpY2tzTHZsVGhyZWUobnVtQnJpY2tzKSB7XG4gICAgbGV0IGJyaWNrc0FycmF5ID0gW11cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bUJyaWNrczsgaSsrKSB7XG4gICAgICBpZiAoaSA8PSA4KSB7XG4gICAgICAgIGxldCB4ID0gNDUgKyAoaSAqIDc1KSArIChpICogNSk7XG4gICAgICAgIGxldCB5ID0gMjU7XG4gICAgICAgIGxldCBoZWFsdGggPSAyO1xuICAgICAgICBicmlja3NBcnJheS5wdXNoKG5ldyBTdHJvbmdlckJyaWNrKHgsIHksIGhlYWx0aCkpO1xuICAgICAgfSBlbHNlIGlmIChpIDw9IDE3KSB7XG4gICAgICAgIGxldCB4ID0gNDUgKyAoKGkgLSA5KSAqIDc1KSArICgoaSAtIDkpICogNSk7XG4gICAgICAgIGxldCB5ID0gNTU7XG4gICAgICAgIGJyaWNrc0FycmF5LnB1c2gobmV3IEJyaWNrKHgsIHkpKTtcbiAgICAgIH0gZWxzZSBpZiAoaSA8PSAyNikge1xuICAgICAgICBsZXQgeCA9IDQ1ICsgKChpIC0gMTgpICogNzUpICsgKChpIC0gMTgpICogNSk7XG4gICAgICAgIGxldCB5ID0gODU7XG4gICAgICAgIGxldCBoZWFsdGggPSAyO1xuICAgICAgICBicmlja3NBcnJheS5wdXNoKG5ldyBTdHJvbmdlckJyaWNrKHgsIHksIGhlYWx0aCkpO1xuICAgICAgfSBlbHNlIGlmIChpIDw9IDM1KSB7XG4gICAgICAgIGxldCB4ID0gNDUgKyAoKGkgLSAyNykgKiA3NSkgKyAoKGkgLSAyNykgKiA1KTtcbiAgICAgICAgbGV0IHkgPSAxMTU7XG4gICAgICAgIGxldCBoZWFsdGggPSAyO1xuICAgICAgICBicmlja3NBcnJheS5wdXNoKG5ldyBTdHJvbmdlckJyaWNrKHgsIHksIGhlYWx0aCkpO1xuICAgICAgfSBlbHNlIGlmIChpIDw9IDQ0KSB7XG4gICAgICAgIGxldCB4ID0gNDUgKyAoKGkgLSAzNikgKiA3NSkgKyAoKGkgLSAzNikgKiA1KTtcbiAgICAgICAgbGV0IHkgPSAxNDU7XG4gICAgICAgIGJyaWNrc0FycmF5LnB1c2gobmV3IEJyaWNrKHgsIHkpKVxuICAgICAgfSBlbHNlIGlmIChpIDw9IDUzKSB7XG4gICAgICAgIGxldCB4ID0gNDUgKyAoKGkgLSA0NSkgKiA3NSkgKyAoKGkgLSA0NSkgKiA1KTtcbiAgICAgICAgbGV0IHkgPSAxNzU7XG4gICAgICAgIGxldCBoZWFsdGggPSAyO1xuICAgICAgICBicmlja3NBcnJheS5wdXNoKG5ldyBTdHJvbmdlckJyaWNrKHgsIHksIGhlYWx0aCkpO1xuICAgICAgfVxuICAgIH1cbiAgICBicmlja3NBcnJheSA9IGJyaWNrc0FycmF5LmZpbHRlcihicmljayA9PiBicmljay54ICE9PSAzNjUpO1xuICAgIHJldHVybiBicmlja3NBcnJheTtcbiAgfVxuXG4gIGNsZWFyQnJpY2tzKCkge1xuICAgIGxldCBicmlja3NBcnJheSA9IFtdO1xuICAgIHJldHVybiBicmlja3NBcnJheTtcbiAgfVxuXG4gIGRyYXcoY29udGV4dCwgYnJpY2tzKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBicmlja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHt4LCB5LCB3aWR0aCwgaGVpZ2h0fSA9IGJyaWNrc1tpXTtcbiAgICAgIGlmIChicmlja3NbaV0uaGVhbHRoID09PSAyKSB7XG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJyMzNjA2MDAnXG4gICAgICB9IGVsc2UgaWYgKGJyaWNrc1tpXS5oZWFsdGggPT09IDEpIHtcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAnI0ZDMDAwOSdcbiAgICAgIH1cbiAgICAgIGNvbnRleHQuZmlsbFJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XG4gICAgfVxuICB9XG59XG5cbmNsYXNzIFN0cm9uZ2VyQnJpY2sgZXh0ZW5kcyBCcmljayB7XG4gIGNvbnN0cnVjdG9yKHgsIHksIGhlYWx0aCkge1xuICAgIHN1cGVyKHgsIHkpO1xuICAgIHRoaXMuaGVhbHRoID0gaGVhbHRoO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQnJpY2s7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9saWIvQnJpY2suanMiXSwic291cmNlUm9vdCI6IiJ9