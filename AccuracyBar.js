class AccuracyBar {

    constructor(x, n, type) {
        this.x = x;
        this.n = n;
        this.type = type;
        
    }

    drawBar() {
        noStroke();
        fill(227, 203, 150);
        rect(80 + this.x - 75, 80, 240, 90);
        fill(50, 51, 81);
        rect(25 + this.x, 100, 200, 30);
        fill(248, 253, 253);
        rect(25 + this.x, 100, 150, 30);
        fill(240, 158, 68);
        rect(25 + this.x, 100, 100, 30);
        fill(166, 75, 52);
        rect(25 + this.x, 100, 50, 30);
        fill(0);
        text('ACCURACY', 95 + this.x, 150);
        fill(255);
        text('Weak', 35 + this.x, 120);
        text('Okay', 85 + this.x, 120);
        fill(0);
        text('Good', 135 + this.x, 120);
        fill(255);
        text('Great!', 180 + this.x, 120);

        stroke(255, 0, 0);
        strokeWeight(5);
        line(this.n + this.x, 98, this.n + this.x, 132);

        if (this.n < 30) {
            introMusic.play();
            state = 9;
        }
    }
}
