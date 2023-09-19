class Guitar {
  constructor() {
    this.s = [4]; //array of 4 strings
    for (let i = 0; i < 4; i++) {
      this.s[i] = 50; //size of each is set to 50 pixels
    }
  }

  assignGuitar(x, y, r, g, b, type) {
    this.x = x; //assign x and y position
    this.y = y;
    this.r = r; //and colour values
    this.g = g;
    this.b = b;
    this.type = type; //and type
  }

  drawGuitar() {
    fill(this.r, this.g, this.b); //custom fill
    noStroke();
    rect(this.x, this.y, width / 2, height);

    fill(0);
    ellipse(this.x + 150, 400, 250, 250);

    for (let i = 0; i < 4; i++) {
      strokeWeight(3);
      stroke(181, 174, 170);
      line(this.x + (i * 55 + 75), 0, this.x + (i * 55 + 75), height);
      fill(255);
      noStroke();
      ellipse(this.x + (i * 55 + 75), 520, this.s[i], this.s[i])
      fill(0);
      textSize(15);
      text('a', this.x + 75, 520); //really is using h
      text('s', this.x + 75 + 55, 520); //really is using j
      text('d', this.x + 75 + 55 + 55, 520); //really is using k
      text('f', this.x + 75 + 55 + 55 + 55, 520); //really is using l
    }
  }

  blockade() {
    if (playerNum == 1) { //draws the vertical lines to show opposite player
      stroke(3);
      stroke(180, 220, 219); //180, 22, 219

      for (let k = 10; k < 600; k += 30) {
        if (k <= 300) {
          line(k, 0, 0, k);
        }
        if (k > 300) {
          for (let m = 10; m < 600; m += 30) {
            line(0, 300 + m, 300, m);
          }
          noStroke();
        }
      }
    }

    if (playerNum == 0) { //had to do them seperately because different sides of the screen
      stroke(3);
      stroke(180, 220, 219);
      for (let k = 310; k < 900; k += 10) {
        if (k > 600) {
          for (let m = -1000; m < 900; m += 45) {
            line(300, 600 + m, 600, m);
          }
          noStroke();
        }
      }
    }
  }

  keyPressed() {
    if (this.type === "player") { //if player presses a key


      for (let i = 0; i < ownNotes.n.length; i++) {
        for (let k = 0; k < 4; k++) {

          if (key === 'a' || key === 'A') {

            this.s[0] = 55;
            if (ownNotes.n[i].z == true) {
              if (ownNotes.n[i].x <= 1) {
                myPoints.p++;

                ownNotes.n[i].z = false;
                if ((myAccuracyBar.n + myAccuracyBar.x) < (220 + myAccuracyBar.x)) {
                  myAccuracyBar.n += 2;
                }
              }

            }
            if (ownNotes.n[i].x <= 1) {
              if (ownNotes.n[i].z == false) {
                if ((myAccuracyBar.n + myAccuracyBar.x) > (25 + myAccuracyBar.x)) {
                  myAccuracyBar.n -= 0.01;
                }
              }
            }

          }

          if (key === 's' || key === 'S') {
            this.s[1] = 55;
            if (ownNotes.n[i].z == true) {

              if (ownNotes.n[i].x <= 2) {
                myPoints.p++;


                if ((myAccuracyBar.n + myAccuracyBar.x) < 220 + myAccuracyBar.x) {
                  myAccuracyBar.n += 2;
                }
                ownNotes.n[i].z = false;

              }
            }
            if (ownNotes.n[i].x <= 2) {
              if (ownNotes.n[i].z == false) {
                if ((myAccuracyBar.n + myAccuracyBar.x) > (25 + myAccuracyBar.x)) {
                  myAccuracyBar.n -= 0.01;
                }
              }
            }
          }



          if (key === 'd' || key === 'D') {
            this.s[2] = 55;
            if (ownNotes.n[i].z == true) {

              if (ownNotes.n[i].x <= 3) {
                myPoints.p++;

                ownNotes.n[i].z = false;
                if ((myAccuracyBar.n + myAccuracyBar.x) < 220 + myAccuracyBar.x) {
                  myAccuracyBar.n += 2;
                }

              }
            }
            if (ownNotes.n[i].x <= 3) {
              if (ownNotes.n[i].z == false) {
                if ((myAccuracyBar.n + myAccuracyBar.x) > 25 + myAccuracyBar.x) {
                  myAccuracyBar.n -= 0.01;
                }
              }
            }

          }

          if (key === 'f' || key === 'F') {
            this.s[3] = 55;
            if (ownNotes.n[i].z == true) {

              if (ownNotes.n[i].x <= 4) {
                myPoints.p += 1;

                ownNotes.n[i].z = false;
                if ((myAccuracyBar.n + myAccuracyBar.x) < 220 + myAccuracyBar.x) {
                  myAccuracyBar.n += 2;
                }
              }
            }
            if (ownNotes.n[i].x <= 4) {
              if (ownNotes.n[i].z == false) {
                if ((myAccuracyBar.n + myAccuracyBar.x) > 25 + myAccuracyBar.x) {
                  myAccuracyBar.n -= 0.01;
                }
              }
            }
          }
        }
      }
      var pointData = {
        id: socket.id,
        currentPoints: myPoints.p,
      }
      socket.emit("updatePoints", pointData);
    }
  }

}
