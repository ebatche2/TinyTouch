// =============================================
// Tiny Touch - Select Trace the Path page (p5.js)
// Screen #8: pick a difficulty, then tap Start.
// Comes from: entry.html (Trace the Path card)
// Goes to:    entry.html (back arrow)
//             Start -> the Instructions page (#9) once it exists
// =============================================

let user = {};
let levels = [
  { name: "Easy",   color: "#7DD87A", dark: "#2EAD5B", stars: 1 },
  { name: "Medium", color: "#FFE07A", dark: "#D9A400", stars: 2 },
  { name: "Hard",   color: "#FFB27A", dark: "#E07020", stars: 3 },
  { name: "Expert", color: "#FF8A8A", dark: "#E5484D", stars: 4 }
];
let picked = 0;      // which level is chosen (0 = Easy)
let pathT = 0;       // moves the little dot along the preview path

// toast message at the bottom
let toastMsg = "";
let toastTimer = 0;

// ---------- Layout ----------
const LEVEL_Y = 392;
const LEVEL_GAP = 58;
const BTN_Y = 640;

// ---------- Colors ----------
const BLUE = "#2D6CF0";
const BLUE_HOVER = "#4A84F5";
const NAVY = "#1B2A5A";
const GRAY = "#5E6A82";
const BG = "#F5F8FE";
const GOLD = "#FFC83D";

function setup() {
  createCanvas(390, 760);
  textFont("Arial");
  user = loadUser();
  if (user.traceLevel !== undefined) picked = user.traceLevel;
}

function draw() {
  cursor(ARROW);
  background(BG);

  drawBackArrow();

  noStroke();
  fill(NAVY);
  textStyle(BOLD);
  textSize(24);
  textAlign(CENTER, CENTER);
  text("Trace the Path", width / 2, 50);
  textStyle(NORMAL);

  // ----- preview card with a dotted path and a star -----
  fill(255);
  stroke("#E3E8F1");
  strokeWeight(1);
  rect(30, 90, 330, 180, 18);
  drawPreviewPath();

  // ----- title + how to play -----
  noStroke();
  fill(NAVY);
  textStyle(BOLD);
  textSize(22);
  text("Trace the Path", width / 2, 305);
  textStyle(NORMAL);
  fill(GRAY);
  textSize(15);
  text("Follow the line with your finger.", width / 2, 333);

  fill(NAVY);
  textSize(14);
  textStyle(BOLD);
  textAlign(LEFT, CENTER);
  text("Choose a level:", 34, 366);
  textStyle(NORMAL);

  // ----- difficulty buttons -----
  for (let i = 0; i < levels.length; i++) {
    drawLevel(i, 30, LEVEL_Y + i * LEVEL_GAP);
  }

  drawButton("Start", 30, BTN_Y, 330, 56);
  drawToast();
}

function drawPreviewPath() {
  // dashed wavy line
  stroke(NAVY);
  strokeWeight(4);
  for (let x = 60; x < 300; x += 14) {
    line(x, pathY(x), x + 7, pathY(x + 7));
  }
  drawStar(318, 130, 22, 10, GOLD);

  // a blue dot slides along the path to show what to do
  pathT = (pathT + 0.006) % 1;
  let dx = lerp(60, 300, pathT);
  noStroke();
  fill(BLUE);
  circle(dx, pathY(dx), 22);
  fill(255, 120);
  circle(dx - 3, pathY(dx) - 3, 7);
}

function pathY(x) {
  return 195 - 40 * sin((x - 60) * 0.022) - (x - 60) * 0.18;
}

function drawLevel(i, x, y) {
  let lv = levels[i];
  let w = 330;
  let h = 48;
  let on = picked === i;
  let hover = isOver(x, y, w, h);
  if (hover) cursor(HAND);

  noStroke();
  fill(0, 20);
  rect(x, y + 3, w, h, 24);
  fill(lv.color);
  rect(x, y, w, h, 24);
  if (on) {
    stroke(NAVY);
    strokeWeight(3);
    noFill();
    rect(x, y, w, h, 24);
  }

  // stars on the left show how hard it is
  for (let s = 0; s < lv.stars; s++) {
    drawStar(x + 26 + s * 20, y + h / 2, 9, 4, on ? "#FFFFFF" : lv.dark);
  }

  noStroke();
  fill(NAVY);
  textSize(18);
  textStyle(on ? BOLD : NORMAL);
  textAlign(CENTER, CENTER);
  text(lv.name, x + w / 2, y + h / 2);
  textStyle(NORMAL);

  // check mark on the chosen one
  if (on) {
    stroke(NAVY);
    strokeWeight(3);
    line(x + w - 38, y + h / 2, x + w - 32, y + h / 2 + 6);
    line(x + w - 32, y + h / 2 + 6, x + w - 22, y + h / 2 - 6);
  }
}

// =============================================
// Clicks
// =============================================
function mousePressed() {
  if (isOver(15, 30, 40, 40)) {
    goTo("entry.html");
    return;
  }

  for (let i = 0; i < levels.length; i++) {
    if (isOver(30, LEVEL_Y + i * LEVEL_GAP, 330, 48)) {
      picked = i;
      user.traceLevel = i;
      saveUser(user);
    }
  }

  if (isOver(30, BTN_Y, 330, 56)) {
    user.traceLevel = picked;
    saveUser(user);
    // TODO: when the Instructions page (#9) is built, replace the line below with:
    // goTo("trace-instructions.html");
    showToast("Starting " + levels[picked].name + "... (Instructions page coming next)");
  }
}

// =============================================
// Helpers
// =============================================
function drawStar(x, y, r1, r2, col) {
  push();
  translate(x, y);
  noStroke();
  fill(col);
  beginShape();
  for (let i = 0; i < 10; i++) {
    let a = -HALF_PI + i * PI / 5;
    let r = i % 2 === 0 ? r1 : r2;
    vertex(cos(a) * r, sin(a) * r);
  }
  endShape(CLOSE);
  pop();
}

function showToast(m) {
  toastMsg = m;
  toastTimer = 150;
}

function drawToast() {
  if (toastTimer <= 0) return;
  toastTimer--;
  let a = min(255, toastTimer * 12);
  textSize(14);
  textStyle(BOLD);
  let w = min(textWidth(toastMsg) + 40, 370);
  noStroke();
  fill(27, 42, 90, a);
  rect(width / 2 - w / 2, 712, w, 36, 18);
  fill(255, a);
  textAlign(CENTER, CENTER);
  text(toastMsg, width / 2, 730);
  textStyle(NORMAL);
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
