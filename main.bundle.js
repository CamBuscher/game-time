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
	  }
	
	  _createClass(Brick, [{
	    key: 'createBricks',
	    value: function createBricks(numBricks, level) {
	      var bricksArray = [];
	      if (level < 3) {
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
	        }
	      } else {
	        for (var i = 0; i < numBricks; i++) {
	          if (i <= 8) {
	            var _x4 = 45 + i * 75 + i * 5;
	            var _y4 = 25;
	            var _health = 2;
	            bricksArray.push(new StrongerBrick(_x4, _y4, _health));
	          } else if (i <= 17) {
	            var _x5 = 45 + (i - 9) * 75 + (i - 9) * 5;
	            var _y5 = 55;
	            bricksArray.push(new Brick(_x5, _y5));
	          } else if (i <= 26) {
	            var _x6 = 45 + (i - 18) * 75 + (i - 18) * 5;
	            var _y6 = 85;
	            var _health2 = 2;
	            bricksArray.push(new StrongerBrick(_x6, _y6, _health2));
	          } else if (i <= 35) {
	            var _x7 = 45 + (i - 27) * 75 + (i - 27) * 5;
	            var _y7 = 115;
	            var _health3 = 2;
	            bricksArray.push(new StrongerBrick(_x7, _y7, _health3));
	          } else if (i <= 44) {
	            var _x8 = 45 + (i - 36) * 75 + (i - 36) * 5;
	            var _y8 = 145;
	            bricksArray.push(new Brick(_x8, _y8));
	          } else if (i <= 53) {
	            var _x9 = 45 + (i - 45) * 75 + (i - 45) * 5;
	            var _y9 = 175;
	            var _health4 = 2;
	            bricksArray.push(new StrongerBrick(_x9, _y9, _health4));
	          }
	        }
	        bricksArray = bricksArray.filter(function (brick) {
	          return brick.x !== 365;
	        });
	      }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZWZjZWIxNTVmNDAxMWYyMDNlNDUiLCJ3ZWJwYWNrOi8vLy4vbGliL2luZGV4LmpzIiwid2VicGFjazovLy8uL2xpYi9QYWRkbGUuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL0tleWJvYXJkZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL0JhbGwuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL1Njb3Jlcy5qcyIsIndlYnBhY2s6Ly8vLi9saWIvR2FtZS5qcyIsIndlYnBhY2s6Ly8vLi9saWIvQnJpY2tzLmpzIl0sIm5hbWVzIjpbImNhbnZhcyIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsIlBhZGRsZSIsInJlcXVpcmUiLCJLZXlib2FyZGVyIiwiQmFsbCIsIlNjb3JlcyIsIkdhbWUiLCJCcmljayIsImN0eCIsImdldENvbnRleHQiLCJuZXdHYW1lIiwiYm91bmN5QmFsbCIsInN0YXJ0UGFkZGxlIiwia2V5Ym9hcmRNb25pdG9yIiwiTWF0aCIsInJhbmRvbSIsImtleVN0YXRlIiwiYnJpY2tzIiwicmVxdWVzdElEIiwidW5kZWZpbmVkIiwiaXNEZWFkIiwiZ2VuZXJhdGVCcmlja3MiLCJzdGFydEdhbWUiLCJnZXRGcm9tU3RvcmFnZSIsImxldmVsIiwibmV3QnJpY2tzIiwiY3JlYXRlQnJpY2tzIiwiZm9yRWFjaCIsImdyYWJCcmlja3MiLCJicmljayIsIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwia2V5RG93biIsImtleVVwIiwicmVzdGFydEdhbWUiLCJnYW1lTG9vcCIsImdldEVsZW1lbnRCeUlkIiwiaW5uZXJIVE1MIiwic2NvcmUiLCJsaXZlcyIsImZpbGxTdHlsZSIsImNsZWFyUmVjdCIsIndpZHRoIiwiaGVpZ2h0IiwiZHJhdyIsImR5IiwicGFkZGxlQmFsbENvbGxpZGluZyIsImR4IiwicGFkZGxlQmFsbFhDaGVjayIsImJyaWNrQmFsbFNpZGVDb2xsaXNpb24iLCJicmlja0JhbGxDb2xsaWRpbmciLCJtb3ZlIiwiYW5pbWF0ZSIsImNoZWNrQmFsbERlYXRoIiwiYmFsbERlYXRoIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiY2hlY2tCcmlja3MiLCJjbGVhckJyaWNrcyIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwiZGVsYXllZFN0YXJ0IiwiZW5kR2FtZSIsInNldFRpbWVvdXQiLCJ1c2VyU2NvcmVzIiwiaW5pdGlhbHMiLCJwcm9tcHQiLCJjaGVja0luaXRpYWxzIiwic2NvcmVUb1N0b3JhZ2UiLCJsaXZlc0luZGljYXRvciIsImlubmVyVGV4dCIsInRlc3QiLCJzIiwic2xpY2UiLCJ0b1VwcGVyQ2FzZSIsInNjb3JlcyIsInN0b3JlU2NvcmVzIiwic3RyaW5naWZ5U2NvcmVzIiwiSlNPTiIsInN0cmluZ2lmeSIsImxvY2FsU3RvcmFnZSIsInNldEl0ZW0iLCJpZCIsInRvcFNjb3JlcyIsImkiLCJsZW5ndGgiLCJyZXRyaWV2ZWRJdGVtIiwiZ2V0SXRlbSIsImtleSIsInBhcnNlZEl0ZW0iLCJwYXJzZSIsInB1c2giLCJzb3J0IiwiYSIsImIiLCJzcGxpY2UiLCJIVE1MSW5pdGlhbHMiLCJIVE1MU2NvcmVzIiwieCIsInkiLCJjb250ZXh0IiwiZmlsbFJlY3QiLCJtb2R1bGUiLCJleHBvcnRzIiwia2V5cyIsImxlZnQiLCJyaWdodCIsImtleUNvZGUiLCJyYWRpdXMiLCJiZWdpblBhdGgiLCJhcmMiLCJQSSIsInN0cm9rZSIsImZpbGwiLCJjYW52YXNIZWlnaHQiLCJjYW52YXNXaWR0aCIsIkRhdGUiLCJub3ciLCJiYWxsIiwicGFkZGxlIiwiZGlzY2FyZGVkQnJpY2tzIiwiYmFsbHMiLCJvYmoxIiwib2JqMiIsImFyZUNvbGxpZGluZyIsImNvbGxpc2lvbkNoZWNrIiwicGFkZGxlRmlyc3RGaWZ0aCIsInBhZGRsZVNlY29uZEZpZnRoIiwicGFkZGxlVGhpcmRGaWZ0aCIsInBhZGRsZUZvdXJ0aEZpZnRoIiwiaW5kZXgiLCJpbmRleE9mIiwiaGVhbHRoIiwiYmluZCIsIm51bUJyaWNr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RSxJQUFJLENBQWIsRUFBZ0JBLElBQUlsRSxPQUFPbUUsTUFBM0IsRUFBbUNELEdBQW5DLEVBQXdDO0FBQUEseUJBQ1JsRSxPQUFPa0UsQ0FBUCxDQURRO0FBQUEsYUFDL0JjLENBRCtCLGFBQy9CQSxDQUQrQjtBQUFBLGFBQzVCQyxDQUQ0QixhQUM1QkEsQ0FENEI7QUFBQSxhQUN6QnZELEtBRHlCLGFBQ3pCQSxLQUR5QjtBQUFBLGFBQ2xCQyxNQURrQixhQUNsQkEsTUFEa0I7O0FBRXRDLGFBQUkzQixPQUFPa0UsQ0FBUCxFQUFVZ0QsTUFBVixLQUFxQixDQUF6QixFQUE0QjtBQUMxQmhDLG1CQUFRMUQsU0FBUixHQUFvQixTQUFwQjtBQUNELFVBRkQsTUFFTyxJQUFJeEIsT0FBT2tFLENBQVAsRUFBVWdELE1BQVYsS0FBcUIsQ0FBekIsRUFBNEI7QUFDakNoQyxtQkFBUTFELFNBQVIsR0FBb0IsU0FBcEI7QUFDRDtBQUNEMEQsaUJBQVFDLFFBQVIsQ0FBaUJILENBQWpCLEVBQW9CQyxDQUFwQixFQUF1QnZELEtBQXZCLEVBQThCQyxNQUE5QjtBQUNEO0FBQ0Y7Ozs7OztLQUdHMkYsYTs7O0FBQ0osMEJBQVl0QyxDQUFaLEVBQWVDLENBQWYsRUFBa0JpQyxNQUFsQixFQUEwQjtBQUFBOztBQUFBLCtIQUNsQmxDLENBRGtCLEVBQ2ZDLENBRGU7O0FBRXhCLFdBQUtpQyxNQUFMLEdBQWNBLE1BQWQ7QUFGd0I7QUFHekI7OztHQUp5QjVILEs7O0FBTzVCOEYsUUFBT0MsT0FBUCxHQUFpQi9GLEtBQWpCLEMiLCJmaWxlIjoibWFpbi5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBlZmNlYjE1NWY0MDExZjIwM2U0NSIsImNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNnYW1lLXNjcmVlbicpO1xuY29uc3QgUGFkZGxlID0gcmVxdWlyZSgnLi9QYWRkbGUnKTtcbmNvbnN0IEtleWJvYXJkZXIgPSByZXF1aXJlKCcuL0tleWJvYXJkZXInKTtcbmNvbnN0IEJhbGwgPSByZXF1aXJlKCcuL0JhbGwuanMnKTtcbmNvbnN0IFNjb3JlcyA9IHJlcXVpcmUoJy4vU2NvcmVzLmpzJyk7XG5jb25zdCBHYW1lID0gcmVxdWlyZSgnLi9HYW1lLmpzJyk7XG5jb25zdCBCcmljayA9IHJlcXVpcmUoJy4vQnJpY2tzLmpzJyk7XG5sZXQgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5sZXQgbmV3R2FtZSA9IG5ldyBHYW1lKGJvdW5jeUJhbGwsIHN0YXJ0UGFkZGxlKTtcbmxldCBzdGFydFBhZGRsZSA9IG5ldyBQYWRkbGUoMzUwLCAxMDAsIDE1KTtcbmxldCBrZXlib2FyZE1vbml0b3IgPSBuZXcgS2V5Ym9hcmRlcigpO1xubGV0IGJvdW5jeUJhbGwgPSBuZXcgQmFsbCg0MDAsIDIwMCwgKChNYXRoLnJhbmRvbSgpICogMykgLSAxLjUpLCA0KTtcbmxldCBrZXlTdGF0ZSA9IHt9O1xubGV0IGJyaWNrcyA9IG5ldyBCcmljaygpO1xubGV0IHJlcXVlc3RJRCA9IHVuZGVmaW5lZDtcbmxldCBpc0RlYWQgPSBudWxsO1xuXG5nZW5lcmF0ZUJyaWNrcygpO1xuc3RhcnRHYW1lKCk7XG5nZXRGcm9tU3RvcmFnZSgpO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZUJyaWNrcygpIHtcbiAgaWYgKG5ld0dhbWUubGV2ZWwgPT09IDEpIHtcbiAgICBsZXQgbmV3QnJpY2tzID0gYnJpY2tzLmNyZWF0ZUJyaWNrcyg0MCwgMSk7XG4gICAgbmV3QnJpY2tzLmZvckVhY2goIGJyaWNrID0+IG5ld0dhbWUuZ3JhYkJyaWNrcyhicmljaykgKTtcbiAgfSBlbHNlIGlmIChuZXdHYW1lLmxldmVsID09PSAyKSB7XG4gICAgbGV0IG5ld0JyaWNrcyA9IGJyaWNrcy5jcmVhdGVCcmlja3MoNDAsIDIpO1xuICAgIG5ld0JyaWNrcy5mb3JFYWNoKCBicmljayA9PiBuZXdHYW1lLmdyYWJCcmlja3MoYnJpY2spICk7XG4gIH0gZWxzZSBpZiAobmV3R2FtZS5sZXZlbCA9PT0gMykge1xuICAgIGxldCBuZXdCcmlja3MgPSBicmlja3MuY3JlYXRlQnJpY2tzKDU0LCAzKTtcbiAgICBuZXdCcmlja3MuZm9yRWFjaCggYnJpY2sgPT4gbmV3R2FtZS5ncmFiQnJpY2tzKGJyaWNrKSApO1xuICB9XG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZnVuY3Rpb24oZSkge1xuICBrZXlTdGF0ZSA9IGtleWJvYXJkTW9uaXRvci5rZXlEb3duKGUpO1xufSk7XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGZ1bmN0aW9uKGUpIHtcbiAga2V5U3RhdGUgPSBrZXlib2FyZE1vbml0b3Iua2V5VXAoZSk7XG59KTtcblxuZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5ldy1nYW1lLWJ1dHRvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcmVzdGFydEdhbWUpO1xuXG5mdW5jdGlvbiBnYW1lTG9vcCgpIHtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VzZXItc2NvcmUnKS5pbm5lckhUTUwgPSBuZXdHYW1lLnNjb3JlO1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubGl2ZXMtaW5kaWNhdG9yJykuaW5uZXJIVE1MID0gbmV3R2FtZS5saXZlcztcbiAgY3R4LmZpbGxTdHlsZSA9ICcjMDAwJztcbiAgY3R4LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuICBzdGFydFBhZGRsZS5kcmF3KGN0eCk7XG4gIGJvdW5jeUJhbGwuZHJhdyhjdHgpO1xuICBib3VuY3lCYWxsLmR5ID0gbmV3R2FtZS5wYWRkbGVCYWxsQ29sbGlkaW5nKGJvdW5jeUJhbGwsIHN0YXJ0UGFkZGxlKTtcbiAgYm91bmN5QmFsbC5keCA9IG5ld0dhbWUucGFkZGxlQmFsbFhDaGVjayhib3VuY3lCYWxsLCBzdGFydFBhZGRsZSk7XG4gIGJvdW5jeUJhbGwuZHggPSBuZXdHYW1lLmJyaWNrQmFsbFNpZGVDb2xsaXNpb24oYm91bmN5QmFsbCwgbmV3R2FtZS5icmlja3MpO1xuICBib3VuY3lCYWxsLmR5ID0gbmV3R2FtZS5icmlja0JhbGxDb2xsaWRpbmcoYm91bmN5QmFsbCwgbmV3R2FtZS5icmlja3MpO1xuICBicmlja3MuZHJhdyhjdHgsIG5ld0dhbWUuYnJpY2tzKTtcbiAgYm91bmN5QmFsbC5tb3ZlKGNhbnZhcy5oZWlnaHQsIGNhbnZhcy53aWR0aCk7XG4gIHN0YXJ0UGFkZGxlLmFuaW1hdGUoa2V5U3RhdGUpO1xuICBpc0RlYWQgPSBuZXdHYW1lLmNoZWNrQmFsbERlYXRoKGJvdW5jeUJhbGwsIGNhbnZhcy5oZWlnaHQpO1xuICBpZiAoaXNEZWFkKSB7XG4gICAgYmFsbERlYXRoKCk7XG4gIH0gZWxzZSB7XG4gICAgcmVxdWVzdElEID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGdhbWVMb29wKTtcbiAgfVxuICBpZiAobmV3R2FtZS5jaGVja0JyaWNrcygpKSB7XG4gICAgYnJpY2tzLmNsZWFyQnJpY2tzKCk7XG4gICAgZ2VuZXJhdGVCcmlja3MoKTtcbiAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUocmVxdWVzdElEKTtcbiAgICByZXF1ZXN0SUQgPSBudWxsO1xuICAgIHN0YXJ0R2FtZSgpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlc3RhcnRHYW1lKCkge1xuICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUocmVxdWVzdElEKTtcbiAgcmVxdWVzdElEID0gbnVsbDtcbiAgbmV3R2FtZS5icmlja3MgPSBicmlja3MuY2xlYXJCcmlja3MoKTtcbiAgYm91bmN5QmFsbCA9IG5ldyBCYWxsKDQwMCwgMjAwLCAoKE1hdGgucmFuZG9tKCkgKiAzKSAtIDEuNSksIDQpO1xuICBuZXdHYW1lID0gbmV3IEdhbWUoYm91bmN5QmFsbCwgc3RhcnRQYWRkbGUpO1xuICBnZW5lcmF0ZUJyaWNrcygpO1xuICBzdGFydEdhbWUoKTtcbn1cblxuZnVuY3Rpb24gc3RhcnRHYW1lKCkge1xuICBjdHguZmlsbFN0eWxlID0gJyMwMDAnO1xuICBjdHguY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4gIGJvdW5jeUJhbGwgPSBuZXcgQmFsbCg0MDAsIDIwMCwgKChNYXRoLnJhbmRvbSgpICogMykgLSAxLjUpLCA0KTtcbiAgc3RhcnRQYWRkbGUgPSBuZXcgUGFkZGxlKDM1MCwgMTAwLCAxNSk7XG4gIHN0YXJ0UGFkZGxlLmRyYXcoY3R4KTtcbiAgYm91bmN5QmFsbC5kcmF3KGN0eCk7XG4gIGJyaWNrcy5kcmF3KGN0eCwgbmV3R2FtZS5icmlja3MpO1xuICBkZWxheWVkU3RhcnQoKTtcbiAgZW5kR2FtZSgpO1xufVxuXG5mdW5jdGlvbiBkZWxheWVkU3RhcnQoKSB7XG4gIGlmKCFyZXF1ZXN0SUQpIHtcbiAgICB3aW5kb3cuc2V0VGltZW91dChnYW1lTG9vcCwgMzAwMCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZW5kR2FtZSgpIHtcbiAgbGV0IHVzZXJTY29yZXMgPSBuZXcgU2NvcmVzKCk7XG4gIGlmKG5ld0dhbWUubGl2ZXMgPT09IDApIHtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXNlci1zY29yZScpLmlubmVySFRNTCA9IDA7XG4gICAgdXNlclNjb3Jlcy5pbml0aWFscyA9IHByb21wdCgnRW50ZXIgeW91ciBpbml0aWFscyEnLCAnJyk7XG4gICAgdXNlclNjb3Jlcy5zY29yZSA9IG5ld0dhbWUuc2NvcmU7XG4gICAgdXNlclNjb3Jlcy5pbml0aWFscyA9IGNoZWNrSW5pdGlhbHModXNlclNjb3Jlcy5pbml0aWFscyk7XG4gICAgc2NvcmVUb1N0b3JhZ2UodXNlclNjb3Jlcyk7XG4gICAgZ2V0RnJvbVN0b3JhZ2UodXNlclNjb3Jlcyk7XG4gICAgbmV3R2FtZSA9IG5ldyBHYW1lKGJvdW5jeUJhbGwsIHN0YXJ0UGFkZGxlKTtcbiAgICBicmlja3MgPSBuZXcgQnJpY2soKTtcbiAgICBnZW5lcmF0ZUJyaWNrcygpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGJhbGxEZWF0aCgpIHtcbiAgaWYocmVxdWVzdElEKSB7XG4gICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKHJlcXVlc3RJRCk7XG4gICAgcmVxdWVzdElEID0gbnVsbDtcbiAgICBpc0RlYWQgPSBmYWxzZTtcbiAgICBsZXQgbGl2ZXNJbmRpY2F0b3IgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubGl2ZXMtaW5kaWNhdG9yJyk7XG4gICAgbGl2ZXNJbmRpY2F0b3IuaW5uZXJUZXh0ID0gbmV3R2FtZS5saXZlcztcbiAgICBzdGFydEdhbWUoKTtcbiAgfVxufVxuXG5jb25zdCBjaGVja0luaXRpYWxzID0gcyA9PiAvW2Etel0qL2dpLnRlc3QocykgPyBzLnNsaWNlKDAsIDMpLnRvVXBwZXJDYXNlKCkgOiAnTi9BJztcblxuZnVuY3Rpb24gc2NvcmVUb1N0b3JhZ2Uoc2NvcmVzKSB7XG4gIGxldCBzdG9yZVNjb3JlcyA9IHNjb3JlcztcbiAgbGV0IHN0cmluZ2lmeVNjb3JlcyA9IEpTT04uc3RyaW5naWZ5KHN0b3JlU2NvcmVzKTtcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oc2NvcmVzLmlkLCBzdHJpbmdpZnlTY29yZXMpO1xufVxuXG5mdW5jdGlvbiBnZXRGcm9tU3RvcmFnZShzY29yZXMpIHtcbiAgbGV0IHRvcFNjb3JlcyA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGxvY2FsU3RvcmFnZS5sZW5ndGg7IGkrKyl7XG4gICAgbGV0IHJldHJpZXZlZEl0ZW0gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShsb2NhbFN0b3JhZ2Uua2V5KGkpKTtcbiAgICBsZXQgcGFyc2VkSXRlbSA9IEpTT04ucGFyc2UocmV0cmlldmVkSXRlbSk7XG4gICAgdG9wU2NvcmVzLnB1c2gocGFyc2VkSXRlbSk7XG4gIH1cbiAgdG9wU2NvcmVzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiBiLnNjb3JlIC0gYS5zY29yZTtcbiAgfSlcbiAgdG9wU2NvcmVzLnNwbGljZSgxMCwgMTAwMCk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdG9wU2NvcmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgbGV0IGluaXRpYWxzID0gdG9wU2NvcmVzW2ldLmluaXRpYWxzO1xuICAgIGxldCBzY29yZSA9IHRvcFNjb3Jlc1tpXS5zY29yZTtcbiAgICBsZXQgSFRNTEluaXRpYWxzID0gJ2hpZ2gtaW5pdGlhbHMtJyArIChpICsgMSk7XG4gICAgbGV0IEhUTUxTY29yZXMgPSAnaGlnaC1zY29yZS0nICsgKGkgKyAxKTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuJyArIEhUTUxJbml0aWFscykuaW5uZXJIVE1MID0gaW5pdGlhbHM7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLicgKyBIVE1MU2NvcmVzKS5pbm5lckhUTUwgPSBzY29yZTtcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbGliL2luZGV4LmpzIiwiY2xhc3MgUGFkZGxlIHtcbiAgY29uc3RydWN0b3IoeCwgd2lkdGgsIGhlaWdodCkge1xuICAgIHRoaXMueSA9IDQ3NTtcbiAgICB0aGlzLnggPSB4O1xuICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcbiAgfVxuICBkcmF3KGNvbnRleHQpIHtcbiAgICBjb250ZXh0LmZpbGxSZWN0KHRoaXMueCwgdGhpcy55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gIH1cbiAgYW5pbWF0ZShrZXlTdGF0ZSkge1xuICAgIGlmIChrZXlTdGF0ZVszN10gJiYgdGhpcy54ID4gMCkge1xuICAgICAgdGhpcy54IC09IDU7XG4gICAgfSBlbHNlIGlmIChrZXlTdGF0ZVszOV0gJiYgdGhpcy54IDwgNzAwKSB7XG4gICAgICB0aGlzLnggKz0gNTtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQYWRkbGU7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbGliL1BhZGRsZS5qcyIsImNsYXNzIEtleWJvYXJkZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmtleXMgPSB7XG4gICAgICBsZWZ0OiAzNyxcbiAgICAgIHJpZ2h0OiAzOSxcbiAgICB9O1xuICB9XG4gIGtleURvd24oZSkge1xuICAgIHZhciBrZXlTdGF0ZSA9IHt9O1xuICAgIGtleVN0YXRlW2Uua2V5Q29kZV0gPSB0cnVlO1xuICAgIHJldHVybiBrZXlTdGF0ZTtcbiAgfVxuXG4gIGtleVVwKGUpIHtcbiAgICB2YXIga2V5U3RhdGUgPSB7fTtcbiAgICBrZXlTdGF0ZVtlLmtleUNvZGVdID0gZmFsc2U7XG4gICAgcmV0dXJuIGtleVN0YXRlO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gS2V5Ym9hcmRlcjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2xpYi9LZXlib2FyZGVyLmpzIiwiY2xhc3MgQmFsbCB7XG4gIGNvbnN0cnVjdG9yKHgsIHksIGR4LCBkeSkge1xuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcbiAgICB0aGlzLmR4ID0gZHg7XG4gICAgdGhpcy5keSA9IGR5O1xuICAgIHRoaXMucmFkaXVzID0gNTtcbiAgICB0aGlzLndpZHRoID0gdGhpcy5yYWRpdXMgKiAyO1xuICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5yYWRpdXMgKiAyO1xuICB9XG4gIGRyYXcoY29udGV4dCkge1xuICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgY29udGV4dC5hcmModGhpcy54LCB0aGlzLnksIHRoaXMucmFkaXVzLCAwLCBNYXRoLlBJICogMiwgZmFsc2UpO1xuICAgIGNvbnRleHQuc3Ryb2tlKCk7XG4gICAgY29udGV4dC5maWxsU3R5bGUgPSBcIiMwMDBcIjtcbiAgICBjb250ZXh0LmZpbGwoKTtcbiAgfVxuICBtb3ZlKGNhbnZhc0hlaWdodCwgY2FudmFzV2lkdGgpIHtcbiAgICBpZiAoKHRoaXMueCArIHRoaXMucmFkaXVzKSA+PSBjYW52YXNXaWR0aCB8fCAodGhpcy54IC0gdGhpcy5yYWRpdXMpIDw9IDApIHtcbiAgICAgIHRoaXMuZHggPSAtdGhpcy5keDtcbiAgICB9XG4gICAgaWYgKCh0aGlzLnkgLSB0aGlzLnJhZGl1cykgPD0gMCkge1xuICAgICAgdGhpcy5keSA9IC10aGlzLmR5O1xuICAgIH1cbiAgICB0aGlzLnkgKz0gdGhpcy5keTtcbiAgICB0aGlzLnggKz0gdGhpcy5keDtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJhbGw7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9saWIvQmFsbC5qcyIsImNsYXNzIFNjb3JlcyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc2NvcmUgPSAwO1xuICAgIHRoaXMuaW5pdGlhbHMgPSAnWFhYJztcbiAgICB0aGlzLmlkID0gRGF0ZS5ub3coKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNjb3JlcztcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2xpYi9TY29yZXMuanMiLCJjbGFzcyBHYW1lIHtcbiAgY29uc3RydWN0b3IoYmFsbCwgcGFkZGxlKSB7XG4gICAgdGhpcy5icmlja3MgPSBbXTtcbiAgICB0aGlzLmRpc2NhcmRlZEJyaWNrcyA9IFtdO1xuICAgIHRoaXMuYmFsbHMgPSBbYmFsbF07XG4gICAgdGhpcy5wYWRkbGUgPSBwYWRkbGU7XG4gICAgdGhpcy5sZXZlbCA9IDE7XG4gICAgdGhpcy5saXZlcyA9IDM7XG4gICAgdGhpcy5zY29yZSA9IDA7XG4gIH1cblxuICBjb2xsaXNpb25DaGVjayhvYmoxLCBvYmoyKSB7XG4gICAgaWYgKG9iajEueCA8IG9iajIueCArIG9iajIud2lkdGggICYmIG9iajEueCArIG9iajEud2lkdGggID4gb2JqMi54ICYmXG4gICAgICAgIG9iajEueSA8IG9iajIueSArIG9iajIuaGVpZ2h0ICYmIG9iajEueSArIG9iajEuaGVpZ2h0ID4gb2JqMi55KSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHBhZGRsZUJhbGxDb2xsaWRpbmcoYmFsbCwgcGFkZGxlKSB7XG4gICAgbGV0IGFyZUNvbGxpZGluZyA9IHRoaXMuY29sbGlzaW9uQ2hlY2soYmFsbCwgcGFkZGxlKTtcbiAgICBsZXQgZHkgPSBiYWxsLmR5O1xuICAgIGlmIChhcmVDb2xsaWRpbmcpIHtcbiAgICAgIHJldHVybiBkeSA9IC1keTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGR5O1xuICAgIH1cbiAgfVxuXG4gIHBhZGRsZUJhbGxYQ2hlY2soYmFsbCwgcGFkZGxlKSB7XG4gICAgbGV0IGFyZUNvbGxpZGluZyA9IHRoaXMuY29sbGlzaW9uQ2hlY2soYmFsbCwgcGFkZGxlKTtcbiAgICBsZXQgcGFkZGxlRmlyc3RGaWZ0aCA9IHBhZGRsZS54ICsgKHBhZGRsZS53aWR0aCAvIDUpO1xuICAgIGxldCBwYWRkbGVTZWNvbmRGaWZ0aCA9IHBhZGRsZS54ICsgKChwYWRkbGUud2lkdGggLyA1KSAqIDIpO1xuICAgIGxldCBwYWRkbGVUaGlyZEZpZnRoID0gcGFkZGxlLnggKyAoKHBhZGRsZS53aWR0aCAvIDUpICogNCk7XG4gICAgbGV0IHBhZGRsZUZvdXJ0aEZpZnRoID0gcGFkZGxlLnggKyBwYWRkbGUud2lkdGg7XG4gICAgaWYgKGFyZUNvbGxpZGluZykge1xuICAgICAgaWYgKGJhbGwueCA8IHBhZGRsZUZpcnN0RmlmdGgpIHtcbiAgICAgICAgYmFsbC5keCAtPSAzO1xuICAgICAgfSBlbHNlIGlmIChiYWxsLnggPCBwYWRkbGVTZWNvbmRGaWZ0aCkge1xuICAgICAgICBiYWxsLmR4IC09IDE7XG4gICAgICB9IGVsc2UgaWYgKGJhbGwueCA8IHBhZGRsZVRoaXJkRmlmdGgpIHtcbiAgICAgICAgYmFsbC5keCArPSAxO1xuICAgICAgfSBlbHNlIGlmIChiYWxsLnggPCBwYWRkbGVGb3VydGhGaWZ0aCkge1xuICAgICAgICBiYWxsLmR4ICs9IDM7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChiYWxsLmR4ID4gMTApIHtcbiAgICAgIGJhbGwuZHggPSAxMDtcbiAgICB9IGVsc2UgaWYgKGJhbGwuZHggPCAtMTApIHtcbiAgICAgIGJhbGwuZHggPSAtMTA7XG4gICAgfVxuICAgIHJldHVybiBiYWxsLmR4XG4gIH1cblxuICBncmFiQnJpY2tzKGJyaWNrcykge1xuICAgIHRoaXMuYnJpY2tzLnB1c2goYnJpY2tzKTtcbiAgfVxuXG4gIGJyaWNrQmFsbENvbGxpZGluZyhiYWxsLCBicmlja3MpIHtcbiAgICBsZXQgZHkgPSBiYWxsLmR5O1xuICAgIGJyaWNrcy5mb3JFYWNoKGZ1bmN0aW9uKGJyaWNrKSB7XG4gICAgICBsZXQgaW5kZXggPSB0aGlzLmJyaWNrcy5pbmRleE9mKGJyaWNrKTtcbiAgICAgIGxldCBhcmVDb2xsaWRpbmcgPSB0aGlzLmNvbGxpc2lvbkNoZWNrKGJhbGwsIGJyaWNrKTtcbiAgICAgIGlmIChhcmVDb2xsaWRpbmcpIHtcbiAgICAgICAgdGhpcy5zY29yZSArPSAxMDA7XG4gICAgICAgIGlmIChicmljay5oZWFsdGggPT09IDEpe1xuICAgICAgICAgIGxldCBpbmRleCA9IHRoaXMuYnJpY2tzLmluZGV4T2YoYnJpY2spO1xuICAgICAgICAgIHRoaXMuZGlzY2FyZGVkQnJpY2tzID0gdGhpcy5icmlja3Muc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgICAgICBicmljay5oZWFsdGgtLTtcbiAgICAgICAgaWYgKGJhbGwueCA8IChicmljay54ICsgYnJpY2sud2lkdGgpICYmIGJhbGwueCA+IGJyaWNrLngpIHtcbiAgICAgICAgICByZXR1cm4gZHkgPSAtZHk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGR5O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfS5iaW5kKHRoaXMpKVxuICAgIHJldHVybiBkeTtcbiAgfVxuXG4gIGNoZWNrQnJpY2tzKCkge1xuICAgIGlmICh0aGlzLmJyaWNrcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRoaXMubGV2ZWwrKztcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGJyaWNrQmFsbFNpZGVDb2xsaXNpb24oYmFsbCwgYnJpY2tzKSB7XG4gICAgYnJpY2tzLmZvckVhY2goZnVuY3Rpb24oYnJpY2spIHtcbiAgICAgIGxldCBhcmVDb2xsaWRpbmcgPSB0aGlzLmNvbGxpc2lvbkNoZWNrKGJhbGwsIGJyaWNrKTtcbiAgICAgIGlmIChhcmVDb2xsaWRpbmcpIHtcbiAgICAgICAgaWYgKGJhbGwueCA8PSBicmljay54IHx8IGJhbGwueCA+PSAoYnJpY2sueCArIGJyaWNrLndpZHRoKSkge1xuICAgICAgICAgIGJhbGwuZHggPSAtYmFsbC5keDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0uYmluZCh0aGlzKSlcbiAgICByZXR1cm4gYmFsbC5keDtcbiAgfVxuXG4gIGNoZWNrQmFsbERlYXRoKGJhbGwsIGNhbnZhc0hlaWdodCkge1xuICAgIGlmIChiYWxsLnkgPj0gY2FudmFzSGVpZ2h0KSB7XG4gICAgICB0aGlzLmxpdmVzIC09IDE7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWU7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9saWIvR2FtZS5qcyIsImNsYXNzIEJyaWNrIHtcbiAgY29uc3RydWN0b3IoeCwgeSkge1xuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcbiAgICB0aGlzLmhlYWx0aCA9IDE7XG4gICAgdGhpcy53aWR0aCA9IDc1O1xuICAgIHRoaXMuaGVpZ2h0ID0gMjU7XG4gIH1cblxuICBjcmVhdGVCcmlja3MobnVtQnJpY2tzLCBsZXZlbCkge1xuICAgIGxldCBicmlja3NBcnJheSA9IFtdXG4gICAgaWYgKGxldmVsIDwgMykge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1Ccmlja3M7IGkrKykge1xuICAgICAgICBpZiAoaSA8PSA5KSB7XG4gICAgICAgICAgbGV0IHggPSAyLjUgKyAoaSAqIDc1KSArIChpICogNSk7XG4gICAgICAgICAgbGV0IHkgPSAxNTtcbiAgICAgICAgICBicmlja3NBcnJheS5wdXNoKG5ldyBCcmljayh4LCB5KSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaSA8PSAxOSkge1xuICAgICAgICAgIGxldCB4ID0gMi41ICsgKChpIC0gMTApICogNzUpICsgKChpIC0gMTApICogNSk7XG4gICAgICAgICAgbGV0IHkgPSA0NTtcbiAgICAgICAgICBicmlja3NBcnJheS5wdXNoKG5ldyBCcmljayh4LCB5KSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaSA8PSAyOSkge1xuICAgICAgICAgIGxldCB4ID0gMi41ICsgKChpIC0gMjApICogNzUpICsgKChpIC0gMjApICogNSk7XG4gICAgICAgICAgbGV0IHkgPSA3NTtcbiAgICAgICAgICBicmlja3NBcnJheS5wdXNoKG5ldyBCcmljayh4LCB5KSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaSA8PSAzOSkge1xuICAgICAgICAgIGxldCB4ID0gMi41ICsgKChpIC0gMzApICogNzUpICsgKChpIC0gMzApICogNSk7XG4gICAgICAgICAgbGV0IHkgPSAxMDU7XG4gICAgICAgICAgaWYgKGxldmVsID09PSAyKSB7XG4gICAgICAgICAgICBsZXQgaGVhbHRoID0gMjtcbiAgICAgICAgICAgIGJyaWNrc0FycmF5LnB1c2gobmV3IFN0cm9uZ2VyQnJpY2soeCwgeSwgaGVhbHRoKSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1Ccmlja3M7IGkrKykge1xuICAgICAgICBpZiAoaSA8PSA4KSB7XG4gICAgICAgICAgbGV0IHggPSA0NSArIChpICogNzUpICsgKGkgKiA1KTtcbiAgICAgICAgICBsZXQgeSA9IDI1O1xuICAgICAgICAgIGxldCBoZWFsdGggPSAyO1xuICAgICAgICAgIGJyaWNrc0FycmF5LnB1c2gobmV3IFN0cm9uZ2VyQnJpY2soeCwgeSwgaGVhbHRoKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaSA8PSAxNykge1xuICAgICAgICAgIGxldCB4ID0gNDUgKyAoKGkgLSA5KSAqIDc1KSArICgoaSAtIDkpICogNSk7XG4gICAgICAgICAgbGV0IHkgPSA1NTtcbiAgICAgICAgICBicmlja3NBcnJheS5wdXNoKG5ldyBCcmljayh4LCB5KSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaSA8PSAyNikge1xuICAgICAgICAgIGxldCB4ID0gNDUgKyAoKGkgLSAxOCkgKiA3NSkgKyAoKGkgLSAxOCkgKiA1KTtcbiAgICAgICAgICBsZXQgeSA9IDg1O1xuICAgICAgICAgIGxldCBoZWFsdGggPSAyO1xuICAgICAgICAgIGJyaWNrc0FycmF5LnB1c2gobmV3IFN0cm9uZ2VyQnJpY2soeCwgeSwgaGVhbHRoKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaSA8PSAzNSkge1xuICAgICAgICAgIGxldCB4ID0gNDUgKyAoKGkgLSAyNykgKiA3NSkgKyAoKGkgLSAyNykgKiA1KTtcbiAgICAgICAgICBsZXQgeSA9IDExNTtcbiAgICAgICAgICBsZXQgaGVhbHRoID0gMjtcbiAgICAgICAgICBicmlja3NBcnJheS5wdXNoKG5ldyBTdHJvbmdlckJyaWNrKHgsIHksIGhlYWx0aCkpO1xuICAgICAgICB9IGVsc2UgaWYgKGkgPD0gNDQpIHtcbiAgICAgICAgICBsZXQgeCA9IDQ1ICsgKChpIC0gMzYpICogNzUpICsgKChpIC0gMzYpICogNSk7XG4gICAgICAgICAgbGV0IHkgPSAxNDU7XG4gICAgICAgICAgYnJpY2tzQXJyYXkucHVzaChuZXcgQnJpY2soeCwgeSkpXG4gICAgICAgIH0gZWxzZSBpZiAoaSA8PSA1Mykge1xuICAgICAgICAgIGxldCB4ID0gNDUgKyAoKGkgLSA0NSkgKiA3NSkgKyAoKGkgLSA0NSkgKiA1KTtcbiAgICAgICAgICBsZXQgeSA9IDE3NTtcbiAgICAgICAgICBsZXQgaGVhbHRoID0gMjtcbiAgICAgICAgICBicmlja3NBcnJheS5wdXNoKG5ldyBTdHJvbmdlckJyaWNrKHgsIHksIGhlYWx0aCkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBicmlja3NBcnJheSA9IGJyaWNrc0FycmF5LmZpbHRlcihicmljayA9PiBicmljay54ICE9PSAzNjUpO1xuICAgIH1cbiAgICByZXR1cm4gYnJpY2tzQXJyYXk7XG4gIH1cblxuICBjbGVhckJyaWNrcygpIHtcbiAgICBsZXQgYnJpY2tzQXJyYXkgPSBbXTtcbiAgICByZXR1cm4gYnJpY2tzQXJyYXk7XG4gIH1cblxuICBkcmF3KGNvbnRleHQsIGJyaWNrcykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYnJpY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCB7eCwgeSwgd2lkdGgsIGhlaWdodH0gPSBicmlja3NbaV07XG4gICAgICBpZiAoYnJpY2tzW2ldLmhlYWx0aCA9PT0gMikge1xuICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICcjMzYwNjAwJ1xuICAgICAgfSBlbHNlIGlmIChicmlja3NbaV0uaGVhbHRoID09PSAxKSB7XG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJyNGQzAwMDknXG4gICAgICB9XG4gICAgICBjb250ZXh0LmZpbGxSZWN0KHgsIHksIHdpZHRoLCBoZWlnaHQpO1xuICAgIH1cbiAgfVxufVxuXG5jbGFzcyBTdHJvbmdlckJyaWNrIGV4dGVuZHMgQnJpY2sge1xuICBjb25zdHJ1Y3Rvcih4LCB5LCBoZWFsdGgpIHtcbiAgICBzdXBlcih4LCB5KTtcbiAgICB0aGlzLmhlYWx0aCA9IGhlYWx0aDtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJyaWNrO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbGliL0JyaWNrcy5qcyJdLCJzb3VyY2VSb290IjoiIn0=