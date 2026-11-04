// Tiny Touch: Drag Shapes. Paste this whole file into sketch.js.
let screen = "levels", level = 0;
let shapes = [], held = -1;
let timeLeft = 30, attempts = 0, matched = 0;
let dragX = 0, dragY = 0, message = "", timeUp = false;
let pickupX = 0, pickupY = 0;
let messageDetail = "", messageColor = "#526283", feedbackTime = 0;
let playTime = 0, completedAt = 0, resultAge = 0;
let zoom = 1, center = 0, panelWidth = 0, offsetY = 0;
let roundNumber = 1, roundResults = [], sessionActive = false;
let sourceRows = [], targetRows = [];
let pieceRadius = 43, fitTolerance = 24, practice = false;
let leaveFrom = "levels", leaveTo = "exit";
let personalBest = 0, newBest = false, storageAvailable = true;
// Return to the Home screen that opened the game. Set to "" in a standalone editor.
const HOME_URL = new URLSearchParams(window.location.search).get("from") === "app"
  ? "TinyTouch-pages/Melodious tuck_2026_11_02_16_17_24/index.html#entry.html"
  : "entry.html";
const levels = ["Easy", "Medium", "Hard", "Expert"];
const colors = ["#fa6267", "#258fff", "#ffcd52", "#62c875", "#af82e5", "#f3944f"];
const shapeCounts = [3, 4, 5, 6];
const sizes = [43, 38, 30, 24];
// Smaller distances require more accurate alignment with the outline.
const tolerance = [24, 18, 13, 9];

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.style("display", "block");
  textFont("Trebuchet MS");
  textAlign(CENTER, CENTER);
  describe("Drag Shapes. Play three rounds with fresh layouts. Choose a timer or untimed practice. Drag shapes into matching outlines. Back, Home, Pause, and Exit are available; leaving an active session asks for confirmation.");
}

function draw() {
  // Scale down on short phones, so every control stays on screen.
  zoom = min(1, height / 760);
  center = width / zoom / 2;
  panelWidth = min(width / zoom - 32, 720);
  offsetY = (height / zoom - 760) / 2;
  background("#f0f6fd");
  cursor(held >= 0 ? "grabbing" : "default");
  push();
  scale(zoom);
  translate(0, offsetY);
  noStroke();
  fill(27, 42, 90, 8);
  rect(center - panelWidth / 2, 20, panelWidth, 728, 28);
  fill("#ffffff");
  rect(center - panelWidth / 2, 16, panelWidth, 728, 28);
  words("TINY TOUCH", center, 43, 12, "#2d6cf0", true);
  words("Drag Shapes", center, 103, 31, "#1b2a5a", true);

  if (screen === "levels") drawLevels();
  if (screen === "instructions") drawInstructions();
  if (screen === "playing" && !practice) {
    timeLeft = max(0, timeLeft - deltaTime / 1000);
    if (timeLeft === 0) finish(true);
  }
  if (screen === "playing" || screen === "finishing") {
    playTime += deltaTime / 1000;
    feedbackTime = max(0, feedbackTime - deltaTime / 1000);
    animatePieces();
    if (screen === "finishing" && playTime - completedAt > 0.85) finish(false);
  }
  if (screen === "playing" || screen === "paused" || screen === "finishing") drawGame();
  if (screen === "paused") drawPause();
  if (screen === "results") drawResults();
  if (screen === "exit") drawExit();
  if (screen !== "leave") drawNavigation();
  if (screen === "leave") drawLeave();
  pop();
}

function drawLevels() {
  words("Find the fit. Make a match.", center, 151, 19, "#5e6a82");
  const float = sin(millis() / 650) * 3;
  shapeIcon(0, center - 65, 218 + float, 28, colors[0], true);
  shapeIcon(1, center, 208 - float, 27, colors[1], true);
  shapeIcon(2, center + 65, 220 + float, 29, colors[2], true);
  words("3 short rounds · A fresh board each time", center, 274, min(16, panelWidth / 23), "#5e6a82");

  const w = min(panelWidth - 40, 360), x = center - w / 2;
  smallButton("30s timer", x, 300, (w - 8) / 2, !practice);
  smallButton("No timer", center + 4, 300, (w - 8) / 2, practice);
  const shades = ["#e6f5d9", "#fff3c5", "#ffe5cf", "#ffe0e3"];
  const details = ["3 large shapes · steady practice", "4 shapes · tighter alignment", "5 shapes · adds a diamond", "6 small shapes · adds a hexagon"];
  for (let i = 0; i < 4; i++) button(levels[i], 367 + i * 72, shades[i], details[i]);
  words(practice ? "Take your time. Accuracy comes first." : "30 seconds for each round. Pause anytime.", center, 662, min(14, panelWidth / 25), "#5e6a82");
}

function drawInstructions() {
  words(levels[level] + " · 3 rounds · " + (practice ? "No timer" : "30s each"), center, 150, 17, "#2d6cf0", true);
  words("Pick up. Line up. Let go.", center, 195, min(23, panelWidth / 15), "#1b2a5a", true);
  const step = min(1, (millis() % 3400) / 2100);
  const progress = step * step * (3 - 2 * step);
  noStroke();
  fill("#f0f6fd");
  rect(center - panelWidth / 2 + 20, 237, panelWidth - 40, 145, 22);
  shapeIcon(0, center + 77, 302, 36, progress === 1 ? "#37aa67" : "#8496ad", false);
  shapeIcon(0, lerp(center - 77, center + 77, progress), 302, 36, colors[0], true);
  if (progress === 1) shapeIcon(0, center + 77, 302, 40, "#37aa67", false);
  words("1   Hold a colored shape", center, 424, 18, "#1b2a5a");
  words("2   Center it inside the same outline", center, 465, min(18, panelWidth / 20), "#1b2a5a");
  words("3   Let go when the outline turns green", center, 506, min(18, panelWidth / 21), "#1b2a5a");
  words("On phones, shapes lift above your finger.", center, 550, min(15, panelWidth / 25), "#5e6a82");
  button("Let's play  →", 589);
}

function startSession() {
  roundNumber = 1;
  roundResults = [];
  sourceRows = [];
  targetRows = [];
  sessionActive = true;
  newBest = false;
  personalBest = readBest();
  startRound();
}

// Shuffle row numbers. A repeated layout is rotated so every round changes.
function shuffledRows(count, previous) {
  const rows = [];
  for (let i = 0; i < count; i++) rows.push(i);
  for (let i = count - 1; i > 0; i--) {
    const j = floor(random(i + 1));
    const temp = rows[i]; rows[i] = rows[j]; rows[j] = temp;
  }
  if (rows.every((row, i) => row === previous[i])) rows.push(rows.shift());
  return rows;
}

function startRound(freshLayout = true) {
  roundResults = roundResults.slice(0, roundNumber - 1);
  shapes = [];
  matched = 0;
  attempts = 0;
  timeLeft = 30;
  held = -1;
  timeUp = false;
  playTime = 0;
  resultAge = 0;
  giveFeedback("Ready? Pick up a shape.", "Line up the centers, then let go.", "#526283");
  pieceRadius = sizes[level] - (roundNumber - 1) * 2;
  fitTolerance = max(6, tolerance[level] - (roundNumber - 1) * 2);
  const count = shapeCounts[level];
  if (freshLayout) {
    sourceRows = shuffledRows(count, sourceRows);
    const previousTargets = targetRows;
    targetRows = shuffledRows(count, previousTargets);
    while (targetRows.every((row, i) => row === sourceRows[i]) || targetRows.every((row, i) => row === previousTargets[i])) {
      targetRows.push(targetRows.shift());
    }
  }
  const gap = count === 3 ? 130 : 282 / (count - 1);
  const spread = min(panelWidth - 28, 570) * 0.27;
  for (let i = 0; i < count; i++) {
    const sourceRow = sourceRows.indexOf(i), targetRow = targetRows.indexOf(i);
    shapes.push({
      type: i, x: center - spread, y: 286 + sourceRow * gap,
      homeX: center - spread, homeY: 286 + sourceRow * gap,
      targetX: center + spread, targetY: 286 + targetRow * gap,
      done: false, redUntil: 0, motion: "", progress: 0,
      fromX: 0, fromY: 0, successAt: -10, errorAt: -10,
      dropX: 0, dropY: 0, grow: 0.7, appearAt: i * 0.07
    });
  }
  screen = "playing";
}

function drawGame() {
  words(levels[level], center - panelWidth / 2 + 55, 141, 14, "#5e6a82", true);
  words("ROUND " + roundNumber + " / 3", center + panelWidth / 2 - 66, 141, 13, "#5e6a82", true);
  for (let i = 1; i <= 3; i++) {
    noStroke();
    fill(i < roundNumber ? "#35aa65" : i === roundNumber ? "#2d6cf0" : "#e0e9f5");
    circle(center + (i - 2) * 18, 141, 9);
  }
  drawTimeBar();
  words(matched + " / " + shapes.length + " matched", center + panelWidth / 2 - 84, 175, 18, "#142878", true);
  const spread = min(panelWidth - 28, 570) * 0.27;
  words("PICK UP", center - spread, 237, 11, "#718299", true);
  words("MATCH HERE", center + spread, 237, 11, "#718299", true);
  noStroke();
  fill("#f5f8fd");
  rect(center - spread - pieceRadius - 16, 251, (pieceRadius + 16) * 2, 355, 20);
  for (let s of shapes) {
    let shade = "#8998b0";
    if (held >= 0 && shapes[held] === s) {
      const distance = dist(s.x, s.y, s.targetX, s.targetY);
      if (distance < pieceRadius * 2) shade = distance <= fitTolerance ? "#239c5d" : "#d69925";
    }
    shapeIcon(s.type, s.targetX, s.targetY, pieceRadius, shade, false);
    if (s.done) {
      shapeIcon(s.type, s.targetX, s.targetY, pieceRadius + 4, "#35aa65", false);
      if (!s.motion) drawCheck(s.targetX + pieceRadius * 0.75, s.targetY - pieceRadius * 0.75);
    }
  }
  for (let i = 0; i < shapes.length; i++) {
    if (i !== held) drawPiece(shapes[i]);
  }
  // Draw the held shape last, so it stays above everything else.
  if (held >= 0) drawPiece(shapes[held]);
  drawEffects();
  drawFeedback();
}

function drawTimeBar() {
  if (practice) {
    words("No timer", center - panelWidth / 2 + 70, 181, 18, "#2d6cf0", true);
    noStroke();
    fill("#e6f1eb");
    rect(center - panelWidth / 2 + 24, 207, panelWidth - 48, 7, 4);
    fill("#35aa65");
    if (matched) rect(center - panelWidth / 2 + 24, 207, (panelWidth - 48) * matched / shapes.length, 7, 4);
    return;
  }
  const shade = timeLeft > 10 ? "#258fff" : timeLeft > 5 ? "#e3a126" : "#dd4b59";
  words(ceil(timeLeft) + "s left", center - panelWidth / 2 + 70, 175, 21, shade, true);
  const x = center - panelWidth / 2 + 24, w = panelWidth - 48;
  const elapsed = 1 - timeLeft / 30;
  noStroke();
  fill("#e4f1fa");
  rect(x, 199, w, 14, 7);
  fill(shade);
  if (timeLeft > 0) rect(x + w * elapsed, 199, w * (1 - elapsed), 14, 7);
  stroke("#ffffff");
  strokeWeight(2);
  circle(x + w * elapsed, 206, 19);
  // The marker moves left to right as the colored time runs out.
  if (timeLeft <= 5 && screen === "playing") {
    noFill();
    stroke(221, 75, 89, 80 + sin(playTime * 4) * 40);
    rect(x - 4, 195, w + 8, 22, 11);
  }
}

function drawPiece(s) {
  const isHeld = held >= 0 && shapes[held] === s;
  if (!s.done && !s.motion && held < 0 && dist(pointerX(), pointerY(), s.x, s.y) < pieceRadius + 8) cursor("grab");
  const age = playTime - s.errorAt;
  const shake = age < 0.45 ? sin(age * 55) * 4 * (1 - age / 0.45) : 0;
  noStroke();
  fill(25, 70, 110, isHeld ? 30 : 12);
  ellipse(s.x + shake, s.y + pieceRadius + (isHeld ? 9 : 4), pieceRadius * 1.7, 12);
  shapeIcon(s.type, s.x + shake, s.y, pieceRadius * s.grow, colors[s.type], true);
  if (s.type === 0) {
    noFill(); stroke(255, 255, 255, 110); strokeWeight(3);
    arc(s.x + shake, s.y, pieceRadius * s.grow * 1.45, pieceRadius * s.grow * 1.45, PI, PI * 1.55);
  }
  if (isHeld) shapeIcon(s.type, s.x, s.y, pieceRadius * s.grow + 4, "#ffffff", false);
  if (playTime < s.redUntil) shapeIcon(s.type, s.x + shake, s.y, pieceRadius * s.grow + 4, "#d83f49", false);
}

function animatePieces() {
  const dt = deltaTime / 1000;
  for (let s of shapes) {
    if (playTime >= s.appearAt) {
      const goal = held >= 0 && shapes[held] === s ? 1.08 : 1;
      s.grow = lerp(s.grow, goal, min(1, dt * 14));
    }
    if (!s.motion) continue;
    s.progress = min(1, s.progress + dt / (s.motion === "snap" ? 0.24 : 0.38));
    const ease = 1 - pow(1 - s.progress, 3);
    s.x = lerp(s.fromX, s.motion === "snap" ? s.targetX : s.homeX, ease);
    s.y = lerp(s.fromY, s.motion === "snap" ? s.targetY : s.homeY, ease);
    if (s.progress === 1) {
      s.x = s.motion === "snap" ? s.targetX : s.homeX;
      s.y = s.motion === "snap" ? s.targetY : s.homeY;
      s.motion = "";
    }
  }
}

function movePiece(s, motion) {
  s.fromX = s.x;
  s.fromY = s.y;
  s.progress = 0;
  s.motion = motion;
}

function drawEffects() {
  for (let s of shapes) {
    const age = playTime - s.successAt;
    if (age >= 0 && age < 0.65) {
      noFill();
      stroke(53, 170, 101, 200 * (1 - age / 0.65));
      strokeWeight(2);
      circle(s.targetX, s.targetY, pieceRadius * 2 + age * 75);
      noStroke();
      fill(53, 170, 101, 255 * (1 - age / 0.65));
      for (let i = 0; i < 8; i++) {
        const a = i * TWO_PI / 8;
        circle(s.targetX + cos(a) * (pieceRadius + age * 60), s.targetY + sin(a) * (pieceRadius + age * 60), 5);
      }
    }
    const missAge = playTime - s.errorAt;
    if (missAge >= 0 && missAge < 0.6) {
      noFill();
      stroke(216, 63, 73, 160 * (1 - missAge / 0.6));
      circle(s.dropX, s.dropY, pieceRadius * 2 + missAge * 50);
    }
  }
}

function giveFeedback(title, detail, shade) {
  message = title;
  messageDetail = detail;
  messageColor = shade;
  feedbackTime = 3;
}

function drawFeedback() {
  let title = feedbackTime > 0 ? message : "Keep going — you've got this!";
  let detail = feedbackTime > 0 ? messageDetail : "Center it in the matching outline.";
  let shade = feedbackTime > 0 ? messageColor : "#526283";
  if (held >= 0) {
    const s = shapes[held], d = dist(s.x, s.y, s.targetX, s.targetY);
    title = "Find the matching outline";
    detail = "Keep holding as you move.";
    shade = "#258fff";
    if (d <= fitTolerance) {
      title = "Perfect position — let go!";
      detail = "The green outline means it fits.";
      shade = "#239c5d";
    } else if (d < pieceRadius * 2) {
      title = "Nearly there!";
      detail = abs(s.targetX - s.x) > abs(s.targetY - s.y)
        ? s.x < s.targetX ? "Move a little right." : "Move a little left."
        : s.y < s.targetY ? "Move a little down." : "Move a little up.";
      shade = "#a8751b";
    }
  }
  noStroke();
  fill("#f1f8fd");
  rect(center - panelWidth / 2 + 18, 620, panelWidth - 36, 50, 12);
  words(title, center, 636, min(18, panelWidth / 17), shade, true);
  words(detail, center, 656, min(15, panelWidth / 22), "#526283");
}

function drawPause() {
  noStroke();
  fill(240, 249, 255, 245);
  rect(center - panelWidth / 2, 118, panelWidth, 612, 24);
  words("Take a break", center, 248, 30, "#142878", true);
  words(practice ? "Your shapes are safe here." : "Your timer is paused.", center, 301, 20, "#526283");
  button("Resume round", 402);
  button("Restart this round", 480, "#f0f8ff");
  button("Change difficulty", 558, "#f0f8ff");
}

function finish(ranOutOfTime) {
  timeUp = ranOutOfTime;
  held = -1;
  resultAge = 0;
  roundResults[roundNumber - 1] = { matched, attempts, total: shapes.length };
  if (roundNumber === 3) {
    sessionActive = false;
    const score = sessionStats().score;
    newBest = score > personalBest;
    personalBest = max(personalBest, score);
    try { localStorage.setItem(bestKey(), String(personalBest)); }
    catch { storageAvailable = false; }
  }
  screen = "results";
}

function accuracy() {
  // Every wrong drop and every unfinished shape counts as a miss.
  return round(100 * matched / (attempts + shapes.length - matched));
}

function sessionStats() {
  let correct = 0, drops = 0, total = 0;
  for (let round of roundResults) {
    correct += round.matched;
    drops += round.attempts;
    total += round.total;
  }
  return { correct, total, misses: drops - correct, score: round(100 * correct / max(1, drops + total - correct)) };
}

function bestKey() { return "tinyTouch-shapes-best-" + level + (practice ? "-practice" : "-timed"); }
function readBest() {
  try { return Number(localStorage.getItem(bestKey())) || 0; }
  catch { storageAvailable = false; return 0; }
}

function drawResults() {
  const finalRound = roundNumber === 3;
  const stats = sessionStats();
  const score = finalRound ? stats.score : accuracy();
  resultAge += deltaTime / 1000;
  const pop = 1 + sin(min(1, resultAge / 0.6) * PI) * 0.16;
  shapeIcon(3, center, 210, 54 * pop, "#ffcf48", true);
  if ((!timeUp || finalRound) && resultAge < 1.6) {
    noStroke();
    for (let i = 0; i < 18; i++) {
      fill(colors[i % colors.length]);
      const x = center + sin(i * 7) * min(panelWidth / 2 - 20, 140) * min(1, resultAge * 3);
      rect(x, 160 + (i % 4) * 18 + resultAge * 60, 6, 10, 2);
    }
  }
  noStroke();
  fill("#775320");
  circle(center - 14, 204, 6);
  circle(center + 14, 204, 6);
  noFill();
  stroke("#775320");
  strokeWeight(3);
  arc(center, 215, 20, 14, 0, PI);
  words(finalRound ? "Session complete!" : timeUp ? "Round finished" : "Great match!", center, 310, min(30, panelWidth / 11), "#1b2a5a", true);
  words(score + "% accuracy", center, 365, 29, "#2d6cf0", true);
  words(finalRound ? stats.correct + " / " + stats.total + " shapes · 3 rounds" : matched + " / " + shapes.length + " matched · Round " + roundNumber + " / 3", center, 410, 18, "#5e6a82");
  words(finalRound ? stats.misses + " missed drops" : (attempts - matched) + " missed drops · " + (shapes.length - matched) + " unmatched", center, 444, min(16, panelWidth / 22), "#5e6a82");
  words(finalRound ? (newBest ? "New personal best!  " : "Best: ") + personalBest + "%" : "Fresh positions in the next round.", center, 485, 17, "#239c5d", true);
  if (finalRound) words(storageAvailable ? "Saved on this device" : "For this visit", center, 510, 12, "#5e6a82");
  button(finalRound ? "Play again  ↻" : "Next round  →", 534);
  button(finalRound ? "Choose difficulty" : "Retry this round", 602, "#f0f8ff");
}

// One function draws both colored shapes and their outlines.
function shapeIcon(type, x, y, radius, shade, solid) {
  push();
  translate(x, y);
  stroke(shade);
  strokeWeight(3);
  if (solid) fill(shade);
  else noFill();
  if (type === 0) circle(0, 0, radius * 2);
  if (type === 1) rect(-radius, -radius, radius * 2, radius * 2, 4);
  if (type === 2) triangle(0, -radius, -radius, radius, radius, radius);
  if (type === 4) quad(0, -radius, radius, 0, 0, radius, -radius, 0);
  if (type === 5) {
    beginShape();
    for (let i = 0; i < 6; i++) vertex(cos(i * PI / 3) * radius, sin(i * PI / 3) * radius);
    endShape(CLOSE);
  }
  if (type === 3) {
    beginShape();
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? radius : radius * 0.47;
      vertex(cos(-HALF_PI + i * PI / 5) * r, sin(-HALF_PI + i * PI / 5) * r);
    }
    endShape(CLOSE);
  }
  pop();
}

function words(label, x, y, size, shade, bold = false) {
  noStroke();
  fill(shade);
  textSize(size);
  textLeading(size * 1.3);
  textStyle(bold ? BOLD : NORMAL);
  text(label, x, y);
}

function button(label, y, shade = "#0088ff", detail = "") {
  const w = min(panelWidth - 40, 360);
  if (overButton(y)) cursor("pointer");
  noStroke();
  fill(27, 42, 90, 8);
  rect(center - w / 2, y + 3, w, 58, 18);
  fill(shade);
  stroke(overButton(y) ? "#204da1" : "#c6e1f2");
  strokeWeight(overButton(y) ? 3 : 1);
  rect(center - w / 2, y, w, 58, 20);
  words(label, center, y + (detail ? 20 : 29), 22, shade === "#0088ff" ? "#ffffff" : "#142878", true);
  if (detail) words(detail, center, y + 43, 14, "#526283");
}

function pointerX() { return mouseX / zoom; }
function pointerY() { return mouseY / zoom - offsetY; }
function overButton(y) {
  return abs(pointerX() - center) < min(panelWidth - 40, 360) / 2 && pointerY() > y && pointerY() < y + 58;
}

function mousePressed(event) {
  // A leave confirmation blocks every other control underneath it.
  if (screen === "leave") {
    if (overButton(420)) screen = leaveFrom;
    else if (overButton(496)) performLeave();
    return false;
  }
  const edge = center - panelWidth / 2 + 16;
  if (hitBox(edge, 18, 72, 52)) { goBack(); return false; }
  if (hitBox(center + panelWidth / 2 - 88, 18, 72, 52)) { requestLeave("home"); return false; }
  if (screen !== "exit") {
    if (screen === "playing" || screen === "finishing") {
      const w = (min(panelWidth - 40, 360) - 12) / 2;
      if (hitBox(center - w - 6, 678, w, 52) && screen === "playing") { pauseRound(); return false; }
      if (hitBox(center + 6, 678, w, 52)) { requestLeave("exit"); return false; }
    } else if (overButton(678)) { requestLeave("exit"); return false; }
  }
  if (screen === "levels") {
    const w = min(panelWidth - 40, 360);
    if (hitBox(center - w / 2, 300, (w - 8) / 2, 52)) practice = false;
    if (hitBox(center + 4, 300, (w - 8) / 2, 52)) practice = true;
    for (let i = 0; i < 4; i++) {
      if (overButton(367 + i * 72)) { level = i; screen = "instructions"; }
    }
  } else if (screen === "instructions") {
    if (overButton(589)) startSession();
  } else if (screen === "results") {
    if (overButton(534)) {
      if (roundNumber === 3) startSession();
      else { roundNumber++; startRound(); }
    } else if (overButton(602)) {
      if (roundNumber === 3) screen = "levels";
      else startRound(false);
    }
  } else if (screen === "paused") {
    if (overButton(402)) screen = "playing";
    else if (overButton(480)) startRound(false);
    else if (overButton(558)) requestLeave("levels");
  } else if (screen === "exit") {
    if (overButton(574)) screen = "levels";
    else if (overButton(652)) requestLeave("home");
  } else if (screen === "playing") {
    const usingTouch = event && (event.pointerType === "touch" || event.type === "touchstart");
    // Bigger touch areas can overlap: pick the closest available shape.
    let nearest = usingTouch ? max(pieceRadius + 18, 32 / zoom) : pieceRadius + 8;
    for (let i = 0; i < shapes.length; i++) {
      const piece = shapes[i];
      const distance = dist(pointerX(), pointerY(), piece.x, piece.y);
      if (!piece.done && !piece.motion && distance < nearest) {
        held = i;
        nearest = distance;
      }
    }
    if (held >= 0) {
      pickupX = pointerX();
      pickupY = pointerY();
      // Touch: center the shape 64 screen pixels above the finger.
      // Mouse: keep the point where the player grabbed it.
      dragX = usingTouch ? 0 : pickupX - shapes[held].x;
      dragY = usingTouch ? 64 / zoom : pickupY - shapes[held].y;
    }
  }
  return false;
}

function mouseDragged() {
  if (screen === "playing" && held >= 0) {
    if (dist(pointerX(), pointerY(), pickupX, pickupY) < 8 / zoom) return false;
    shapes[held].x = constrain(pointerX() - dragX, center - panelWidth / 2 + pieceRadius, center + panelWidth / 2 - pieceRadius);
    shapes[held].y = constrain(pointerY() - dragY, 240, 605);
  }
  return false;
}

function mouseReleased() {
  if (screen !== "playing" || held < 0) return false;
  // A tap or small finger wobble isn't a missed attempt.
  if (dist(pointerX(), pointerY(), pickupX, pickupY) < 8 / zoom) {
    movePiece(shapes[held], "return");
    held = -1;
    return false;
  }
  // Update once more in case a fast drag ends between frames.
  mouseDragged();
  const s = shapes[held];
  held = -1;
  if (dist(s.x, s.y, s.homeX, s.homeY) < 8) return false;
  attempts++;
  if (dist(s.x, s.y, s.targetX, s.targetY) <= fitTolerance) {
    s.done = true;
    s.successAt = playTime;
    movePiece(s, "snap");
    matched++;
    giveFeedback("Matched! Nice work.", matched === shapes.length ? "You matched every shape!" : (shapes.length - matched) + " shapes left. Keep going!", "#239c5d");
    if (matched === shapes.length) {
      completedAt = playTime;
      screen = "finishing";
    }
  } else {
    const distance = dist(s.x, s.y, s.targetX, s.targetY);
    const wrongTarget = shapes.some(other => other !== s && dist(s.x, s.y, other.targetX, other.targetY) < pieceRadius + 10);
    s.errorAt = playTime;
    s.dropX = s.x;
    s.dropY = s.y;
    s.redUntil = playTime + 0.9;
    movePiece(s, "return");
    giveFeedback(wrongTarget ? "Different shape — try again." : distance < pieceRadius * 2 ? "Almost! Line up the centers." : "Not quite inside the outline.", "Try again when the shape returns.", "#bf3f4b");
  }
  return false;
}

function keyPressed() {
  if (key === "Escape") { goBack(); return false; }
  if (key === "Enter" && screen === "instructions") startSession();
  else if (key === "Enter" && screen === "paused") screen = "playing";
}

function pauseRound() {
  if (held >= 0) movePiece(shapes[held], "return");
  held = -1;
  screen = "paused";
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Reposition the board safely after an orientation change.
  if (screen === "playing" || screen === "paused" || screen === "finishing") {
    zoom = min(1, height / 760);
    center = width / zoom / 2;
    panelWidth = min(width / zoom - 32, 720);
    const spread = min(panelWidth - 28, 570) * 0.27;
    for (let s of shapes) {
      s.homeX = center - spread;
      s.targetX = center + spread;
      s.x = s.done ? s.targetX : s.homeX;
      s.y = s.done ? s.targetY : s.homeY;
      s.motion = "";
    }
    held = -1;
  }
}


// Shared navigation uses large tap areas instead of tiny icon-only controls.
function hitBox(x, y, w, h) {
  return pointerX() > x && pointerX() < x + w && pointerY() > y && pointerY() < y + h;
}

function smallButton(label, x, y, w, selected = false) {
  const hover = hitBox(x, y, w, 52);
  if (hover) cursor("pointer");
  fill(selected ? "#2d6cf0" : "#f3f7fd");
  stroke(hover ? "#2d6cf0" : "#dce6f2");
  strokeWeight(1);
  rect(x, y, w, 52, 16);
  words(label, x + w / 2, y + 26, 16, selected ? "#ffffff" : "#1b2a5a", true);
}

function drawNavigation() {
  smallButton("‹ Back", center - panelWidth / 2 + 16, 18, 72);
  smallButton("⌂ Home", center + panelWidth / 2 - 88, 18, 72);
  if (screen === "exit") return;
  const w = min(panelWidth - 40, 360);
  if (screen === "playing" || screen === "finishing") {
    const half = (w - 12) / 2;
    smallButton(screen === "finishing" ? "✓ Done" : "Ⅱ Pause", center - half - 6, 678, half);
    smallButton("× Exit", center + 6, 678, half);
  } else smallButton("× Exit game", center - w / 2, 678, w);
}

function goBack() {
  if (screen === "leave") screen = leaveFrom;
  else if (screen === "levels") requestLeave("home");
  else if (screen === "instructions" || screen === "exit") screen = "levels";
  else if (screen === "playing") pauseRound();
  else if (screen === "paused") screen = "playing";
  else if (screen === "results") requestLeave("levels");
}

function requestLeave(destination) {
  leaveTo = destination;
  if (!sessionActive) { performLeave(); return; }
  if (screen === "playing") pauseRound();
  leaveFrom = screen;
  screen = "leave";
}

function performLeave() {
  sessionActive = false;
  held = -1;
  shapes = [];
  if (leaveTo === "home" && HOME_URL) window.location.assign(HOME_URL);
  else screen = leaveTo === "levels" ? "levels" : "exit";
}

function drawLeave() {
  noStroke();
  fill("#ffffff");
  rect(center - panelWidth / 2, 16, panelWidth, 728, 28);
  words("TINY TOUCH", center, 70, 13, "#2d6cf0", true);
  words("Leave this session?", center, 255, min(29, panelWidth / 11), "#1b2a5a", true);
  words(roundResults.length + " of 3 rounds finished.", center, 306, 19, "#5e6a82");
  words("Your current session will end.\nYour saved personal best will stay.", center, 357, min(17, panelWidth / 21), "#5e6a82");
  button("Keep playing", 420);
  button(leaveTo === "home" ? "Leave and go home" : "Leave session", 496, "#ffe3e5");
}

function drawExit() {
  shapeIcon(3, center, 229, 49, "#ffcf48", true);
  words("See you next time!", center, 340, min(29, panelWidth / 11), "#1b2a5a", true);
  words("Every little bit of practice counts.", center, 398, min(18, panelWidth / 21), "#5e6a82");
  words("You're out of the game now.", center, 438, 16, "#5e6a82");
  button("Play again", 574);
  button("Go home", 652, "#f0f8ff");
}

function drawCheck(x, y) {
  noStroke(); fill("#239c5d"); circle(x, y, 18);
  stroke("#ffffff"); strokeWeight(2);
  line(x - 4, y, x - 1, y + 3);
  line(x - 1, y + 3, x + 5, y - 4);
}
