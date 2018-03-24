class Keyboarder {
  constructor() {
    this.keys = {
      left: 37,
      right: 39,
    };
    this.keyState = {};
  }
  keyDown(e) {
    this.keyState[e.keyCode] = true;
    return keyState;
  }

  keyUp(e) {
    this.keyState[e.keyCode] = false;
    return keyState;
  }
}

module.exports = Keyboarder;
