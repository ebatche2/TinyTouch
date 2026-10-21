// =============================================
// Tiny Touch - Home Screen (p5.js)
// =============================================

// ---------- User info (change these later) ----------
let userName = "Jay";
let streak = 10;
let exercises = 28;

// ---------- Things you can tap ----------
let items = [];
let pressedItem = null;

// ---------- Feedback message (toast) ----------
let toastMsg = "";
let toastTimer = 0;

// ---------- Colors (match screen #5) ----------
const BLUE = "#2D6CF0";
const NAVY = "#1B2A5A";
const GRAY = "#5E6A82";
const BG = "#F5F8FE";
const BORDER = "#E3E8F1";
const LIGHT_BLUE = "#D7EAFB";
const YELLOW = "#FFF0B3";
const GOLD = "#FFC83D";
const ORANGE = "#FF6A1A";
const RED_CAR = "#E53935";
const PINK = "#E36BD6";
const BEAR = "#A0612E";
const BEAR_LIGHT = "#E8C29E";

function setup() {
  createCanvas(390, 760);
  textFont("Arial");

  items = [
    // top
    { id: "avatar",    x: 22,  y: 85,  w: 76,  h: 76,
      msg: "👤 Opening your Profile..." },
    { id: "gear",      x: 310, y: 100, w: 50,  h: 50,
      msg: "⚙️ Opening Settings..." },

    // stats
    { id: "streak",    x: 20,  y: 175, w: 170, h: 72,
      msg: "🔥 " + streak + " days in a row! Keep it going, " + userName + "!" },
    { id: "exercises", x: 200, y: 175, w: 170, h: 72,
      msg: "⭐ You've finished " + exercises + " exercises. Awesome!" },

    // games
    { id: "brush", x: 20,  y: 265, w: 170, h: 170, color: LIGHT_BLUE,
      label: "Brush\nthe Teeth", msg: "🦷 Starting Brush the Teeth!" },
    { id: "trace", x: 200, y: 265, w: 170, h: 170, color: YELLOW,
      label: "Trace\nthe Path", msg: "✏️ Starting Trace the Path!" },
    { id: "drag",  x: 20,  y: 445, w: 170, h: 170, color: YELLOW,
      label: "Drag\nShapes", msg: "🔷 Starting Drag Shapes!" },
    { id: "car",   x: 200, y: 445, w: 170, h: 170, color: LIGHT_BLUE,
      label: "Car\nObstacles", msg: "🚗 Starting Car Obstacles!" },

    // bottom buttons
    { id: "profile",  x: 20,  y: 635, w: 170, h: 56,
      msg: "👤 Opening your Profile..." },
    { id: "settings", x: 200, y: 635, w: 170, h: 56,
      msg: "⚙️ Opening Settings..." }
  ];

  for (let it of items) it.s = 1;   // s = size for the bounce animation
}

function draw() {
  background(BG);
  cursor(ARROW);

  // ----- logo -----
  drawLogoHands(130, 45, 0.6);
  noStroke();
  fill(BLUE);
  textStyle(BOLD);
  textSize(27);
  textAlign(LEFT, CENTER);
  text("Tiny Touch", 164, 47);

  // ----- "Hi Jay!" -----
  fill(NAVY);
  textSize(30);
  text("Hi " + userName + "!", 112, 124);
  textStyle(NORMAL);

  // ----- all tappable things -----
  for (let it of items) {
    let over = isOver(it);
    if (over) cursor(HAND);

    // hover = grow a little, press = shrink
    let target = 1;
    if (over) target = 1.03;
    if (pressedItem === it && over) target = 0.94;
    it.s = lerp(it.s, target, 0.25);

    drawItem(it);
  }

  drawToast();
}

// =============================================
// Draw each item
// =============================================
function drawItem(it) {
  push();
  translate(it.x + it.w / 2, it.y + it.h / 2);
  scale(it.s);

  if (it.id === "avatar") {
    noStroke();
    fill(LIGHT_BLUE);
    circle(0, 0, 76);
    drawBear(0, 4, 0.95);
  }

  else if (it.id === "gear") {
    drawGear(0, 0, 14, BLUE, BG);
  }

  else if (it.id === "streak") {
    card(it.w, it.h, "#FFFFFF", 16);
    drawFire(-55, 0);
    noStroke();
    fill(NAVY);
    textAlign(LEFT, CENTER);
    textStyle(BOLD);
    textSize(22);
    text(streak + " days", -32, -9);
    textStyle(NORMAL);
    fill(GRAY);
    textSize(14);
    text("streak", -20, 14);
  }

  else if (it.id === "exercises") {
    card(it.w, it.h, "#FFFFFF", 16);
    drawStar(-52, 0, 20, 9, GOLD);
    noStroke();
    fill(NAVY);
    textAlign(LEFT, CENTER);
    textStyle(BOLD);
    textSize(24);
    text(exercises, -28, -9);
    textStyle(NORMAL);
    fill(GRAY);
    textSize(14);
    text("exercises", -28, 14);
  }

  else if (it.label) {           // the 4 game cards
    card(it.w, it.h, it.color, 18);

    if (it.id === "brush") drawTooth(0, -28);
    if (it.id === "trace") drawTraceIcon(0, -28);
    if (it.id === "drag")  drawShapesIcon(0, -28);
    if (it.id === "car")   drawCar(0, -28);

    noStroke();
    fill(NAVY);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(19);
    textLeading(22);
    text(it.label, 0, 46);
    textStyle(NORMAL);
  }

  else if (it.id === "profile") {
    card(it.w, it.h, "#FFFFFF", 16);
    drawPersonIcon(-45, 0, 14);
    noStroke();
    fill(NAVY);
    textAlign(LEFT, CENTER);
    textSize(19);
    text("Profile", -22, 1);
  }

  else if (it.id === "settings") {
    card(it.w, it.h, "#FFFFFF", 16);
    drawGear(-45, 0, 11, BLUE, "#FFFFFF");
    noStroke();
    fill(NAVY);
    textAlign(LEFT, CENTER);
    textSize(19);
    text("Settings", -22, 1);
  }

  pop();
}

// rounded card with a soft shadow
function card(w, h, col, r) {
  noStroke();
  fill(0, 18);
  rect(-w / 2, -h / 2 + 4, w, h, r);
  fill(col);
  stroke(col === "#FFFFFF" ? BORDER : col);
  strokeWeight(1);
  rect(-w / 2, -h / 2, w, h, r);
}

// =============================================
// Feedback when tapping
// =============================================
function mousePressed() {
  pressedItem = null;
  for (let it of items) {
    if (isOver(it)) pressedItem = it;
  }
}

function mouseReleased() {
  if (pressedItem && isOver(pressedItem)) {
    pressedItem.s = 1.12;          // little "pop" bounce
    showToast(pressedItem.msg);    // message at the bottom
  }
  pressedItem = null;
}

function showToast(m) {
  toastMsg = m;
  toastTimer = 150;   // about 2.5 seconds
}

function drawToast() {
  if (toastTimer <= 0) return;
  toastTimer--;

  let a = min(255, toastTimer * 12);                       // fade out
  let slide = toastTimer > 140 ? (toastTimer - 140) * 3 : 0; // slide in

  textSize(15);
  textStyle(BOLD);
  let w = min(textWidth(toastMsg) + 40, 360);

  noStroke();
  fill(27, 42, 90, a);
  rect(width / 2 - w / 2, 705 + slide, w, 40, 20);
  fill(255, a);
  textAlign(CENTER, CENTER);
  text(toastMsg, width / 2, 725 + slide);
  textStyle(NORMAL);
}

function isOver(it) {
  return mouseX > it.x && mouseX < it.x + it.w &&
         mouseY > it.y && mouseY < it.y + it.h;
}

// =============================================
// Icons
// =============================================
function drawBear(x, y, s) {
  push();
  translate(x, y);
  scale(s);
  noStroke();
  fill(BEAR);
  circle(-22, -22, 22);
  circle(22, -22, 22);
  fill(BEAR_LIGHT);
  circle(-22, -22, 11);
  circle(22, -22, 11);
  fill(BEAR);
  circle(0, 0, 58);
  fill(BEAR_LIGHT);
  ellipse(0, 11, 30, 22);
  fill(30);
  circle(-11, -6, 7);
  circle(11, -6, 7);
  ellipse(0, 5, 10, 7);
  stroke(30);
  strokeWeight(2);
  noFill();
  arc(-3, 11, 6, 6, 0, PI);
  arc(3, 11, 6, 6, 0, PI);
  pop();
}

function drawFire(x, y) {
  push();
  translate(x, y);
  noStroke();
  fill(ORANGE);
  ellipse(0, 6, 28, 26);
  triangle(-13, 3, 13, 3, 3, -20);
  fill(GOLD);
  ellipse(0, 10, 13, 13);
  triangle(-6, 8, 6, 8, 1, -4);
  pop();
}

function drawStar(x, y, r1, r2, col) {
  noStroke();
  fill(col);
  beginShape();
  for (let i = 0; i < 10; i++) {
    let a = -HALF_PI + i * PI / 5;
    let r = i % 2 === 0 ? r1 : r2;
    vertex(x + cos(a) * r, y + sin(a) * r);
  }
  endShape(CLOSE);
}

function drawGear(x, y, r, col, holeCol) {
  push();
  translate(x, y);
  noStroke();
  fill(col);
  for (let i = 0; i < 8; i++) {
    push();
    rotate(i * PI / 4);
    rect(-r * 0.25, -r * 1.3, r * 0.5, r * 0.6, 2);
    pop();
  }
  circle(0, 0, r * 2);
  fill(holeCol);
  circle(0, 0, r * 0.8);
  pop();
}

function drawPersonIcon(x, y, r) {
  noStroke();
  fill(BLUE);
  circle(x, y, r * 2);
  fill(255);
  circle(x, y - r * 0.25, r * 0.7);
  arc(x, y + r * 0.7, r * 1.3, r * 0.9, PI, TWO_PI);
}

function drawTooth(x, y) {
  push();
  translate(x, y);
  noStroke();
  fill(255);
  rect(-26, -28, 52, 36, 18);
  rect(-24, 0, 18, 30, 9);
  rect(6, 0, 18, 30, 9);
  fill(NAVY);
  circle(-9, -10, 6);
  circle(9, -10, 6);
  noFill();
  stroke(NAVY);
  strokeWeight(2);
  arc(0, -4, 12, 8, 0, PI);
  noStroke();
  fill(255, 150, 170);
  ellipse(-17, -3, 8, 5);
  ellipse(17, -3, 8, 5);
  pop();
}

function drawTraceIcon(x, y) {
  push();
  translate(x, y);
  stroke(NAVY);
  strokeWeight(3);
  let wave = (px) => 10 * sin((px + 45) * 0.09) + 8;
  for (let t = 0; t < 1; t += 0.08) {
    let x1 = lerp(-45, 28, t);
    let x2 = lerp(-45, 28, t + 0.04);
    line(x1, wave(x1), x2, wave(x2));
  }
  pop();
  drawStar(x + 38, y - 20, 18, 8, GOLD);
}

function drawShapesIcon(x, y) {
  push();
  translate(x, y);
  noStroke();
  fill(BLUE);
  circle(-24, 10, 36);
  fill(PINK);
  rect(-2, -30, 38, 38, 4);
  fill(GOLD);
  triangle(-44, -10, -30, -34, -16, -10);
  pop();
}

function drawCar(x, y) {
  push();
  translate(x, y);
  noStroke();
  fill(RED_CAR);
  rect(-24, -26, 46, 24, 10);
  rect(-42, -8, 84, 24, 10);
  fill("#BFE3FF");
  rect(-18, -21, 17, 14, 4);
  rect(3, -21, 14, 14, 4);
  fill("#FFD54F");
  circle(37, 2, 7);
  fill(40);
  circle(-22, 17, 20);
  circle(22, 17, 20);
  fill(180);
  circle(-22, 17, 8);
  circle(22, 17, 8);
  pop();
}

// blue + peach hands (logo)
function drawLogoHands(x, y, s) {
  drawHand(x - 18 * s, y, s, BLUE, -0.25);
  drawHand(x + 18 * s, y, s, "#F5B08A", 0.25);
}

function drawHand(x, y, s, col, angle) {
  push();
  translate(x, y);
  rotate(angle);
  scale(s);
  noStroke();
  fill(col);
  ellipse(0, 10, 34, 32);
  for (let i = 0; i < 4; i++) {
    rect(-15 + i * 9, -22, 8, 30, 4);
  }
  push();
  translate(-17, 10);
  rotate(-0.8);
  rect(-4, -16, 8, 20, 4);
  pop();
  pop();
}