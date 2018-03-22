class Keyboarder {
  constructor() {
    this.keys = {
      left: 37,
      right: 39,
    };
  }
  keyDown(e) {
    var keyState = {};
    keyState[e.keyCode] = true;
    return keyState;
  }

  keyUp(e) {
    var keyState = {};
    keyState[e.keyCode] = false;
    return keyState;
  }
}

module.exports = Keyboarder;
