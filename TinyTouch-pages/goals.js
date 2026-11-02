// =============================================
// Tiny Touch - Set Your Goals page (p5.js)
// Screen #4: pick how many exercises a day + daily reminder.
// Comes from: info.html (Continue)
// Goes to:    entry.html (Home screen) after Save & Continue
// =============================================

let user = {};
let choices = [5, 10, 15];
let picked = 10;
let reminderOn = true;
let knobX = 0;          // for the toggle slide animation

// ---------- Layout ----------
const CHOICE_Y = 300;
const CHOICE_GAP = 66;
const TOGGLE_Y = 530;
const BTN_Y = 600;

// ---------- Colors ----------
const BLUE = "#2D6CF0";
const BLUE_HOVER = "#4A84F5";
const LIGHT_BLUE = "#EAF2FF";
const NAVY = "#1B2A5A";
const GRAY = "#6B7489";
const FIELD_BORDER = "#E3E7EF";
const RED = "#E5484D";

function setup() {
  createCanvas(390, 760);
  textFont("Arial");
  user = loadUser();
  if (user.goal) picked = user.goal;
  if (user.reminder === false) reminderOn = false;
  knobX = reminderOn ? 1 : 0;
}

function draw() {
  cursor(ARROW);
  background(255);

  drawBackArrow();

  // ----- target icon -----
  drawTarget(width / 2, 120);

  // ----- title -----
  noStroke();
  fill(NAVY);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(28);
  text("Set Your Goals", width / 2, 200);
  textStyle(NORMAL);
  fill(GRAY);
  textSize(16);
  text("How many exercises do you want\nto complete each day?", width / 2, 245);

  // ----- choices -----
  for (let i = 0; i < choices.length; i++) {
    drawChoice(choices[i], 30, CHOICE_Y + i * CHOICE_GAP);
  }

  // ----- daily reminder toggle -----
  drawBell(48, TOGGLE_Y);
  noStroke();
  fill(NAVY);
  textSize(17);
  textAlign(LEFT, CENTER);
  text("Daily Reminder", 72, TOGGLE_Y);

  knobX = lerp(knobX, reminderOn ? 1 : 0, 0.3);
  let tx = 296;
  let hoverToggle = isOver(tx - 4, TOGGLE_Y - 18, 72, 36);
  if (hoverToggle) cursor(HAND);
  fill(lerpColor(color("#C9CFDB"), color(BLUE), knobX));
  rect(tx, TOGGLE_Y - 15, 60, 30, 15);
  fill(255);
  circle(tx + 15 + knobX * 30, TOGGLE_Y, 24);

  // ----- Save & Continue -----
  drawButton("Save & Continue", 30, BTN_Y, 330, 56);
}

function drawChoice(n, x, y) {
  let w = 330;
  let h = 52;
  let on = picked === n;
  let hover = isOver(x, y, w, h);
  if (hover) cursor(HAND);

  stroke(on ? BLUE : hover ? BLUE_HOVER : FIELD_BORDER);
  strokeWeight(on ? 2 : 1);
  fill(on ? LIGHT_BLUE : 255);
  rect(x, y, w, h, 12);

  // radio circle
  noFill();
  stroke(on ? BLUE : GRAY);
  strokeWeight(2);
  circle(x + 30, y + h / 2, 20);
  if (on) {
    noStroke();
    fill(BLUE);
    circle(x + 30, y + h / 2, 10);
  }

  noStroke();
  fill(on ? BLUE : NAVY);
  textSize(17);
  textStyle(on ? BOLD : NORMAL);
  textAlign(LEFT, CENTER);
  text(n + " exercises", x + 56, y + h / 2);
  textStyle(NORMAL);
}

// =============================================
// Clicks
// =============================================
function mousePressed() {
  if (isOver(15, 30, 40, 40)) {
    goTo("info.html");
    return;
  }

  for (let i = 0; i < choices.length; i++) {
    if (isOver(30, CHOICE_Y + i * CHOICE_GAP, 330, 52)) picked = choices[i];
  }

  if (isOver(292, TOGGLE_Y - 18, 72, 36)) reminderOn = !reminderOn;

  if (isOver(30, BTN_Y, 330, 56)) {
    user.goal = picked;
    user.reminder = reminderOn;
    saveUser(user);
    goTo("entry.html");
  }
}

// =============================================
// Drawings
// =============================================
function drawTarget(x, y) {
  noStroke();
  fill(RED);
  circle(x, y, 80);
  fill(255);
  circle(x, y, 58);
  fill(RED);
  circle(x, y, 36);
  fill(255);
  circle(x, y, 14);
  // arrow
  stroke(NAVY);
  strokeWeight(4);
  line(x, y, x + 34, y - 34);
  noStroke();
  fill(BLUE);
  triangle(x + 30, y - 40, x + 44, y - 26, x + 46, y - 46);
}

function drawBell(x, y) {
  noStroke();
  fill(GRAY);
  arc(x, y + 2, 22, 26, PI, TWO_PI);
  rect(x - 11, y + 1, 22, 6, 2);
  circle(x, y + 10, 6);
}

function drawBackArrow() {
  let hover = isOver(15, 30, 40, 40);
  if (hover) cursor(HAND);
  stroke(hover ? BLUE_HOVER : NAVY);
  strokeWeight(3);
  noFill();
  line(36, 40, 26, 50);
  line(26, 50, 36, 60);
}

function drawButton(label, x, y, w, h) {
  let hover = isOver(x, y, w, h);
  let offset = hover && mouseIsPressed ? 2 : 0;
  if (hover) cursor(HAND);

  noStroke();
  fill(0, 30);
  rect(x, y + 4, w, h, 14);
  fill(hover ? BLUE_HOVER : BLUE);
  rect(x, y + offset, w, h, 14);

  fill(255);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(21);
  text(label, x + w / 2, y + h / 2 + offset);
  textStyle(NORMAL);
}

function isOver(x, y, w, h) {
  return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
}

// ---------- go to another page ----------
function goTo(page) {
  window.location.href = page;
}

// ---------- saved user info (shared by all pages) ----------
function loadUser() {
  try {
    return JSON.parse(localStorage.getItem("tinyTouchUser")) || {};
  } catch (e) {
    return {};
  }
}

function saveUser(u) {
  try {
    localStorage.setItem("tinyTouchUser", JSON.stringify(u));
  } catch (e) {}
}
