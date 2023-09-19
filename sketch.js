var socket;
let state = 0;
var x = 0;

var playerNum;
var numberOfPlayers = 0;

var waiting = false;
var gameOver = false;

var myGuitar;
var oppGuitar;

var myCurrPoints;

let ready = -1;

var arrayofnotes = [];
var arrayofnotes2 = [];

let track;
let introMusic;

function preload() {
  introMusic = loadSound('song.mp3'); //import sound
}

function setup() {
  track = loadSound('track.mp3'); //import sound
  createCanvas(600, 600);
  introMusic.play();

  ownNotes = new Notes();
  notownNotes = new Notes();

  myAccuracyBar = new AccuracyBar();
  oppAccuracyBar = new AccuracyBar();

  myGuitar = new Guitar();
  oppGuitar = new Guitar();

  socket = io.connect('http://192.168.2.141:3400');

  //---------------------------------------refresh the positions of the grid of notes
  socket.on('refreshGrid', (grid) => {
    for (var i = 0; i < grid.length; i++) {
      arrayofnotes[i] = grid[i];
    }
  });

  socket.on('refreshGrid2', (grid2) => {
    for (var i = 0; i < grid2.length; i++) {
      arrayofnotes2[i] = grid2[i];
    }
  });

  socket.on('refreshnp', (players) => {
    numberOfPlayers = players.length; //refreshes number of players to determine waiting room
  });

  socket.on('waiting', setWaiting);
  socket.on('ready', setReady);
  socket.on('updatePointsAtLast', updateThePoints);
}

function updateThePoints(pointData) {
  oppPoints.p = pointData.currentPoints; //oppisite points equals the current points passed in within the guitar class (.pppp)
}

function setWaiting(data) { //set the waiting rom
  numberOfPlayers = data.imp; //store a copy of the number of players for the waiting room
  playerNum = data.playerNum;
  oppNum = data.oppNum;
}

function setReady(data) {
  playerNum = data.playerNum; //assign player numbers
  oppNum = data.oppNum;

  if (playerNum == 0) {
    myGuitar.assignGuitar(0, 0, 246, 203, 91, "player");
    oppGuitar.assignGuitar(width / 2, 0, 213, 222, 247, "opponent");

    myPoints = new Points(50, 0, "player");
    oppPoints = new Points(350, 0, "opponent");

    myAccuracyBar = new AccuracyBar(0, 130, "player");
    oppAccuracyBar = new AccuracyBar(320, 130, "opponent");

    ownNotes.assignNote(arrayofnotes, 238, 148, 66, "player", 75);
    notownNotes.assignNote(arrayofnotes2, 238, 148, 66, "opponent", 375);
  }

  if (playerNum == 1) {
    myGuitar.assignGuitar(width / 2, 0, 213, 222, 247, "player");
    oppGuitar.assignGuitar(0, 0, 246, 203, 91, "opponent");

    myPoints = new Points(350, 0, "player");
    oppPoints = new Points(50, 0, "opponent");

    myAccuracyBar = new AccuracyBar(320, 130, "player");
    oppAccuracyBar = new AccuracyBar(0, 130, "opponent");

    ownNotes.assignNote(arrayofnotes2, 238, 148, 66, "player", 375);
    notownNotes.assignNote(arrayofnotes, 238, 148, 66, "opponent", 75);
  }

  introMusic.stop();
  track.play(); //start music
  state = 1; //move to acitve play
}

function draw() {
  background(255);
  checkState();
  checkGame();
  reachedtheend();


  if (playerNum == 1 && state == 0) { //so waiting screen only appears for player that is waiting
    drawWaitingScreen();
  }
}

function checkGame() {
  if (state == 1) { //if in active play
    for (let i = 0; i < arrayofnotes.length; i++) {
      if (arrayofnotes[i].y > 590) { //and the note has moved off screen
        arrayofnotes.splice(i, 1); //remove it from the array
      }
    }
    for (let i = 0; i < arrayofnotes2.length; i++) { //if in active play
      if (arrayofnotes2[i].y > 590) {//and the second array of notes has moved offscreen
        arrayofnotes2.splice(i, 1); //remove the note from the array
      }
    }
  }
}

function reachedtheend() {
  if (state == 1) { //if in active play
    if (arrayofnotes.length < 1 && arrayofnotes2.length < 1) { //and all the notes have been removed
      introMusic.play();

      state = 9; //the game ends
    }
  }
}


function checkState() {
  if (state == 0) {
    drawMenu();
  }
  if (state == 1) {
    activePlay();
    myAccuracyBar.drawBar();
  }
  if (state == 9) {
    drawGameOverScreen();
  }
  if (state == 7) {
    drawInstructions();
  }
}

function drawGameOverScreen() {
  track.stop(); //stop music if it hasn't stopped already
  //------------------------draw sunset background
  background(182, 89, 61);
  noStroke();
  fill(248, 207, 95);
  triangle(150, 0, 300, 500, 450, 0);
  fill(238, 147, 66);
  triangle(0, 150, 300, 400, 0, 400);
  triangle(600, 150, 300, 400, 600, 400);
  fill(253, 244, 238);
  ellipse(300, 400, 400, 400);
  fill(52, 49, 79);
  rect(0, 505, width, 100);
  fill(245, 243, 245);
  rect(0, 400, width, 250);
  //---------------------draw text
  textSize(25);
  fill(52, 49, 79)
  text('Final Score:', 10, 450);
  textSize(20);
  if (myPoints.type == 'player') { //-------if the points are the players,
    text('You:' + ' ' + myPoints.p, 10, 498); //then their screen shows their points
    text('Opponent:' + ' ' + oppPoints.p, 10, 546); //and their opponents
  }
  //---more text
  textSize(50);
  fill(238, 147, 66);
  text('Game Over!', 160, 350);
}


function activePlay() { //------------state one
  //------------draw both guitars
  myGuitar.drawGuitar();
  oppGuitar.drawGuitar();
  //---------------draw both sets of notes
  ownNotes.drawNote();
  notownNotes.drawNote();
  oppGuitar.blockade(); //and block out the oppisite guitar, placed here so notes draw underneath
  //----------------
  ownNotes.checkDist(); //see if a note is in range
  //------------------draw both sets of points
  myPoints.drawPoints();
  oppPoints.drawPoints();
}

function drawWaitingScreen() {
  //-------------------------------draw sunset for menu--------------
  background(182, 89, 61);
  noStroke();
  fill(248, 207, 95);
  triangle(150, 0, 300, 500, 450, 0);
  fill(238, 147, 66);
  triangle(0, 150, 300, 400, 0, 400);
  triangle(600, 150, 300, 400, 600, 400);
  fill(253, 244, 238);
  ellipse(300, 400, 400, 400);
  fill(52, 49, 79);
  rect(0, 505, width, 100);
  fill(116, 147, 200);
  rect(0, 475, width, 50);
  fill(160, 180, 232);
  rect(0, 425, width, 50);
  fill(245, 243, 245);
  rect(0, 400, width, 25);
  fill(52, 49, 79);
  //-------------------------------draw colour-changing text--------------
  textSize(30);
  x++; //colour gradually increases
  fill(x);
  if (x >= 255) { //but if it reaches pure white, reset to black
    x = 0;
  }
  text('Waiting for second player...', 5, 460);
  //-------------------------------draw guitar strings--------------
  for (let i = 0; i < 4; i++) {
    strokeWeight(5);
    stroke(181, 174, 170);
    line(i * 55 + 205, 0, i * 55 + 205, height);
  }
}

function drawMenu() {
  background(182, 89, 61);
  //-------------------------------draw sunset------------------------------------
  noStroke();
  fill(248, 207, 95);
  triangle(150, 0, 300, 500, 450, 0);
  fill(238, 147, 66);
  triangle(0, 150, 300, 400, 0, 400);
  triangle(600, 150, 300, 400, 600, 400);
  fill(253, 244, 238);
  ellipse(300, 400, 400, 400);
  fill(52, 49, 79);
  rect(0, 505, width, 100);
  fill(116, 147, 200);
  rect(0, 475, width, 50);
  fill(160, 180, 232);
  rect(0, 425, width, 50);
  fill(245, 243, 245);
  rect(0, 400, width, 25);
  fill(52, 49, 79);
  //-------------------------------text options for menu--------------
  textSize(30);
  text('Strike a Chord', 5, 460);
  textSize(20);
  fill(253, 244, 238);
  text('Click Here to Play >', 5, 510);
  fill(255);
  textSize(15);
  text('Click Here for Instructions >', 5, 560);
  //-------------------------------show number of people in the waiting room--------------
  if (numberOfPlayers == 0) { //if there are no players
    var playleng = 'no'; //convert 0 players to string
    text(playleng + ' ' + 'players in waiting room!', 400, 560);
  }
  else if (numberOfPlayers != 0 && playerNum != 1 && playerNum == null) {//if there is at least one player
    text(numberOfPlayers + ' ' + 'player in waiting room!', 400, 560);
  }
  //-------------------------------draw guitar strings--------------
  for (let i = 0; i < 4; i++) {
    strokeWeight(5);
    stroke(181, 174, 170);
    line(i * 55 + 205, 0, i * 55 + 205, height);
  }
}

function drawInstructions() {
  //----------------------------draw sunset background
  background(182, 89, 61);
  noStroke();
  fill(248, 207, 95);
  triangle(150, 0, 300, 500, 450, 0);
  fill(238, 147, 66);
  triangle(0, 150, 300, 400, 0, 400);
  triangle(600, 150, 300, 400, 600, 400);
  //----------------------------draw guitar strings
  for (let i = 0; i < 4; i++) {
    strokeWeight(5);
    stroke(181, 174, 170);
    line(i * 55 + 205, 0, i * 55 + 205, height);
  }
  //----------------------------draw sunset background cont'd
  noStroke();
  fill(253, 244, 238);
  ellipse(300, 400, 400, 400);
  fill(52, 49, 79);
  rect(0, 505, width, 100);
  fill(245, 243, 245);
  rect(0, 400, width, 250);
  //---------------------------draw text instructions
  textSize(16);
  fill(52, 49, 79)
  text(' - Hit the corresponding key when a note is in range to earn points.', 10, 450);
  text(' - You can see your points and your partners screen in real time.', 10, 478);
  text(' - If your accuracy drops to weak, its game over!', 10, 506);
  text(' - Otherwise the game ends when all the notes have played.', 10, 534);
  textSize(10);
  text('Press any key to go back.', 400, 580);
  textSize(50);
  fill(238, 147, 66);
  text('Instructions', 160, 350);
}


//--------------------------------event-driven functions---------------------------------
function keyPressed() {

  myGuitar.keyPressed();
  oppGuitar.keyPressed();



}

function keyReleased() {
  if (state != 7) { //if not in the instruction state
    for (let i = 0; i < 4; i++) {
      myGuitar.s[i] = 50; //then resize both guitar string pegs, so it doesn't appear that they are being pressed
      oppGuitar.s[i] = 50;
    }

  } else {
    state = 0; //otherwise, if in the instruction state, return to menu
  }
}


function mousePressed() {
  if (state == 0) {
    if (mouseX > 0 && mouseX < 210 && mouseY > 480 && mouseY < 530) { //if clicked overtop of play button
      socket.emit('join'); //add player
    }

    if (mouseX > 0 && mouseX < 210 && mouseY > 535 && mouseY < 590) {//if instruction button is clicked

      state = 7; //enter instruction state
    }
  }
}
