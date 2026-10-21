// =============================================
// Tiny Touch - Create Account page (p5.js)
// =============================================

let cnv;
let fields = [];
let errorMsg = "";
let successMsg = "";
let shakeTime = 0;
let userData = {};

// ---------- Layout ----------
const FIELD_START = 190;
const FIELD_GAP = 70;
const BTN_Y = 612;
const LINK_Y = 718;

// ---------- Colors (match screen #2) ----------
const BLUE = "#2D6CF0";
const BLUE_HOVER = "#4A84F5";
const NAVY = "#1B2A5A";
const GRAY = "#6B7489";
const FIELD_BORDER = "#E3E7EF";
const RED = "#E5484D";
const GREEN = "#2EAD5B";
const ORANGE = "#F2994A";

function setup() {
  cnv = createCanvas(390, 760);
  textFont("Arial");

  const fieldInfo = [
    { name: "First Name",       icon: "person", type: "text" },
    { name: "Last Name",        icon: "person", type: "text" },
    { name: "Email Address",    icon: "mail",   type: "email" },
    { name: "Phone Number",     icon: "phone",  type: "tel" },
    { name: "Password",         icon: "lock",   type: "password" },
    { name: "Confirm Password", icon: "lock",   type: "password" }
  ];

  let y = FIELD_START;
  for (let info of fieldInfo) {
    let inp = createInput("");
    inp.attribute("placeholder", info.name);
    inp.elt.type = info.type;
    styleInput(inp, info.type === "password" ? 200 : 240);

    let f = {
      name: info.name,
      icon: info.icon,
      type: info.type,
      input: inp,
      x: 30, y: y, w: 330, h: 48,
      error: "",
      valid: false,
      touched: false
    };
    fields.push(f);

    // feedback while typing (after the box was used once)
    inp.input(() => {
      if (f.touched) validateField(f);
      if (f.name === "Password" && fields[5].touched) validateField(fields[5]);
      errorMsg = "";
      successMsg = "";
    });

    // feedback when the user clicks out of the box
    inp.elt.addEventListener("blur", () => {
      if (inp.value() !== "") {
        f.touched = true;
        validateField(f);
      }
    });

    y += FIELD_GAP;
  }

  placeInputs(0);
}

function draw() {
  cursor(ARROW);
  background(255);

  // shake when there are mistakes
  let sx = 0;
  if (shakeTime > 0) {
    sx = sin(shakeTime * 1.3) * 8 * (shakeTime / 24);
    shakeTime--;
    placeInputs(sx);
    if (shakeTime === 0) placeInputs(0);
  }

  // ----- back arrow -----
  let backHover = isOver(15, 30, 40, 40);
  if (backHover) cursor(HAND);
  stroke(backHover ? BLUE_HOVER : NAVY);
  strokeWeight(3);
  noFill();
  line(36, 40, 26, 50);
  line(26, 50, 36, 60);

  // ----- logo -----
  drawLogoHands(128, 50, 0.6);
  noStroke();
  fill(BLUE);
  textStyle(BOLD);
  textSize(26);
  textAlign(LEFT, CENTER);
  text("Tiny Touch", 162, 52);

  // ----- title -----
  textAlign(CENTER, CENTER);
  fill(NAVY);
  textSize(28);
  text("Create Account", width / 2, 120);
  textStyle(NORMAL);
  fill(GRAY);
  textSize(16);
  text("Join Tiny Touch to start playing!", width / 2, 152);

  // ----- fields -----
  for (let f of fields) drawField(f, sx);

  // ----- Create Account button -----
  drawButton("Create Account", 30, BTN_Y, 330, 56);

  // ----- message under button -----
  noStroke();
  textSize(14);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  if (errorMsg !== "") {
    fill(RED);
    text(errorMsg, width / 2, BTN_Y + 76);
  } else if (successMsg !== "") {
    fill(GREEN);
    text(successMsg, width / 2, BTN_Y + 76);
  }
  textStyle(NORMAL);

  // ----- "Already have an account? Log In" -----
  textSize(15);
  textAlign(LEFT, CENTER);
  let part1 = "Already have an account? ";
  let total = textWidth(part1 + "Log In");
  let startX = width / 2 - total / 2;
  fill(NAVY);
  text(part1, startX, LINK_Y);

  let linkX = startX + textWidth(part1);
  let linkHover = isOver(linkX, LINK_Y - 12, textWidth("Log In"), 24);
  if (linkHover) cursor(HAND);
  fill(linkHover ? BLUE_HOVER : BLUE);
  text("Log In", linkX, LINK_Y);
  stroke(linkHover ? BLUE_HOVER : BLUE);
  strokeWeight(1);
  line(linkX, LINK_Y + 9, linkX + textWidth("Log In"), LINK_Y + 9);
}

// =============================================
// Drawing one input box
// =============================================
function drawField(f, sx) {
  let x = f.x + sx;
  let focused = document.activeElement === f.input.elt;
  let hasError = f.error !== "";

  // red = wrong, green = correct, blue = typing, gray = normal
  strokeWeight(hasError || focused || f.valid ? 2 : 1);
  if (hasError) stroke(RED);
  else if (f.valid) stroke(GREEN);
  else if (focused) stroke(BLUE);
  else stroke(FIELD_BORDER);
  fill(hasError ? "#FFF5F5" : 255);
  rect(x, f.y, f.w, f.h, 10);

  // icon
  let iconCol = hasError ? RED : (focused ? BLUE : NAVY);
  drawIcon(f.icon, x + 24, f.y + f.h / 2, iconCol);

  // green check
  if (f.valid) {
    let cx = f.type === "password" ? x + f.w - 62 : x + f.w - 28;
    drawCheck(cx, f.y + f.h / 2);
  }

  // eye button for passwords
  if (f.type === "password") {
    let ex = x + f.w - 28;
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

  // feedback message under the box
  let msgY = f.y + f.h + 11;
  if (hasError) {
    noStroke();
    fill(RED);
    circle(x + 12, msgY, 13);
    fill(255);
    textSize(10);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text("!", x + 12, msgY + 1);
    fill(RED);
    textSize(12);
    textStyle(NORMAL);
    textAlign(LEFT, CENTER);
    text(f.error, x + 24, msgY);
  } else if (f.name === "Password" && f.input.value() !== "") {
    drawStrength(f.input.value(), x, msgY);
  }
}

// =============================================
// Rules for each box (edit messages here)
// =============================================
function getError(f) {
  let v = f.input.value().trim();

  if (v === "") return f.name + " is required.";

  if (f.name === "First Name" || f.name === "Last Name") {
    if (!/^[A-Za-z' -]+$/.test(v)) return "Use letters only (no numbers or symbols).";
  }

  if (f.name === "Email Address") {
    if (!v.includes("@")) return "Email is missing an @ (like jay@email.com).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter a real email, like jay@email.com";
  }

  if (f.name === "Phone Number") {
    if (/[^0-9()\-\s+]/.test(v)) return "Phone number can only have numbers.";
    let digits = v.replace(/\D/g, "");
    if (digits.length !== 10) return "Phone number needs 10 digits.";
  }

  if (f.name === "Password") {
    let p = f.input.value();
    if (p.length < 8) return "Password needs at least 8 characters.";
    if (!/[0-9]/.test(p)) return "Add at least one number to your password.";
  }

  if (f.name === "Confirm Password") {
    if (f.input.value() !== fields[4].input.value()) return "Passwords don't match.";
  }

  return "";
}

function validateField(f) {
  f.error = getError(f);
  f.valid = f.error === "";
}

function submitCreateAccount() {
  let firstBad = null;

  for (let f of fields) {
    f.touched = true;
    validateField(f);
    if (f.error !== "" && firstBad === null) firstBad = f;
  }

  if (firstBad !== null) {
    errorMsg = "Please fix the fields in red.";
    successMsg = "";
    shakeTime = 24;
    firstBad.input.elt.focus();
    return;
  }

  // everything is correct
  userData = {
    firstName: fields[0].input.value().trim(),
    lastName: fields[1].input.value().trim(),
    email: fields[2].input.value().trim(),
    phone: fields[3].input.value().trim()
  };
  errorMsg = "";
  successMsg = "Account created! Welcome, " + userData.firstName + "!";
}

// password strength bar
function drawStrength(p, x, y) {
  let score = 0;
  if (p.length >= 8) score++;
  if (/[0-9]/.test(p)) score++;
  if (/[A-Z]/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;

  let label = "Weak";
  let col = RED;
  if (score >= 4) { label = "Strong"; col = GREEN; }
  else if (score >= 2) { label = "Okay"; col = ORANGE; }

  noStroke();
  for (let i = 0; i < 4; i++) {
    fill(i < score ? col : FIELD_BORDER);
    rect(x + 6 + i * 34, y - 3, 30, 6, 3);
  }
  fill(col);
  textSize(12);
  textStyle(BOLD);
  textAlign(LEFT, CENTER);
  text(label, x + 148, y);
  textStyle(NORMAL);
}

// =============================================
// Clicks + keys
// =============================================
function mousePressed() {
  // back arrow (hook this up to your welcome page later)
  if (isOver(15, 30, 40, 40)) {
    console.log("Back to Welcome page");
  }

  // eye buttons
  for (let f of fields) {
    if (f.type === "password") {
      let ex = f.x + f.w - 28;
      let ey = f.y + f.h / 2;
      if (dist(mouseX, mouseY, ex, ey) < 16) {
        f.input.elt.type = f.input.elt.type === "password" ? "text" : "password";
      }
    }
  }

  // Create Account button
  if (isOver(30, BTN_Y, 330, 56)) submitCreateAccount();

  // Log In link (hook this up to your log in page later)
  textSize(15);
  let part1 = "Already have an account? ";
  let total = textWidth(part1 + "Log In");
  let linkX = width / 2 - total / 2 + textWidth(part1);
  if (isOver(linkX, LINK_Y - 12, textWidth("Log In"), 24)) {
    console.log("Go to Log In page");
  }
}

function keyPressed() {
  if (key === "Enter") submitCreateAccount();
}

// =============================================
// Helpers
// =============================================
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

function drawCheck(x, y) {
  noStroke();
  fill(GREEN);
  circle(x, y, 20);
  stroke(255);
  strokeWeight(2.5);
  line(x - 5, y, x - 1, y + 4);
  line(x - 1, y + 4, x + 5, y - 4);
}

function drawIcon(type, x, y, col) {
  stroke(col);
  strokeWeight(2);
  noFill();

  if (type === "person") {
    circle(x, y - 6, 10);
    arc(x, y + 10, 20, 16, PI, TWO_PI);
  } else if (type === "mail") {
    rect(x - 11, y - 8, 22, 16, 2);
    line(x - 11, y - 8, x, y + 1);
    line(x + 11, y - 8, x, y + 1);
  } else if (type === "phone") {
    rect(x - 7, y - 11, 14, 22, 3);
    line(x - 2, y + 7, x + 2, y + 7);
  } else if (type === "lock") {
    rect(x - 9, y - 2, 18, 13, 2);
    arc(x, y - 2, 12, 16, PI, TWO_PI);
  }
}

// blue + peach hands like the logo
function drawLogoHands(x, y, s) {
  drawHand(x - 18 * s, y, s, "#2D6CF0", -0.25);
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

function styleInput(inp, w) {
  inp.size(w, 28);
  inp.style("border", "none");
  inp.style("outline", "none");
  inp.style("background", "transparent");
  inp.style("font-size", "16px");
  inp.style("font-family", "Arial");
  inp.style("color", NAVY);
}

function placeInputs(offsetX) {
  let p = cnv.position();
  for (let f of fields) {
    f.input.position(p.x + f.x + 48 + offsetX, p.y + f.y + 10);
  }
}

function windowResized() {
  placeInputs(0);
}