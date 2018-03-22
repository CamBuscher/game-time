class Ball {
  constructor(x, y, dx, dy) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = 5;
    this.width = this.radius * 2;
    this.height = this.radius * 2;
  }
  draw(context) {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.stroke();
    context.fillStyle = "#000";
    context.fill();
  }
  move(canvasHeight, canvasWidth) {
    if ((this.x + this.radius) >= canvasWidth || (this.x - this.radius) <= 0) {
      this.dx = -this.dx;
    }
    if ((this.y - this.radius) <= 0) {
      this.dy = -this.dy;
    }
    this.y += this.dy;
    this.x += this.dx;
  }
}

module.exports = Ball;
