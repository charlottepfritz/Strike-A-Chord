class Points {
  constructor(xpos, numPoints, type) {
    this.x = xpos; //position for drawing the points box
    this.p = numPoints; //number of points
    this.type = type; //type, either player or opponent
  }

  drawPoints() {
    fill(255);
    rect(this.x, 20, 80, 30); //draw points box
    fill(0);
    text('Points:' + ' ' + this.p, this.x + 5, 40); //draw points
  }
}

