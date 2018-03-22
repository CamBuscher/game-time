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
	      var boolean = this.collisionCheck(ball, paddle);
	      var dy = ball.dy;
	      if (boolean === true) {
	        return dy = -dy;
	      } else {
	        return dy;
	      }
	    }
	  }, {
	    key: "paddleBallXCheck",
	    value: function paddleBallXCheck(ball, paddle) {
	      var boolean = this.collisionCheck(ball, paddle);
	      var paddleFirstFifth = paddle.x + paddle.width / 5;
	      var paddleSecondFifth = paddle.x + paddle.width / 5 * 2;
	      var paddleMiddleFifth = paddle.x + paddle.width / 5 * 3;
	      var paddleThirdFifth = paddle.x + paddle.width / 5 * 4;
	      var paddleFourthFifth = paddle.x + paddle.width;
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
	        var boolean = this.collisionCheck(ball, brick);
	        if (boolean === true) {
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
	        var boolean = this.collisionCheck(ball, brick);
	        if (boolean === true) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgM2I0MDljNzNkZDJjZjE1M2VkYjYiLCJ3ZWJwYWNrOi8vLy4vbGliL2luZGV4LmpzIiwid2VicGFjazovLy8uL2xpYi9QYWRkbGUuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL2tleWJvYXJkZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL2JhbGwuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL3Njb3Jlcy5qcyIsIndlYnBhY2s6Ly8vLi9saWIvR2FtZS5qcyIsIndlYnBhY2s6Ly8vLi9saWIvYnJpY2tzLmpzIl0sIm5hbWVzIjpbImNhbnZhcyIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsIlBhZGRsZSIsInJlcXVpcmUiLCJLZXlib2FyZGVyIiwiQmFsbCIsIlNjb3JlcyIsIkdhbWUiLCJCcmljayIsImN0eCIsImdldENvbnRleHQiLCJuZXdHYW1lIiwiYm91bmN5QmFsbCIsInN0YXJ0UGFkZGxlIiwia2V5Ym9hcmRNb25pdG9yIiwiTWF0aCIsInJhbmRvbSIsImtleVN0YXRlIiwiYnJpY2tzIiwicmVxdWVzdElEIiwidW5kZWZpbmVkIiwiaXNEZWFkIiwiZ2VuZXJhdGVCcmlja3MiLCJzdGFydEdhbWUiLCJnZXRGcm9tU3RvcmFnZSIsImxldmVsIiwibmV3QnJpY2tzIiwiY3JlYXRlQnJpY2tzIiwiZm9yRWFjaCIsImdyYWJCcmlja3MiLCJicmljayIsIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwia2V5RG93biIsImtleVVwIiwicmVzdGFydEdhbWUiLCJnYW1lTG9vcCIsImdldEVsZW1lbnRCeUlkIiwiaW5uZXJIVE1MIiwic2NvcmUiLCJsaXZlcyIsImZpbGxTdHlsZSIsImNsZWFyUmVjdCIsIndpZHRoIiwiaGVpZ2h0IiwiZHJhdyIsImR5IiwicGFkZGxlQmFsbENvbGxpZGluZyIsImR4IiwicGFkZGxlQmFsbFhDaGVjayIsImJyaWNrQmFsbFNpZGVDb2xsaXNpb24iLCJicmlja0JhbGxDb2xsaWRpbmciLCJtb3ZlIiwiYW5pbWF0ZSIsImNoZWNrQmFsbERlYXRoIiwiYmFsbERlYXRoIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiY2hlY2tCcmlja3MiLCJjbGVhckJyaWNrcyIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwiZGVsYXllZFN0YXJ0IiwiZW5kR2FtZSIsInNldFRpbWVvdXQiLCJ1c2VyU2NvcmVzIiwiaW5pdGlhbHMiLCJwcm9tcHQiLCJjb25zb2xlIiwibG9nIiwiY2hlY2tJbml0aWFscyIsInNjb3JlVG9TdG9yYWdlIiwibGl2ZXNJbmRpY2F0b3IiLCJpbm5lclRleHQiLCJ0ZXN0IiwicyIsInNsaWNlIiwidG9VcHBlckNhc2UiLCJzY29yZXMiLCJzdG9yZVNjb3JlcyIsInN0cmluZ2lmeVNjb3JlcyIsIkpTT04iLCJzdHJpbmdpZnkiLCJsb2NhbFN0b3JhZ2UiLCJzZXRJdGVtIiwiaWQiLCJ0b3BTY29yZXMiLCJpIiwibGVuZ3RoIiwicmV0cmlldmVkSXRlbSIsImdldEl0ZW0iLCJrZXkiLCJwYXJzZWRJdGVtIiwicGFyc2UiLCJwdXNoIiwic29ydCIsImEiLCJiIiwic3BsaWNlIiwiSFRNTEluaXRpYWxzIiwiSFRNTFNjb3JlcyIsIngiLCJ5IiwiY29udGV4dCIsImZpbGxSZWN0IiwibW9kdWxlIiwiZXhwb3J0cyIsImtleXMiLCJsZWZ0IiwicmlnaHQiLCJrZXlDb2RlIiwicmFkaXVzIiwiYmVnaW5QYXRoIiwiYXJjIiwiUEkiLCJzdHJva2UiLCJmaWxsIiwiY2FudmFzSGVpZ2h0IiwiY2FudmFzV2lkdGgiLCJEYXRlIiwibm93IiwiYmFsbCIsInBhZGRsZSIsImRpc2NhcmRlZEJyaWNrcyIsImJhbGxzIiwib2JqMSIsIm9iajIiLCJib29sZWFuIiwiY29sbGlzaW9uQ2hlY2siLCJwYWRkbGVGaXJzdEZpZnRoIiwicGFkZGxlU2Vjb25kRmlmdGgiLCJwYWRkbGVNaWRkbGVGaWZ0aCIsInBhZGRsZVRoaXJkRmlmdGgiLCJwYWRkbGVGb3VydGhGaWZ0aCIsImluZGV4IiwiaW5k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QSxNQUFkO0FBRndCO0FBR3pCOzs7R0FKeUIvSCxLOztBQU81QmdHLFFBQU9DLE9BQVAsR0FBaUJqRyxLQUFqQixDIiwiZmlsZSI6Im1haW4uYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgM2I0MDljNzNkZDJjZjE1M2VkYjYiLCJjb25zdCBjYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZ2FtZS1zY3JlZW4nKTtcbmNvbnN0IFBhZGRsZSA9IHJlcXVpcmUoJy4vUGFkZGxlJyk7XG5jb25zdCBLZXlib2FyZGVyID0gcmVxdWlyZSgnLi9rZXlib2FyZGVyJyk7XG5jb25zdCBCYWxsID0gcmVxdWlyZSgnLi9iYWxsLmpzJyk7XG5jb25zdCBTY29yZXMgPSByZXF1aXJlKCcuL3Njb3Jlcy5qcycpO1xuY29uc3QgR2FtZSA9IHJlcXVpcmUoJy4vR2FtZS5qcycpO1xuY29uc3QgQnJpY2sgPSByZXF1aXJlKCcuL2JyaWNrcy5qcycpO1xubGV0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xubGV0IG5ld0dhbWUgPSBuZXcgR2FtZShib3VuY3lCYWxsLCBzdGFydFBhZGRsZSk7XG5sZXQgc3RhcnRQYWRkbGUgPSBuZXcgUGFkZGxlKDM1MCwgMTAwLCAxNSk7XG5sZXQga2V5Ym9hcmRNb25pdG9yID0gbmV3IEtleWJvYXJkZXIoKTtcbmxldCBib3VuY3lCYWxsID0gbmV3IEJhbGwoNDAwLCAyMDAsICgoTWF0aC5yYW5kb20oKSAqIDMpIC0xLjUpLCA0KTtcbmxldCBrZXlTdGF0ZSA9IHt9O1xubGV0IGJyaWNrcyA9IG5ldyBCcmljaygpO1xubGV0IHJlcXVlc3RJRCA9IHVuZGVmaW5lZDtcbmxldCBpc0RlYWQgPSBudWxsO1xuXG5nZW5lcmF0ZUJyaWNrcygpO1xuc3RhcnRHYW1lKCk7XG5nZXRGcm9tU3RvcmFnZSgpO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZUJyaWNrcygpIHtcbiAgaWYgKG5ld0dhbWUubGV2ZWwgPT09IDEpIHtcbiAgICBsZXQgbmV3QnJpY2tzID0gYnJpY2tzLmNyZWF0ZUJyaWNrcyg0MCwgMSk7XG4gICAgbmV3QnJpY2tzLmZvckVhY2goIGJyaWNrID0+IG5ld0dhbWUuZ3JhYkJyaWNrcyhicmljaykgKTtcbiAgfSBlbHNlIGlmIChuZXdHYW1lLmxldmVsID09PSAyKSB7XG4gICAgbGV0IG5ld0JyaWNrcyA9IGJyaWNrcy5jcmVhdGVCcmlja3MoNDAsIDIpO1xuICAgIG5ld0JyaWNrcy5mb3JFYWNoKCBicmljayA9PiBuZXdHYW1lLmdyYWJCcmlja3MoYnJpY2spICk7XG4gIH0gZWxzZSBpZiAobmV3R2FtZS5sZXZlbCA9PT0gMykge1xuICAgIGxldCBuZXdCcmlja3MgPSBicmlja3MuY3JlYXRlQnJpY2tzKDU0LCAzKTtcbiAgICBuZXdCcmlja3MuZm9yRWFjaCggYnJpY2sgPT4gbmV3R2FtZS5ncmFiQnJpY2tzKGJyaWNrKSApO1xuICB9O1xufTtcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBmdW5jdGlvbihlKSB7XG4gIGtleVN0YXRlID0ga2V5Ym9hcmRNb25pdG9yLmtleURvd24oZSk7XG59KTtcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgZnVuY3Rpb24oZSkge1xuICBrZXlTdGF0ZSA9IGtleWJvYXJkTW9uaXRvci5rZXlVcChlKTtcbn0pO1xuXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmV3LWdhbWUtYnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCByZXN0YXJ0R2FtZSk7XG5cbmZ1bmN0aW9uIGdhbWVMb29wKCkge1xuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXNlci1zY29yZScpLmlubmVySFRNTCA9IG5ld0dhbWUuc2NvcmU7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5saXZlcy1pbmRpY2F0b3InKS5pbm5lckhUTUwgPSBuZXdHYW1lLmxpdmVzO1xuICBjdHguZmlsbFN0eWxlID0gJyMwMDAnO1xuICBjdHguY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4gIHN0YXJ0UGFkZGxlLmRyYXcoY3R4KTtcbiAgYm91bmN5QmFsbC5kcmF3KGN0eCk7XG4gIGJvdW5jeUJhbGwuZHkgPSBuZXdHYW1lLnBhZGRsZUJhbGxDb2xsaWRpbmcoYm91bmN5QmFsbCwgc3RhcnRQYWRkbGUpO1xuICBib3VuY3lCYWxsLmR4ID0gbmV3R2FtZS5wYWRkbGVCYWxsWENoZWNrKGJvdW5jeUJhbGwsIHN0YXJ0UGFkZGxlKTtcbiAgYm91bmN5QmFsbC5keCA9IG5ld0dhbWUuYnJpY2tCYWxsU2lkZUNvbGxpc2lvbihib3VuY3lCYWxsLCBuZXdHYW1lLmJyaWNrcyk7XG4gIGJvdW5jeUJhbGwuZHkgPSBuZXdHYW1lLmJyaWNrQmFsbENvbGxpZGluZyhib3VuY3lCYWxsLCBuZXdHYW1lLmJyaWNrcyk7XG4gIGJyaWNrcy5kcmF3KGN0eCwgbmV3R2FtZS5icmlja3MpO1xuICBib3VuY3lCYWxsLm1vdmUoY2FudmFzLmhlaWdodCwgY2FudmFzLndpZHRoKTtcbiAgc3RhcnRQYWRkbGUuYW5pbWF0ZShrZXlTdGF0ZSk7XG4gIGlzRGVhZCA9IG5ld0dhbWUuY2hlY2tCYWxsRGVhdGgoYm91bmN5QmFsbCwgY2FudmFzLmhlaWdodCk7XG4gIGlmIChpc0RlYWQpIHtcbiAgICBiYWxsRGVhdGgoKTtcbiAgfSBlbHNlIHtcbiAgICByZXF1ZXN0SUQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZ2FtZUxvb3ApO1xuICB9XG4gIGlmIChuZXdHYW1lLmNoZWNrQnJpY2tzKCkpIHtcbiAgICBicmlja3MuY2xlYXJCcmlja3MoKTtcbiAgICBnZW5lcmF0ZUJyaWNrcygpO1xuICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZShyZXF1ZXN0SUQpO1xuICAgIHJlcXVlc3RJRCA9IG51bGw7XG4gICAgc3RhcnRHYW1lKCk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHJlc3RhcnRHYW1lKCkge1xuICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUocmVxdWVzdElEKTtcbiAgcmVxdWVzdElEID0gbnVsbDtcbiAgbmV3R2FtZS5icmlja3MgPSBicmlja3MuY2xlYXJCcmlja3MoKTtcbiAgYm91bmN5QmFsbCA9IG5ldyBCYWxsKDQwMCwgMjAwLCAoKE1hdGgucmFuZG9tKCkgKiAzKSAtMS41KSwgNCk7XG4gIG5ld0dhbWUgPSBuZXcgR2FtZShib3VuY3lCYWxsLCBzdGFydFBhZGRsZSk7XG4gIGdlbmVyYXRlQnJpY2tzKCk7XG4gIHN0YXJ0R2FtZSgpO1xufVxuXG5mdW5jdGlvbiBzdGFydEdhbWUoKSB7XG4gIGN0eC5maWxsU3R5bGUgPSAnIzAwMCc7XG4gIGN0eC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgYm91bmN5QmFsbCA9IG5ldyBCYWxsKDQwMCwgMjAwLCAoKE1hdGgucmFuZG9tKCkgKiAzKSAtMS41KSwgNCk7XG4gIHN0YXJ0UGFkZGxlID0gbmV3IFBhZGRsZSgzNTAsIDEwMCwgMTUpO1xuICBzdGFydFBhZGRsZS5kcmF3KGN0eCk7XG4gIGJvdW5jeUJhbGwuZHJhdyhjdHgpO1xuICBicmlja3MuZHJhdyhjdHgsIG5ld0dhbWUuYnJpY2tzKTtcbiAgZGVsYXllZFN0YXJ0KCk7XG4gIGVuZEdhbWUoKTtcbn1cblxuZnVuY3Rpb24gZGVsYXllZFN0YXJ0KCkge1xuICBpZighcmVxdWVzdElEKSB7XG4gICAgd2luZG93LnNldFRpbWVvdXQoZ2FtZUxvb3AsIDMwMDApO1xuICB9XG59XG5cbmZ1bmN0aW9uIGVuZEdhbWUoKSB7XG4gIHZhciB1c2VyU2NvcmVzID0gbmV3IFNjb3JlcygpO1xuICBpZihuZXdHYW1lLmxpdmVzID09PSAwKSB7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VzZXItc2NvcmUnKS5pbm5lckhUTUwgPSAwO1xuICAgIHVzZXJTY29yZXMuaW5pdGlhbHMgPSBwcm9tcHQoJ0VudGVyIHlvdXIgaW5pdGlhbHMhJywgJycpO1xuICAgIHVzZXJTY29yZXMuc2NvcmUgPSBuZXdHYW1lLnNjb3JlO1xuICAgIGNvbnNvbGUubG9nKHVzZXJTY29yZXMuaW5pdGlhbHMpO1xuICAgIHVzZXJTY29yZXMuaW5pdGlhbHMgPSBjaGVja0luaXRpYWxzKHVzZXJTY29yZXMuaW5pdGlhbHMpO1xuICAgIHNjb3JlVG9TdG9yYWdlKHVzZXJTY29yZXMpO1xuICAgIGdldEZyb21TdG9yYWdlKHVzZXJTY29yZXMpO1xuICAgIG5ld0dhbWUgPSBuZXcgR2FtZShib3VuY3lCYWxsLCBzdGFydFBhZGRsZSk7XG4gICAgYnJpY2tzID0gbmV3IEJyaWNrKCk7XG4gICAgZ2VuZXJhdGVCcmlja3MoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBiYWxsRGVhdGgoKSB7XG4gIGlmKHJlcXVlc3RJRCkge1xuICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZShyZXF1ZXN0SUQpO1xuICAgIHJlcXVlc3RJRCA9IG51bGw7XG4gICAgaXNEZWFkID0gZmFsc2U7XG4gICAgdmFyIGxpdmVzSW5kaWNhdG9yID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxpdmVzLWluZGljYXRvcicpO1xuICAgIGxpdmVzSW5kaWNhdG9yLmlubmVyVGV4dCA9IG5ld0dhbWUubGl2ZXM7XG4gICAgc3RhcnRHYW1lKCk7XG4gIH1cbn1cblxuY29uc3QgY2hlY2tJbml0aWFscyA9IHMgPT4gL1thLXpdKi9naS50ZXN0KHMpID8gcy5zbGljZSgwLDMpLnRvVXBwZXJDYXNlKCkgOiAnTi9BJztcblxuZnVuY3Rpb24gc2NvcmVUb1N0b3JhZ2Uoc2NvcmVzKSB7XG4gIHZhciBzdG9yZVNjb3JlcyA9IHNjb3JlcztcbiAgdmFyIHN0cmluZ2lmeVNjb3JlcyA9IEpTT04uc3RyaW5naWZ5KHN0b3JlU2NvcmVzKTtcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oc2NvcmVzLmlkLCBzdHJpbmdpZnlTY29yZXMpO1xufVxuXG5mdW5jdGlvbiBnZXRGcm9tU3RvcmFnZShzY29yZXMpIHtcbiAgbGV0IHRvcFNjb3JlcyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxvY2FsU3RvcmFnZS5sZW5ndGg7IGkrKyl7XG4gICAgbGV0IHJldHJpZXZlZEl0ZW0gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShsb2NhbFN0b3JhZ2Uua2V5KGkpKTtcbiAgICBsZXQgcGFyc2VkSXRlbSA9IEpTT04ucGFyc2UocmV0cmlldmVkSXRlbSk7XG4gICAgdG9wU2NvcmVzLnB1c2gocGFyc2VkSXRlbSk7XG4gIH1cbiAgdG9wU2NvcmVzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiBiLnNjb3JlIC0gYS5zY29yZTtcbiAgfSlcbiAgdG9wU2NvcmVzLnNwbGljZSgxMCwgMTAwMCk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdG9wU2NvcmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgbGV0IGluaXRpYWxzID0gdG9wU2NvcmVzW2ldLmluaXRpYWxzO1xuICAgIGxldCBzY29yZSA9IHRvcFNjb3Jlc1tpXS5zY29yZTtcbiAgICBsZXQgSFRNTEluaXRpYWxzID0gJ2hpZ2gtaW5pdGlhbHMtJyArIChpICsgMSk7XG4gICAgbGV0IEhUTUxTY29yZXMgPSAnaGlnaC1zY29yZS0nICsgKGkgKyAxKTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuJyArIEhUTUxJbml0aWFscykuaW5uZXJIVE1MID0gaW5pdGlhbHM7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLicgKyBIVE1MU2NvcmVzKS5pbm5lckhUTUwgPSBzY29yZTtcbiAgfVxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2xpYi9pbmRleC5qcyIsImNsYXNzIFBhZGRsZSB7XG4gIGNvbnN0cnVjdG9yKHgsIHdpZHRoLCBoZWlnaHQpIHtcbiAgICB0aGlzLnkgPSA0NzU7XG4gICAgdGhpcy54ID0geDtcbiAgICB0aGlzLndpZHRoID0gd2lkdGg7XG4gICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG4gIH1cbiAgZHJhdyhjb250ZXh0KSB7XG4gICAgY29udGV4dC5maWxsUmVjdCh0aGlzLngsIHRoaXMueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICB9XG4gIGFuaW1hdGUoa2V5U3RhdGUpIHtcbiAgICBpZiAoa2V5U3RhdGVbMzddICYmIHRoaXMueCA+IDApIHtcbiAgICAgIHRoaXMueCAtPSA1O1xuICAgIH0gZWxzZSBpZiAoa2V5U3RhdGVbMzldICYmIHRoaXMueCA8IDcwMCkge1xuICAgICAgdGhpcy54ICs9IDU7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUGFkZGxlO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2xpYi9QYWRkbGUuanMiLCJjbGFzcyBLZXlib2FyZGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5rZXlzID0ge1xuICAgICAgbGVmdDogMzcsXG4gICAgICByaWdodDogMzksXG4gICAgfVxuICB9XG4gIGtleURvd24oZSkge1xuICAgIHZhciBrZXlTdGF0ZSA9IHt9O1xuICAgIGtleVN0YXRlW2Uua2V5Q29kZV0gPSB0cnVlO1xuICAgIHJldHVybiBrZXlTdGF0ZTtcbiAgfTtcblxuICBrZXlVcChlKSB7XG4gICAgdmFyIGtleVN0YXRlID0ge307XG4gICAga2V5U3RhdGVbZS5rZXlDb2RlXSA9IGZhbHNlO1xuICAgIHJldHVybiBrZXlTdGF0ZTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBLZXlib2FyZGVyO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbGliL2tleWJvYXJkZXIuanMiLCJjbGFzcyBCYWxsIHtcbiAgY29uc3RydWN0b3IoeCwgeSwgZHgsIGR5KSB7XG4gICAgdGhpcy54ID0geDtcbiAgICB0aGlzLnkgPSB5O1xuICAgIHRoaXMuZHggPSBkeDtcbiAgICB0aGlzLmR5ID0gZHk7XG4gICAgdGhpcy5yYWRpdXMgPSA1O1xuICAgIHRoaXMud2lkdGggPSB0aGlzLnJhZGl1cyAqIDI7XG4gICAgdGhpcy5oZWlnaHQgPSB0aGlzLnJhZGl1cyAqIDI7XG4gIH1cbiAgZHJhdyhjb250ZXh0KSB7XG4gICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICBjb250ZXh0LmFyYyh0aGlzLngsIHRoaXMueSwgdGhpcy5yYWRpdXMsIDAsIE1hdGguUEkgKiAyICxmYWxzZSk7XG4gICAgY29udGV4dC5zdHJva2UoKTtcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IFwiIzAwMFwiO1xuICAgIGNvbnRleHQuZmlsbCgpO1xuICB9XG4gIG1vdmUoY2FudmFzSGVpZ2h0LCBjYW52YXNXaWR0aCkge1xuICAgIGlmICgodGhpcy54ICsgdGhpcy5yYWRpdXMpID49IGNhbnZhc1dpZHRoIHx8ICh0aGlzLnggLSB0aGlzLnJhZGl1cykgPD0gMCkge1xuICAgICAgdGhpcy5keCA9IC10aGlzLmR4O1xuICAgIH1cbiAgICBpZiAoKHRoaXMueSAtIHRoaXMucmFkaXVzKSA8PSAwKSB7XG4gICAgICB0aGlzLmR5ID0gLXRoaXMuZHk7XG4gICAgfVxuICAgIHRoaXMueSArPSB0aGlzLmR5O1xuICAgIHRoaXMueCArPSB0aGlzLmR4O1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQmFsbDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2xpYi9iYWxsLmpzIiwiY2xhc3MgU2NvcmVzIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zY29yZSA9IDA7XG4gICAgdGhpcy5pbml0aWFscyA9ICdYWFgnO1xuICAgIHRoaXMuaWQgPSBEYXRlLm5vdygpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2NvcmVzO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbGliL3Njb3Jlcy5qcyIsImNsYXNzIEdhbWUge1xuICBjb25zdHJ1Y3RvcihiYWxsLCBwYWRkbGUpIHtcbiAgICB0aGlzLmJyaWNrcyA9IFtdO1xuICAgIHRoaXMuZGlzY2FyZGVkQnJpY2tzID0gW107XG4gICAgdGhpcy5iYWxscyA9IFtiYWxsXTtcbiAgICB0aGlzLnBhZGRsZSA9IHBhZGRsZTtcbiAgICB0aGlzLmxldmVsID0gMTtcbiAgICB0aGlzLmxpdmVzID0gMztcbiAgICB0aGlzLnNjb3JlID0gMDtcbiAgfVxuXG4gIGNvbGxpc2lvbkNoZWNrKG9iajEsIG9iajIpIHtcbiAgICBpZiAob2JqMS54IDwgb2JqMi54ICsgb2JqMi53aWR0aCAgJiYgb2JqMS54ICsgb2JqMS53aWR0aCAgPiBvYmoyLnggJiZcbiAgICAgICAgb2JqMS55IDwgb2JqMi55ICsgb2JqMi5oZWlnaHQgJiYgb2JqMS55ICsgb2JqMS5oZWlnaHQgPiBvYmoyLnkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcGFkZGxlQmFsbENvbGxpZGluZyhiYWxsLCBwYWRkbGUpIHtcbiAgICBsZXQgYm9vbGVhbiA9IHRoaXMuY29sbGlzaW9uQ2hlY2soYmFsbCwgcGFkZGxlKTtcbiAgICBsZXQgZHkgPSBiYWxsLmR5O1xuICAgIGlmIChib29sZWFuID09PSB0cnVlKSB7XG4gICAgICByZXR1cm4gZHkgPSAtZHk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBkeTtcbiAgICB9XG4gIH1cblxuICBwYWRkbGVCYWxsWENoZWNrKGJhbGwsIHBhZGRsZSkge1xuICAgIGxldCBib29sZWFuID0gdGhpcy5jb2xsaXNpb25DaGVjayhiYWxsLCBwYWRkbGUpO1xuICAgIGxldCBwYWRkbGVGaXJzdEZpZnRoID0gcGFkZGxlLnggKyAocGFkZGxlLndpZHRoIC8gNSk7XG4gICAgbGV0IHBhZGRsZVNlY29uZEZpZnRoID0gcGFkZGxlLnggKyAoKHBhZGRsZS53aWR0aCAvIDUpICogMik7XG4gICAgbGV0IHBhZGRsZU1pZGRsZUZpZnRoID0gcGFkZGxlLnggKyAoKHBhZGRsZS53aWR0aCAvIDUpICogMyk7XG4gICAgbGV0IHBhZGRsZVRoaXJkRmlmdGggPSBwYWRkbGUueCArICgocGFkZGxlLndpZHRoIC8gNSkgKiA0KTtcbiAgICBsZXQgcGFkZGxlRm91cnRoRmlmdGggPSBwYWRkbGUueCArIHBhZGRsZS53aWR0aDtcbiAgICBpZiAoYm9vbGVhbiA9PT0gdHJ1ZSkge1xuICAgICAgaWYgKGJhbGwueCA8IHBhZGRsZUZpcnN0RmlmdGgpIHtcbiAgICAgICAgYmFsbC5keCAtPSAzO1xuICAgICAgfSBlbHNlIGlmIChiYWxsLnggPCBwYWRkbGVTZWNvbmRGaWZ0aCkge1xuICAgICAgICBiYWxsLmR4IC09IDE7XG4gICAgICB9IGVsc2UgaWYgKGJhbGwueCA8IHBhZGRsZVRoaXJkRmlmdGgpIHtcbiAgICAgICAgYmFsbC5keCArPSAxO1xuICAgICAgfSBlbHNlIGlmIChiYWxsLnggPCBwYWRkbGVGb3VydGhGaWZ0aCkge1xuICAgICAgICBiYWxsLmR4ICs9IDM7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChiYWxsLmR4ID4gMTApIHtcbiAgICAgIGJhbGwuZHggPSAxMDtcbiAgICB9IGVsc2UgaWYgKGJhbGwuZHggPCAtMTApIHtcbiAgICAgIGJhbGwuZHggPSAtMTA7XG4gICAgfVxuICAgIHJldHVybiBiYWxsLmR4XG4gIH1cblxuICBncmFiQnJpY2tzKGJyaWNrcykge1xuICAgIHRoaXMuYnJpY2tzLnB1c2goYnJpY2tzKTtcbiAgfVxuXG4gIGJyaWNrQmFsbENvbGxpZGluZyhiYWxsLCBicmlja3MpIHtcbiAgICBsZXQgZHkgPSBiYWxsLmR5O1xuICAgIGJyaWNrcy5mb3JFYWNoKGZ1bmN0aW9uKGJyaWNrKSB7XG4gICAgICBsZXQgaW5kZXggPSB0aGlzLmJyaWNrcy5pbmRleE9mKGJyaWNrKTtcbiAgICAgIGxldCBib29sZWFuID0gdGhpcy5jb2xsaXNpb25DaGVjayhiYWxsLCBicmljayk7XG4gICAgICBpZiAoYm9vbGVhbiA9PT0gdHJ1ZSkge1xuICAgICAgICB0aGlzLnNjb3JlICs9IDEwMDtcbiAgICAgICAgaWYgKGJyaWNrLmhlYWx0aCA9PT0gMSl7XG4gICAgICAgICAgICBsZXQgaW5kZXggPSB0aGlzLmJyaWNrcy5pbmRleE9mKGJyaWNrKTtcbiAgICAgICAgICAgIHRoaXMuZGlzY2FyZGVkQnJpY2tzID0gdGhpcy5icmlja3Muc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgICAgICBicmljay5oZWFsdGgtLTtcbiAgICAgICAgaWYgKGJhbGwueCA8IChicmljay54ICsgYnJpY2sud2lkdGgpICYmIGJhbGwueCA+IGJyaWNrLngpIHtcbiAgICAgICAgICByZXR1cm4gZHkgPSAtZHk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGR5O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB9LmJpbmQodGhpcykpXG4gICAgcmV0dXJuIGR5O1xuICB9XG5cbiAgY2hlY2tCcmlja3MoKSB7XG4gICAgaWYgKHRoaXMuYnJpY2tzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy5sZXZlbCsrO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgYnJpY2tCYWxsU2lkZUNvbGxpc2lvbihiYWxsLCBicmlja3MpIHtcbiAgICBicmlja3MuZm9yRWFjaChmdW5jdGlvbihicmljaykge1xuICAgICAgbGV0IGJvb2xlYW4gPSB0aGlzLmNvbGxpc2lvbkNoZWNrKGJhbGwsIGJyaWNrKTtcbiAgICAgIGlmIChib29sZWFuID09PSB0cnVlKSB7XG4gICAgICAgIGlmIChiYWxsLnggPD0gYnJpY2sueCB8fCBiYWxsLnggPj0gKGJyaWNrLnggKyBicmljay53aWR0aCkpIHtcbiAgICAgICAgICBiYWxsLmR4ID0gLWJhbGwuZHg7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LmJpbmQodGhpcykpXG4gICAgcmV0dXJuIGJhbGwuZHg7XG4gIH1cblxuICBjaGVja0JhbGxEZWF0aChiYWxsLCBjYW52YXNIZWlnaHQpIHtcbiAgICBpZiAoYmFsbC55ID49IGNhbnZhc0hlaWdodCkge1xuICAgICAgdGhpcy5saXZlcyAtPSAxO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vbGliL0dhbWUuanMiLCJjbGFzcyBCcmljayB7XG4gIGNvbnN0cnVjdG9yKHgsIHkpIHtcbiAgICB0aGlzLnggPSB4O1xuICAgIHRoaXMueSA9IHk7XG4gICAgdGhpcy5oZWFsdGggPSAxO1xuICAgIHRoaXMud2lkdGggPSA3NTtcbiAgICB0aGlzLmhlaWdodCA9IDI1O1xuICAgIHRoaXMuYnJpY2tzID0gW107XG4gIH1cblxuICBjcmVhdGVCcmlja3MobnVtQnJpY2tzLCBsZXZlbCkge1xuICAgIGlmKGxldmVsIDwgMyl7XG4gICAgICBmb3IodmFyIGkgPSAwOyBpIDwgbnVtQnJpY2tzOyBpKyspIHtcbiAgICAgICAgaWYgKGkgPD0gOSkge1xuICAgICAgICAgIGxldCB4ID0gMi41ICsgKGkgKiA3NSkgKyAoaSAqIDUpO1xuICAgICAgICAgIGxldCB5ID0gKDE1KTtcbiAgICAgICAgICB0aGlzLmJyaWNrcy5wdXNoKG5ldyBCcmljayh4LCB5KSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaSA8PSAxOSkge1xuICAgICAgICAgIGxldCB4ID0gMi41ICsgKChpIC0gMTApICogNzUpICsgKChpIC0gMTApICogNSk7XG4gICAgICAgICAgbGV0IHkgPSA0NTtcbiAgICAgICAgICB0aGlzLmJyaWNrcy5wdXNoKG5ldyBCcmljayh4LCB5KSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaSA8PSAyOSkge1xuICAgICAgICAgIGxldCB4ID0gMi41ICsgKChpIC0gMjApICogNzUpICsgKChpIC0gMjApICogNSk7XG4gICAgICAgICAgbGV0IHkgPSA3NTtcbiAgICAgICAgICB0aGlzLmJyaWNrcy5wdXNoKG5ldyBCcmljayh4LCB5KSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaSA8PSAzOSkge1xuICAgICAgICAgIGxldCB4ID0gMi41ICsgKChpIC0gMzApICogNzUpICsgKChpIC0gMzApICogNSk7XG4gICAgICAgICAgbGV0IHkgPSAxMDU7XG4gICAgICAgICAgaWYgKGxldmVsID09PSAyKSB7XG4gICAgICAgICAgICBsZXQgaGVhbHRoID0gMjtcbiAgICAgICAgICAgIHRoaXMuYnJpY2tzLnB1c2gobmV3IFN0cm9uZ2VyQnJpY2soeCwgeSwgaGVhbHRoKSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1Ccmlja3M7IGkrKykge1xuICAgICAgICBpZihpIDw9IDgpIHtcbiAgICAgICAgICBsZXQgeCA9IDQ1ICsgKGkgKiA3NSkgKyAoaSAqIDUpO1xuICAgICAgICAgIGxldCB5ID0gMjU7XG4gICAgICAgICAgbGV0IGhlYWx0aCA9IDI7XG4gICAgICAgICAgdGhpcy5icmlja3MucHVzaChuZXcgU3Ryb25nZXJCcmljayh4LCB5LCBoZWFsdGgpKTsgIFxuICAgICAgICB9IGVsc2UgaWYgKGkgPD0gMTcpIHtcbiAgICAgICAgICBsZXQgeCA9IDQ1ICsgKChpIC0gOSkgKiA3NSkgKyAoKGkgLSA5KSAqIDUpO1xuICAgICAgICAgIGxldCB5ID0gNTU7XG4gICAgICAgICAgdGhpcy5icmlja3MucHVzaChuZXcgQnJpY2soeCwgeSkpO1xuICAgICAgICB9IGVsc2UgaWYgKGkgPD0gMjYpIHtcbiAgICAgICAgICBsZXQgeCA9IDQ1ICsgKChpIC0gMTgpICogNzUpICsgKChpIC0gMTgpICogNSk7XG4gICAgICAgICAgbGV0IHkgPSA4NTtcbiAgICAgICAgICBsZXQgaGVhbHRoID0gMjtcbiAgICAgICAgICB0aGlzLmJyaWNrcy5wdXNoKG5ldyBTdHJvbmdlckJyaWNrKHgsIHksIGhlYWx0aCkpO1xuICAgICAgICB9IGVsc2UgaWYgKGkgPD0gMzUpIHtcbiAgICAgICAgICBsZXQgeCA9IDQ1ICsgKChpIC0gMjcpICogNzUpICsgKChpIC0gMjcpICogNSk7XG4gICAgICAgICAgbGV0IHkgPSAxMTU7XG4gICAgICAgICAgbGV0IGhlYWx0aCA9IDI7XG4gICAgICAgICAgdGhpcy5icmlja3MucHVzaChuZXcgU3Ryb25nZXJCcmljayh4LCB5LCBoZWFsdGgpKTtcbiAgICAgICAgfSBlbHNlIGlmIChpIDw9IDQ0KSB7XG4gICAgICAgICAgbGV0IHggPSA0NSArICgoaSAtIDM2KSAqIDc1KSArICgoaSAtIDM2KSAqIDUpO1xuICAgICAgICAgIGxldCB5ID0gMTQ1O1xuICAgICAgICAgIHRoaXMuYnJpY2tzLnB1c2gobmV3IEJyaWNrKHgsIHkpKVxuICAgICAgICB9IGVsc2UgaWYgKGkgPD0gNTMpIHtcbiAgICAgICAgICBsZXQgeCA9IDQ1ICsgKChpIC0gNDUpICogNzUpICsgKChpIC0gNDUpICogNSk7XG4gICAgICAgICAgbGV0IHkgPSAxNzU7XG4gICAgICAgICAgbGV0IGhlYWx0aCA9IDI7XG4gICAgICAgICAgdGhpcy5icmlja3MucHVzaChuZXcgU3Ryb25nZXJCcmljayh4LCB5LCBoZWFsdGgpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5icmlja3MgPSB0aGlzLmJyaWNrcy5maWx0ZXIoYnJpY2sgPT4gYnJpY2sueCAhPT0gMzY1KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5icmlja3M7XG4gIH1cblxuICBjbGVhckJyaWNrcygpIHtcbiAgICB0aGlzLmJyaWNrcyA9IFtdO1xuICAgIHJldHVybiB0aGlzLmJyaWNrcztcbiAgfVxuXG4gIGRyYXcoY29udGV4dCwgYnJpY2tzKSB7XG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGJyaWNrcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3Qge3gsIHksIHdpZHRoLCBoZWlnaHR9ID0gYnJpY2tzW2ldO1xuICAgICAgaWYgKGJyaWNrc1tpXS5oZWFsdGggPT09IDIpIHtcbiAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gJyMzNjA2MDAnXG4gICAgfSBlbHNlIGlmIChicmlja3NbaV0uaGVhbHRoID09PSAxKSB7XG4gICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICcjRkMwMDA5J1xuICAgIH1cbiAgICAgIGNvbnRleHQuZmlsbFJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XG4gICAgfVxuICB9XG59XG5cbmNsYXNzIFN0cm9uZ2VyQnJpY2sgZXh0ZW5kcyBCcmljayB7XG4gIGNvbnN0cnVjdG9yKHgsIHksIGhlYWx0aCkge1xuICAgIHN1cGVyKHgsIHkpO1xuICAgIHRoaXMuaGVhbHRoID0gaGVhbHRoO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQnJpY2s7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9saWIvYnJpY2tzLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==