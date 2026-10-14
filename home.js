let screen = "home";   // which screen we're on

function setup() {
  createCanvas(600, 400);
  textAlign(CENTER, CENTER);
}

function draw() {
  background(30);

  if (screen === "home") {
    drawHome();
  } else if (screen === "game") {
    drawGame();
  }
}

function drawHome() {
  // Title
  fill(255);
  textSize(40);
  text("Tiny Touch", width / 2, 100);

  // Start button (a rectangle + label)
  // TODO: draw a rectangle centered at (width/2, 250), about 200 wide and 60 tall
  // TODO: draw the text "Start" on top of it
}

function drawGame() {
  fill(255);
  textSize(24);
  text("Game goes here", width / 2, height / 2);
}

function mousePressed() {
  // TODO: if we're on the home screen AND the mouse is inside the button,
  // change screen to "game"
}