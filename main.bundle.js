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
	  };
	};
	
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
	};
	
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
	    console.log(userScores.initials);
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
	  for (var i = 0; i < topScores.length; i++) {
	    var initials = topScores[i].initials;
	    var score = topScores[i].score;
	    var HTMLInitials = 'high-initials-' + (i + 1);
	    var HTMLScores = 'high-score-' + (i + 1);
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
	      if (areColliding === true) {
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
	      var paddleMiddleFifth = paddle.x + paddle.width / 5 * 3;
	      var paddleThirdFifth = paddle.x + paddle.width / 5 * 4;
	      var paddleFourthFifth = paddle.x + paddle.width;
	      if (areColliding === true) {
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
	        if (areColliding === true) {
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
	        if (areColliding === true) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMmZkNGI1ZTM5ODQ0ZTUxNjNjYmIiLCJ3ZWJwYWNrOi8vLy4vbGliL2luZGV4LmpzIiwid2VicGFjazovLy8uL2xpYi9QYWRkbGUuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL2tleWJvYXJkZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL2JhbGwuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL3Njb3Jlcy5qcyIsIndlYnBhY2s6Ly8vLi9saWIvR2FtZS5qcyIsIndlYnBhY2s6Ly8vLi9saWIvYnJpY2tzLmpzIl0sIm5hbWVzIjpbImNhbnZhcyIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsIlBhZGRsZSIsInJlcXVpcmUiLCJLZXlib2FyZGVyIiwiQmFsbCIsIlNjb3JlcyIsIkdhbWUiLCJCcmljayIsImN0eCIsImdldENvbnRleHQiLCJuZXdHYW1lIiwiYm91bmN5QmFsbCIsInN0YXJ0UGFkZGxlIiwia2V5Ym9hcmRNb25pdG9yIiwiTWF0aCIsInJhbmRvbSIsImtleVN0YXRlIiwiYnJpY2tzIiwicmVxdWVzdElEIiwidW5kZWZpbmVkIiwiaXNEZWFkIiwiZ2VuZXJhdGVCcmlja3MiLCJzdGFydEdhbWUiLCJnZXRGcm9tU3RvcmFnZSIsImxldmVsIiwibmV3QnJpY2tzIiwiY3JlYXRlQnJpY2tzIiwiZm9yRWFjaCIsImdyYWJCcmlja3MiLCJicmljayIsIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwia2V5RG93biIsImtleVVwIiwicmVzdGFydEdhbWUiLCJnYW1lTG9vcCIsImdldEVsZW1lbnRCeUlkIiwiaW5uZXJIVE1MIiwic2NvcmUiLCJsaXZlcyIsImZpbGxTdHlsZSIsImNsZWFyUmVjdCIsIndpZHRoIiwiaGVpZ2h0IiwiZHJhdyIsImR5IiwicGFkZGxlQmFsbENvbGxpZGluZyIsImR4IiwicGFkZGxlQmFsbFhDaGVjayIsImJyaWNrQmFsbFNpZGVDb2xsaXNpb24iLCJicmlja0JhbGxDb2xsaWRpbmciLCJtb3ZlIiwiYW5pbWF0ZSIsImNoZWNrQmFsbERlYXRoIiwiYmFsbERlYXRoIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiY2hlY2tCcmlja3MiLCJjbGVhckJyaWNrcyIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwiZGVsYXllZFN0YXJ0IiwiZW5kR2FtZSIsInNldFRpbWVvdXQiLCJ1c2VyU2NvcmVzIiwiaW5pdGlhbHMiLCJwcm9tcHQiLCJjb25zb2xlIiwibG9nIiwiY2hlY2tJbml0aWFscyIsInNjb3JlVG9TdG9yYWdlIiwibGl2ZXNJbmRpY2F0b3IiLCJpbm5lclRleHQiLCJ0ZXN0IiwicyIsInNsaWNlIiwidG9VcHBlckNhc2UiLCJzY29yZXMiLCJzdG9yZVNjb3JlcyIsInN0cmluZ2lmeVNjb3JlcyIsIkpTT04iLCJzdHJpbmdpZnkiLCJsb2NhbFN0b3JhZ2UiLCJzZXRJdGVtIiwiaWQiLCJ0b3BTY29yZXMiLCJpIiwibGVuZ3RoIiwicmV0cmlldmVkSXRlbSIsImdldEl0ZW0iLCJrZXkiLCJwYXJzZWRJdGVtIiwicGFyc2UiLCJwdXNoIiwic29ydCIsImEiLCJiIiwic3BsaWNlIiwiSFRNTEluaXRpYWxzIiwiSFRNTFNjb3JlcyIsIngiLCJ5IiwiY29udGV4dCIsImZpbGxSZWN0IiwibW9kdWxlIiwiZXhwb3J0cyIsImtleXMiLCJsZWZ0IiwicmlnaHQiLCJrZXlDb2RlIiwicmFkaXVzIiwiYmVnaW5QYXRoIiwiYXJjIiwiUEkiLCJzdHJva2UiLCJmaWxsIiwiY2FudmFzSGVpZ2h0IiwiY2FudmFzV2lkdGgiLCJEYXRlIiwibm93IiwiYmFsbCIsInBhZGRsZSIsImRpc2NhcmRlZEJyaWNrcyIsImJhbGxzIiwib2JqMSIsIm9iajIiLCJhcmVDb2xsaWRpbmciLCJjb2xsaXNpb25DaGVjayIsInBhZGRsZUZpcnN0RmlmdGgiLCJwYWRkbGVTZWNvbmRGaWZ0aCIsInBhZGRsZU1pZGRsZUZpZnRoIiwicGFkZGxlVGhpcmRGaWZ0aCIsInBhZGRsZUZvdXJ0aEZpZnRoIiwiaW5kZXgiLCJpbmRleE9mIiwiaGVhbHRoIiwiYmluZCIsIm51bUJyaWNrcyIsIlN0cm9uZ2VyQnJpY2siLCJmaWx0ZXIiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7QUN0Q0EsS0FBTUEsU0FBU0MsU0FBU0MsYUFBVCxDQUF1QixjQUF2QixDQUFmO0FBQ0EsS0FBTUMsU0FBUyxtQkFBQUMsQ0FBUSxDQUFSLENBQWY7QUFDQSxLQUFNQyxhQUFhLG1CQUFBRCxDQUFRLENBQVIsQ0FBbkI7QUFDQSxLQUFNRSxPQUFPLG1CQUFBRixDQUFRLENBQVIsQ0FBYjtBQUNBLEtBQU1HLFNBQVMsbUJBQUFILENBQVEsQ0FBUixDQUFmO0FBQ0EsS0FBTUksT0FBTyxtQkFBQUosQ0FBUSxDQUFSLENBQWI7QUFDQSxLQUFNSyxRQUFRLG1CQUFBTCxDQUFRLENBQVIsQ0FBZDtBQUNBLEtBQUlNLE1BQU1WLE9BQU9XLFVBQVAsQ0FBa0IsSUFBbEIsQ0FBVjtBQUNBLEtBQUlDLFVBQVUsSUFBSUosSUFBSixDQUFTSyxVQUFULEVBQXFCQyxXQUFyQixDQUFkO0FBQ0EsS0FBSUEsY0FBYyxJQUFJWCxNQUFKLENBQVcsR0FBWCxFQUFnQixHQUFoQixFQUFxQixFQUFyQixDQUFsQjtBQUNBLEtBQUlZLGtCQUFrQixJQUFJVixVQUFKLEVBQXRCO0FBQ0EsS0FBSVEsYUFBYSxJQUFJUCxJQUFKLENBQVMsR0FBVCxFQUFjLEdBQWQsRUFBcUJVLEtBQUtDLE1BQUwsS0FBZ0IsQ0FBakIsR0FBcUIsR0FBekMsRUFBK0MsQ0FBL0MsQ0FBakI7QUFDQSxLQUFJQyxXQUFXLEVBQWY7QUFDQSxLQUFJQyxTQUFTLElBQUlWLEtBQUosRUFBYjtBQUNBLEtBQUlXLFlBQVlDLFNBQWhCO0FBQ0EsS0FBSUMsU0FBUyxJQUFiOztBQUVBQztBQUNBQztBQUNBQzs7QUFFQSxVQUFTRixjQUFULEdBQTBCO0FBQ3hCLE9BQUlYLFFBQVFjLEtBQVIsS0FBa0IsQ0FBdEIsRUFBeUI7QUFDdkIsU0FBSUMsWUFBWVIsT0FBT1MsWUFBUCxDQUFvQixFQUFwQixFQUF3QixDQUF4QixDQUFoQjtBQUNBRCxlQUFVRSxPQUFWLENBQW1CO0FBQUEsY0FBU2pCLFFBQVFrQixVQUFSLENBQW1CQyxLQUFuQixDQUFUO0FBQUEsTUFBbkI7QUFDRCxJQUhELE1BR08sSUFBSW5CLFFBQVFjLEtBQVIsS0FBa0IsQ0FBdEIsRUFBeUI7QUFDOUIsU0FBSUMsYUFBWVIsT0FBT1MsWUFBUCxDQUFvQixFQUFwQixFQUF3QixDQUF4QixDQUFoQjtBQUNBRCxnQkFBVUUsT0FBVixDQUFtQjtBQUFBLGNBQVNqQixRQUFRa0IsVUFBUixDQUFtQkMsS0FBbkIsQ0FBVDtBQUFBLE1BQW5CO0FBQ0QsSUFITSxNQUdBLElBQUluQixRQUFRYyxLQUFSLEtBQWtCLENBQXRCLEVBQXlCO0FBQzlCLFNBQUlDLGNBQVlSLE9BQU9TLFlBQVAsQ0FBb0IsRUFBcEIsRUFBd0IsQ0FBeEIsQ0FBaEI7QUFDQUQsaUJBQVVFLE9BQVYsQ0FBbUI7QUFBQSxjQUFTakIsUUFBUWtCLFVBQVIsQ0FBbUJDLEtBQW5CLENBQVQ7QUFBQSxNQUFuQjtBQUNEO0FBQ0Y7O0FBRURDLFFBQU9DLGdCQUFQLENBQXdCLFNBQXhCLEVBQW1DLFVBQVNDLENBQVQsRUFBWTtBQUM3Q2hCLGNBQVdILGdCQUFnQm9CLE9BQWhCLENBQXdCRCxDQUF4QixDQUFYO0FBQ0QsRUFGRDs7QUFJQUYsUUFBT0MsZ0JBQVAsQ0FBd0IsT0FBeEIsRUFBaUMsVUFBU0MsQ0FBVCxFQUFZO0FBQzNDaEIsY0FBV0gsZ0JBQWdCcUIsS0FBaEIsQ0FBc0JGLENBQXRCLENBQVg7QUFDRCxFQUZEOztBQUlBakMsVUFBU0MsYUFBVCxDQUF1QixrQkFBdkIsRUFBMkMrQixnQkFBM0MsQ0FBNEQsT0FBNUQsRUFBcUVJLFdBQXJFOztBQUVBLFVBQVNDLFFBQVQsR0FBb0I7QUFDbEJyQyxZQUFTc0MsY0FBVCxDQUF3QixZQUF4QixFQUFzQ0MsU0FBdEMsR0FBa0Q1QixRQUFRNkIsS0FBMUQ7QUFDQXhDLFlBQVNDLGFBQVQsQ0FBdUIsa0JBQXZCLEVBQTJDc0MsU0FBM0MsR0FBdUQ1QixRQUFROEIsS0FBL0Q7QUFDQWhDLE9BQUlpQyxTQUFKLEdBQWdCLE1BQWhCO0FBQ0FqQyxPQUFJa0MsU0FBSixDQUFjLENBQWQsRUFBaUIsQ0FBakIsRUFBb0I1QyxPQUFPNkMsS0FBM0IsRUFBa0M3QyxPQUFPOEMsTUFBekM7QUFDQWhDLGVBQVlpQyxJQUFaLENBQWlCckMsR0FBakI7QUFDQUcsY0FBV2tDLElBQVgsQ0FBZ0JyQyxHQUFoQjtBQUNBRyxjQUFXbUMsRUFBWCxHQUFnQnBDLFFBQVFxQyxtQkFBUixDQUE0QnBDLFVBQTVCLEVBQXdDQyxXQUF4QyxDQUFoQjtBQUNBRCxjQUFXcUMsRUFBWCxHQUFnQnRDLFFBQVF1QyxnQkFBUixDQUF5QnRDLFVBQXpCLEVBQXFDQyxXQUFyQyxDQUFoQjtBQUNBRCxjQUFXcUMsRUFBWCxHQUFnQnRDLFFBQVF3QyxzQkFBUixDQUErQnZDLFVBQS9CLEVBQTJDRCxRQUFRTyxNQUFuRCxDQUFoQjtBQUNBTixjQUFXbUMsRUFBWCxHQUFnQnBDLFFBQVF5QyxrQkFBUixDQUEyQnhDLFVBQTNCLEVBQXVDRCxRQUFRTyxNQUEvQyxDQUFoQjtBQUNBQSxVQUFPNEIsSUFBUCxDQUFZckMsR0FBWixFQUFpQkUsUUFBUU8sTUFBekI7QUFDQU4sY0FBV3lDLElBQVgsQ0FBZ0J0RCxPQUFPOEMsTUFBdkIsRUFBK0I5QyxPQUFPNkMsS0FBdEM7QUFDQS9CLGVBQVl5QyxPQUFaLENBQW9CckMsUUFBcEI7QUFDQUksWUFBU1YsUUFBUTRDLGNBQVIsQ0FBdUIzQyxVQUF2QixFQUFtQ2IsT0FBTzhDLE1BQTFDLENBQVQ7QUFDQSxPQUFJeEIsTUFBSixFQUFZO0FBQ1ZtQztBQUNELElBRkQsTUFFTztBQUNMckMsaUJBQVlzQyxzQkFBc0JwQixRQUF0QixDQUFaO0FBQ0Q7QUFDRCxPQUFJMUIsUUFBUStDLFdBQVIsRUFBSixFQUEyQjtBQUN6QnhDLFlBQU95QyxXQUFQO0FBQ0FyQztBQUNBUyxZQUFPNkIsb0JBQVAsQ0FBNEJ6QyxTQUE1QjtBQUNBQSxpQkFBWSxJQUFaO0FBQ0FJO0FBQ0Q7QUFDRjs7QUFFRCxVQUFTYSxXQUFULEdBQXVCO0FBQ3JCTCxVQUFPNkIsb0JBQVAsQ0FBNEJ6QyxTQUE1QjtBQUNBQSxlQUFZLElBQVo7QUFDQVIsV0FBUU8sTUFBUixHQUFpQkEsT0FBT3lDLFdBQVAsRUFBakI7QUFDQS9DLGdCQUFhLElBQUlQLElBQUosQ0FBUyxHQUFULEVBQWMsR0FBZCxFQUFxQlUsS0FBS0MsTUFBTCxLQUFnQixDQUFqQixHQUFxQixHQUF6QyxFQUErQyxDQUEvQyxDQUFiO0FBQ0FMLGFBQVUsSUFBSUosSUFBSixDQUFTSyxVQUFULEVBQXFCQyxXQUFyQixDQUFWO0FBQ0FTO0FBQ0FDO0FBQ0Q7O0FBRUQsVUFBU0EsU0FBVCxHQUFxQjtBQUNuQmQsT0FBSWlDLFNBQUosR0FBZ0IsTUFBaEI7QUFDQWpDLE9BQUlrQyxTQUFKLENBQWMsQ0FBZCxFQUFpQixDQUFqQixFQUFvQjVDLE9BQU82QyxLQUEzQixFQUFrQzdDLE9BQU84QyxNQUF6QztBQUNBakMsZ0JBQWEsSUFBSVAsSUFBSixDQUFTLEdBQVQsRUFBYyxHQUFkLEVBQXFCVSxLQUFLQyxNQUFMLEtBQWdCLENBQWpCLEdBQXFCLEdBQXpDLEVBQStDLENBQS9DLENBQWI7QUFDQUgsaUJBQWMsSUFBSVgsTUFBSixDQUFXLEdBQVgsRUFBZ0IsR0FBaEIsRUFBcUIsRUFBckIsQ0FBZDtBQUNBVyxlQUFZaUMsSUFBWixDQUFpQnJDLEdBQWpCO0FBQ0FHLGNBQVdrQyxJQUFYLENBQWdCckMsR0FBaEI7QUFDQVMsVUFBTzRCLElBQVAsQ0FBWXJDLEdBQVosRUFBaUJFLFFBQVFPLE1BQXpCO0FBQ0EyQztBQUNBQztBQUNEOztBQUVELFVBQVNELFlBQVQsR0FBd0I7QUFDdEIsT0FBRyxDQUFDMUMsU0FBSixFQUFlO0FBQ2JZLFlBQU9nQyxVQUFQLENBQWtCMUIsUUFBbEIsRUFBNEIsSUFBNUI7QUFDRDtBQUNGOztBQUVELFVBQVN5QixPQUFULEdBQW1CO0FBQ2pCLE9BQUlFLGFBQWEsSUFBSTFELE1BQUosRUFBakI7QUFDQSxPQUFHSyxRQUFROEIsS0FBUixLQUFrQixDQUFyQixFQUF3QjtBQUN0QnpDLGNBQVNzQyxjQUFULENBQXdCLFlBQXhCLEVBQXNDQyxTQUF0QyxHQUFrRCxDQUFsRDtBQUNBeUIsZ0JBQVdDLFFBQVgsR0FBc0JDLE9BQU8sc0JBQVAsRUFBK0IsRUFBL0IsQ0FBdEI7QUFDQUYsZ0JBQVd4QixLQUFYLEdBQW1CN0IsUUFBUTZCLEtBQTNCO0FBQ0EyQixhQUFRQyxHQUFSLENBQVlKLFdBQVdDLFFBQXZCO0FBQ0FELGdCQUFXQyxRQUFYLEdBQXNCSSxjQUFjTCxXQUFXQyxRQUF6QixDQUF0QjtBQUNBSyxvQkFBZU4sVUFBZjtBQUNBeEMsb0JBQWV3QyxVQUFmO0FBQ0FyRCxlQUFVLElBQUlKLElBQUosQ0FBU0ssVUFBVCxFQUFxQkMsV0FBckIsQ0FBVjtBQUNBSyxjQUFTLElBQUlWLEtBQUosRUFBVDtBQUNBYztBQUNEO0FBQ0Y7O0FBRUQsVUFBU2tDLFNBQVQsR0FBcUI7QUFDbkIsT0FBR3JDLFNBQUgsRUFBYztBQUNaWSxZQUFPNkIsb0JBQVAsQ0FBNEJ6QyxTQUE1QjtBQUNBQSxpQkFBWSxJQUFaO0FBQ0FFLGNBQVMsS0FBVDtBQUNBLFNBQUlrRCxpQkFBaUJ2RSxTQUFTQyxhQUFULENBQXVCLGtCQUF2QixDQUFyQjtBQUNBc0Usb0JBQWVDLFNBQWYsR0FBMkI3RCxRQUFROEIsS0FBbkM7QUFDQWxCO0FBQ0Q7QUFDRjs7QUFFRCxLQUFNOEMsZ0JBQWdCLFNBQWhCQSxhQUFnQjtBQUFBLFVBQUssWUFBV0ksSUFBWCxDQUFnQkMsQ0FBaEIsSUFBcUJBLEVBQUVDLEtBQUYsQ0FBUSxDQUFSLEVBQVUsQ0FBVixFQUFhQyxXQUFiLEVBQXJCLEdBQWtEO0FBQXZEO0FBQUEsRUFBdEI7O0FBRUEsVUFBU04sY0FBVCxDQUF3Qk8sTUFBeEIsRUFBZ0M7QUFDOUIsT0FBSUMsY0FBY0QsTUFBbEI7QUFDQSxPQUFJRSxrQkFBa0JDLEtBQUtDLFNBQUwsQ0FBZUgsV0FBZixDQUF0QjtBQUNBSSxnQkFBYUMsT0FBYixDQUFxQk4sT0FBT08sRUFBNUIsRUFBZ0NMLGVBQWhDO0FBQ0Q7O0FBRUQsVUFBU3ZELGNBQVQsQ0FBd0JxRCxNQUF4QixFQUFnQztBQUM5QixPQUFJUSxZQUFZLEVBQWhCO0FBQ0EsUUFBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUlKLGFBQWFLLE1BQWpDLEVBQXlDRCxHQUF6QyxFQUE2QztBQUMzQyxTQUFJRSxnQkFBZ0JOLGFBQWFPLE9BQWIsQ0FBcUJQLGFBQWFRLEdBQWIsQ0FBaUJKLENBQWpCLENBQXJCLENBQXBCO0FBQ0EsU0FBSUssYUFBYVgsS0FBS1ksS0FBTCxDQUFXSixhQUFYLENBQWpCO0FBQ0FILGVBQVVRLElBQVYsQ0FBZUYsVUFBZjtBQUNEO0FBQ0ROLGFBQVVTLElBQVYsQ0FBZSxVQUFTQyxDQUFULEVBQVlDLENBQVosRUFBZTtBQUM1QixZQUFPQSxFQUFFeEQsS0FBRixHQUFVdUQsRUFBRXZELEtBQW5CO0FBQ0QsSUFGRDtBQUdBNkMsYUFBVVksTUFBVixDQUFpQixFQUFqQixFQUFxQixJQUFyQjtBQUNBLFFBQUssSUFBSVgsSUFBSSxDQUFiLEVBQWdCQSxJQUFJRCxVQUFVRSxNQUE5QixFQUFzQ0QsR0FBdEMsRUFBMkM7QUFDekMsU0FBSXJCLFdBQVdvQixVQUFVQyxDQUFWLEVBQWFyQixRQUE1QjtBQUNBLFNBQUl6QixRQUFRNkMsVUFBVUMsQ0FBVixFQUFhOUMsS0FBekI7QUFDQSxTQUFJMEQsZUFBZSxvQkFBb0JaLElBQUksQ0FBeEIsQ0FBbkI7QUFDQSxTQUFJYSxhQUFhLGlCQUFpQmIsSUFBSSxDQUFyQixDQUFqQjtBQUNBdEYsY0FBU0MsYUFBVCxDQUF1QixNQUFNaUcsWUFBN0IsRUFBMkMzRCxTQUEzQyxHQUF1RDBCLFFBQXZEO0FBQ0FqRSxjQUFTQyxhQUFULENBQXVCLE1BQU1rRyxVQUE3QixFQUF5QzVELFNBQXpDLEdBQXFEQyxLQUFyRDtBQUNEO0FBQ0YsRTs7Ozs7Ozs7Ozs7O0tDM0pLdEMsTTtBQUNKLG1CQUFZa0csQ0FBWixFQUFleEQsS0FBZixFQUFzQkMsTUFBdEIsRUFBOEI7QUFBQTs7QUFDNUIsVUFBS3dELENBQUwsR0FBUyxHQUFUO0FBQ0EsVUFBS0QsQ0FBTCxHQUFTQSxDQUFUO0FBQ0EsVUFBS3hELEtBQUwsR0FBYUEsS0FBYjtBQUNBLFVBQUtDLE1BQUwsR0FBY0EsTUFBZDtBQUNEOzs7OzBCQUNJeUQsTyxFQUFTO0FBQ1pBLGVBQVFDLFFBQVIsQ0FBaUIsS0FBS0gsQ0FBdEIsRUFBeUIsS0FBS0MsQ0FBOUIsRUFBaUMsS0FBS3pELEtBQXRDLEVBQTZDLEtBQUtDLE1BQWxEO0FBQ0Q7Ozs2QkFDTzVCLFEsRUFBVTtBQUNoQixXQUFJQSxTQUFTLEVBQVQsS0FBZ0IsS0FBS21GLENBQUwsR0FBUyxDQUE3QixFQUFnQztBQUM5QixjQUFLQSxDQUFMLElBQVUsQ0FBVjtBQUNELFFBRkQsTUFFTyxJQUFJbkYsU0FBUyxFQUFULEtBQWdCLEtBQUttRixDQUFMLEdBQVMsR0FBN0IsRUFBa0M7QUFDdkMsY0FBS0EsQ0FBTCxJQUFVLENBQVY7QUFDRDtBQUNGOzs7Ozs7QUFHSEksUUFBT0MsT0FBUCxHQUFpQnZHLE1BQWpCLEM7Ozs7Ozs7Ozs7OztLQ25CTUUsVTtBQUNKLHlCQUFjO0FBQUE7O0FBQ1osVUFBS3NHLElBQUwsR0FBWTtBQUNWQyxhQUFNLEVBREk7QUFFVkMsY0FBTztBQUZHLE1BQVo7QUFJRDs7Ozs2QkFDTzNFLEMsRUFBRztBQUNULFdBQUloQixXQUFXLEVBQWY7QUFDQUEsZ0JBQVNnQixFQUFFNEUsT0FBWCxJQUFzQixJQUF0QjtBQUNBLGNBQU81RixRQUFQO0FBQ0Q7OzsyQkFFS2dCLEMsRUFBRztBQUNQLFdBQUloQixXQUFXLEVBQWY7QUFDQUEsZ0JBQVNnQixFQUFFNEUsT0FBWCxJQUFzQixLQUF0QjtBQUNBLGNBQU81RixRQUFQO0FBQ0Q7Ozs7OztBQUdIdUYsUUFBT0MsT0FBUCxHQUFpQnJHLFVBQWpCLEM7Ozs7Ozs7Ozs7OztLQ3BCTUMsSTtBQUNKLGlCQUFZK0YsQ0FBWixFQUFlQyxDQUFmLEVBQWtCcEQsRUFBbEIsRUFBc0JGLEVBQXRCLEVBQTBCO0FBQUE7O0FBQ3hCLFVBQUtxRCxDQUFMLEdBQVNBLENBQVQ7QUFDQSxVQUFLQyxDQUFMLEdBQVNBLENBQVQ7QUFDQSxVQUFLcEQsRUFBTCxHQUFVQSxFQUFWO0FBQ0EsVUFBS0YsRUFBTCxHQUFVQSxFQUFWO0FBQ0EsVUFBSytELE1BQUwsR0FBYyxDQUFkO0FBQ0EsVUFBS2xFLEtBQUwsR0FBYSxLQUFLa0UsTUFBTCxHQUFjLENBQTNCO0FBQ0EsVUFBS2pFLE1BQUwsR0FBYyxLQUFLaUUsTUFBTCxHQUFjLENBQTVCO0FBQ0Q7Ozs7MEJBQ0lSLE8sRUFBUztBQUNaQSxlQUFRUyxTQUFSO0FBQ0FULGVBQVFVLEdBQVIsQ0FBWSxLQUFLWixDQUFqQixFQUFvQixLQUFLQyxDQUF6QixFQUE0QixLQUFLUyxNQUFqQyxFQUF5QyxDQUF6QyxFQUE0Qy9GLEtBQUtrRyxFQUFMLEdBQVUsQ0FBdEQsRUFBeUQsS0FBekQ7QUFDQVgsZUFBUVksTUFBUjtBQUNBWixlQUFRNUQsU0FBUixHQUFvQixNQUFwQjtBQUNBNEQsZUFBUWEsSUFBUjtBQUNEOzs7MEJBQ0lDLFksRUFBY0MsVyxFQUFhO0FBQzlCLFdBQUssS0FBS2pCLENBQUwsR0FBUyxLQUFLVSxNQUFmLElBQTBCTyxXQUExQixJQUEwQyxLQUFLakIsQ0FBTCxHQUFTLEtBQUtVLE1BQWYsSUFBMEIsQ0FBdkUsRUFBMEU7QUFDeEUsY0FBSzdELEVBQUwsR0FBVSxDQUFDLEtBQUtBLEVBQWhCO0FBQ0Q7QUFDRCxXQUFLLEtBQUtvRCxDQUFMLEdBQVMsS0FBS1MsTUFBZixJQUEwQixDQUE5QixFQUFpQztBQUMvQixjQUFLL0QsRUFBTCxHQUFVLENBQUMsS0FBS0EsRUFBaEI7QUFDRDtBQUNELFlBQUtzRCxDQUFMLElBQVUsS0FBS3RELEVBQWY7QUFDQSxZQUFLcUQsQ0FBTCxJQUFVLEtBQUtuRCxFQUFmO0FBQ0Q7Ozs7OztBQUdIdUQsUUFBT0MsT0FBUCxHQUFpQnBHLElBQWpCLEM7Ozs7Ozs7Ozs7S0M3Qk1DLE0sR0FDSixrQkFBYztBQUFBOztBQUNaLFFBQUtrQyxLQUFMLEdBQWEsQ0FBYjtBQUNBLFFBQUt5QixRQUFMLEdBQWdCLEtBQWhCO0FBQ0EsUUFBS21CLEVBQUwsR0FBVWtDLEtBQUtDLEdBQUwsRUFBVjtBQUNELEU7O0FBR0hmLFFBQU9DLE9BQVAsR0FBaUJuRyxNQUFqQixDOzs7Ozs7Ozs7Ozs7S0NSTUMsSTtBQUNKLGlCQUFZaUgsSUFBWixFQUFrQkMsTUFBbEIsRUFBMEI7QUFBQTs7QUFDeEIsVUFBS3ZHLE1BQUwsR0FBYyxFQUFkO0FBQ0EsVUFBS3dHLGVBQUwsR0FBdUIsRUFBdkI7QUFDQSxVQUFLQyxLQUFMLEdBQWEsQ0FBQ0gsSUFBRCxDQUFiO0FBQ0EsVUFBS0MsTUFBTCxHQUFjQSxNQUFkO0FBQ0EsVUFBS2hHLEtBQUwsR0FBYSxDQUFiO0FBQ0EsVUFBS2dCLEtBQUwsR0FBYSxDQUFiO0FBQ0EsVUFBS0QsS0FBTCxHQUFhLENBQWI7QUFDRDs7OztvQ0FFY29GLEksRUFBTUMsSSxFQUFNO0FBQ3pCLFdBQUlELEtBQUt4QixDQUFMLEdBQVN5QixLQUFLekIsQ0FBTCxHQUFTeUIsS0FBS2pGLEtBQXZCLElBQWlDZ0YsS0FBS3hCLENBQUwsR0FBU3dCLEtBQUtoRixLQUFkLEdBQXVCaUYsS0FBS3pCLENBQTdELElBQ0F3QixLQUFLdkIsQ0FBTCxHQUFTd0IsS0FBS3hCLENBQUwsR0FBU3dCLEtBQUtoRixNQUR2QixJQUNpQytFLEtBQUt2QixDQUFMLEdBQVN1QixLQUFLL0UsTUFBZCxHQUF1QmdGLEtBQUt4QixDQURqRSxFQUNvRTtBQUNsRSxnQkFBTyxJQUFQO0FBQ0QsUUFIRCxNQUdPO0FBQ0wsZ0JBQU8sS0FBUDtBQUNEO0FBQ0Y7Ozt5Q0FFbUJtQixJLEVBQU1DLE0sRUFBUTtBQUNoQyxXQUFJSyxlQUFlLEtBQUtDLGNBQUwsQ0FBb0JQLElBQXBCLEVBQTBCQyxNQUExQixDQUFuQjtBQUNBLFdBQUkxRSxLQUFLeUUsS0FBS3pFLEVBQWQ7QUFDQSxXQUFJK0UsaUJBQWlCLElBQXJCLEVBQTJCO0FBQ3pCLGdCQUFPL0UsS0FBSyxDQUFDQSxFQUFiO0FBQ0QsUUFGRCxNQUVPO0FBQ0wsZ0JBQU9BLEVBQVA7QUFDRDtBQUNGOzs7c0NBRWdCeUUsSSxFQUFNQyxNLEVBQVE7QUFDN0IsV0FBSUssZUFBZSxLQUFLQyxjQUFMLENBQW9CUCxJQUFwQixFQUEwQkMsTUFBMUIsQ0FBbkI7QUFDQSxXQUFJTyxtQkFBbUJQLE9BQU9yQixDQUFQLEdBQVlxQixPQUFPN0UsS0FBUCxHQUFlLENBQWxEO0FBQ0EsV0FBSXFGLG9CQUFvQlIsT0FBT3JCLENBQVAsR0FBYXFCLE9BQU83RSxLQUFQLEdBQWUsQ0FBaEIsR0FBcUIsQ0FBekQ7QUFDQSxXQUFJc0Ysb0JBQW9CVCxPQUFPckIsQ0FBUCxHQUFhcUIsT0FBTzdFLEtBQVAsR0FBZSxDQUFoQixHQUFxQixDQUF6RDtBQUNBLFdBQUl1RixtQkFBbUJWLE9BQU9yQixDQUFQLEdBQWFxQixPQUFPN0UsS0FBUCxHQUFlLENBQWhCLEdBQXFCLENBQXhEO0FBQ0EsV0FBSXdGLG9CQUFvQlgsT0FBT3JCLENBQVAsR0FBV3FCLE9BQU83RSxLQUExQztBQUNBLFdBQUlrRixpQkFBaUIsSUFBckIsRUFBMkI7QUFDekIsYUFBSU4sS0FBS3BCLENBQUwsR0FBUzRCLGdCQUFiLEVBQStCO0FBQzdCUixnQkFBS3ZFLEVBQUwsSUFBVyxDQUFYO0FBQ0QsVUFGRCxNQUVPLElBQUl1RSxLQUFLcEIsQ0FBTCxHQUFTNkIsaUJBQWIsRUFBZ0M7QUFDckNULGdCQUFLdkUsRUFBTCxJQUFXLENBQVg7QUFDRCxVQUZNLE1BRUEsSUFBSXVFLEtBQUtwQixDQUFMLEdBQVMrQixnQkFBYixFQUErQjtBQUNwQ1gsZ0JBQUt2RSxFQUFMLElBQVcsQ0FBWDtBQUNELFVBRk0sTUFFQSxJQUFJdUUsS0FBS3BCLENBQUwsR0FBU2dDLGlCQUFiLEVBQWdDO0FBQ3JDWixnQkFBS3ZFLEVBQUwsSUFBVyxDQUFYO0FBQ0Q7QUFDRjtBQUNELFdBQUl1RSxLQUFLdkUsRUFBTCxHQUFVLEVBQWQsRUFBa0I7QUFDaEJ1RSxjQUFLdkUsRUFBTCxHQUFVLEVBQVY7QUFDRCxRQUZELE1BRU8sSUFBSXVFLEtBQUt2RSxFQUFMLEdBQVUsQ0FBQyxFQUFmLEVBQW1CO0FBQ3hCdUUsY0FBS3ZFLEVBQUwsR0FBVSxDQUFDLEVBQVg7QUFDRDtBQUNELGNBQU91RSxLQUFLdkUsRUFBWjtBQUNEOzs7Z0NBRVUvQixNLEVBQVE7QUFDakIsWUFBS0EsTUFBTCxDQUFZMkUsSUFBWixDQUFpQjNFLE1BQWpCO0FBQ0Q7Ozt3Q0FFa0JzRyxJLEVBQU10RyxNLEVBQVE7QUFDL0IsV0FBSTZCLEtBQUt5RSxLQUFLekUsRUFBZDtBQUNBN0IsY0FBT1UsT0FBUCxDQUFlLFVBQVNFLEtBQVQsRUFBZ0I7QUFDN0IsYUFBSXVHLFFBQVEsS0FBS25ILE1BQUwsQ0FBWW9ILE9BQVosQ0FBb0J4RyxLQUFwQixDQUFaO0FBQ0EsYUFBSWdHLGVBQWUsS0FBS0MsY0FBTCxDQUFvQlAsSUFBcEIsRUFBMEIxRixLQUExQixDQUFuQjtBQUNBLGFBQUlnRyxpQkFBaUIsSUFBckIsRUFBMkI7QUFDekIsZ0JBQUt0RixLQUFMLElBQWMsR0FBZDtBQUNBLGVBQUlWLE1BQU15RyxNQUFOLEtBQWlCLENBQXJCLEVBQXVCO0FBQ25CLGlCQUFJRixTQUFRLEtBQUtuSCxNQUFMLENBQVlvSCxPQUFaLENBQW9CeEcsS0FBcEIsQ0FBWjtBQUNBLGtCQUFLNEYsZUFBTCxHQUF1QixLQUFLeEcsTUFBTCxDQUFZK0UsTUFBWixDQUFtQm9DLE1BQW5CLEVBQTBCLENBQTFCLENBQXZCO0FBQ0g7QUFDRHZHLGlCQUFNeUcsTUFBTjtBQUNBLGVBQUlmLEtBQUtwQixDQUFMLEdBQVV0RSxNQUFNc0UsQ0FBTixHQUFVdEUsTUFBTWMsS0FBMUIsSUFBb0M0RSxLQUFLcEIsQ0FBTCxHQUFTdEUsTUFBTXNFLENBQXZELEVBQTBEO0FBQ3hELG9CQUFPckQsS0FBSyxDQUFDQSxFQUFiO0FBQ0QsWUFGRCxNQUVPO0FBQ0wsb0JBQU9BLEVBQVA7QUFDRDtBQUNGO0FBQ0EsUUFoQlksQ0FnQlh5RixJQWhCVyxDQWdCTixJQWhCTSxDQUFmO0FBaUJBLGNBQU96RixFQUFQO0FBQ0Q7OzttQ0FFYTtBQUNaLFdBQUksS0FBSzdCLE1BQUwsQ0FBWXFFLE1BQVosS0FBdUIsQ0FBM0IsRUFBOEI7QUFDNUIsY0FBSzlELEtBQUw7QUFDQSxnQkFBTyxJQUFQO0FBQ0Q7QUFDRjs7OzRDQUVzQitGLEksRUFBTXRHLE0sRUFBUTtBQUNuQ0EsY0FBT1UsT0FBUCxDQUFlLFVBQVNFLEtBQVQsRUFBZ0I7QUFDN0IsYUFBSWdHLGVBQWUsS0FBS0MsY0FBTCxDQUFvQlAsSUFBcEIsRUFBMEIxRixLQUExQixDQUFuQjtBQUNBLGFBQUlnRyxpQkFBaUIsSUFBckIsRUFBMkI7QUFDekIsZUFBSU4sS0FBS3BCLENBQUwsSUFBVXRFLE1BQU1zRSxDQUFoQixJQUFxQm9CLEtBQUtwQixDQUFMLElBQVd0RSxNQUFNc0UsQ0FBTixHQUFVdEUsTUFBTWMsS0FBcEQsRUFBNEQ7QUFDMUQ0RSxrQkFBS3ZFLEVBQUwsR0FBVSxDQUFDdUUsS0FBS3ZFLEVBQWhCO0FBQ0Q7QUFDRjtBQUNGLFFBUGMsQ0FPYnVGLElBUGEsQ0FPUixJQVBRLENBQWY7QUFRQSxjQUFPaEIsS0FBS3ZFLEVBQVo7QUFDRDs7O29DQUVjdUUsSSxFQUFNSixZLEVBQWM7QUFDakMsV0FBSUksS0FBS25CLENBQUwsSUFBVWUsWUFBZCxFQUE0QjtBQUMxQixjQUFLM0UsS0FBTCxJQUFjLENBQWQ7QUFDQSxnQkFBTyxJQUFQO0FBQ0QsUUFIRCxNQUdPO0FBQ0wsZ0JBQU8sS0FBUDtBQUNEO0FBQ0Y7Ozs7OztBQUdIK0QsUUFBT0MsT0FBUCxHQUFpQmxHLElBQWpCLEM7Ozs7Ozs7Ozs7Ozs7Ozs7S0MvR01DLEs7QUFDSixrQkFBWTRGLENBQVosRUFBZUMsQ0FBZixFQUFrQjtBQUFBOztBQUNoQixVQUFLRCxDQUFMLEdBQVNBLENBQVQ7QUFDQSxVQUFLQyxDQUFMLEdBQVNBLENBQVQ7QUFDQSxVQUFLa0MsTUFBTCxHQUFjLENBQWQ7QUFDQSxVQUFLM0YsS0FBTCxHQUFhLEVBQWI7QUFDQSxVQUFLQyxNQUFMLEdBQWMsRUFBZDtBQUNBLFVBQUszQixNQUFMLEdBQWMsRUFBZDtBQUNEOzs7O2tDQUVZdUgsUyxFQUFXaEgsSyxFQUFPO0FBQzdCLFdBQUdBLFFBQVEsQ0FBWCxFQUFhO0FBQ1gsY0FBSSxJQUFJNkQsSUFBSSxDQUFaLEVBQWVBLElBQUltRCxTQUFuQixFQUE4Qm5ELEdBQTlCLEVBQW1DO0FBQ2pDLGVBQUlBLEtBQUssQ0FBVCxFQUFZO0FBQ1YsaUJBQUljLElBQUksTUFBT2QsSUFBSSxFQUFYLEdBQWtCQSxJQUFJLENBQTlCO0FBQ0EsaUJBQUllLElBQUssRUFBVDtBQUNBLGtCQUFLbkYsTUFBTCxDQUFZMkUsSUFBWixDQUFpQixJQUFJckYsS0FBSixDQUFVNEYsQ0FBVixFQUFhQyxDQUFiLENBQWpCO0FBQ0QsWUFKRCxNQUlPLElBQUlmLEtBQUssRUFBVCxFQUFhO0FBQ2xCLGlCQUFJYyxLQUFJLE1BQU8sQ0FBQ2QsSUFBSSxFQUFMLElBQVcsRUFBbEIsR0FBeUIsQ0FBQ0EsSUFBSSxFQUFMLElBQVcsQ0FBNUM7QUFDQSxpQkFBSWUsS0FBSSxFQUFSO0FBQ0Esa0JBQUtuRixNQUFMLENBQVkyRSxJQUFaLENBQWlCLElBQUlyRixLQUFKLENBQVU0RixFQUFWLEVBQWFDLEVBQWIsQ0FBakI7QUFDRCxZQUpNLE1BSUEsSUFBSWYsS0FBSyxFQUFULEVBQWE7QUFDbEIsaUJBQUljLE1BQUksTUFBTyxDQUFDZCxJQUFJLEVBQUwsSUFBVyxFQUFsQixHQUF5QixDQUFDQSxJQUFJLEVBQUwsSUFBVyxDQUE1QztBQUNBLGlCQUFJZSxNQUFJLEVBQVI7QUFDQSxrQkFBS25GLE1BQUwsQ0FBWTJFLElBQVosQ0FBaUIsSUFBSXJGLEtBQUosQ0FBVTRGLEdBQVYsRUFBYUMsR0FBYixDQUFqQjtBQUNELFlBSk0sTUFJQSxJQUFJZixLQUFLLEVBQVQsRUFBYTtBQUNsQixpQkFBSWMsTUFBSSxNQUFPLENBQUNkLElBQUksRUFBTCxJQUFXLEVBQWxCLEdBQXlCLENBQUNBLElBQUksRUFBTCxJQUFXLENBQTVDO0FBQ0EsaUJBQUllLE1BQUksR0FBUjtBQUNBLGlCQUFJNUUsVUFBVSxDQUFkLEVBQWlCO0FBQ2YsbUJBQUk4RyxTQUFTLENBQWI7QUFDQSxvQkFBS3JILE1BQUwsQ0FBWTJFLElBQVosQ0FBaUIsSUFBSTZDLGFBQUosQ0FBa0J0QyxHQUFsQixFQUFxQkMsR0FBckIsRUFBd0JrQyxNQUF4QixDQUFqQjtBQUNEO0FBQ0Y7QUFDRjtBQUNGLFFBdkJELE1BdUJPO0FBQ0wsY0FBSyxJQUFJakQsSUFBSSxDQUFiLEVBQWdCQSxJQUFJbUQsU0FBcEIsRUFBK0JuRCxHQUEvQixFQUFvQztBQUNsQyxlQUFHQSxLQUFLLENBQVIsRUFBVztBQUNULGlCQUFJYyxNQUFJLEtBQU1kLElBQUksRUFBVixHQUFpQkEsSUFBSSxDQUE3QjtBQUNBLGlCQUFJZSxNQUFJLEVBQVI7QUFDQSxpQkFBSWtDLFVBQVMsQ0FBYjtBQUNBLGtCQUFLckgsTUFBTCxDQUFZMkUsSUFBWixDQUFpQixJQUFJNkMsYUFBSixDQUFrQnRDLEdBQWxCLEVBQXFCQyxHQUFyQixFQUF3QmtDLE9BQXhCLENBQWpCO0FBQ0QsWUFMRCxNQUtPLElBQUlqRCxLQUFLLEVBQVQsRUFBYTtBQUNsQixpQkFBSWMsTUFBSSxLQUFNLENBQUNkLElBQUksQ0FBTCxJQUFVLEVBQWhCLEdBQXVCLENBQUNBLElBQUksQ0FBTCxJQUFVLENBQXpDO0FBQ0EsaUJBQUllLE1BQUksRUFBUjtBQUNBLGtCQUFLbkYsTUFBTCxDQUFZMkUsSUFBWixDQUFpQixJQUFJckYsS0FBSixDQUFVNEYsR0FBVixFQUFhQyxHQUFiLENBQWpCO0FBQ0QsWUFKTSxNQUlBLElBQUlmLEtBQUssRUFBVCxFQUFhO0FBQ2xCLGlCQUFJYyxNQUFJLEtBQU0sQ0FBQ2QsSUFBSSxFQUFMLElBQVcsRUFBakIsR0FBd0IsQ0FBQ0EsSUFBSSxFQUFMLElBQVcsQ0FBM0M7QUFDQSxpQkFBSWUsTUFBSSxFQUFSO0FBQ0EsaUJBQUlrQyxXQUFTLENBQWI7QUFDQSxrQkFBS3JILE1BQUwsQ0FBWTJFLElBQVosQ0FBaUIsSUFBSTZDLGFBQUosQ0FBa0J0QyxHQUFsQixFQUFxQkMsR0FBckIsRUFBd0JrQyxRQUF4QixDQUFqQjtBQUNELFlBTE0sTUFLQSxJQUFJakQsS0FBSyxFQUFULEVBQWE7QUFDbEIsaUJBQUljLE1BQUksS0FBTSxDQUFDZCxJQUFJLEVBQUwsSUFBVyxFQUFqQixHQUF3QixDQUFDQSxJQUFJLEVBQUwsSUFBVyxDQUEzQztBQUNBLGlCQUFJZSxNQUFJLEdBQVI7QUFDQSxpQkFBSWtDLFdBQVMsQ0FBYjtBQUNBLGtCQUFLckgsTUFBTCxDQUFZMkUsSUFBWixDQUFpQixJQUFJNkMsYUFBSixDQUFrQnRDLEdBQWxCLEVBQXFCQyxHQUFyQixFQUF3QmtDLFFBQXhCLENBQWpCO0FBQ0QsWUFMTSxNQUtBLElBQUlqRCxLQUFLLEVBQVQsRUFBYTtBQUNsQixpQkFBSWMsTUFBSSxLQUFNLENBQUNkLElBQUksRUFBTCxJQUFXLEVBQWpCLEdBQXdCLENBQUNBLElBQUksRUFBTCxJQUFXLENBQTNDO0FBQ0EsaUJBQUllLE1BQUksR0FBUjtBQUNBLGtCQUFLbkYsTUFBTCxDQUFZMkUsSUFBWixDQUFpQixJQUFJckYsS0FBSixDQUFVNEYsR0FBVixFQUFhQyxHQUFiLENBQWpCO0FBQ0QsWUFKTSxNQUlBLElBQUlmLEtBQUssRUFBVCxFQUFhO0FBQ2xCLGlCQUFJYyxNQUFJLEtBQU0sQ0FBQ2QsSUFBSSxFQUFMLElBQVcsRUFBakIsR0FBd0IsQ0FBQ0EsSUFBSSxFQUFMLElBQVcsQ0FBM0M7QUFDQSxpQkFBSWUsTUFBSSxHQUFSO0FBQ0EsaUJBQUlrQyxXQUFTLENBQWI7QUFDQSxrQkFBS3JILE1BQUwsQ0FBWTJFLElBQVosQ0FBaUIsSUFBSTZDLGFBQUosQ0FBa0J0QyxHQUFsQixFQUFxQkMsR0FBckIsRUFBd0JrQyxRQUF4QixDQUFqQjtBQUNEO0FBQ0Y7QUFDRCxjQUFLckgsTUFBTCxHQUFjLEtBQUtBLE1BQUwsQ0FBWXlILE1BQVosQ0FBbUI7QUFBQSxrQkFBUzdHLE1BQU1zRSxDQUFOLEtBQVksR0FBckI7QUFBQSxVQUFuQixDQUFkO0FBQ0Q7QUFDRCxjQUFPLEtBQUtsRixNQUFaO0FBQ0Q7OzttQ0FFYTtBQUNaLFlBQUtBLE1BQUwsR0FBYyxFQUFkO0FBQ0EsY0FBTyxLQUFLQSxNQUFaO0FBQ0Q7OzswQkFFSW9GLE8sRUFBU3BGLE0sRUFBUTtBQUNwQixZQUFJLElBQUlvRSxJQUFJLENBQVosRUFBZUEsSUFBSXBFLE9BQU9xRSxNQUExQixFQUFrQ0QsR0FBbEMsRUFBdUM7QUFBQSx5QkFDUHBFLE9BQU9vRSxDQUFQLENBRE87QUFBQSxhQUM5QmMsQ0FEOEIsYUFDOUJBLENBRDhCO0FBQUEsYUFDM0JDLENBRDJCLGFBQzNCQSxDQUQyQjtBQUFBLGFBQ3hCekQsS0FEd0IsYUFDeEJBLEtBRHdCO0FBQUEsYUFDakJDLE1BRGlCLGFBQ2pCQSxNQURpQjs7QUFFckMsYUFBSTNCLE9BQU9vRSxDQUFQLEVBQVVpRCxNQUFWLEtBQXFCLENBQXpCLEVBQTRCO0FBQzVCakMsbUJBQVE1RCxTQUFSLEdBQW9CLFNBQXBCO0FBQ0QsVUFGQyxNQUVLLElBQUl4QixPQUFPb0UsQ0FBUCxFQUFVaUQsTUFBVixLQUFxQixDQUF6QixFQUE0QjtBQUNqQ2pDLG1CQUFRNUQsU0FBUixHQUFvQixTQUFwQjtBQUNEO0FBQ0M0RCxpQkFBUUMsUUFBUixDQUFpQkgsQ0FBakIsRUFBb0JDLENBQXBCLEVBQXVCekQsS0FBdkIsRUFBOEJDLE1BQTlCO0FBQ0Q7QUFDRjs7Ozs7O0tBR0c2RixhOzs7QUFDSiwwQkFBWXRDLENBQVosRUFBZUMsQ0FBZixFQUFrQmtDLE1BQWxCLEVBQTBCO0FBQUE7O0FBQUEsK0hBQ2xCbkMsQ0FEa0IsRUFDZkMsQ0FEZTs7QUFFeEIsV0FBS2tDLE1BQUwsR0FBY0EsTUFBZDtBQUZ3QjtBQUd6Qjs7O0dBSnlCL0gsSzs7QUFPNUJnRyxRQUFPQyxPQUFQLEdBQWlCakcsS0FBakIsQyIsImZpbGUiOiJtYWluLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDJmZDRiNWUzOTg0NGU1MTYzY2JiIiwiY29uc3QgY2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2dhbWUtc2NyZWVuJyk7XG5jb25zdCBQYWRkbGUgPSByZXF1aXJlKCcuL1BhZGRsZScpO1xuY29uc3QgS2V5Ym9hcmRlciA9IHJlcXVpcmUoJy4va2V5Ym9hcmRlcicpO1xuY29uc3QgQmFsbCA9IHJlcXVpcmUoJy4vYmFsbC5qcycpO1xuY29uc3QgU2NvcmVzID0gcmVxdWlyZSgnLi9zY29yZXMuanMnKTtcbmNvbnN0IEdhbWUgPSByZXF1aXJlKCcuL0dhbWUuanMnKTtcbmNvbnN0IEJyaWNrID0gcmVxdWlyZSgnLi9icmlja3MuanMnKTtcbmxldCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbmxldCBuZXdHYW1lID0gbmV3IEdhbWUoYm91bmN5QmFsbCwgc3RhcnRQYWRkbGUpO1xubGV0IHN0YXJ0UGFkZGxlID0gbmV3IFBhZGRsZSgzNTAsIDEwMCwgMTUpO1xubGV0IGtleWJvYXJkTW9uaXRvciA9IG5ldyBLZXlib2FyZGVyKCk7XG5sZXQgYm91bmN5QmFsbCA9IG5ldyBCYWxsKDQwMCwgMjAwLCAoKE1hdGgucmFuZG9tKCkgKiAzKSAtMS41KSwgNCk7XG5sZXQga2V5U3RhdGUgPSB7fTtcbmxldCBicmlja3MgPSBuZXcgQnJpY2soKTtcbmxldCByZXF1ZXN0SUQgPSB1bmRlZmluZWQ7XG5sZXQgaXNEZWFkID0gbnVsbDtcblxuZ2VuZXJhdGVCcmlja3MoKTtcbnN0YXJ0R2FtZSgpO1xuZ2V0RnJvbVN0b3JhZ2UoKTtcblxuZnVuY3Rpb24gZ2VuZXJhdGVCcmlja3MoKSB7XG4gIGlmIChuZXdHYW1lLmxldmVsID09PSAxKSB7XG4gICAgbGV0IG5ld0JyaWNrcyA9IGJyaWNrcy5jcmVhdGVCcmlja3MoNDAsIDEpO1xuICAgIG5ld0JyaWNrcy5mb3JFYWNoKCBicmljayA9PiBuZXdHYW1lLmdyYWJCcmlja3MoYnJpY2spICk7XG4gIH0gZWxzZSBpZiAobmV3R2FtZS5sZXZlbCA9PT0gMikge1xuICAgIGxldCBuZXdCcmlja3MgPSBicmlja3MuY3JlYXRlQnJpY2tzKDQwLCAyKTtcbiAgICBuZXdCcmlja3MuZm9yRWFjaCggYnJpY2sgPT4gbmV3R2FtZS5ncmFiQnJpY2tzKGJyaWNrKSApO1xuICB9IGVsc2UgaWYgKG5ld0dhbWUubGV2ZWwgPT09IDMpIHtcbiAgICBsZXQgbmV3QnJpY2tzID0gYnJpY2tzLmNyZWF0ZUJyaWNrcyg1NCwgMyk7XG4gICAgbmV3QnJpY2tzLmZvckVhY2goIGJyaWNrID0+IG5ld0dhbWUuZ3JhYkJyaWNrcyhicmljaykgKTtcbiAgfTtcbn07XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZnVuY3Rpb24oZSkge1xuICBrZXlTdGF0ZSA9IGtleWJvYXJkTW9uaXRvci5rZXlEb3duKGUpO1xufSk7XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGZ1bmN0aW9uKGUpIHtcbiAga2V5U3RhdGUgPSBrZXlib2FyZE1vbml0b3Iua2V5VXAoZSk7XG59KTtcblxuZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5ldy1nYW1lLWJ1dHRvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcmVzdGFydEdhbWUpO1xuXG5mdW5jdGlvbiBnYW1lTG9vcCgpIHtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VzZXItc2NvcmUnKS5pbm5lckhUTUwgPSBuZXdHYW1lLnNjb3JlO1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubGl2ZXMtaW5kaWNhdG9yJykuaW5uZXJIVE1MID0gbmV3R2FtZS5saXZlcztcbiAgY3R4LmZpbGxTdHlsZSA9ICcjMDAwJztcbiAgY3R4LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuICBzdGFydFBhZGRsZS5kcmF3KGN0eCk7XG4gIGJvdW5jeUJhbGwuZHJhdyhjdHgpO1xuICBib3VuY3lCYWxsLmR5ID0gbmV3R2FtZS5wYWRkbGVCYWxsQ29sbGlkaW5nKGJvdW5jeUJhbGwsIHN0YXJ0UGFkZGxlKTtcbiAgYm91bmN5QmFsbC5keCA9IG5ld0dhbWUucGFkZGxlQmFsbFhDaGVjayhib3VuY3lCYWxsLCBzdGFydFBhZGRsZSk7XG4gIGJvdW5jeUJhbGwuZHggPSBuZXdHYW1lLmJyaWNrQmFsbFNpZGVDb2xsaXNpb24oYm91bmN5QmFsbCwgbmV3R2FtZS5icmlja3MpO1xuICBib3VuY3lCYWxsLmR5ID0gbmV3R2FtZS5icmlja0JhbGxDb2xsaWRpbmcoYm91bmN5QmFsbCwgbmV3R2FtZS5icmlja3MpO1xuICBicmlja3MuZHJhdyhjdHgsIG5ld0dhbWUuYnJpY2tzKTtcbiAgYm91bmN5QmFsbC5tb3ZlKGNhbnZhcy5oZWlnaHQsIGNhbnZhcy53aWR0aCk7XG4gIHN0YXJ0UGFkZGxlLmFuaW1hdGUoa2V5U3RhdGUpO1xuICBpc0RlYWQgPSBuZXdHYW1lLmNoZWNrQmFsbERlYXRoKGJvdW5jeUJhbGwsIGNhbnZhcy5oZWlnaHQpO1xuICBpZiAoaXNEZWFkKSB7XG4gICAgYmFsbERlYXRoKCk7XG4gIH0gZWxzZSB7XG4gICAgcmVxdWVzdElEID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGdhbWVMb29wKTtcbiAgfVxuICBpZiAobmV3R2FtZS5jaGVja0JyaWNrcygpKSB7XG4gICAgYnJpY2tzLmNsZWFyQnJpY2tzKCk7XG4gICAgZ2VuZXJhdGVCcmlja3MoKTtcbiAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUocmVxdWVzdElEKTtcbiAgICByZXF1ZXN0SUQgPSBudWxsO1xuICAgIHN0YXJ0R2FtZSgpO1xuICB9XG59O1xuXG5mdW5jdGlvbiByZXN0YXJ0R2FtZSgpIHtcbiAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKHJlcXVlc3RJRCk7XG4gIHJlcXVlc3RJRCA9IG51bGw7XG4gIG5ld0dhbWUuYnJpY2tzID0gYnJpY2tzLmNsZWFyQnJpY2tzKCk7XG4gIGJvdW5jeUJhbGwgPSBuZXcgQmFsbCg0MDAsIDIwMCwgKChNYXRoLnJhbmRvbSgpICogMykgLTEuNSksIDQpO1xuICBuZXdHYW1lID0gbmV3IEdhbWUoYm91bmN5QmFsbCwgc3RhcnRQYWRkbGUpO1xuICBnZW5lcmF0ZUJyaWNrcygpO1xuICBzdGFydEdhbWUoKTtcbn1cblxuZnVuY3Rpb24gc3RhcnRHYW1lKCkge1xuICBjdHguZmlsbFN0eWxlID0gJyMwMDAnO1xuICBjdHguY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4gIGJvdW5jeUJhbGwgPSBuZXcgQmFsbCg0MDAsIDIwMCwgKChNYXRoLnJhbmRvbSgpICogMykgLTEuNSksIDQpO1xuICBzdGFydFBhZGRsZSA9IG5ldyBQYWRkbGUoMzUwLCAxMDAsIDE1KTtcbiAgc3RhcnRQYWRkbGUuZHJhdyhjdHgpO1xuICBib3VuY3lCYWxsLmRyYXcoY3R4KTtcbiAgYnJpY2tzLmRyYXcoY3R4LCBuZXdHYW1lLmJyaWNrcyk7XG4gIGRlbGF5ZWRTdGFydCgpO1xuICBlbmRHYW1lKCk7XG59XG5cbmZ1bmN0aW9uIGRlbGF5ZWRTdGFydCgpIHtcbiAgaWYoIXJlcXVlc3RJRCkge1xuICAgIHdpbmRvdy5zZXRUaW1lb3V0KGdhbWVMb29wLCAzMDAwKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBlbmRHYW1lKCkge1xuICB2YXIgdXNlclNjb3JlcyA9IG5ldyBTY29yZXMoKTtcbiAgaWYobmV3R2FtZS5saXZlcyA9PT0gMCkge1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1c2VyLXNjb3JlJykuaW5uZXJIVE1MID0gMDtcbiAgICB1c2VyU2NvcmVzLmluaXRpYWxzID0gcHJvbXB0KCdFbnRlciB5b3VyIGluaXRpYWxzIScsICcnKTtcbiAgICB1c2VyU2NvcmVzLnNjb3JlID0gbmV3R2FtZS5zY29yZTtcbiAgICBjb25zb2xlLmxvZyh1c2VyU2NvcmVzLmluaXRpYWxzKTtcbiAgICB1c2VyU2NvcmVzLmluaXRpYWxzID0gY2hlY2tJbml0aWFscyh1c2VyU2NvcmVzLmluaXRpYWxzKTtcbiAgICBzY29yZVRvU3RvcmFnZSh1c2VyU2NvcmVzKTtcbiAgICBnZXRGcm9tU3RvcmFnZSh1c2VyU2NvcmVzKTtcbiAgICBuZXdHYW1lID0gbmV3IEdhbWUoYm91bmN5QmFsbCwgc3RhcnRQYWRkbGUpO1xuICAgIGJyaWNrcyA9IG5ldyBCcmljaygpO1xuICAgIGdlbmVyYXRlQnJpY2tzKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gYmFsbERlYXRoKCkge1xuICBpZihyZXF1ZXN0SUQpIHtcbiAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUocmVxdWVzdElEKTtcbiAgICByZXF1ZXN0SUQgPSBudWxsO1xuICAgIGlzRGVhZCA9IGZhbHNlO1xuICAgIHZhciBsaXZlc0luZGljYXRvciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5saXZlcy1pbmRpY2F0b3InKTtcbiAgICBsaXZlc0luZGljYXRvci5pbm5lclRleHQgPSBuZXdHYW1lLmxpdmVzO1xuICAgIHN0YXJ0R2FtZSgpO1xuICB9XG59XG5cbmNvbnN0IGNoZWNrSW5pdGlhbHMgPSBzID0+IC9bYS16XSovZ2kudGVzdChzKSA/IHMuc2xpY2UoMCwzKS50b1VwcGVyQ2FzZSgpIDogJ04vQSc7XG5cbmZ1bmN0aW9uIHNjb3JlVG9TdG9yYWdlKHNjb3Jlcykge1xuICB2YXIgc3RvcmVTY29yZXMgPSBzY29yZXM7XG4gIHZhciBzdHJpbmdpZnlTY29yZXMgPSBKU09OLnN0cmluZ2lmeShzdG9yZVNjb3Jlcyk7XG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHNjb3Jlcy5pZCwgc3RyaW5naWZ5U2NvcmVzKTtcbn1cblxuZnVuY3Rpb24gZ2V0RnJvbVN0b3JhZ2Uoc2NvcmVzKSB7XG4gIGxldCB0b3BTY29yZXMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsb2NhbFN0b3JhZ2UubGVuZ3RoOyBpKyspe1xuICAgIGxldCByZXRyaWV2ZWRJdGVtID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0obG9jYWxTdG9yYWdlLmtleShpKSk7XG4gICAgbGV0IHBhcnNlZEl0ZW0gPSBKU09OLnBhcnNlKHJldHJpZXZlZEl0ZW0pO1xuICAgIHRvcFNjb3Jlcy5wdXNoKHBhcnNlZEl0ZW0pO1xuICB9XG4gIHRvcFNjb3Jlcy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICByZXR1cm4gYi5zY29yZSAtIGEuc2NvcmU7XG4gIH0pXG4gIHRvcFNjb3Jlcy5zcGxpY2UoMTAsIDEwMDApO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHRvcFNjb3Jlcy5sZW5ndGg7IGkrKykge1xuICAgIGxldCBpbml0aWFscyA9IHRvcFNjb3Jlc1tpXS5pbml0aWFscztcbiAgICBsZXQgc2NvcmUgPSB0b3BTY29yZXNbaV0uc2NvcmU7XG4gICAgbGV0IEhUTUxJbml0aWFscyA9ICdoaWdoLWluaXRpYWxzLScgKyAoaSArIDEpO1xuICAgIGxldCBIVE1MU2NvcmVzID0gJ2hpZ2gtc2NvcmUtJyArIChpICsgMSk7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLicgKyBIVE1MSW5pdGlhbHMpLmlubmVySFRNTCA9IGluaXRpYWxzO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy4nICsgSFRNTFNjb3JlcykuaW5uZXJIVE1MID0gc2NvcmU7XG4gIH1cbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9saWIvaW5kZXguanMiLCJjbGFzcyBQYWRkbGUge1xuICBjb25zdHJ1Y3Rvcih4LCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgdGhpcy55ID0gNDc1O1xuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy53aWR0aCA9IHdpZHRoO1xuICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuICB9XG4gIGRyYXcoY29udGV4dCkge1xuICAgIGNvbnRleHQuZmlsbFJlY3QodGhpcy54LCB0aGlzLnksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgfVxuICBhbmltYXRlKGtleVN0YXRlKSB7XG4gICAgaWYgKGtleVN0YXRlWzM3XSAmJiB0aGlzLnggPiAwKSB7XG4gICAgICB0aGlzLnggLT0gNTtcbiAgICB9IGVsc2UgaWYgKGtleVN0YXRlWzM5XSAmJiB0aGlzLnggPCA3MDApIHtcbiAgICAgIHRoaXMueCArPSA1O1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBhZGRsZTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9saWIvUGFkZGxlLmpzIiwiY2xhc3MgS2V5Ym9hcmRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMua2V5cyA9IHtcbiAgICAgIGxlZnQ6IDM3LFxuICAgICAgcmlnaHQ6IDM5LFxuICAgIH1cbiAgfVxuICBrZXlEb3duKGUpIHtcbiAgICB2YXIga2V5U3RhdGUgPSB7fTtcbiAgICBrZXlTdGF0ZVtlLmtleUNvZGVdID0gdHJ1ZTtcbiAgICByZXR1cm4ga2V5U3RhdGU7XG4gIH07XG5cbiAga2V5VXAoZSkge1xuICAgIHZhciBrZXlTdGF0ZSA9IHt9O1xuICAgIGtleVN0YXRlW2Uua2V5Q29kZV0gPSBmYWxzZTtcbiAgICByZXR1cm4ga2V5U3RhdGU7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gS2V5Ym9hcmRlcjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2xpYi9rZXlib2FyZGVyLmpzIiwiY2xhc3MgQmFsbCB7XG4gIGNvbnN0cnVjdG9yKHgsIHksIGR4LCBkeSkge1xuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcbiAgICB0aGlzLmR4ID0gZHg7XG4gICAgdGhpcy5keSA9IGR5O1xuICAgIHRoaXMucmFkaXVzID0gNTtcbiAgICB0aGlzLndpZHRoID0gdGhpcy5yYWRpdXMgKiAyO1xuICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5yYWRpdXMgKiAyO1xuICB9XG4gIGRyYXcoY29udGV4dCkge1xuICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgY29udGV4dC5hcmModGhpcy54LCB0aGlzLnksIHRoaXMucmFkaXVzLCAwLCBNYXRoLlBJICogMiAsZmFsc2UpO1xuICAgIGNvbnRleHQuc3Ryb2tlKCk7XG4gICAgY29udGV4dC5maWxsU3R5bGUgPSBcIiMwMDBcIjtcbiAgICBjb250ZXh0LmZpbGwoKTtcbiAgfVxuICBtb3ZlKGNhbnZhc0hlaWdodCwgY2FudmFzV2lkdGgpIHtcbiAgICBpZiAoKHRoaXMueCArIHRoaXMucmFkaXVzKSA+PSBjYW52YXNXaWR0aCB8fCAodGhpcy54IC0gdGhpcy5yYWRpdXMpIDw9IDApIHtcbiAgICAgIHRoaXMuZHggPSAtdGhpcy5keDtcbiAgICB9XG4gICAgaWYgKCh0aGlzLnkgLSB0aGlzLnJhZGl1cykgPD0gMCkge1xuICAgICAgdGhpcy5keSA9IC10aGlzLmR5O1xuICAgIH1cbiAgICB0aGlzLnkgKz0gdGhpcy5keTtcbiAgICB0aGlzLnggKz0gdGhpcy5keDtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJhbGw7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9saWIvYmFsbC5qcyIsImNsYXNzIFNjb3JlcyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc2NvcmUgPSAwO1xuICAgIHRoaXMuaW5pdGlhbHMgPSAnWFhYJztcbiAgICB0aGlzLmlkID0gRGF0ZS5ub3coKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNjb3JlcztcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2xpYi9zY29yZXMuanMiLCJjbGFzcyBHYW1lIHtcbiAgY29uc3RydWN0b3IoYmFsbCwgcGFkZGxlKSB7XG4gICAgdGhpcy5icmlja3MgPSBbXTtcbiAgICB0aGlzLmRpc2NhcmRlZEJyaWNrcyA9IFtdO1xuICAgIHRoaXMuYmFsbHMgPSBbYmFsbF07XG4gICAgdGhpcy5wYWRkbGUgPSBwYWRkbGU7XG4gICAgdGhpcy5sZXZlbCA9IDE7XG4gICAgdGhpcy5saXZlcyA9IDM7XG4gICAgdGhpcy5zY29yZSA9IDA7XG4gIH1cblxuICBjb2xsaXNpb25DaGVjayhvYmoxLCBvYmoyKSB7XG4gICAgaWYgKG9iajEueCA8IG9iajIueCArIG9iajIud2lkdGggICYmIG9iajEueCArIG9iajEud2lkdGggID4gb2JqMi54ICYmXG4gICAgICAgIG9iajEueSA8IG9iajIueSArIG9iajIuaGVpZ2h0ICYmIG9iajEueSArIG9iajEuaGVpZ2h0ID4gb2JqMi55KSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHBhZGRsZUJhbGxDb2xsaWRpbmcoYmFsbCwgcGFkZGxlKSB7XG4gICAgbGV0IGFyZUNvbGxpZGluZyA9IHRoaXMuY29sbGlzaW9uQ2hlY2soYmFsbCwgcGFkZGxlKTtcbiAgICBsZXQgZHkgPSBiYWxsLmR5O1xuICAgIGlmIChhcmVDb2xsaWRpbmcgPT09IHRydWUpIHtcbiAgICAgIHJldHVybiBkeSA9IC1keTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGR5O1xuICAgIH1cbiAgfVxuXG4gIHBhZGRsZUJhbGxYQ2hlY2soYmFsbCwgcGFkZGxlKSB7XG4gICAgbGV0IGFyZUNvbGxpZGluZyA9IHRoaXMuY29sbGlzaW9uQ2hlY2soYmFsbCwgcGFkZGxlKTtcbiAgICBsZXQgcGFkZGxlRmlyc3RGaWZ0aCA9IHBhZGRsZS54ICsgKHBhZGRsZS53aWR0aCAvIDUpO1xuICAgIGxldCBwYWRkbGVTZWNvbmRGaWZ0aCA9IHBhZGRsZS54ICsgKChwYWRkbGUud2lkdGggLyA1KSAqIDIpO1xuICAgIGxldCBwYWRkbGVNaWRkbGVGaWZ0aCA9IHBhZGRsZS54ICsgKChwYWRkbGUud2lkdGggLyA1KSAqIDMpO1xuICAgIGxldCBwYWRkbGVUaGlyZEZpZnRoID0gcGFkZGxlLnggKyAoKHBhZGRsZS53aWR0aCAvIDUpICogNCk7XG4gICAgbGV0IHBhZGRsZUZvdXJ0aEZpZnRoID0gcGFkZGxlLnggKyBwYWRkbGUud2lkdGg7XG4gICAgaWYgKGFyZUNvbGxpZGluZyA9PT0gdHJ1ZSkge1xuICAgICAgaWYgKGJhbGwueCA8IHBhZGRsZUZpcnN0RmlmdGgpIHtcbiAgICAgICAgYmFsbC5keCAtPSAzO1xuICAgICAgfSBlbHNlIGlmIChiYWxsLnggPCBwYWRkbGVTZWNvbmRGaWZ0aCkge1xuICAgICAgICBiYWxsLmR4IC09IDE7XG4gICAgICB9IGVsc2UgaWYgKGJhbGwueCA8IHBhZGRsZVRoaXJkRmlmdGgpIHtcbiAgICAgICAgYmFsbC5keCArPSAxO1xuICAgICAgfSBlbHNlIGlmIChiYWxsLnggPCBwYWRkbGVGb3VydGhGaWZ0aCkge1xuICAgICAgICBiYWxsLmR4ICs9IDM7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChiYWxsLmR4ID4gMTApIHtcbiAgICAgIGJhbGwuZHggPSAxMDtcbiAgICB9IGVsc2UgaWYgKGJhbGwuZHggPCAtMTApIHtcbiAgICAgIGJhbGwuZHggPSAtMTA7XG4gICAgfVxuICAgIHJldHVybiBiYWxsLmR4XG4gIH1cblxuICBncmFiQnJpY2tzKGJyaWNrcykge1xuICAgIHRoaXMuYnJpY2tzLnB1c2goYnJpY2tzKTtcbiAgfVxuXG4gIGJyaWNrQmFsbENvbGxpZGluZyhiYWxsLCBicmlja3MpIHtcbiAgICBsZXQgZHkgPSBiYWxsLmR5O1xuICAgIGJyaWNrcy5mb3JFYWNoKGZ1bmN0aW9uKGJyaWNrKSB7XG4gICAgICBsZXQgaW5kZXggPSB0aGlzLmJyaWNrcy5pbmRleE9mKGJyaWNrKTtcbiAgICAgIGxldCBhcmVDb2xsaWRpbmcgPSB0aGlzLmNvbGxpc2lvbkNoZWNrKGJhbGwsIGJyaWNrKTtcbiAgICAgIGlmIChhcmVDb2xsaWRpbmcgPT09IHRydWUpIHtcbiAgICAgICAgdGhpcy5zY29yZSArPSAxMDA7XG4gICAgICAgIGlmIChicmljay5oZWFsdGggPT09IDEpe1xuICAgICAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5icmlja3MuaW5kZXhPZihicmljayk7XG4gICAgICAgICAgICB0aGlzLmRpc2NhcmRlZEJyaWNrcyA9IHRoaXMuYnJpY2tzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJpY2suaGVhbHRoLS07XG4gICAgICAgIGlmIChiYWxsLnggPCAoYnJpY2sueCArIGJyaWNrLndpZHRoKSAmJiBiYWxsLnggPiBicmljay54KSB7XG4gICAgICAgICAgcmV0dXJuIGR5ID0gLWR5O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBkeTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgfS5iaW5kKHRoaXMpKVxuICAgIHJldHVybiBkeTtcbiAgfVxuXG4gIGNoZWNrQnJpY2tzKCkge1xuICAgIGlmICh0aGlzLmJyaWNrcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRoaXMubGV2ZWwrKztcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGJyaWNrQmFsbFNpZGVDb2xsaXNpb24oYmFsbCwgYnJpY2tzKSB7XG4gICAgYnJpY2tzLmZvckVhY2goZnVuY3Rpb24oYnJpY2spIHtcbiAgICAgIGxldCBhcmVDb2xsaWRpbmcgPSB0aGlzLmNvbGxpc2lvbkNoZWNrKGJhbGwsIGJyaWNrKTtcbiAgICAgIGlmIChhcmVDb2xsaWRpbmcgPT09IHRydWUpIHtcbiAgICAgICAgaWYgKGJhbGwueCA8PSBicmljay54IHx8IGJhbGwueCA+PSAoYnJpY2sueCArIGJyaWNrLndpZHRoKSkge1xuICAgICAgICAgIGJhbGwuZHggPSAtYmFsbC5keDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0uYmluZCh0aGlzKSlcbiAgICByZXR1cm4gYmFsbC5keDtcbiAgfVxuXG4gIGNoZWNrQmFsbERlYXRoKGJhbGwsIGNhbnZhc0hlaWdodCkge1xuICAgIGlmIChiYWxsLnkgPj0gY2FudmFzSGVpZ2h0KSB7XG4gICAgICB0aGlzLmxpdmVzIC09IDE7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWU7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9saWIvR2FtZS5qcyIsImNsYXNzIEJyaWNrIHtcbiAgY29uc3RydWN0b3IoeCwgeSkge1xuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcbiAgICB0aGlzLmhlYWx0aCA9IDE7XG4gICAgdGhpcy53aWR0aCA9IDc1O1xuICAgIHRoaXMuaGVpZ2h0ID0gMjU7XG4gICAgdGhpcy5icmlja3MgPSBbXTtcbiAgfVxuXG4gIGNyZWF0ZUJyaWNrcyhudW1Ccmlja3MsIGxldmVsKSB7XG4gICAgaWYobGV2ZWwgPCAzKXtcbiAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBudW1Ccmlja3M7IGkrKykge1xuICAgICAgICBpZiAoaSA8PSA5KSB7XG4gICAgICAgICAgbGV0IHggPSAyLjUgKyAoaSAqIDc1KSArIChpICogNSk7XG4gICAgICAgICAgbGV0IHkgPSAoMTUpO1xuICAgICAgICAgIHRoaXMuYnJpY2tzLnB1c2gobmV3IEJyaWNrKHgsIHkpKTtcbiAgICAgICAgfSBlbHNlIGlmIChpIDw9IDE5KSB7XG4gICAgICAgICAgbGV0IHggPSAyLjUgKyAoKGkgLSAxMCkgKiA3NSkgKyAoKGkgLSAxMCkgKiA1KTtcbiAgICAgICAgICBsZXQgeSA9IDQ1O1xuICAgICAgICAgIHRoaXMuYnJpY2tzLnB1c2gobmV3IEJyaWNrKHgsIHkpKTtcbiAgICAgICAgfSBlbHNlIGlmIChpIDw9IDI5KSB7XG4gICAgICAgICAgbGV0IHggPSAyLjUgKyAoKGkgLSAyMCkgKiA3NSkgKyAoKGkgLSAyMCkgKiA1KTtcbiAgICAgICAgICBsZXQgeSA9IDc1O1xuICAgICAgICAgIHRoaXMuYnJpY2tzLnB1c2gobmV3IEJyaWNrKHgsIHkpKTtcbiAgICAgICAgfSBlbHNlIGlmIChpIDw9IDM5KSB7XG4gICAgICAgICAgbGV0IHggPSAyLjUgKyAoKGkgLSAzMCkgKiA3NSkgKyAoKGkgLSAzMCkgKiA1KTtcbiAgICAgICAgICBsZXQgeSA9IDEwNTtcbiAgICAgICAgICBpZiAobGV2ZWwgPT09IDIpIHtcbiAgICAgICAgICAgIGxldCBoZWFsdGggPSAyO1xuICAgICAgICAgICAgdGhpcy5icmlja3MucHVzaChuZXcgU3Ryb25nZXJCcmljayh4LCB5LCBoZWFsdGgpKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bUJyaWNrczsgaSsrKSB7XG4gICAgICAgIGlmKGkgPD0gOCkge1xuICAgICAgICAgIGxldCB4ID0gNDUgKyAoaSAqIDc1KSArIChpICogNSk7XG4gICAgICAgICAgbGV0IHkgPSAyNTtcbiAgICAgICAgICBsZXQgaGVhbHRoID0gMjtcbiAgICAgICAgICB0aGlzLmJyaWNrcy5wdXNoKG5ldyBTdHJvbmdlckJyaWNrKHgsIHksIGhlYWx0aCkpO1xuICAgICAgICB9IGVsc2UgaWYgKGkgPD0gMTcpIHtcbiAgICAgICAgICBsZXQgeCA9IDQ1ICsgKChpIC0gOSkgKiA3NSkgKyAoKGkgLSA5KSAqIDUpO1xuICAgICAgICAgIGxldCB5ID0gNTU7XG4gICAgICAgICAgdGhpcy5icmlja3MucHVzaChuZXcgQnJpY2soeCwgeSkpO1xuICAgICAgICB9IGVsc2UgaWYgKGkgPD0gMjYpIHtcbiAgICAgICAgICBsZXQgeCA9IDQ1ICsgKChpIC0gMTgpICogNzUpICsgKChpIC0gMTgpICogNSk7XG4gICAgICAgICAgbGV0IHkgPSA4NTtcbiAgICAgICAgICBsZXQgaGVhbHRoID0gMjtcbiAgICAgICAgICB0aGlzLmJyaWNrcy5wdXNoKG5ldyBTdHJvbmdlckJyaWNrKHgsIHksIGhlYWx0aCkpO1xuICAgICAgICB9IGVsc2UgaWYgKGkgPD0gMzUpIHtcbiAgICAgICAgICBsZXQgeCA9IDQ1ICsgKChpIC0gMjcpICogNzUpICsgKChpIC0gMjcpICogNSk7XG4gICAgICAgICAgbGV0IHkgPSAxMTU7XG4gICAgICAgICAgbGV0IGhlYWx0aCA9IDI7XG4gICAgICAgICAgdGhpcy5icmlja3MucHVzaChuZXcgU3Ryb25nZXJCcmljayh4LCB5LCBoZWFsdGgpKTtcbiAgICAgICAgfSBlbHNlIGlmIChpIDw9IDQ0KSB7XG4gICAgICAgICAgbGV0IHggPSA0NSArICgoaSAtIDM2KSAqIDc1KSArICgoaSAtIDM2KSAqIDUpO1xuICAgICAgICAgIGxldCB5ID0gMTQ1O1xuICAgICAgICAgIHRoaXMuYnJpY2tzLnB1c2gobmV3IEJyaWNrKHgsIHkpKVxuICAgICAgICB9IGVsc2UgaWYgKGkgPD0gNTMpIHtcbiAgICAgICAgICBsZXQgeCA9IDQ1ICsgKChpIC0gNDUpICogNzUpICsgKChpIC0gNDUpICogNSk7XG4gICAgICAgICAgbGV0IHkgPSAxNzU7XG4gICAgICAgICAgbGV0IGhlYWx0aCA9IDI7XG4gICAgICAgICAgdGhpcy5icmlja3MucHVzaChuZXcgU3Ryb25nZXJCcmljayh4LCB5LCBoZWFsdGgpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5icmlja3MgPSB0aGlzLmJyaWNrcy5maWx0ZXIoYnJpY2sgPT4gYnJpY2sueCAhPT0gMzY1KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuYnJpY2tzO1xuICB9XG5cbiAgY2xlYXJCcmlja3MoKSB7XG4gICAgdGhpcy5icmlja3MgPSBbXTtcbiAgICByZXR1cm4gdGhpcy5icmlja3M7XG4gIH1cblxuICBkcmF3KGNvbnRleHQsIGJyaWNrcykge1xuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBicmlja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHt4LCB5LCB3aWR0aCwgaGVpZ2h0fSA9IGJyaWNrc1tpXTtcbiAgICAgIGlmIChicmlja3NbaV0uaGVhbHRoID09PSAyKSB7XG4gICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICcjMzYwNjAwJ1xuICAgIH0gZWxzZSBpZiAoYnJpY2tzW2ldLmhlYWx0aCA9PT0gMSkge1xuICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAnI0ZDMDAwOSdcbiAgICB9XG4gICAgICBjb250ZXh0LmZpbGxSZWN0KHgsIHksIHdpZHRoLCBoZWlnaHQpO1xuICAgIH1cbiAgfVxufVxuXG5jbGFzcyBTdHJvbmdlckJyaWNrIGV4dGVuZHMgQnJpY2sge1xuICBjb25zdHJ1Y3Rvcih4LCB5LCBoZWFsdGgpIHtcbiAgICBzdXBlcih4LCB5KTtcbiAgICB0aGlzLmhlYWx0aCA9IGhlYWx0aDtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJyaWNrO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbGliL2JyaWNrcy5qcyJdLCJzb3VyY2VSb290IjoiIn0=