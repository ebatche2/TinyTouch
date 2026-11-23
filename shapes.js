// Tiny Touch: Drag Shapes. Paste this whole file into sketch.js.
// Colors shared with the rest of the Tiny Touch app
const NAVY = "#1B2A5A", BLUE = "#2D6CF0", BLUE_HOVER = "#4A84F5", MUTED = "#5E6A82", BORDER = "#E3E8F1";
const GREEN = "#2EAD5B", RED = "#E5484D", GOLD = "#FFC83D", BG = "#F5F8FE", LIGHT_BLUE = "#EAF2FF";
const GOLD_DARK = "#F2A900", STAR_OFF = "#C9CFDB", CONFETTI = ["#2D6CF0", "#FFC83D", "#E36BD6", "#2EAD5B", "#FF6A1A"];
// One color per level, like the level pills in Car Obstacles and Trace the Path
const levelColors = [
  { color: "#7DD87A", dark: "#2EAD5B" }, { color: "#FFE07A", dark: "#D9A400" },
  { color: "#FFB27A", dark: "#E07020" }, { color: "#FF8A8A", dark: "#E5484D" }
];
let screen = "levels", level = 0;
let shapes = [], held = -1;
let timeLeft = 30, attempts = 0, matched = 0;
let dragX = 0, dragY = 0, message = "", timeUp = false;
let pickupX = 0, pickupY = 0;
let messageDetail = "", messageColor = MUTED, feedbackTime = 0;
let playTime = 0, completedAt = 0, resultAge = 0;
let zoom = 1, center = 195, panelWidth = 390, offsetX = 0, offsetY = 0; // the game is drawn on a 390 x 760 page, centered in the window
let btns = [];
let roundNumber = 1, roundResults = [], sessionActive = false;
let sourceRows = [], targetRows = [];
let pieceRadius = 43, fitTolerance = 24, practice = false;
let leaveFrom = "levels", leaveTo = "levels";
let personalBest = 0, newBest = false, storageAvailable = true;
// Return to the Home screen that opened the game. Set to "" in a standalone editor.
const HOME_URL = "index.html#entry.html";
const levels = ["Easy", "Medium", "Hard", "Expert"];
const colors = ["#fa6267", "#258fff", "#ffcd52", "#62c875", "#af82e5", "#f3944f"];
const shapeCounts = [3, 4, 5, 6];
const sizes = [43, 38, 30, 24];
// Smaller distances require more accurate alignment with the outline.
const tolerance = [24, 18, 13, 9];

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.style("display", "block");
  textFont("Arial");
  textAlign(CENTER, CENTER);
  describe("Drag Shapes. Play three rounds with fresh layouts. Choose a timer or untimed practice. Drag shapes into matching outlines. The pause button opens Resume, Restart, Change level, and Home; leaving an active session asks for confirmation.");
}

function draw() {
  // The page is 390 wide, in the top-left corner of a white window (like Trace the Path and Car Obstacles).
  // Only on small windows is it scaled down, so every control stays on screen.
  zoom = min(1, height / 720, width / 390);
  offsetX = 0;
  offsetY = 0;
  const info = screen === "results" ? resultInfo() : null;
  background("#ffffff");
  cursor(held >= 0 ? "grabbing" : "default");
  btns = [];
  push();
  scale(zoom);
  noStroke();
  fill(info ? (info.score >= 70 ? "#EAF4FF" : "#FDEFF7") : BG);
  rect(0, 0, 390, 760);

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
  if (screen === "playing" || screen === "paused" || screen === "finishing") { drawGame(); drawTopBar(); }
  if (screen === "paused") drawPause();
  if (screen === "results") drawResults();
  if (screen === "leave") drawLeave();
  gameMusic.setPlaying(screen === "playing", "shapes");
  pop();
}

function drawLevels() {
  drawBackArrow(goBack);
  words("Drag Shapes", center, 50, 24, NAVY, true);

  // preview card: a shape slides into its outline
  card(30, 90, 330, 180);
  drawShapeDemo(30, 90, 330, 180, 30);

  words("Match the Shapes", center, 305, 22, NAVY, true);
  words("Drag each shape into its outline.", center, 333, 15, MUTED);
  words("Choose a level:", 34, 366, 14, NAVY, true, LEFT);
  for (let i = 0; i < 4; i++) levelPill(i, 30, 392 + i * 58);
  button("Start", 30, 640, 330, 56, "primary", () => { screen = "instructions"; });
}

// A level choice, drawn like the level pills in Car Obstacles
function levelPill(i, x, y) {
  const w = 330, h = 48, on = level === i, over = hitBox(x, y, w, h);
  if (over) cursor("pointer");
  noStroke();
  fill(0, 20);
  rect(x, y + 3, w, h, 24);
  fill(levelColors[i].color);
  rect(x, y, w, h, 24);
  if (on) { stroke(NAVY); strokeWeight(3); noFill(); rect(x, y, w, h, 24); }
  for (let k = 0; k <= i; k++) drawStar(x + 26 + k * 20, y + h / 2, 9, 4, on ? "#FFFFFF" : levelColors[i].dark);
  words(levels[i] + " - " + shapeCounts[i] + " shapes", x + w / 2 + 24, y + h / 2, 18, NAVY, on);   // +24 keeps it clear of the stars
  if (on) {
    stroke(NAVY); strokeWeight(3);
    line(x + w - 38, y + h / 2, x + w - 32, y + h / 2 + 6);
    line(x + w - 32, y + h / 2 + 6, x + w - 22, y + h / 2 - 6);
    noStroke();
  }
  btns.push({ x, y, w, h, fn: () => { level = i; } });
}

// A looping demo: a shape slides into its outline, which turns green
function drawShapeDemo(x, y, w, h, r) {
  const cycle = floor(millis() / 3200), t = (millis() % 3200) / 3200, type = cycle % 6;
  const ax = x + 80, bx = x + w - 80, cy = y + h / 2 + 6;
  const k = constrain((t - 0.15) / 0.45, 0, 1), ease = k * k * (3 - 2 * k), arrived = k === 1;
  words("PICK UP", ax, y + 26, 11, "#718299", true);
  words("MATCH HERE", bx, y + 26, 11, "#718299", true);
  shapeIcon(type, bx, cy, r, arrived ? GREEN : "#8998b0", false);
  shapeIcon(type, lerp(ax, bx, ease), cy, r, colors[type], true);
  if (arrived) shapeIcon(type, bx, cy, r + 4, GREEN, false);
}

function drawInstructions() {
  drawBackArrow(goBack);
  words("Drag Shapes", center, 50, 24, NAVY, true);

  // which level the player picked
  const label = levels[level] + "  ·  3 rounds";
  textSize(14);
  textStyle(BOLD);
  const pillW = textWidth(label) + 32;
  noStroke();
  fill(BLUE);
  rect(center - pillW / 2, 78, pillW, 30, 15);
  words(label, center, 93, 14, "#ffffff", true);

  // demo card
  card(30, 130, 330, 300);
  drawShapeDemo(30, 130, 330, 300, 38);

  words("How to play", center, 470, 19, NAVY, true);
  words("Pick up a shape and drag it.\nLet go when it fits the outline.", center, 512, 16, MUTED);
  words("On phones, shapes lift above your finger.", center, 543, 13, MUTED);

  // timer choice
  toggle("30s timer", 30, 560, 160, 44, !practice, () => { practice = false; });
  toggle("No timer", 200, 560, 160, 44, practice, () => { practice = true; });

  button("Start", 30, 640, 330, 56, "primary", startSession);
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
  giveFeedback("Ready? Pick up a shape.", "Line up the centers, then let go.", MUTED);
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
  gameMusic.setPlaying(true, "shapes");
}

function drawGame() {
  drawTimeBar();
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
      if (distance < pieceRadius * 2) shade = distance <= fitTolerance ? GREEN : "#d69925";
    }
    shapeIcon(s.type, s.targetX, s.targetY, pieceRadius, shade, false);
    if (s.done) {
      shapeIcon(s.type, s.targetX, s.targetY, pieceRadius + 4, GREEN, false);
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

// The top bar, laid out like the one in Car Obstacles: pause, progress bar, round counter, level name
function drawTopBar() {
  noStroke();
  fill(255, 150);
  rect(0, 0, 390, 92);
  const over = screen === "playing" && dist(pointerX(), pointerY(), 40, 50) < 24;
  if (over) cursor("pointer");
  fill(0, 30);
  circle(40, 53, 46);
  fill(over ? LIGHT_BLUE : "#ffffff");
  circle(40, 50, 46);
  fill(BLUE);
  rect(32, 40, 6, 20, 2);
  rect(42, 40, 6, 20, 2);
  if (screen === "playing") btns.push({ x: 16, y: 26, w: 48, h: 48, fn: pauseRound });

  fill(BORDER);
  rect(80, 44, 210, 14, 7);
  if (matched) { fill(GREEN); rect(80, 44, 210 * matched / shapes.length, 14, 7); }

  fill(BLUE);
  rect(304, 34, 64, 32, 16);
  words(roundNumber + "/3", 336, 50, 16, "#ffffff", true);
  words(levels[level] + " - " + shapes.length + " shapes", 185, 76, 13, NAVY, true);
}

function drawTimeBar() {
  words(matched + " / " + shapes.length + " matched", 360, 121, 16, NAVY, true, RIGHT);
  if (practice) {
    words("No timer", 30, 121, 18, BLUE, true, LEFT);
    return;
  }
  const shade = timeLeft > 10 ? "#258fff" : timeLeft > 5 ? "#e3a126" : "#dd4b59";
  words(ceil(timeLeft) + "s left", 30, 121, 21, shade, true, LEFT);
  const x = 30, w = 330;
  const elapsed = 1 - timeLeft / 30;
  noStroke();
  fill("#e4f1fa");
  rect(x, 141, w, 14, 7);
  fill(shade);
  if (timeLeft > 0) rect(x + w * elapsed, 141, w * (1 - elapsed), 14, 7);
  stroke("#ffffff");
  strokeWeight(2);
  circle(x + w * elapsed, 148, 19);
  // The marker moves left to right as the colored time runs out.
  if (timeLeft <= 5 && screen === "playing") {
    noFill();
    stroke(221, 75, 89, 80 + sin(playTime * 4) * 40);
    rect(x - 4, 137, w + 8, 22, 11);
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
  let shade = feedbackTime > 0 ? messageColor : MUTED;
  if (held >= 0) {
    const s = shapes[held], d = dist(s.x, s.y, s.targetX, s.targetY);
    title = "Find the matching outline";
    detail = "Keep holding as you move.";
    shade = "#258fff";
    if (d <= fitTolerance) {
      title = "Perfect position — let go!";
      detail = "The green outline means it fits.";
      shade = GREEN;
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
  rect(30, 620, 330, 50, 12);
  words(title, center, 636, min(18, panelWidth / 17), shade, true);
  words(detail, center, 656, min(15, panelWidth / 22), MUTED);
}

function drawPause() {
  btns = [];                       // nothing underneath can be tapped while paused
  noStroke();
  fill(27, 42, 90, 150);
  rect(0, 0, 390, 760);
  fill(255);
  rect(45, 200, 300, 432, 24);
  words("Paused", center, 245, 26, NAVY, true);
  words(practice ? "Your shapes are safe here." : "Your timer is paused.", center, 277, 15, MUTED);
  button("Resume", 75, 300, 240, 52, "primary", () => { screen = "playing"; });
  button("Restart", 75, 367, 240, 52, "secondary", () => startRound(false));
  button("Change level", 75, 434, 240, 52, "secondary", () => requestLeave("levels"));
  button("Home", 75, 501, 240, 52, "secondary", () => requestLeave("home"));
  button(gameMusic.label(), 75, 564, 240, 52, "secondary", gameMusic.toggle);
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

// The numbers the results page shows (a finished session, or just one round)
function resultInfo() {
  const finalRound = roundNumber === 3, stats = sessionStats();
  return { finalRound, stats, score: finalRound ? stats.score : accuracy() };
}

function drawResults() {
  const { finalRound, stats, score } = resultInfo();
  const passed = score >= 70, stars = score >= 90 ? 3 : score >= 80 ? 2 : passed ? 1 : 0;
  resultAge += deltaTime / 1000;

  // falling confetti when they did well
  if (passed) {
    noStroke();
    for (let i = 0; i < 50; i++) {
      push();
      translate((i * 73 + i * i * 7) % 390, ((i * 131 + resultAge * (60 + (i % 4) * 25)) % 800) - 40);
      rotate(resultAge * (2 + (i % 3)) + i);
      fill(CONFETTI[i % 5]);
      rect(-4, -6, 8, 12, 2);
      pop();
    }
  }

  // star buddy (happy or sad), bouncing a little
  drawStarBuddy(center, 190 + sin(frameCount * 0.08) * 6, passed);
  words(finalRound ? "Session complete!" : timeUp ? "Round finished" : "Great match!", center, 335, 34, NAVY, true);

  for (let i = 0; i < 3; i++) drawStar(center - 70 + i * 70, i === 1 ? 392 : 400, 28, 13, i < stars ? GOLD : STAR_OFF);

  words("Accuracy", center, 452, 17, MUTED);
  words(score + "%", center, 486, 30, passed ? GREEN : RED, true);
  words(finalRound ? stats.correct + " / " + stats.total + " shapes  ·  " + levels[level] + ", 3 rounds"
                   : matched + " / " + shapes.length + " matched  ·  " + levels[level] + ", round " + roundNumber + " of 3", center, 514, 14, MUTED);
  words(finalRound ? stats.misses + " missed drops" : (attempts - matched) + " missed drops  ·  " + (shapes.length - matched) + " unmatched", center, 536, 14, MUTED);
  if (finalRound) words((newBest ? "New personal best!  " : "Best: ") + personalBest + "%" + (storageAvailable ? "" : " (this visit only)"), center, 558, 14, GREEN, true);
  else words("Fresh positions in the next round.", center, 558, 14, MUTED);

  button(finalRound ? "Play Again" : "Next Round", 30, 584, 330, 56, "primary", () => {
    if (roundNumber === 3) startSession();
    else { roundNumber++; startRound(); }
  });
  button(finalRound ? "Choose Level" : "Retry Round", 30, 652, 330, 56, "secondary", () => {
    if (roundNumber === 3) screen = "levels";
    else startRound(false);
  });
}

// The happy / sad star from the Car Obstacles results page
function drawStar(x, y, r1, r2, col) {
  push();
  translate(x, y);
  noStroke();
  fill(col);
  beginShape();
  for (let i = 0; i < 10; i++) {
    const a = -HALF_PI + i * PI / 5, r = i % 2 === 0 ? r1 : r2;
    vertex(cos(a) * r, sin(a) * r);
  }
  endShape(CLOSE);
  pop();
}

function drawStarBuddy(x, y, happy) {
  noStroke();
  fill(255, 220, 90, 70);
  circle(x, y, 230);
  drawStar(x, y + 6, 100, 48, GOLD_DARK);
  drawStar(x, y, 96, 45, GOLD);
  fill(NAVY);
  ellipse(x - 22, y - 8, 14, 18);
  ellipse(x + 22, y - 8, 14, 18);
  fill(255);
  circle(x - 19, y - 12, 5);
  circle(x + 25, y - 12, 5);
  fill(255, 140, 140, 150);
  ellipse(x - 40, y + 12, 18, 10);
  ellipse(x + 40, y + 12, 18, 10);
  if (happy) {
    fill(NAVY);
    arc(x, y + 14, 40, 34, 0, PI, CHORD);
    fill("#FF7A7A");
    ellipse(x, y + 26, 18, 8);
  } else {
    noFill();
    stroke(NAVY);
    strokeWeight(4);
    arc(x, y + 32, 30, 22, PI + 0.3, TWO_PI - 0.3);
    noStroke();
    fill("#7CC4FF");
    ellipse(x + 26, y + 10, 8, 12);
  }
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

function words(label, x, y, size, shade, bold = false, align = CENTER) {
  noStroke();
  fill(shade);
  textSize(size);
  textLeading(size * 1.3);
  textStyle(bold ? BOLD : NORMAL);
  textAlign(align, CENTER);
  text(label, x, y);
}

// style: "primary" (solid blue), "secondary" (white, blue outline) or "danger" (red outline).
// Draws the button and remembers where it is, so mousePressed can run fn when it is tapped.
function button(label, x, y, w, h, style, fn) {
  const over = hitBox(x, y, w, h), primary = style === "primary", danger = style === "danger";
  const accent = danger ? RED : BLUE, off = over && mouseIsPressed ? 2 : 0;
  if (over) cursor("pointer");
  noStroke();
  fill(0, 30);
  rect(x, y + 4, w, h, 14);
  stroke(accent);
  strokeWeight(2);
  fill(primary ? (over ? BLUE_HOVER : BLUE) : over ? (danger ? "#FBD5D7" : LIGHT_BLUE) : (danger ? "#FDECEC" : "#ffffff"));
  rect(x, y + off, w, h, 14);
  noStroke();
  words(label, x + w / 2, y + h / 2 + off, h >= 54 ? 21 : 19, primary ? "#ffffff" : accent, true);
  btns.push({ x, y, w, h, fn });
}

// A two-way choice (like the timer): the chosen option is solid blue
function toggle(label, x, y, w, h, selected, fn) {
  const over = hitBox(x, y, w, h);
  if (over) cursor("pointer");
  fill(selected ? BLUE : "#ffffff");
  stroke(selected || over ? BLUE : BORDER);
  strokeWeight(selected || over ? 2 : 1);
  rect(x, y, w, h, 14);
  noStroke();
  words(label, x + w / 2, y + h / 2, 16, selected ? "#ffffff" : NAVY, true);
  btns.push({ x, y, w, h, fn });
}

// A white card with a thin border, like the cards on the other Tiny Touch pages
function card(x, y, w, h) {
  push();
  stroke(BORDER);
  strokeWeight(1);
  fill("#ffffff");
  rect(x, y, w, h, 18);
  pop();
}

function pointerX() { return mouseX / zoom - offsetX; }
function pointerY() { return mouseY / zoom - offsetY; }
function mousePressed(event) {
  // Buttons first. Each one was saved by button() or toggle() while drawing.
  for (let i = btns.length - 1; i >= 0; i--) {
    const b = btns[i];
    if (hitBox(b.x, b.y, b.w, b.h)) { b.fn(); return false; }
  }
  if (screen === "playing") {
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
    giveFeedback("Matched! Nice work.", matched === shapes.length ? "You matched every shape!" : (shapes.length - matched) + " shapes left. Keep going!", GREEN);
    if (matched === shapes.length) {
      gameMusic.setPlaying(false);
      gameSounds.complete("shapes", { finalRound: roundNumber === 3 });
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
    giveFeedback(wrongTarget ? "Different shape — try again." : distance < pieceRadius * 2 ? "Almost! Line up the centers." : "Not quite inside the outline.", "Try again when the shape returns.", RED);
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
  held = -1;   // drop anything being dragged; the page rescales itself in draw()
}


// Shared navigation uses large tap areas instead of tiny icon-only controls.
function hitBox(x, y, w, h) {
  return pointerX() > x && pointerX() < x + w && pointerY() > y && pointerY() < y + h;
}

// The same chevron back arrow the other Tiny Touch screens use
// The same chevron back arrow the other Tiny Touch screens use
function drawBackArrow(fn) {
  const hover = hitBox(15, 30, 40, 40);
  if (hover) cursor("pointer");
  stroke(hover ? BLUE_HOVER : NAVY);
  strokeWeight(3);
  noFill();
  line(36, 40, 26, 50);
  line(26, 50, 36, 60);
  noStroke();
  btns.push({ x: 15, y: 30, w: 40, h: 40, fn });
}

function goBack() {
  if (screen === "leave") screen = leaveFrom;
  else if (screen === "levels") requestLeave("home");
  else if (screen === "instructions") screen = "levels";
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
  else screen = "levels";
}

function drawLeave() {
  card(30, 200, 330, 330);
  words("Leave this session?", center, 255, 24, NAVY, true);
  words(roundResults.length + " of 3 rounds finished.", center, 305, 16, MUTED);
  words("Your current session will end.\nYour saved personal best will stay.", center, 350, 15, MUTED);
  button("Keep playing", 60, 400, 270, 52, "primary", () => { screen = leaveFrom; });
  button(leaveTo === "home" ? "Leave and go home" : "Leave session", 60, 467, 270, 52, "danger", performLeave);
}

function drawCheck(x, y) {
  noStroke(); fill(GREEN); circle(x, y, 18);
  stroke("#ffffff"); strokeWeight(2);
  line(x - 4, y, x - 1, y + 3);
  line(x - 1, y + 3, x + 5, y - 4);
}
