let selectedGoal = 10;   // which option is chosen: 5, 10, or 15
let reminderOn = true;   // is the daily reminder toggle on?

function setup() {
  // TODO 1: create the canvas (use the same size as the other pages)
  createCanvas(400, 800);
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
}

function draw() {
  background(255);

  // TODO 1: draw the title "Set Your Goals"
  textSize(40);
  text("Set Your Goals", 200, 50);
  // TODO 2: draw the question text
  textSize(20);
  text("How many exercises do you\nwant to complete each day?", 200, 100);
  // TODO 3: draw the three option boxes (5, 10, 15)
  if (selectedGoal === 5) {
    fill("Blue");
  } else {
    fill(255);
  }

  rect(width / 2, 200, 250, 50, 10);
  fill(0);
  text("5 Exercises", width / 2, 200);

  if (selectedGoal === 10) {
    fill("Blue");
  } else {
    fill(255);
  }
  rect(width / 2, 260, 250, 50, 10);
  fill(0);
  text("10 Exercises", width / 2, 260);

  if (selectedGoal === 15) {
    fill("Blue");
  } else {
    fill(255);
  }
  rect(width / 2, 320, 250, 50, 10);
  fill(0);
  text("15 Exercises", width / 2, 320);
  // TODO 4: draw the Daily Reminder label and toggle
  // TODO 5: draw the Save & Continue button
}