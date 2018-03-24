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
    return this.keyState;
  }

  keyUp(e) {
    this.keyState[e.keyCode] = false;
    return this.keyState;
  }
}

module.exports = Keyboarder;
