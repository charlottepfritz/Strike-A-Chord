class Notes {

  constructor() {
  }

  assignNote(n, r, g, b, type, shift) {
    this.n = n; //assign positions
    this.type = type; //type, either player or opponent
    this.r = r; //colour
    this.g = g;
    this.b = b;
    this.s = shift; //shift for drawing
  }

  drawNote() {
    for (var i = 0; i < this.n.length; i++) {
      fill(this.r, this.g, this.b);
      var p = { x: (int(this.n[i].x)), y: this.n[i].y }
      ellipse(p.x * 55 + this.s, this.n[i].y, 50, 50);
      this.n[i].y++; //y posiiton increases, moving notes down
    }
  }

  checkDist() {
    for (let i = 0; i < this.n.length; i++) {
      for (let k = 0; k < 4; k++) {
        if (this.n[i].y > 500 && this.n[i].y < 540) {
          this.n[i].z = true; //if the note is in range, then true
        }
        else {
          this.n[i].z = false; //if the note is not in range, false
        }
      }
    }
  }
}
