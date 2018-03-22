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
	
	var generateBricks = function generateBricks() {
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
	};
	
	window.addEventListener('keydown', function (e) {
	  keyState = keyboardMonitor.keyDown(e);
	});
	
	window.addEventListener('keyup', function (e) {
	  keyState = keyboardMonitor.keyUp(e);
	});
	
	document.querySelector('.new-game-button').addEventListener('click', restartGame);
	
	var gameLoop = function gameLoop() {
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
	};
	
	var restartGame = function restartGame() {
	  window.cancelAnimationFrame(requestID);
	  requestID = null;
	  newGame.bricks = bricks.clearBricks();
	  bouncyBall = new Ball(400, 200, Math.random() * 3 - 1.5, 4);
	  newGame = new Game(bouncyBall, startPaddle);
	  generateBricks();
	  startGame();
	};
	
	var startGame = function startGame() {
	  ctx.fillStyle = '#000';
	  ctx.clearRect(0, 0, canvas.width, canvas.height);
	  bouncyBall = new Ball(400, 200, Math.random() * 3 - 1.5, 4);
	  startPaddle = new Paddle(350, 100, 15);
	  startPaddle.draw(ctx);
	  bouncyBall.draw(ctx);
	  bricks.draw(ctx, newGame.bricks);
	  delayedStart();
	  endGame();
	};
	
	var delayedStart = function delayedStart() {
	  if (!requestID) {
	    window.setTimeout(gameLoop, 3000);
	  }
	};
	
	var endGame = function endGame() {
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
	};
	
	var ballDeath = function ballDeath() {
	  if (requestID) {
	    window.cancelAnimationFrame(requestID);
	    requestID = null;
	    isDead = false;
	    var livesIndicator = document.querySelector('.lives-indicator');
	    livesIndicator.innerText = newGame.lives;
	    startGame();
	  }
	};
	
	var checkInitials = function checkInitials(s) {
	  return (/[a-z]*/gi.test(s) ? s.slice(0, 3).toUpperCase() : 'N/A'
	  );
	};
	
	var scoreToStorage = function scoreToStorage(scores) {
	  var storeScores = scores;
	  var stringifyScores = JSON.stringify(storeScores);
	  localStorage.setItem(scores.id, stringifyScores);
	};
	
	var getFromStorage = function getFromStorage(scores) {
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
	};

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMzQ0NjI2OTI1MWI1YTk1ZDU0MmIiLCJ3ZWJwYWNrOi8vLy4vbGliL2luZGV4LmpzIiwid2VicGFjazovLy8uL2xpYi9QYWRkbGUuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL2tleWJvYXJkZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL2JhbGwuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL3Njb3Jlcy5qcyIsIndlYnBhY2s6Ly8vLi9saWIvR2FtZS5qcyIsIndlYnBhY2s6Ly8vLi9saWIvYnJpY2tzLmpzIl0sIm5hbWVzIjpbImNhbnZhcyIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsIlBhZGRsZSIsInJlcXVpcmUiLCJLZXlib2FyZGVyIiwiQmFsbCIsIlNjb3JlcyIsIkdhbWUiLCJCcmljayIsImN0eCIsImdldENvbnRleHQiLCJuZXdHYW1lIiwiYm91bmN5QmFsbCIsInN0YXJ0UGFkZGxlIiwia2V5Ym9hcmRNb25pdG9yIiwiTWF0aCIsInJhbmRvbSIsImtleVN0YXRlIiwiYnJpY2tzIiwicmVxdWVzdElEIiwidW5kZWZpbmVkIiwiaXNEZWFkIiwiZ2VuZXJhdGVCcmlja3MiLCJzdGFydEdhbWUiLCJnZXRGcm9tU3RvcmFnZSIsImxldmVsIiwibmV3QnJpY2tzIiwiY3JlYXRlQnJpY2tzIiwiZm9yRWFjaCIsImdyYWJCcmlja3MiLCJicmljayIsIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwia2V5RG93biIsImtleVVwIiwicmVzdGFydEdhbWUiLCJnYW1lTG9vcCIsImdldEVsZW1lbnRCeUlkIiwiaW5uZXJIVE1MIiwic2NvcmUiLCJsaXZlcyIsImZpbGxTdHlsZSIsImNsZWFyUmVjdCIsIndpZHRoIiwiaGVpZ2h0IiwiZHJhdyIsImR5IiwicGFkZGxlQmFsbENvbGxpZGluZyIsImR4IiwicGFkZGxlQmFsbFhDaGVjayIsImJyaWNrQmFsbFNpZGVDb2xsaXNpb24iLCJicmlja0JhbGxDb2xsaWRpbmciLCJtb3ZlIiwiYW5pbWF0ZSIsImNoZWNrQmFsbERlYXRoIiwiYmFsbERlYXRoIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiY2hlY2tCcmlja3MiLCJjbGVhckJyaWNrcyIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwiZGVsYXllZFN0YXJ0IiwiZW5kR2FtZSIsInNldFRpbWVvdXQiLCJ1c2VyU2NvcmVzIiwiaW5pdGlhbHMiLCJwcm9tcHQiLCJjaGVja0luaXRpYWxzIiwic2NvcmVUb1N0b3JhZ2UiLCJsaXZlc0luZGljYXRvciIsImlubmVyVGV4dCIsInRlc3QiLCJzIiwic2xpY2UiLCJ0b1VwcGVyQ2FzZSIsInNjb3JlcyIsInN0b3JlU2NvcmVzIiwic3RyaW5naWZ5U2NvcmVzIiwiSlNPTiIsInN0cmluZ2lmeSIsImxvY2FsU3RvcmFnZSIsInNldEl0ZW0iLCJpZCIsInRvcFNjb3JlcyIsImkiLCJsZW5ndGgiLCJyZXRyaWV2ZWRJdGVtIiwiZ2V0SXRlbSIsImtleSIsInBhcnNlZEl0ZW0iLCJwYXJzZSIsInB1c2giLCJzb3J0IiwiYSIsImIiLCJzcGxpY2UiLCJIVE1MSW5pdGlhbHMiLCJIVE1MU2NvcmVzIiwieCIsInkiLCJjb250ZXh0IiwiZmlsbFJlY3QiLCJtb2R1bGUiLCJleHBvcnRzIiwia2V5cyIsImxlZnQiLCJyaWdodCIsImtleUNvZGUiLCJyYWRpdXMiLCJiZWdpblBhdGgiLCJhcmMiLCJQSSIsInN0cm9rZSIsImZpbGwiLCJjYW52YXNIZWlnaHQiLCJjYW52YXNXaWR0aCIsIkRhdGUiLCJub3ciLCJiYWxsIiwicGFkZGxlIiwiZGlzY2FyZGVkQnJpY2tzIiwiYmFsbHMiLCJvYmoxIiwib2JqMiIsImFyZUNvbGxpZGluZyIsImNvbGxpc2lvbkNoZWNrIiwicGFkZGxlRmlyc3RGaWZ0aCIsInBhZGRsZVNlY29uZEZpZnRoIiwicGFkZGxlVGhpcmRGaWZ0aCIsInBhZGRsZUZvdXJ0aEZpZnRoIiwiaW5kZXgiLCJpbmRleE9mIiwiaGVhbHRoIiwiYmluZCIsIm51bUJyaWNr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QUd6Qjs7O0dBSnlCNUgsSzs7QUFPNUI4RixRQUFPQyxPQUFQLEdBQWlCL0YsS0FBakIsQyIsImZpbGUiOiJtYWluLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDM0NDYyNjkyNTFiNWE5NWQ1NDJiIiwiY29uc3QgY2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2dhbWUtc2NyZWVuJyk7XG5jb25zdCBQYWRkbGUgPSByZXF1aXJlKCcuL1BhZGRsZScpO1xuY29uc3QgS2V5Ym9hcmRlciA9IHJlcXVpcmUoJy4va2V5Ym9hcmRlcicpO1xuY29uc3QgQmFsbCA9IHJlcXVpcmUoJy4vYmFsbC5qcycpO1xuY29uc3QgU2NvcmVzID0gcmVxdWlyZSgnLi9zY29yZXMuanMnKTtcbmNvbnN0IEdhbWUgPSByZXF1aXJlKCcuL0dhbWUuanMnKTtcbmNvbnN0IEJyaWNrID0gcmVxdWlyZSgnLi9icmlja3MuanMnKTtcbmxldCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbmxldCBuZXdHYW1lID0gbmV3IEdhbWUoYm91bmN5QmFsbCwgc3RhcnRQYWRkbGUpO1xubGV0IHN0YXJ0UGFkZGxlID0gbmV3IFBhZGRsZSgzNTAsIDEwMCwgMTUpO1xubGV0IGtleWJvYXJkTW9uaXRvciA9IG5ldyBLZXlib2FyZGVyKCk7XG5sZXQgYm91bmN5QmFsbCA9IG5ldyBCYWxsKDQwMCwgMjAwLCAoKE1hdGgucmFuZG9tKCkgKiAzKSAtIDEuNSksIDQpO1xubGV0IGtleVN0YXRlID0ge307XG5sZXQgYnJpY2tzID0gbmV3IEJyaWNrKCk7XG5sZXQgcmVxdWVzdElEID0gdW5kZWZpbmVkO1xubGV0IGlzRGVhZCA9IG51bGw7XG5cbmdlbmVyYXRlQnJpY2tzKCk7XG5zdGFydEdhbWUoKTtcbmdldEZyb21TdG9yYWdlKCk7XG5cbmNvbnN0IGdlbmVyYXRlQnJpY2tzID0gKCkgPT4ge1xuICBpZiAobmV3R2FtZS5sZXZlbCA9PT0gMSkge1xuICAgIGxldCBuZXdCcmlja3MgPSBicmlja3MuY3JlYXRlQnJpY2tzKDQwLCAxKTtcbiAgICBuZXdCcmlja3MuZm9yRWFjaCggYnJpY2sgPT4gbmV3R2FtZS5ncmFiQnJpY2tzKGJyaWNrKSApO1xuICB9IGVsc2UgaWYgKG5ld0dhbWUubGV2ZWwgPT09IDIpIHtcbiAgICBsZXQgbmV3QnJpY2tzID0gYnJpY2tzLmNyZWF0ZUJyaWNrcyg0MCwgMik7XG4gICAgbmV3QnJpY2tzLmZvckVhY2goIGJyaWNrID0+IG5ld0dhbWUuZ3JhYkJyaWNrcyhicmljaykgKTtcbiAgfSBlbHNlIGlmIChuZXdHYW1lLmxldmVsID09PSAzKSB7XG4gICAgbGV0IG5ld0JyaWNrcyA9IGJyaWNrcy5jcmVhdGVCcmlja3MoNTQsIDMpO1xuICAgIG5ld0JyaWNrcy5mb3JFYWNoKCBicmljayA9PiBuZXdHYW1lLmdyYWJCcmlja3MoYnJpY2spICk7XG4gIH1cbn1cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBmdW5jdGlvbihlKSB7XG4gIGtleVN0YXRlID0ga2V5Ym9hcmRNb25pdG9yLmtleURvd24oZSk7XG59KTtcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgZnVuY3Rpb24oZSkge1xuICBrZXlTdGF0ZSA9IGtleWJvYXJkTW9uaXRvci5rZXlVcChlKTtcbn0pO1xuXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmV3LWdhbWUtYnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCByZXN0YXJ0R2FtZSk7XG5cbmNvbnN0IGdhbWVMb29wID0gKCkgPT4ge1xuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXNlci1zY29yZScpLmlubmVySFRNTCA9IG5ld0dhbWUuc2NvcmU7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5saXZlcy1pbmRpY2F0b3InKS5pbm5lckhUTUwgPSBuZXdHYW1lLmxpdmVzO1xuICBjdHguZmlsbFN0eWxlID0gJyMwMDAnO1xuICBjdHguY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4gIHN0YXJ0UGFkZGxlLmRyYXcoY3R4KTtcbiAgYm91bmN5QmFsbC5kcmF3KGN0eCk7XG4gIGJvdW5jeUJhbGwuZHkgPSBuZXdHYW1lLnBhZGRsZUJhbGxDb2xsaWRpbmcoYm91bmN5QmFsbCwgc3RhcnRQYWRkbGUpO1xuICBib3VuY3lCYWxsLmR4ID0gbmV3R2FtZS5wYWRkbGVCYWxsWENoZWNrKGJvdW5jeUJhbGwsIHN0YXJ0UGFkZGxlKTtcbiAgYm91bmN5QmFsbC5keCA9IG5ld0dhbWUuYnJpY2tCYWxsU2lkZUNvbGxpc2lvbihib3VuY3lCYWxsLCBuZXdHYW1lLmJyaWNrcyk7XG4gIGJvdW5jeUJhbGwuZHkgPSBuZXdHYW1lLmJyaWNrQmFsbENvbGxpZGluZyhib3VuY3lCYWxsLCBuZXdHYW1lLmJyaWNrcyk7XG4gIGJyaWNrcy5kcmF3KGN0eCwgbmV3R2FtZS5icmlja3MpO1xuICBib3VuY3lCYWxsLm1vdmUoY2FudmFzLmhlaWdodCwgY2FudmFzLndpZHRoKTtcbiAgc3RhcnRQYWRkbGUuYW5pbWF0ZShrZXlTdGF0ZSk7XG4gIGlzRGVhZCA9IG5ld0dhbWUuY2hlY2tCYWxsRGVhdGgoYm91bmN5QmFsbCwgY2FudmFzLmhlaWdodCk7XG4gIGlmIChpc0RlYWQpIHtcbiAgICBiYWxsRGVhdGgoKTtcbiAgfSBlbHNlIHtcbiAgICByZXF1ZXN0SUQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZ2FtZUxvb3ApO1xuICB9XG4gIGlmIChuZXdHYW1lLmNoZWNrQnJpY2tzKCkpIHtcbiAgICBicmlja3MuY2xlYXJCcmlja3MoKTtcbiAgICBnZW5lcmF0ZUJyaWNrcygpO1xuICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZShyZXF1ZXN0SUQpO1xuICAgIHJlcXVlc3RJRCA9IG51bGw7XG4gICAgc3RhcnRHYW1lKCk7XG4gIH1cbn1cblxuY29uc3QgcmVzdGFydEdhbWUgPSAoKSA9PiB7XG4gIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZShyZXF1ZXN0SUQpO1xuICByZXF1ZXN0SUQgPSBudWxsO1xuICBuZXdHYW1lLmJyaWNrcyA9IGJyaWNrcy5jbGVhckJyaWNrcygpO1xuICBib3VuY3lCYWxsID0gbmV3IEJhbGwoNDAwLCAyMDAsICgoTWF0aC5yYW5kb20oKSAqIDMpIC0gMS41KSwgNCk7XG4gIG5ld0dhbWUgPSBuZXcgR2FtZShib3VuY3lCYWxsLCBzdGFydFBhZGRsZSk7XG4gIGdlbmVyYXRlQnJpY2tzKCk7XG4gIHN0YXJ0R2FtZSgpO1xufVxuXG5jb25zdCBzdGFydEdhbWUgPSAoKSA9PiB7XG4gIGN0eC5maWxsU3R5bGUgPSAnIzAwMCc7XG4gIGN0eC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgYm91bmN5QmFsbCA9IG5ldyBCYWxsKDQwMCwgMjAwLCAoKE1hdGgucmFuZG9tKCkgKiAzKSAtIDEuNSksIDQpO1xuICBzdGFydFBhZGRsZSA9IG5ldyBQYWRkbGUoMzUwLCAxMDAsIDE1KTtcbiAgc3RhcnRQYWRkbGUuZHJhdyhjdHgpO1xuICBib3VuY3lCYWxsLmRyYXcoY3R4KTtcbiAgYnJpY2tzLmRyYXcoY3R4LCBuZXdHYW1lLmJyaWNrcyk7XG4gIGRlbGF5ZWRTdGFydCgpO1xuICBlbmRHYW1lKCk7XG59XG5cbmNvbnN0IGRlbGF5ZWRTdGFydCA9ICgpID0+IHtcbiAgaWYoIXJlcXVlc3RJRCkge1xuICAgIHdpbmRvdy5zZXRUaW1lb3V0KGdhbWVMb29wLCAzMDAwKTtcbiAgfVxufVxuXG5jb25zdCBlbmRHYW1lID0gKCkgPT4ge1xuICBsZXQgdXNlclNjb3JlcyA9IG5ldyBTY29yZXMoKTtcbiAgaWYobmV3R2FtZS5saXZlcyA9PT0gMCkge1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1c2VyLXNjb3JlJykuaW5uZXJIVE1MID0gMDtcbiAgICB1c2VyU2NvcmVzLmluaXRpYWxzID0gcHJvbXB0KCdFbnRlciB5b3VyIGluaXRpYWxzIScsICcnKTtcbiAgICB1c2VyU2NvcmVzLnNjb3JlID0gbmV3R2FtZS5zY29yZTtcbiAgICB1c2VyU2NvcmVzLmluaXRpYWxzID0gY2hlY2tJbml0aWFscyh1c2VyU2NvcmVzLmluaXRpYWxzKTtcbiAgICBzY29yZVRvU3RvcmFnZSh1c2VyU2NvcmVzKTtcbiAgICBnZXRGcm9tU3RvcmFnZSh1c2VyU2NvcmVzKTtcbiAgICBuZXdHYW1lID0gbmV3IEdhbWUoYm91bmN5QmFsbCwgc3RhcnRQYWRkbGUpO1xuICAgIGJyaWNrcyA9IG5ldyBCcmljaygpO1xuICAgIGdlbmVyYXRlQnJpY2tzKCk7XG4gIH1cbn1cblxuY29uc3QgYmFsbERlYXRoID0gKCkgPT4ge1xuICBpZihyZXF1ZXN0SUQpIHtcbiAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUocmVxdWVzdElEKTtcbiAgICByZXF1ZXN0SUQgPSBudWxsO1xuICAgIGlzRGVhZCA9IGZhbHNlO1xuICAgIGxldCBsaXZlc0luZGljYXRvciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5saXZlcy1pbmRpY2F0b3InKTtcbiAgICBsaXZlc0luZGljYXRvci5pbm5lclRleHQgPSBuZXdHYW1lLmxpdmVzO1xuICAgIHN0YXJ0R2FtZSgpO1xuICB9XG59XG5cbmNvbnN0IGNoZWNrSW5pdGlhbHMgPSBzID0+IC9bYS16XSovZ2kudGVzdChzKSA/IHMuc2xpY2UoMCwgMykudG9VcHBlckNhc2UoKSA6ICdOL0EnO1xuXG5jb25zdCBzY29yZVRvU3RvcmFnZSA9IChzY29yZXMpID0+IHtcbiAgbGV0IHN0b3JlU2NvcmVzID0gc2NvcmVzO1xuICBsZXQgc3RyaW5naWZ5U2NvcmVzID0gSlNPTi5zdHJpbmdpZnkoc3RvcmVTY29yZXMpO1xuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShzY29yZXMuaWQsIHN0cmluZ2lmeVNjb3Jlcyk7XG59XG5cbmNvbnN0IGdldEZyb21TdG9yYWdlID0gKHNjb3JlcykgPT4ge1xuICBsZXQgdG9wU2NvcmVzID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbG9jYWxTdG9yYWdlLmxlbmd0aDsgaSsrKXtcbiAgICBsZXQgcmV0cmlldmVkSXRlbSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGxvY2FsU3RvcmFnZS5rZXkoaSkpO1xuICAgIGxldCBwYXJzZWRJdGVtID0gSlNPTi5wYXJzZShyZXRyaWV2ZWRJdGVtKTtcbiAgICB0b3BTY29yZXMucHVzaChwYXJzZWRJdGVtKTtcbiAgfVxuICB0b3BTY29yZXMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIGIuc2NvcmUgLSBhLnNjb3JlO1xuICB9KVxuICB0b3BTY29yZXMuc3BsaWNlKDEwLCAxMDAwKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b3BTY29yZXMubGVuZ3RoOyBpKyspIHtcbiAgICBsZXQgaW5pdGlhbHMgPSB0b3BTY29yZXNbaV0uaW5pdGlhbHM7XG4gICAgbGV0IHNjb3JlID0gdG9wU2NvcmVzW2ldLnNjb3JlO1xuICAgIGxldCBIVE1MSW5pdGlhbHMgPSAnaGlnaC1pbml0aWFscy0nICsgKGkgKyAxKTtcbiAgICBsZXQgSFRNTFNjb3JlcyA9ICdoaWdoLXNjb3JlLScgKyAoaSArIDEpO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy4nICsgSFRNTEluaXRpYWxzKS5pbm5lckhUTUwgPSBpbml0aWFscztcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuJyArIEhUTUxTY29yZXMpLmlubmVySFRNTCA9IHNjb3JlO1xuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9saWIvaW5kZXguanMiLCJjbGFzcyBQYWRkbGUge1xuICBjb25zdHJ1Y3Rvcih4LCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgdGhpcy55ID0gNDc1O1xuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy53aWR0aCA9IHdpZHRoO1xuICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuICB9XG4gIGRyYXcoY29udGV4dCkge1xuICAgIGNvbnRleHQuZmlsbFJlY3QodGhpcy54LCB0aGlzLnksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgfVxuICBhbmltYXRlKGtleVN0YXRlKSB7XG4gICAgaWYgKGtleVN0YXRlWzM3XSAmJiB0aGlzLnggPiAwKSB7XG4gICAgICB0aGlzLnggLT0gNTtcbiAgICB9IGVsc2UgaWYgKGtleVN0YXRlWzM5XSAmJiB0aGlzLnggPCA3MDApIHtcbiAgICAgIHRoaXMueCArPSA1O1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBhZGRsZTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9saWIvUGFkZGxlLmpzIiwiY2xhc3MgS2V5Ym9hcmRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMua2V5cyA9IHtcbiAgICAgIGxlZnQ6IDM3LFxuICAgICAgcmlnaHQ6IDM5LFxuICAgIH07XG4gIH1cbiAga2V5RG93bihlKSB7XG4gICAgdmFyIGtleVN0YXRlID0ge307XG4gICAga2V5U3RhdGVbZS5rZXlDb2RlXSA9IHRydWU7XG4gICAgcmV0dXJuIGtleVN0YXRlO1xuICB9XG5cbiAga2V5VXAoZSkge1xuICAgIHZhciBrZXlTdGF0ZSA9IHt9O1xuICAgIGtleVN0YXRlW2Uua2V5Q29kZV0gPSBmYWxzZTtcbiAgICByZXR1cm4ga2V5U3RhdGU7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBLZXlib2FyZGVyO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbGliL2tleWJvYXJkZXIuanMiLCJjbGFzcyBCYWxsIHtcbiAgY29uc3RydWN0b3IoeCwgeSwgZHgsIGR5KSB7XG4gICAgdGhpcy54ID0geDtcbiAgICB0aGlzLnkgPSB5O1xuICAgIHRoaXMuZHggPSBkeDtcbiAgICB0aGlzLmR5ID0gZHk7XG4gICAgdGhpcy5yYWRpdXMgPSA1O1xuICAgIHRoaXMud2lkdGggPSB0aGlzLnJhZGl1cyAqIDI7XG4gICAgdGhpcy5oZWlnaHQgPSB0aGlzLnJhZGl1cyAqIDI7XG4gIH1cbiAgZHJhdyhjb250ZXh0KSB7XG4gICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICBjb250ZXh0LmFyYyh0aGlzLngsIHRoaXMueSwgdGhpcy5yYWRpdXMsIDAsIE1hdGguUEkgKiAyLCBmYWxzZSk7XG4gICAgY29udGV4dC5zdHJva2UoKTtcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IFwiIzAwMFwiO1xuICAgIGNvbnRleHQuZmlsbCgpO1xuICB9XG4gIG1vdmUoY2FudmFzSGVpZ2h0LCBjYW52YXNXaWR0aCkge1xuICAgIGlmICgodGhpcy54ICsgdGhpcy5yYWRpdXMpID49IGNhbnZhc1dpZHRoIHx8ICh0aGlzLnggLSB0aGlzLnJhZGl1cykgPD0gMCkge1xuICAgICAgdGhpcy5keCA9IC10aGlzLmR4O1xuICAgIH1cbiAgICBpZiAoKHRoaXMueSAtIHRoaXMucmFkaXVzKSA8PSAwKSB7XG4gICAgICB0aGlzLmR5ID0gLXRoaXMuZHk7XG4gICAgfVxuICAgIHRoaXMueSArPSB0aGlzLmR5O1xuICAgIHRoaXMueCArPSB0aGlzLmR4O1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQmFsbDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2xpYi9iYWxsLmpzIiwiY2xhc3MgU2NvcmVzIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zY29yZSA9IDA7XG4gICAgdGhpcy5pbml0aWFscyA9ICdYWFgnO1xuICAgIHRoaXMuaWQgPSBEYXRlLm5vdygpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2NvcmVzO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbGliL3Njb3Jlcy5qcyIsImNsYXNzIEdhbWUge1xuICBjb25zdHJ1Y3RvcihiYWxsLCBwYWRkbGUpIHtcbiAgICB0aGlzLmJyaWNrcyA9IFtdO1xuICAgIHRoaXMuZGlzY2FyZGVkQnJpY2tzID0gW107XG4gICAgdGhpcy5iYWxscyA9IFtiYWxsXTtcbiAgICB0aGlzLnBhZGRsZSA9IHBhZGRsZTtcbiAgICB0aGlzLmxldmVsID0gMTtcbiAgICB0aGlzLmxpdmVzID0gMztcbiAgICB0aGlzLnNjb3JlID0gMDtcbiAgfVxuXG4gIGNvbGxpc2lvbkNoZWNrKG9iajEsIG9iajIpIHtcbiAgICBpZiAob2JqMS54IDwgb2JqMi54ICsgb2JqMi53aWR0aCAgJiYgb2JqMS54ICsgb2JqMS53aWR0aCAgPiBvYmoyLnggJiZcbiAgICAgICAgb2JqMS55IDwgb2JqMi55ICsgb2JqMi5oZWlnaHQgJiYgb2JqMS55ICsgb2JqMS5oZWlnaHQgPiBvYmoyLnkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcGFkZGxlQmFsbENvbGxpZGluZyhiYWxsLCBwYWRkbGUpIHtcbiAgICBsZXQgYXJlQ29sbGlkaW5nID0gdGhpcy5jb2xsaXNpb25DaGVjayhiYWxsLCBwYWRkbGUpO1xuICAgIGxldCBkeSA9IGJhbGwuZHk7XG4gICAgaWYgKGFyZUNvbGxpZGluZykge1xuICAgICAgcmV0dXJuIGR5ID0gLWR5O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZHk7XG4gICAgfVxuICB9XG5cbiAgcGFkZGxlQmFsbFhDaGVjayhiYWxsLCBwYWRkbGUpIHtcbiAgICBsZXQgYXJlQ29sbGlkaW5nID0gdGhpcy5jb2xsaXNpb25DaGVjayhiYWxsLCBwYWRkbGUpO1xuICAgIGxldCBwYWRkbGVGaXJzdEZpZnRoID0gcGFkZGxlLnggKyAocGFkZGxlLndpZHRoIC8gNSk7XG4gICAgbGV0IHBhZGRsZVNlY29uZEZpZnRoID0gcGFkZGxlLnggKyAoKHBhZGRsZS53aWR0aCAvIDUpICogMik7XG4gICAgbGV0IHBhZGRsZVRoaXJkRmlmdGggPSBwYWRkbGUueCArICgocGFkZGxlLndpZHRoIC8gNSkgKiA0KTtcbiAgICBsZXQgcGFkZGxlRm91cnRoRmlmdGggPSBwYWRkbGUueCArIHBhZGRsZS53aWR0aDtcbiAgICBpZiAoYXJlQ29sbGlkaW5nKSB7XG4gICAgICBpZiAoYmFsbC54IDwgcGFkZGxlRmlyc3RGaWZ0aCkge1xuICAgICAgICBiYWxsLmR4IC09IDM7XG4gICAgICB9IGVsc2UgaWYgKGJhbGwueCA8IHBhZGRsZVNlY29uZEZpZnRoKSB7XG4gICAgICAgIGJhbGwuZHggLT0gMTtcbiAgICAgIH0gZWxzZSBpZiAoYmFsbC54IDwgcGFkZGxlVGhpcmRGaWZ0aCkge1xuICAgICAgICBiYWxsLmR4ICs9IDE7XG4gICAgICB9IGVsc2UgaWYgKGJhbGwueCA8IHBhZGRsZUZvdXJ0aEZpZnRoKSB7XG4gICAgICAgIGJhbGwuZHggKz0gMztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGJhbGwuZHggPiAxMCkge1xuICAgICAgYmFsbC5keCA9IDEwO1xuICAgIH0gZWxzZSBpZiAoYmFsbC5keCA8IC0xMCkge1xuICAgICAgYmFsbC5keCA9IC0xMDtcbiAgICB9XG4gICAgcmV0dXJuIGJhbGwuZHhcbiAgfVxuXG4gIGdyYWJCcmlja3MoYnJpY2tzKSB7XG4gICAgdGhpcy5icmlja3MucHVzaChicmlja3MpO1xuICB9XG5cbiAgYnJpY2tCYWxsQ29sbGlkaW5nKGJhbGwsIGJyaWNrcykge1xuICAgIGxldCBkeSA9IGJhbGwuZHk7XG4gICAgYnJpY2tzLmZvckVhY2goZnVuY3Rpb24oYnJpY2spIHtcbiAgICAgIGxldCBpbmRleCA9IHRoaXMuYnJpY2tzLmluZGV4T2YoYnJpY2spO1xuICAgICAgbGV0IGFyZUNvbGxpZGluZyA9IHRoaXMuY29sbGlzaW9uQ2hlY2soYmFsbCwgYnJpY2spO1xuICAgICAgaWYgKGFyZUNvbGxpZGluZykge1xuICAgICAgICB0aGlzLnNjb3JlICs9IDEwMDtcbiAgICAgICAgaWYgKGJyaWNrLmhlYWx0aCA9PT0gMSl7XG4gICAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5icmlja3MuaW5kZXhPZihicmljayk7XG4gICAgICAgICAgdGhpcy5kaXNjYXJkZWRCcmlja3MgPSB0aGlzLmJyaWNrcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9XG4gICAgICAgIGJyaWNrLmhlYWx0aC0tO1xuICAgICAgICBpZiAoYmFsbC54IDwgKGJyaWNrLnggKyBicmljay53aWR0aCkgJiYgYmFsbC54ID4gYnJpY2sueCkge1xuICAgICAgICAgIHJldHVybiBkeSA9IC1keTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZHk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LmJpbmQodGhpcykpXG4gICAgcmV0dXJuIGR5O1xuICB9XG5cbiAgY2hlY2tCcmlja3MoKSB7XG4gICAgaWYgKHRoaXMuYnJpY2tzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy5sZXZlbCsrO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgYnJpY2tCYWxsU2lkZUNvbGxpc2lvbihiYWxsLCBicmlja3MpIHtcbiAgICBicmlja3MuZm9yRWFjaChmdW5jdGlvbihicmljaykge1xuICAgICAgbGV0IGFyZUNvbGxpZGluZyA9IHRoaXMuY29sbGlzaW9uQ2hlY2soYmFsbCwgYnJpY2spO1xuICAgICAgaWYgKGFyZUNvbGxpZGluZykge1xuICAgICAgICBpZiAoYmFsbC54IDw9IGJyaWNrLnggfHwgYmFsbC54ID49IChicmljay54ICsgYnJpY2sud2lkdGgpKSB7XG4gICAgICAgICAgYmFsbC5keCA9IC1iYWxsLmR4O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfS5iaW5kKHRoaXMpKVxuICAgIHJldHVybiBiYWxsLmR4O1xuICB9XG5cbiAgY2hlY2tCYWxsRGVhdGgoYmFsbCwgY2FudmFzSGVpZ2h0KSB7XG4gICAgaWYgKGJhbGwueSA+PSBjYW52YXNIZWlnaHQpIHtcbiAgICAgIHRoaXMubGl2ZXMgLT0gMTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2xpYi9HYW1lLmpzIiwiY2xhc3MgQnJpY2sge1xuICBjb25zdHJ1Y3Rvcih4LCB5KSB7XG4gICAgdGhpcy54ID0geDtcbiAgICB0aGlzLnkgPSB5O1xuICAgIHRoaXMuaGVhbHRoID0gMTtcbiAgICB0aGlzLndpZHRoID0gNzU7XG4gICAgdGhpcy5oZWlnaHQgPSAyNTtcbiAgICB0aGlzLmJyaWNrcyA9IFtdO1xuICB9XG5cbiAgY3JlYXRlQnJpY2tzKG51bUJyaWNrcywgbGV2ZWwpIHtcbiAgICBpZiAobGV2ZWwgPCAzKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bUJyaWNrczsgaSsrKSB7XG4gICAgICAgIGlmIChpIDw9IDkpIHtcbiAgICAgICAgICBsZXQgeCA9IDIuNSArIChpICogNzUpICsgKGkgKiA1KTtcbiAgICAgICAgICBsZXQgeSA9IDE1O1xuICAgICAgICAgIHRoaXMuYnJpY2tzLnB1c2gobmV3IEJyaWNrKHgsIHkpKTtcbiAgICAgICAgfSBlbHNlIGlmIChpIDw9IDE5KSB7XG4gICAgICAgICAgbGV0IHggPSAyLjUgKyAoKGkgLSAxMCkgKiA3NSkgKyAoKGkgLSAxMCkgKiA1KTtcbiAgICAgICAgICBsZXQgeSA9IDQ1O1xuICAgICAgICAgIHRoaXMuYnJpY2tzLnB1c2gobmV3IEJyaWNrKHgsIHkpKTtcbiAgICAgICAgfSBlbHNlIGlmIChpIDw9IDI5KSB7XG4gICAgICAgICAgbGV0IHggPSAyLjUgKyAoKGkgLSAyMCkgKiA3NSkgKyAoKGkgLSAyMCkgKiA1KTtcbiAgICAgICAgICBsZXQgeSA9IDc1O1xuICAgICAgICAgIHRoaXMuYnJpY2tzLnB1c2gobmV3IEJyaWNrKHgsIHkpKTtcbiAgICAgICAgfSBlbHNlIGlmIChpIDw9IDM5KSB7XG4gICAgICAgICAgbGV0IHggPSAyLjUgKyAoKGkgLSAzMCkgKiA3NSkgKyAoKGkgLSAzMCkgKiA1KTtcbiAgICAgICAgICBsZXQgeSA9IDEwNTtcbiAgICAgICAgICBpZiAobGV2ZWwgPT09IDIpIHtcbiAgICAgICAgICAgIGxldCBoZWFsdGggPSAyO1xuICAgICAgICAgICAgdGhpcy5icmlja3MucHVzaChuZXcgU3Ryb25nZXJCcmljayh4LCB5LCBoZWFsdGgpKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bUJyaWNrczsgaSsrKSB7XG4gICAgICAgIGlmIChpIDw9IDgpIHtcbiAgICAgICAgICBsZXQgeCA9IDQ1ICsgKGkgKiA3NSkgKyAoaSAqIDUpO1xuICAgICAgICAgIGxldCB5ID0gMjU7XG4gICAgICAgICAgbGV0IGhlYWx0aCA9IDI7XG4gICAgICAgICAgdGhpcy5icmlja3MucHVzaChuZXcgU3Ryb25nZXJCcmljayh4LCB5LCBoZWFsdGgpKTtcbiAgICAgICAgfSBlbHNlIGlmIChpIDw9IDE3KSB7XG4gICAgICAgICAgbGV0IHggPSA0NSArICgoaSAtIDkpICogNzUpICsgKChpIC0gOSkgKiA1KTtcbiAgICAgICAgICBsZXQgeSA9IDU1O1xuICAgICAgICAgIHRoaXMuYnJpY2tzLnB1c2gobmV3IEJyaWNrKHgsIHkpKTtcbiAgICAgICAgfSBlbHNlIGlmIChpIDw9IDI2KSB7XG4gICAgICAgICAgbGV0IHggPSA0NSArICgoaSAtIDE4KSAqIDc1KSArICgoaSAtIDE4KSAqIDUpO1xuICAgICAgICAgIGxldCB5ID0gODU7XG4gICAgICAgICAgbGV0IGhlYWx0aCA9IDI7XG4gICAgICAgICAgdGhpcy5icmlja3MucHVzaChuZXcgU3Ryb25nZXJCcmljayh4LCB5LCBoZWFsdGgpKTtcbiAgICAgICAgfSBlbHNlIGlmIChpIDw9IDM1KSB7XG4gICAgICAgICAgbGV0IHggPSA0NSArICgoaSAtIDI3KSAqIDc1KSArICgoaSAtIDI3KSAqIDUpO1xuICAgICAgICAgIGxldCB5ID0gMTE1O1xuICAgICAgICAgIGxldCBoZWFsdGggPSAyO1xuICAgICAgICAgIHRoaXMuYnJpY2tzLnB1c2gobmV3IFN0cm9uZ2VyQnJpY2soeCwgeSwgaGVhbHRoKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaSA8PSA0NCkge1xuICAgICAgICAgIGxldCB4ID0gNDUgKyAoKGkgLSAzNikgKiA3NSkgKyAoKGkgLSAzNikgKiA1KTtcbiAgICAgICAgICBsZXQgeSA9IDE0NTtcbiAgICAgICAgICB0aGlzLmJyaWNrcy5wdXNoKG5ldyBCcmljayh4LCB5KSlcbiAgICAgICAgfSBlbHNlIGlmIChpIDw9IDUzKSB7XG4gICAgICAgICAgbGV0IHggPSA0NSArICgoaSAtIDQ1KSAqIDc1KSArICgoaSAtIDQ1KSAqIDUpO1xuICAgICAgICAgIGxldCB5ID0gMTc1O1xuICAgICAgICAgIGxldCBoZWFsdGggPSAyO1xuICAgICAgICAgIHRoaXMuYnJpY2tzLnB1c2gobmV3IFN0cm9uZ2VyQnJpY2soeCwgeSwgaGVhbHRoKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuYnJpY2tzID0gdGhpcy5icmlja3MuZmlsdGVyKGJyaWNrID0+IGJyaWNrLnggIT09IDM2NSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmJyaWNrcztcbiAgfVxuXG4gIGNsZWFyQnJpY2tzKCkge1xuICAgIHRoaXMuYnJpY2tzID0gW107XG4gICAgcmV0dXJuIHRoaXMuYnJpY2tzO1xuICB9XG5cbiAgZHJhdyhjb250ZXh0LCBicmlja3MpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJyaWNrcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3Qge3gsIHksIHdpZHRoLCBoZWlnaHR9ID0gYnJpY2tzW2ldO1xuICAgICAgaWYgKGJyaWNrc1tpXS5oZWFsdGggPT09IDIpIHtcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAnIzM2MDYwMCdcbiAgICAgIH0gZWxzZSBpZiAoYnJpY2tzW2ldLmhlYWx0aCA9PT0gMSkge1xuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICcjRkMwMDA5J1xuICAgICAgfVxuICAgICAgY29udGV4dC5maWxsUmVjdCh4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgU3Ryb25nZXJCcmljayBleHRlbmRzIEJyaWNrIHtcbiAgY29uc3RydWN0b3IoeCwgeSwgaGVhbHRoKSB7XG4gICAgc3VwZXIoeCwgeSk7XG4gICAgdGhpcy5oZWFsdGggPSBoZWFsdGg7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCcmljaztcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2xpYi9icmlja3MuanMiXSwic291cmNlUm9vdCI6IiJ9