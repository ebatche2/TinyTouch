// Tiny Touch — paste this whole file into sketch.js.
let screen = "welcome";

function setup() {
  const canvas = createCanvas(windowWidth, max(windowHeight, 720));
  canvas.style("display", "block");
  canvas.style("touch-action", "pan-y");
  textFont("Trebuchet MS");
  textAlign(CENTER, CENTER);
  describe("Tiny Touch: a sunny forest, two handprints, and friendly animals. Choose Create Account or Log In.");
}

function draw() {
  drawForest();
  const x = width / 2;
  push();
  translate(0, (height - 720) / 2);
  if (screen === "welcome") {
    drawHand(x - 30, "#0788ff", -0.25);
    drawHand(x + 25, "#ffbd93", 0.25);
    write("Tiny Touch", 185, 48, "#0085f5", true);
    write("Fun games to build\nfine motor skills", 249, 23, "#12316f");
    noStroke();
    fill(255, 255, 255, 150);
    rect(x - buttonWidth() / 2 - 16, 322, buttonWidth() + 32, 172, 26);
    drawButton("Create Account", 338, true);
    drawButton("Log In", 416, false);
  } else {
    write("Tiny Touch", 185, 36, "#0085f5", true);
    write(screen, 262, 27, "#12316f", true);
    write("This page is coming next.", 306, 19, "#12316f");
    drawButton("Back to welcome", 416, true);
  }
  drawAnimal("bear", x - 102);
  drawAnimal("bunny", x);
  drawAnimal("lion", x + 102);
  pop();
  noFill();
  stroke(255, 255, 255, 180);
  strokeWeight(2);
  rect(12, 12, width - 24, height - 24, 24);
}

// These two helpers avoid repeating text settings and fill colors.
function write(words, y, size, shade, bold = false) {
  noStroke();
  fill(shade);
  textSize(size);
  textStyle(bold ? BOLD : NORMAL);
  text(words, width / 2, y);
}

function oval(shade, x, y, w, h = w) {
  noStroke();
  fill(shade);
  ellipse(x, y, w, h);
}

function drawForest() {
  noStroke();
  for (let y = 0; y < height; y += 4) {
    fill(lerpColor(color("#8cddfb"), color("#f1fcff"), y / height));
    rect(0, y, width, 4);
  }
  fill(255, 255, 255, 35);
  triangle(width / 2, 0, width * 0.05, height * 0.7, width * 0.35, height * 0.7);
  triangle(width / 2, 0, width * 0.65, height * 0.7, width * 0.95, height * 0.7);
  drawCloud(width * 0.12, 134);
  drawCloud(width * 0.85, 102);
  drawCloud(width * 0.72, 250);
  oval("#b2dfa0", width * 0.2, height * 0.83, width * 1.4, height * 0.55);
  oval("#94d387", width * 0.85, height * 0.87, width * 1.4, height * 0.6);
  for (let x = 0; x < width; x += 42) {
    oval("#82c876", x, height * 0.7 + sin(x) * 12, 90, 65);
  }
  drawTree(width * 0.2, height * 0.66, 0.55);
  drawTree(width * 0.8, height * 0.66, 0.6);
  drawTree(width * 0.02, height * 0.53, 1.15);
  drawTree(width * 0.98, height * 0.53, 1.2);
  drawTree(width * 0.07, height * 0.72, 0.9);
  drawTree(width * 0.94, height * 0.74, 0.95);
  oval("#85c765", width * 0.35, height * 1.12, width * 2, height * 0.78);
  oval("#b6dc7c", width * 0.55, height * 1.12, width * 1.4, height * 0.67);
  oval("#cae592", width * 0.5, height * 1.17, width * 0.95, height * 0.64);
  // Grass and flowers.
  for (let x = 22; x < width; x += 79) {
    const y = height - 34 - (sin(x) + 1) * 12;
    stroke("#77ae55");
    strokeWeight(2);
    line(x - 4, y + 7, x - 7, y);
    line(x, y + 7, x + 3, y - 4);
    oval("#fff8c9", x + 10, y - 3, 8);
    oval("#edbe4b", x + 10, y - 3, 3);
  }
}

function drawCloud(x, y) {
  noStroke();
  fill(255, 255, 255, 215);
  ellipse(x, y, 100, 25);
  circle(x - 20, y - 10, 30);
  circle(x + 10, y - 16, 43);
  circle(x + 36, y - 7, 25);
}

function drawTree(x, y, size) {
  push();
  translate(x, y);
  scale(size);
  oval("#477f47", 4, 130, 80, 15);
  stroke("#aa7950");
  strokeWeight(15);
  line(0, 10, 0, 130);
  strokeWeight(8);
  line(0, 62, -28, 34);
  line(0, 42, 27, 17);
  oval("#3c9857", -29, -2, 100);
  oval("#3c9857", 30, -12, 107);
  oval("#3c9857", 0, -57, 107);
  oval("#58b45d", -36, -34, 73);
  oval("#58b45d", 29, -43, 80);
  oval("#58b45d", -7, -83, 75);
  oval("#80c965", -22, -80, 48);
  oval("#80c965", 14, -54, 51);
  oval("#80c965", -42, -24, 39);
  pop();
}

function drawHand(x, shade, angle) {
  push();
  translate(x, 100);
  rotate(angle);
  stroke(shade);
  strokeWeight(12);
  line(-17, 0, -22, -26);
  line(-4, -4, -6, -38);
  line(9, -4, 9, -35);
  line(21, 0, 24, -23);
  line(-22, 18, -36, 1);
  oval(shade, 1, 14, 52);
  fill(255, 255, 255, 145);
  ellipse(3, 21, 14, 10);
  pop();
}

function drawAnimal(kind, x) {
  push();
  translate(x, 616);
  let fur = "#b97c43", light = "#d79a5d";
  if (kind === "bunny") { fur = "#fffdf1"; light = "#ffffff"; }
  if (kind === "lion") { fur = "#f6c94e"; light = "#ffde73"; }
  noStroke();
  fill(70, 107, 39, 45);
  ellipse(0, 70, 86, 14);
  // Mane, body, arms, feet, and belly.
  if (kind === "lion") {
    oval("#c78329", 0, -18, 102);
    for (let a = 0; a < TWO_PI; a += PI / 6) {
      oval("#e6a235", cos(a) * 42, sin(a) * 42 - 18, 28);
      oval("#f0b23c", cos(a) * 36, sin(a) * 36 - 22, 23);
    }
  }
  oval(fur, 0, 36, 64, 63);
  oval(fur, -32, 31, 23, 35);
  oval(fur, 32, 31, 23, 35);
  oval(fur, -19, 63, 28, 18);
  oval(fur, 19, 63, 28, 18);
  oval("#fff0ca", 0, 39, 34, 40);
  // Ears.
  if (kind === "bunny") {
    oval(fur, -18, -69, 23, 78);
    oval(fur, 18, -69, 23, 78);
    oval("#f4b5b9", -18, -74, 11, 53);
    oval("#f4b5b9", 18, -74, 11, 53);
  } else {
    const ear = kind === "bear" ? "#85512e" : "#dba03a";
    oval(fur, -29, -47, 30);
    oval(fur, 29, -47, 30);
    oval(ear, -29, -47, 16);
    oval(ear, 29, -47, 16);
  }
  // Head, muzzle, eyes, nose, and smile.
  const muzzle = kind === "bunny" ? "#fffdf1" : "#ffe5b2";
  oval(fur, 0, -15, 81, 73);
  oval(light, -5, -30, 59, 39);
  oval(muzzle, -9, 1, 25, 24);
  oval(muzzle, 9, 1, 25, 24);
  oval("#352720", -17, -18, 10, 12);
  oval("#352720", 17, -18, 10, 12);
  oval("#ffffff", -19, -21, 3);
  oval("#ffffff", 15, -21, 3);
  oval(kind === "bunny" ? "#dc8e91" : "#51352a", 0, -3, 11, 8);
  fill("#593a2b");
  arc(0, 7, 18, 17, 0, PI, CHORD);
  oval("#ee9290", 0, 13, 8, 4);
  oval("#efad93", -28, -3, 11, 7);
  oval("#efad93", 28, -3, 11, 7);
  pop();
}

function buttonWidth() {
  return min(390, width - 80);
}

function drawButton(words, y, primary) {
  stroke("#0085ff");
  strokeWeight(overButton(y) ? 3 : 1.5);
  fill(primary ? "#0085ff" : "#f4fcff");
  rect((width - buttonWidth()) / 2, y, buttonWidth(), 60, 28);
  write(words, y + 30, 23, primary ? "#ffffff" : "#123b92", true);
  textStyle(NORMAL);
}

function overButton(y) {
  y += (height - 720) / 2;
  return abs(mouseX - width / 2) < buttonWidth() / 2 && mouseY > y && mouseY < y + 60;
}

function mousePressed() {
  if (screen === "welcome") {
    if (overButton(338)) screen = "Create Account";
    else if (overButton(416)) screen = "Log In";
  } else if (overButton(416)) screen = "welcome";
}

function keyPressed() {
  if (key === "Escape") screen = "welcome";
}

function windowResized() {
  resizeCanvas(windowWidth, max(windowHeight, 720));
  select("canvas").style("touch-action", "pan-y");
}
