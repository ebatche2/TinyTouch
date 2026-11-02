// =============================================
// Tiny Touch - Edit Password page (p5.js)
// Screen #6: change the password from Settings.
// Comes from: entry.html (Settings / gear button)
// Goes to:    entry.html (back arrow, or after the password is updated)
// Note: passwords are never saved anywhere. A real app would send
//       them to a secure server, not keep them in the browser.
// =============================================

let cnv;
let fields = [];
let errorMsg = "";
let successMsg = "";
let leaveTimer = 0;     // counts down after success, then goes Home

// ---------- Layout ----------
const FIELD_START = 110;
const FIELD_GAP = 66;
const BOX_Y = 320;
const BTN_Y = 520;

// ---------- Colors ----------
const BLUE = "#2D6CF0";
const BLUE_HOVER = "#4A84F5";
const LIGHT_BLUE = "#F3F7FF";
const NAVY = "#1B2A5A";
const GRAY = "#6B7489";
const FIELD_BORDER = "#E3E7EF";
const RED = "#E5484D";
const GREEN = "#2EAD5B";

// the rules shown in the "Password Requirements" box
const RULES = [
  { text: "At least 8 characters",           test: (p) => p.length >= 8 },
  { text: "Include an uppercase letter (A-Z)", test: (p) => /[A-Z]/.test(p) },
  { text: "Include a lowercase letter (a-z)",  test: (p) => /[a-z]/.test(p) },
  { text: "Include a number (0-9)",            test: (p) => /[0-9]/.test(p) }
];

function setup() {
  cnv = createCanvas(390, 760);
  textFont("Arial");

  let names = ["Current Password", "New Password", "Confirm New Password"];
  let y = FIELD_START;
  for (let n of names) {
    let inp = createInput("");
    inp.attribute("placeholder", n);
    inp.elt.type = "password";
    styleInput(inp, 220);
    inp.input(() => {
      errorMsg = "";
      successMsg = "";
    });
    fields.push({ name: n, input: inp, x: 30, y: y, w: 330, h: 48 });
    y += FIELD_GAP;
  }
  placeInputs();
}

function draw() {
  cursor(ARROW);
  background(255);

  drawBackArrow();

  noStroke();
  fill(NAVY);
  textStyle(BOLD);
  textSize(24);
  textAlign(CENTER, CENTER);
  text("Edit Password", width / 2, 50);
  textStyle(NORMAL);

  for (let f of fields) drawField(f);

  drawRequirements();

  drawButton("Update Password", 30, BTN_Y, 330, 56);

  noStroke();
  textSize(14);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  if (errorMsg !== "") {
    fill(RED);
    text(errorMsg, width / 2, BTN_Y + 80);
  } else if (successMsg !== "") {
    fill(GREEN);
    text(successMsg, width / 2, BTN_Y + 80);
  }
  textStyle(NORMAL);

  // after a success, wait about 1.5 seconds, then go back Home
  if (leaveTimer > 0) {
    leaveTimer--;
    if (leaveTimer === 0) goTo("entry.html");
  }
}

function drawField(f) {
  let focused = document.activeElement === f.input.elt;
  stroke(focused ? BLUE : FIELD_BORDER);
  strokeWeight(focused ? 2 : 1);
  fill(255);
  rect(f.x, f.y, f.w, f.h, 10);

  drawLock(f.x + 24, f.y + f.h / 2, focused ? BLUE : NAVY);

  // eye button: tap to show / hide the password
  let ex = f.x + f.w - 28;
  let ey = f.y + f.h / 2;
  let showing = f.input.elt.type === "text";
  if (dist(mouseX, mouseY, ex, ey) < 16) cursor(HAND);
  stroke(showing ? BLUE : NAVY);
  strokeWeight(2);
  noFill();
  ellipse(ex, ey, 24, 14);
  noStroke();
  fill(showing ? BLUE : NAVY);
  circle(ex, ey, 7);
  if (!showing) {
    stroke(NAVY);
    strokeWeight(2);
    line(ex - 11, ey + 8, ex + 11, ey - 8);
  }
}

// the box with the 4 rules; each one turns green when it's met
function drawRequirements() {
  let p = fields[1].input.value();

  noStroke();
  fill(LIGHT_BLUE);
  rect(30, BOX_Y, 330, 170, 12);

  fill(NAVY);
  textSize(15);
  textStyle(BOLD);
  textAlign(LEFT, CENTER);
  text("Password Requirements:", 46, BOX_Y + 26);
  textStyle(NORMAL);

  for (let i = 0; i < RULES.length; i++) {
    let y = BOX_Y + 62 + i * 30;
    let ok = RULES[i].test(p);
    if (ok) {
      noStroke();
      fill(GREEN);
      circle(56, y, 18);
      stroke(255);
      strokeWeight(2);
      line(51, y, 55, y + 4);
      line(55, y + 4, 61, y - 4);
    } else {
      noFill();
      stroke(GRAY);
      strokeWeight(1.5);
      circle(56, y, 16);
    }
    noStroke();
    fill(ok ? GREEN : GRAY);
    textSize(14);
    text(RULES[i].text, 76, y);
  }
}

// =============================================
// Clicks + keys
// =============================================
function mousePressed() {
  if (isOver(15, 30, 40, 40)) {
    goTo("entry.html");
    return;
  }

  // eye buttons
  for (let f of fields) {
    if (dist(mouseX, mouseY, f.x + f.w - 28, f.y + f.h / 2) < 16) {
      f.input.elt.type = f.input.elt.type === "password" ? "text" : "password";
    }
  }

  if (isOver(30, BTN_Y, 330, 56)) updatePassword();
}

function keyPressed() {
  if (key === "Enter") updatePassword();
}

function updatePassword() {
  let current = fields[0].input.value();
  let newPass = fields[1].input.value();
  let confirm = fields[2].input.value();
  successMsg = "";

  if (current === "") {
    errorMsg = "Enter your current password.";
    return;
  }
  for (let r of RULES) {
    if (!r.test(newPass)) {
      errorMsg = "New password: " + r.text.toLowerCase() + ".";
      return;
    }
  }
  if (newPass === current) {
    errorMsg = "New password must be different.";
    return;
  }
  if (confirm !== newPass) {
    errorMsg = "New passwords don't match.";
    return;
  }

  errorMsg = "";
  successMsg = "Password updated!";
  for (let f of fields) f.input.value("");
  leaveTimer = 90;
}

// =============================================
// Helpers
// =============================================
function drawLock(x, y, col) {
  stroke(col);
  strokeWeight(2);
  noFill();
  rect(x - 9, y - 2, 18, 13, 2);
  arc(x, y - 2, 12, 16, PI, TWO_PI);
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

function styleInput(inp, w) {
  inp.size(w, 28);
  inp.style("border", "none");
  inp.style("outline", "none");
  inp.style("background", "transparent");
  inp.style("font-size", "16px");
  inp.style("font-family", "Arial");
  inp.style("color", NAVY);
}

function placeInputs() {
  let p = cnv.position();
  for (let f of fields) {
    f.input.position(p.x + f.x + 48, p.y + f.y + 10);
  }
}

function windowResized() {
  placeInputs();
}

// ---------- go to another page ----------
function goTo(page) {
  window.location.href = page;
}
