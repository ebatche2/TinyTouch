// =============================================
// Tiny Touch - Account Information page (p5.js)
// Screen #3: the user checks their info and taps Continue.
// Comes from: account.html (Create Account) or the Profile button on the Home screen
// Goes to:    goals.html (Continue), region.html (Region / Country row)
// =============================================

let cnv;
let rows = [];
let errorMsg = "";
let user = {};

// ---------- Layout ----------
const ROW_START = 200;
const ROW_GAP = 56;
const ROW_H = 46;
const BTN_Y = 620;

// ---------- Colors (match the other pages) ----------
const BLUE = "#2D6CF0";
const BLUE_HOVER = "#4A84F5";
const NAVY = "#1B2A5A";
const GRAY = "#6B7489";
const FIELD_BORDER = "#E3E7EF";
const RED = "#E5484D";
const BEAR = "#A0612E";
const BEAR_LIGHT = "#E8C29E";

function setup() {
  cnv = createCanvas(390, 760);
  textFont("Arial");
  user = loadUser();

  // kind: "text" = typing box, "date" = date picker,
  //       "select" = drop-down, "link" = tap to open another page
  const rowInfo = [
    { label: "First Name", key: "firstName", kind: "text" },
    { label: "Last Name",  key: "lastName",  kind: "text" },
    { label: "Email",      key: "email",     kind: "text" },
    { label: "Phone",      key: "phone",     kind: "text" },
    { label: "Region / Country", key: "region", kind: "link" },
    { label: "Date of Birth", key: "dob",    kind: "date" },
    { label: "Gender",     key: "gender",    kind: "select" }
  ];

  let y = ROW_START;
  for (let info of rowInfo) {
    let r = { label: info.label, key: info.key, kind: info.kind,
              x: 30, y: y, w: 330, h: ROW_H, input: null };

    if (info.kind === "text" || info.kind === "date") {
      r.input = createInput(user[info.key] || "");
      if (info.kind === "date") r.input.elt.type = "date";
      styleInput(r.input, 170);
    } else if (info.kind === "select") {
      r.input = createSelect();
      r.input.option("Choose...", "");
      for (let g of ["Female", "Male", "Other", "Prefer not to say"]) r.input.option(g);
      r.input.selected(user.gender || "");
      styleInput(r.input, 176);
    }
    if (r.input) r.input.input(() => (errorMsg = ""));

    rows.push(r);
    y += ROW_GAP;
  }

  placeInputs();
}

function draw() {
  cursor(ARROW);
  background(255);

  drawBackArrow();

  // ----- title -----
  noStroke();
  fill(NAVY);
  textStyle(BOLD);
  textSize(24);
  textAlign(CENTER, CENTER);
  text("Account Information", width / 2, 50);
  textStyle(NORMAL);

  // ----- bear picture with a camera badge -----
  drawBearFace(width / 2, 125, 1);
  noStroke();
  fill(BLUE);
  circle(width / 2 + 34, 152, 28);
  fill(255);
  rect(width / 2 + 26, 147, 16, 11, 2);
  fill(BLUE);
  circle(width / 2 + 34, 152, 7);

  // ----- rows -----
  for (let r of rows) drawRow(r);

  // ----- Continue button -----
  drawButton("Continue", 30, BTN_Y, 330, 56);

  if (errorMsg !== "") {
    noStroke();
    fill(RED);
    textSize(14);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text(errorMsg, width / 2, BTN_Y + 80);
    textStyle(NORMAL);
  }
}

function drawRow(r) {
  let focused = r.input && document.activeElement === r.input.elt;
  let hover = r.kind === "link" && isOver(r.x, r.y, r.w, r.h);
  if (hover) cursor(HAND);

  stroke(focused || hover ? BLUE : FIELD_BORDER);
  strokeWeight(focused || hover ? 2 : 1);
  fill(255);
  rect(r.x, r.y, r.w, r.h, 10);

  noStroke();
  fill(GRAY);
  textSize(13);
  textStyle(BOLD);
  textAlign(LEFT, CENTER);
  text(r.label, r.x + 14, r.y + r.h / 2);
  textStyle(NORMAL);

  // the Region row shows the saved country and a ">" arrow
  if (r.kind === "link") {
    fill(NAVY);
    textSize(15);
    text(user.flag + "  " + user.region, r.x + 150, r.y + r.h / 2);
    stroke(hover ? BLUE : GRAY);
    strokeWeight(2);
    noFill();
    let ax = r.x + r.w - 20;
    let ay = r.y + r.h / 2;
    line(ax - 4, ay - 6, ax + 2, ay);
    line(ax + 2, ay, ax - 4, ay + 6);
  }
}

// =============================================
// Clicks + keys
// =============================================
function mousePressed() {
  // back arrow
  if (isOver(15, 30, 40, 40)) {
    saveTyping();
    goTo("account.html");
    return;
  }

  // Region / Country row -> region page
  for (let r of rows) {
    if (r.kind === "link" && isOver(r.x, r.y, r.w, r.h)) {
      saveTyping();          // keep what they typed so far
      goTo("region.html");
      return;
    }
  }

  // Continue button
  if (isOver(30, BTN_Y, 330, 56)) submitInfo();
}

function keyPressed() {
  if (key === "Enter") submitInfo();
}

function submitInfo() {
  for (let r of rows) {
    if (r.input && r.input.value().trim() === "") {
      errorMsg = "Please fill in " + r.label + ".";
      r.input.elt.focus();
      return;
    }
  }
  saveTyping();
  goTo("goals.html");
}

// copy every box into the saved user info
function saveTyping() {
  for (let r of rows) {
    if (r.input) user[r.key] = r.input.value().trim();
  }
  saveUser(user);
}

// =============================================
// Helpers
// =============================================
function drawBearFace(x, y, s) {
  push();
  translate(x, y);
  scale(s);
  noStroke();
  fill("#EAF2FF");
  circle(0, 0, 96);
  fill(BEAR);
  circle(-26, -26, 26);
  circle(26, -26, 26);
  circle(0, 4, 66);
  fill(BEAR_LIGHT);
  ellipse(0, 16, 32, 24);
  fill(NAVY);
  circle(-12, -2, 7);
  circle(12, -2, 7);
  ellipse(0, 10, 10, 7);
  pop();
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
  inp.style("font-size", "15px");
  inp.style("font-family", "Arial");
  inp.style("color", NAVY);
}

function placeInputs() {
  let p = cnv.position();
  for (let r of rows) {
    if (r.input) r.input.position(p.x + r.x + 146, p.y + r.y + 9);
  }
}

function windowResized() {
  placeInputs();
}

// ---------- go to another page ----------
function goTo(page) {
  window.location.href = page;
}

// ---------- saved user info (shared by all pages) ----------
function loadUser() {
  let u = {};
  try {
    u = JSON.parse(localStorage.getItem("tinyTouchUser")) || {};
  } catch (e) {}
  if (!u.region) { u.region = "United States"; u.flag = "🇺🇸"; }
  return u;
}

function saveUser(u) {
  try {
    localStorage.setItem("tinyTouchUser", JSON.stringify(u));
  } catch (e) {}
}
