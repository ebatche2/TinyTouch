// =============================================
// Tiny Touch - ALL PAGES IN ONE FILE (p5.js)
// Paste this whole file into sketch.js.
//
// How it works:
// - Each page's code is inside its own function (welcomePage, accountPage, ...).
//   Things declared inside a function stay inside it, so every page can
//   have its own "cnv", "BLUE", "draw", etc. without clashing.
// - goTo("info.html") switches to another page. (The names match the
//   separate .html files, so the page code is the same as before.)
// - The real p5 functions at the bottom (setup, draw, mousePressed, ...)
//   just pass each event to whichever page is showing.
// =============================================

let page = null;        // the page that is showing now
let nextPage = "home.html";   // the page to show next (start on Welcome)

const PAGES = {
  "home.html": welcomePage,
  "account.html": accountPage,
  "login.html": loginPage,
  "info.html": infoPage,
  "goals.html": goalsPage,
  "entry.html": homePage,
  "password.html": passwordPage,
  "region.html": regionPage,
  "trace.html": tracePage,
  "trace-instructions.html": traceInstructionsPage,
  "trace-play.html": tracePlayPage,
  "trace-result.html": traceResultPage,
  "index.html": carPage
};

function goTo(name) {
  if (PAGES[name]) nextPage = name;
  else console.log("No page called " + name);
}

// switch pages at the start of a frame, so the old page finishes its click first
function switchPage() {
  removeElements();          // remove the old page's text boxes
  cursor(ARROW);
  // reset drawing settings so one page's style doesn't leak into the next
  textAlign(LEFT, BASELINE);
  textStyle(NORMAL);
  textSize(12);
  fill(255);
  stroke(0);
  strokeWeight(1);
  page = PAGES[nextPage]();  // run the page's function to get a fresh page
  nextPage = null;
  if (page.setup) page.setup();
}

// #############################################################
// 1. Welcome   (was home.js)
// #############################################################
function welcomePage() {
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
      if (overButton(338)) goTo("account.html");
      else if (overButton(416)) goTo("login.html");
    } else if (overButton(416)) screen = "welcome";
  }

  function keyPressed() {
    if (key === "Escape") screen = "welcome";
  }

  function windowResized() {
    resizeCanvas(windowWidth, max(windowHeight, 720));
    select("canvas").style("touch-action", "pan-y");
  }

  return { setup, draw, mousePressed, keyPressed, windowResized };
}

// #############################################################
// 2. Create Account   (was accountentry.js)
// #############################################################
function accountPage() {
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

    let linkX = startX + (textWidth(part1.trim()) + 5);
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

    // save the info (NOT the password) so the next pages can use it
    try {
      let saved = JSON.parse(localStorage.getItem("tinyTouchUser")) || {};
      Object.assign(saved, userData);
      localStorage.setItem("tinyTouchUser", JSON.stringify(saved));
    } catch (e) {}

    // show the success message for a moment, then go to Account Information
    setTimeout(() => {
      goTo("info.html");
    }, 1200);
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
    // back arrow -> Welcome page
    if (isOver(15, 30, 40, 40)) {
      goTo("home.html");
      return;
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

    // Log In link -> Log In page
    textSize(15);
    let part1 = "Already have an account? ";
    let total = textWidth(part1 + "Log In");
    let linkX = width / 2 - total / 2 + (textWidth(part1.trim()) + 5);
    if (isOver(linkX, LINK_Y - 12, textWidth("Log In"), 24)) {
      goTo("login.html");
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

  return { setup, draw, mousePressed, keyPressed, windowResized };
}
// #############################################################
// Log In   (was login.js)
// #############################################################
function loginPage() {
  // =============================================
  // Tiny Touch - Log In page (p5.js)
  // Comes from: home.html (Welcome -> Log In), account.html ("Already have an account? Log In")
  // Goes to:    entry.html (Home) after logging in,
  //             account.html ("Create Account" link), home.html (back arrow)
  //
  // Note: this prototype has no server, so it can only check that the email
  // matches the account made on this device. The password is NOT saved or
  // checked. A real app would send both to a secure server to check them.
  // =============================================

  let cnv;
  let fields = [];
  let errorMsg = "";
  let successMsg = "";
  let infoMsg = "";
  let shakeTime = 0;
  let leaveTimer = 0;
  let user = {};

  // ---------- Layout ----------
  const FIELD_START = 300;
  const FIELD_GAP = 74;
  const FORGOT_Y = 448;
  const BTN_Y = 490;
  const LINK_Y = 640;

  // ---------- Colors (match the other pages) ----------
  const BLUE = "#2D6CF0";
  const BLUE_HOVER = "#4A84F5";
  const NAVY = "#1B2A5A";
  const GRAY = "#6B7489";
  const FIELD_BORDER = "#E3E7EF";
  const RED = "#E5484D";
  const GREEN = "#2EAD5B";
  const BEAR = "#A0612E";
  const BEAR_LIGHT = "#E8C29E";

  function setup() {
    cnv = createCanvas(390, 760);
    textFont("Arial");
    user = loadUser();

    const fieldInfo = [
      { name: "Email Address", icon: "mail", type: "email" },
      { name: "Password",      icon: "lock", type: "password" }
    ];

    let y = FIELD_START;
    for (let info of fieldInfo) {
      let inp = createInput("");
      inp.attribute("placeholder", info.name);
      inp.elt.type = info.type;
      styleInput(inp, info.type === "password" ? 200 : 240);
      inp.input(() => {
        errorMsg = "";
        infoMsg = "";
      });
      fields.push({ name: info.name, icon: info.icon, type: info.type, input: inp,
                    x: 30, y: y, w: 330, h: 48 });
      y += FIELD_GAP;
    }

    // fill in the email if an account was made on this device
    if (user.email) fields[0].input.value(user.email);

    placeInputs(0);
  }

  function draw() {
    cursor(ARROW);
    background(255);

    // shake when something is wrong
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

    // ----- bear waving -----
    drawBear(width / 2, 150);

    // ----- title -----
    textAlign(CENTER, CENTER);
    fill(NAVY);
    textStyle(BOLD);
    textSize(28);
    text("Welcome Back!", width / 2, 230);
    textStyle(NORMAL);
    fill(GRAY);
    textSize(16);
    text("Log in to keep playing.", width / 2, 262);

    // ----- fields -----
    for (let f of fields) drawField(f, sx);

    // ----- Forgot password? -----
    textSize(14);
    textAlign(RIGHT, CENTER);
    let fw = textWidth("Forgot password?");
    let forgotHover = isOver(360 - fw, FORGOT_Y - 10, fw, 20);
    if (forgotHover) cursor(HAND);
    noStroke();
    fill(forgotHover ? BLUE_HOVER : BLUE);
    text("Forgot password?", 360, FORGOT_Y);

    // ----- Log In button -----
    drawButton("Log In", 30, BTN_Y, 330, 56);

    // ----- message under the button -----
    noStroke();
    textSize(14);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    if (errorMsg !== "") {
      fill(RED);
      text(errorMsg, width / 2, BTN_Y + 78);
    } else if (successMsg !== "") {
      fill(GREEN);
      text(successMsg, width / 2, BTN_Y + 78);
    } else if (infoMsg !== "") {
      fill(GRAY);
      textStyle(NORMAL);
      text(infoMsg, width / 2, BTN_Y + 78);
    }
    textStyle(NORMAL);

    // ----- "Don't have an account? Create Account" -----
    textSize(15);
    textAlign(LEFT, CENTER);
    let part1 = "Don't have an account? ";
    let part2 = "Create Account";
    let total = textWidth(part1 + part2);
    let startX = width / 2 - total / 2;
    fill(NAVY);
    text(part1, startX, LINK_Y);
    let linkX = startX + (textWidth(part1.trim()) + 5);
    let linkHover = isOver(linkX, LINK_Y - 12, textWidth(part2), 24);
    if (linkHover) cursor(HAND);
    fill(linkHover ? BLUE_HOVER : BLUE);
    text(part2, linkX, LINK_Y);
    stroke(linkHover ? BLUE_HOVER : BLUE);
    strokeWeight(1);
    line(linkX, LINK_Y + 9, linkX + textWidth(part2), LINK_Y + 9);

    // after logging in, wait a moment, then go Home
    if (leaveTimer > 0) {
      leaveTimer--;
      if (leaveTimer === 0) goTo("entry.html");
    }
  }

  // =============================================
  // Drawing one input box
  // =============================================
  function drawField(f, sx) {
    let x = f.x + sx;
    let focused = document.activeElement === f.input.elt;

    strokeWeight(focused ? 2 : 1);
    stroke(focused ? BLUE : FIELD_BORDER);
    fill(255);
    rect(x, f.y, f.w, f.h, 10);

    drawIcon(f.icon, x + 24, f.y + f.h / 2, focused ? BLUE : NAVY);

    // eye button for the password
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
  }

  // =============================================
  // Clicks + keys
  // =============================================
  function mousePressed() {
    // back arrow -> Welcome page
    if (isOver(15, 30, 40, 40)) {
      goTo("home.html");
      return;
    }

    // eye button
    let pw = fields[1];
    if (dist(mouseX, mouseY, pw.x + pw.w - 28, pw.y + pw.h / 2) < 16) {
      pw.input.elt.type = pw.input.elt.type === "password" ? "text" : "password";
    }

    // Forgot password?
    textSize(14);
    let fw = textWidth("Forgot password?");
    if (isOver(360 - fw, FORGOT_Y - 10, fw, 20)) {
      errorMsg = "";
      infoMsg = "Ask a grown-up to help reset your password.";
    }

    // Log In button
    if (isOver(30, BTN_Y, 330, 56)) logIn();

    // Create Account link
    textSize(15);
    let part1 = "Don't have an account? ";
    let part2 = "Create Account";
    let linkX = width / 2 - textWidth(part1 + part2) / 2 + (textWidth(part1.trim()) + 5);
    if (isOver(linkX, LINK_Y - 12, textWidth(part2), 24)) goTo("account.html");
  }

  function keyPressed() {
    if (key === "Enter") logIn();
  }

  function logIn() {
    let email = fields[0].input.value().trim();
    let password = fields[1].input.value();
    infoMsg = "";

    if (email === "") return fail("Please enter your email.", 0);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("Enter a real email, like jay@email.com", 0);
    if (password === "") return fail("Please enter your password.", 1);
    if (!user.email) return fail("No account yet. Tap Create Account below.", 0);
    if (email.toLowerCase() !== user.email.toLowerCase()) {
      return fail("We couldn't find an account with that email.", 0);
    }

    errorMsg = "";
    successMsg = "Welcome back, " + (user.firstName || "friend") + "!";
    leaveTimer = 60;    // about 1 second
  }

  function fail(msg, fieldIndex) {
    errorMsg = msg;
    successMsg = "";
    shakeTime = 24;
    fields[fieldIndex].input.elt.focus();
  }

  // =============================================
  // Helpers
  // =============================================
  function drawBear(x, y) {
    push();
    translate(x, y);
    noStroke();
    fill("#EAF2FF");
    circle(0, 0, 100);
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
    // waving paw
    push();
    translate(36, 30);
    rotate(-0.6 + sin(frameCount * 0.12) * 0.35);
    fill(BEAR);
    ellipse(0, -14, 18, 30);
    pop();
    pop();
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

  function drawIcon(type, x, y, col) {
    stroke(col);
    strokeWeight(2);
    noFill();
    if (type === "mail") {
      rect(x - 11, y - 8, 22, 16, 2);
      line(x - 11, y - 8, x, y + 1);
      line(x + 11, y - 8, x, y + 1);
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


  // ---------- saved user info (shared by all pages) ----------
  function loadUser() {
    try {
      return JSON.parse(localStorage.getItem("tinyTouchUser")) || {};
    } catch (e) {
      return {};
    }
  }

  return { setup, draw, mousePressed, keyPressed, windowResized };
}

// #############################################################
// 3. Account Information   (was info.js)
// #############################################################
function infoPage() {
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

  return { setup, draw, mousePressed, keyPressed, windowResized };
}
// #############################################################
// 4. Set Your Goals   (was goals.js)
// #############################################################
function goalsPage() {
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

  return { setup, draw, mousePressed };
}

// #############################################################
// 5. Home Screen   (was entry.js)
// #############################################################
function homePage() {
  // =============================================
  // Tiny Touch - Home Screen (p5.js)
  // =============================================

  // ---------- User info (change these later) ----------
  let userName = "Jay";
  try {
    // use the first name typed on the Create Account page, if there is one
    let saved = JSON.parse(localStorage.getItem("tinyTouchUser")) || {};
    if (saved.firstName) userName = saved.firstName;
  } catch (e) {}
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

      // which page each button opens (the rest just show the message for now)
      let pages = {
        trace: "trace.html",       // Trace the Path
        car: "index.html",         // Car Obstacles
        avatar: "info.html",       // Profile
        profile: "info.html",
        gear: "password.html",     // Settings -> Edit Password
        settings: "password.html"
      };
      let page = pages[pressedItem.id];
      if (page) {
        // wait a moment so the bounce and message are seen
        setTimeout(() => {
          goTo(page);
        }, 400);
      }
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

  return { setup, draw, mousePressed, mouseReleased };
}
// #############################################################
// 6. Edit Password   (was password.js)
// #############################################################
function passwordPage() {
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

  return { setup, draw, mousePressed, keyPressed, windowResized };
}

// #############################################################
// 7. Region / Country   (was region.js)
// #############################################################
function regionPage() {
  // =============================================
  // Tiny Touch - Region / Country page (p5.js)
  // Screen #7: search and pick a country from the list.
  // Comes from: info.html (Region / Country row)
  // Goes to:    info.html (back arrow, or Save)
  // Scroll the list with the mouse wheel / trackpad, or drag it.
  // =============================================

  let cnv;
  let search;
  let user = {};
  let selected = "";
  let scrollY = 0;
  let dragStartY = null;
  let dragStartScroll = 0;
  let dragged = false;

  // ---------- Layout ----------
  const LIST_TOP = 150;
  const LIST_BOTTOM = 650;
  const ROW_H = 48;
  const BTN_Y = 672;

  // ---------- Colors ----------
  const BLUE = "#2D6CF0";
  const BLUE_HOVER = "#4A84F5";
  const LIGHT_BLUE = "#EAF2FF";
  const NAVY = "#1B2A5A";
  const GRAY = "#6B7489";
  const FIELD_BORDER = "#E3E7EF";

  // [two-letter code, name]. The first 4 are pinned to the top, like the design.
  const COUNTRIES = [
    ["US", "United States"], ["CA", "Canada"], ["GB", "United Kingdom"], ["AU", "Australia"],
    ["AF", "Afghanistan"], ["AL", "Albania"], ["DZ", "Algeria"], ["AD", "Andorra"], ["AO", "Angola"],
    ["AG", "Antigua and Barbuda"], ["AR", "Argentina"], ["AM", "Armenia"], ["AT", "Austria"],
    ["AZ", "Azerbaijan"], ["BS", "Bahamas"], ["BH", "Bahrain"], ["BD", "Bangladesh"], ["BB", "Barbados"],
    ["BY", "Belarus"], ["BE", "Belgium"], ["BZ", "Belize"], ["BJ", "Benin"], ["BT", "Bhutan"],
    ["BO", "Bolivia"], ["BA", "Bosnia and Herzegovina"], ["BW", "Botswana"], ["BR", "Brazil"],
    ["BN", "Brunei"], ["BG", "Bulgaria"], ["BF", "Burkina Faso"], ["BI", "Burundi"], ["CV", "Cabo Verde"],
    ["KH", "Cambodia"], ["CM", "Cameroon"], ["CF", "Central African Republic"], ["TD", "Chad"],
    ["CL", "Chile"], ["CN", "China"], ["CO", "Colombia"], ["KM", "Comoros"], ["CG", "Congo"],
    ["CD", "Congo (DRC)"], ["CR", "Costa Rica"], ["CI", "Côte d'Ivoire"], ["HR", "Croatia"], ["CU", "Cuba"],
    ["CY", "Cyprus"], ["CZ", "Czechia"], ["DK", "Denmark"], ["DJ", "Djibouti"], ["DM", "Dominica"],
    ["DO", "Dominican Republic"], ["EC", "Ecuador"], ["EG", "Egypt"], ["SV", "El Salvador"],
    ["GQ", "Equatorial Guinea"], ["ER", "Eritrea"], ["EE", "Estonia"], ["SZ", "Eswatini"], ["ET", "Ethiopia"],
    ["FJ", "Fiji"], ["FI", "Finland"], ["FR", "France"], ["GA", "Gabon"], ["GM", "Gambia"], ["GE", "Georgia"],
    ["DE", "Germany"], ["GH", "Ghana"], ["GR", "Greece"], ["GD", "Grenada"], ["GT", "Guatemala"],
    ["GN", "Guinea"], ["GW", "Guinea-Bissau"], ["GY", "Guyana"], ["HT", "Haiti"], ["HN", "Honduras"],
    ["HU", "Hungary"], ["IS", "Iceland"], ["IN", "India"], ["ID", "Indonesia"], ["IR", "Iran"], ["IQ", "Iraq"],
    ["IE", "Ireland"], ["IL", "Israel"], ["IT", "Italy"], ["JM", "Jamaica"], ["JP", "Japan"], ["JO", "Jordan"],
    ["KZ", "Kazakhstan"], ["KE", "Kenya"], ["KI", "Kiribati"], ["KW", "Kuwait"], ["KG", "Kyrgyzstan"],
    ["LA", "Laos"], ["LV", "Latvia"], ["LB", "Lebanon"], ["LS", "Lesotho"], ["LR", "Liberia"], ["LY", "Libya"],
    ["LI", "Liechtenstein"], ["LT", "Lithuania"], ["LU", "Luxembourg"], ["MG", "Madagascar"], ["MW", "Malawi"],
    ["MY", "Malaysia"], ["MV", "Maldives"], ["ML", "Mali"], ["MT", "Malta"], ["MH", "Marshall Islands"],
    ["MR", "Mauritania"], ["MU", "Mauritius"], ["MX", "Mexico"], ["FM", "Micronesia"], ["MD", "Moldova"],
    ["MC", "Monaco"], ["MN", "Mongolia"], ["ME", "Montenegro"], ["MA", "Morocco"], ["MZ", "Mozambique"],
    ["MM", "Myanmar"], ["NA", "Namibia"], ["NR", "Nauru"], ["NP", "Nepal"], ["NL", "Netherlands"],
    ["NZ", "New Zealand"], ["NI", "Nicaragua"], ["NE", "Niger"], ["NG", "Nigeria"], ["KP", "North Korea"],
    ["MK", "North Macedonia"], ["NO", "Norway"], ["OM", "Oman"], ["PK", "Pakistan"], ["PW", "Palau"],
    ["PS", "Palestine"], ["PA", "Panama"], ["PG", "Papua New Guinea"], ["PY", "Paraguay"], ["PE", "Peru"],
    ["PH", "Philippines"], ["PL", "Poland"], ["PT", "Portugal"], ["PR", "Puerto Rico"], ["QA", "Qatar"],
    ["RO", "Romania"], ["RU", "Russia"], ["RW", "Rwanda"], ["KN", "Saint Kitts and Nevis"],
    ["LC", "Saint Lucia"], ["VC", "Saint Vincent and the Grenadines"], ["WS", "Samoa"], ["SM", "San Marino"],
    ["ST", "São Tomé and Príncipe"], ["SA", "Saudi Arabia"], ["SN", "Senegal"], ["RS", "Serbia"],
    ["SC", "Seychelles"], ["SL", "Sierra Leone"], ["SG", "Singapore"], ["SK", "Slovakia"], ["SI", "Slovenia"],
    ["SB", "Solomon Islands"], ["SO", "Somalia"], ["ZA", "South Africa"], ["KR", "South Korea"],
    ["SS", "South Sudan"], ["ES", "Spain"], ["LK", "Sri Lanka"], ["SD", "Sudan"], ["SR", "Suriname"],
    ["SE", "Sweden"], ["CH", "Switzerland"], ["SY", "Syria"], ["TW", "Taiwan"], ["TJ", "Tajikistan"],
    ["TZ", "Tanzania"], ["TH", "Thailand"], ["TL", "Timor-Leste"], ["TG", "Togo"], ["TO", "Tonga"],
    ["TT", "Trinidad and Tobago"], ["TN", "Tunisia"], ["TR", "Türkiye"], ["TM", "Turkmenistan"],
    ["TV", "Tuvalu"], ["UG", "Uganda"], ["UA", "Ukraine"], ["AE", "United Arab Emirates"], ["UY", "Uruguay"],
    ["UZ", "Uzbekistan"], ["VU", "Vanuatu"], ["VA", "Vatican City"], ["VE", "Venezuela"], ["VN", "Vietnam"],
    ["YE", "Yemen"], ["ZM", "Zambia"], ["ZW", "Zimbabwe"]
  ];

  function setup() {
    cnv = createCanvas(390, 760);
    textFont("Arial");
    user = loadUser();
    selected = user.region || "United States";

    search = createInput("");
    search.attribute("placeholder", "Search for a country...");
    search.size(280, 28);
    search.style("border", "none");
    search.style("outline", "none");
    search.style("background", "transparent");
    search.style("font-size", "16px");
    search.style("font-family", "Arial");
    search.style("color", NAVY);
    search.input(() => (scrollY = 0));   // jump to the top when searching
    placeInputs();
  }

  function draw() {
    cursor(ARROW);
    background(255);

    let list = filteredList();

    // ----- the country list (drawn first, so the header covers it) -----
    let maxScroll = max(0, list.length * ROW_H - (LIST_BOTTOM - LIST_TOP));
    scrollY = constrain(scrollY, 0, maxScroll);

    for (let i = 0; i < list.length; i++) {
      let y = LIST_TOP + i * ROW_H - scrollY;
      if (y + ROW_H < LIST_TOP || y > LIST_BOTTOM) continue;   // off screen
      drawCountry(list[i], y);
    }
    if (list.length === 0) {
      noStroke();
      fill(GRAY);
      textSize(15);
      textAlign(CENTER, CENTER);
      text("No countries match your search.", width / 2, LIST_TOP + 40);
    }

    // ----- header (covers rows that scroll up) -----
    noStroke();
    fill(255);
    rect(0, 0, width, LIST_TOP);
    drawBackArrow();
    noStroke();
    fill(NAVY);
    textStyle(BOLD);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("Region / Country", width / 2, 50);
    textStyle(NORMAL);

    // search box
    let focused = document.activeElement === search.elt;
    stroke(focused ? BLUE : FIELD_BORDER);
    strokeWeight(focused ? 2 : 1);
    fill("#F7F9FC");
    rect(30, 86, 330, 46, 23);
    stroke(GRAY);
    strokeWeight(2);
    noFill();
    circle(54, 106, 14);
    line(59, 111, 65, 117);

    // ----- footer with Save button -----
    noStroke();
    fill(255);
    rect(0, LIST_BOTTOM, width, height - LIST_BOTTOM);
    stroke(FIELD_BORDER);
    strokeWeight(1);
    line(0, LIST_BOTTOM, width, LIST_BOTTOM);
    drawButton("Save", 30, BTN_Y, 330, 56);
  }

  function drawCountry(c, y) {
    let on = c[1] === selected;
    let hover = mouseY > LIST_TOP && mouseY < LIST_BOTTOM && isOver(20, y, 350, ROW_H);
    if (hover) cursor(HAND);

    noStroke();
    fill(on ? LIGHT_BLUE : hover ? "#F7F9FC" : 255);
    rect(20, y + 2, 350, ROW_H - 4, 10);

    textAlign(LEFT, CENTER);
    textSize(24);
    fill(0);
    text(flagOf(c[0]), 36, y + ROW_H / 2);

    fill(on ? BLUE : NAVY);
    textSize(16);
    textStyle(on ? BOLD : NORMAL);
    text(c[1], 80, y + ROW_H / 2);
    textStyle(NORMAL);

    // radio circle on the right
    noFill();
    stroke(on ? BLUE : GRAY);
    strokeWeight(2);
    circle(346, y + ROW_H / 2, 20);
    if (on) {
      noStroke();
      fill(BLUE);
      circle(346, y + ROW_H / 2, 10);
    }
  }

  // countries whose name contains what was typed in the search box
  function filteredList() {
    let q = search.value().trim().toLowerCase();
    if (q === "") return COUNTRIES;
    return COUNTRIES.filter((c) => c[1].toLowerCase().includes(q));
  }

  // turns "US" into the 🇺🇸 flag emoji
  function flagOf(code) {
    return String.fromCodePoint(...[...code].map((ch) => 127397 + ch.charCodeAt(0)));
  }

  // =============================================
  // Clicks, dragging, and scrolling
  // =============================================
  function mousePressed() {
    if (isOver(15, 30, 40, 40)) {
      goTo("info.html");
      return;
    }
    if (isOver(30, BTN_Y, 330, 56)) {
      let c = COUNTRIES.find((c) => c[1] === selected);
      user.region = c[1];
      user.flag = flagOf(c[0]);
      saveUser(user);
      goTo("info.html");
      return;
    }
    if (mouseY > LIST_TOP && mouseY < LIST_BOTTOM) {
      dragStartY = mouseY;
      dragStartScroll = scrollY;
      dragged = false;
    }
  }

  function mouseDragged() {
    if (dragStartY === null) return;
    if (abs(mouseY - dragStartY) > 6) dragged = true;
    scrollY = dragStartScroll - (mouseY - dragStartY);
  }

  // a tap (not a drag) on a row picks that country
  function mouseReleased() {
    if (dragStartY !== null && !dragged) {
      let i = floor((mouseY - LIST_TOP + scrollY) / ROW_H);
      let list = filteredList();
      if (i >= 0 && i < list.length) selected = list[i][1];
    }
    dragStartY = null;
  }

  function mouseWheel(event) {
    if (mouseY > LIST_TOP && mouseY < LIST_BOTTOM) {
      scrollY += event.delta;
      return false;   // don't scroll the whole web page
    }
  }

  // =============================================
  // Helpers
  // =============================================
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

  function placeInputs() {
    let p = cnv.position();
    search.position(p.x + 74, p.y + 95);
  }

  function windowResized() {
    placeInputs();
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

  return { setup, draw, mousePressed, mouseReleased, mouseDragged, mouseWheel, windowResized };
}
// #############################################################
// 8. Trace the Path   (was trace.js)
// #############################################################
function tracePage() {
  // =============================================
  // Tiny Touch - Select Trace the Path page (p5.js)
  // Screen #8: pick a difficulty, then tap Start.
  // Comes from: entry.html (Trace the Path card)
  // Goes to:    entry.html (back arrow), trace-instructions.html (Start)
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
      user.traceRound = 1;          // start at path 1 of 3
      saveUser(user);
      goTo("trace-instructions.html");
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

  return { setup, draw, mousePressed };
}

// #############################################################
// 9. Trace the Path: Instructions   (was trace-instructions.js)
// #############################################################
function traceInstructionsPage() {
  // =============================================
  // Tiny Touch - Trace the Path: Instructions (p5.js)
  // Screen #9: shows how to play, then Start.
  // Comes from: trace.html (Start)
  // Goes to:    trace-play.html (Start), trace.html (back arrow)
  // =============================================

  let user = {};
  let demoT = 0;       // moves the demo finger along the path

  const LEVEL_NAMES = ["Easy", "Medium", "Hard", "Expert"];

  // ---------- Layout ----------
  const BTN_Y = 640;

  // ---------- Colors ----------
  const BLUE = "#2D6CF0";
  const BLUE_HOVER = "#4A84F5";
  const NAVY = "#1B2A5A";
  const GRAY = "#5E6A82";
  const BG = "#F5F8FE";
  const GOLD = "#FFC83D";
  const GREEN = "#2EAD5B";
  const SKIN = "#F5C6A5";

  function setup() {
    createCanvas(390, 760);
    textFont("Arial");
    user = loadUser();
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

    // which level + path the player is on
    let level = LEVEL_NAMES[user.traceLevel || 0];
    let pathNum = user.traceRound || 1;
    let label = level + "  ·  Path " + pathNum + " of 3";
    textSize(14);
    textStyle(BOLD);
    let pillW = textWidth(label) + 32;     // pill grows to fit the words
    fill(BLUE);
    rect(width / 2 - pillW / 2, 78, pillW, 30, 15);
    fill(255);
    text(label, width / 2, 93);
    textStyle(NORMAL);

    // ----- demo card -----
    fill(255);
    stroke("#E3E8F1");
    strokeWeight(1);
    rect(30, 130, 330, 300, 20);
    drawDemo();

    // ----- how to play -----
    noStroke();
    fill(NAVY);
    textSize(19);
    textStyle(BOLD);
    text("How to play", width / 2, 470);
    textStyle(NORMAL);
    fill(GRAY);
    textSize(16);
    text("Follow the dotted line with your finger.\nStay on the path to reach the star.", width / 2, 512);

    // the 2 rules as little color keys
    drawKey(48, 570, GREEN, "Green = on the path");
    drawKey(212, 570, "#E5484D", "Red = off the path");

    drawButton("Start", 30, BTN_Y, 330, 56);
  }

  // a dotted path, a star, and a finger tracing it (green line behind)
  function drawDemo() {
    demoT += 0.005;
    if (demoT > 1.25) demoT = 0;          // short pause at the end
    let t = min(demoT, 1);

    // dotted path
    noStroke();
    fill(NAVY);
    for (let s = 0; s <= 1; s += 0.035) {
      let p = demoPoint(s);
      circle(p.x, p.y, 7);
    }
    // green part already traced
    stroke(GREEN);
    strokeWeight(10);
    noFill();
    beginShape();
    for (let s = 0; s <= t; s += 0.01) {
      let p = demoPoint(s);
      vertex(p.x, p.y);
    }
    endShape();

    // star at the end (bounces)
    let end = demoPoint(1);
    drawStar(end.x + 4, end.y - 6 + sin(frameCount * 0.1) * 3, 24, 11, GOLD);

    // start dot
    let start = demoPoint(0);
    noStroke();
    fill(BLUE);
    circle(start.x, start.y, 22);

    // finger
    let f = demoPoint(t);
    drawFinger(f.x, f.y);
  }

  function demoPoint(s) {
    let x = lerp(70, 300, s);
    let y = lerp(370, 200, s) - 45 * sin(s * TWO_PI);
    return { x: x, y: y };
  }

  function drawFinger(x, y) {
    push();
    translate(x, y);
    noStroke();
    fill(0, 25);
    circle(0, 0, 26);
    fill(SKIN);
    rect(-9, 0, 18, 46, 9);        // finger
    rect(-20, 30, 40, 50, 14);     // hand
    fill(255, 120);
    ellipse(0, 6, 10, 8);          // fingernail shine
    pop();
  }

  function drawKey(x, y, col, label) {
    noStroke();
    fill(col);
    rect(x, y - 4, 24, 8, 4);
    fill(GRAY);
    textSize(13);
    textAlign(LEFT, CENTER);
    text(label, x + 32, y);
    textAlign(CENTER, CENTER);
  }

  // =============================================
  // Clicks
  // =============================================
  function mousePressed() {
    if (isOver(15, 30, 40, 40)) {
      goTo("trace.html");
      return;
    }
    if (isOver(30, BTN_Y, 330, 56)) goTo("trace-play.html");
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


  // ---------- saved user info (shared by all pages) ----------
  function loadUser() {
    try {
      return JSON.parse(localStorage.getItem("tinyTouchUser")) || {};
    } catch (e) {
      return {};
    }
  }

  return { setup, draw, mousePressed };
}
// #############################################################
// 10-11. Trace the Path: Playing   (was trace-play.js)
// #############################################################
function tracePlayPage() {
  // =============================================
  // Tiny Touch - Trace the Path: Playing (p5.js)
  // Screens #10 and #11: trace the path with your finger.
  //   - On the path  -> your line is GREEN
  //   - Off the path -> your line is RED, the dot shows an X (mistake)
  // When you reach the star, your score (accuracy) is saved and
  // the result page opens.
  // Comes from: trace-instructions.html, trace-result.html (Retry / Next Level)
  // Goes to:    trace-result.html (finished), entry.html (pause -> Home)
  // =============================================

  let cnv;
  let user = {};
  let level = 0;        // 0 Easy, 1 Medium, 2 Hard, 3 Expert
  let pathNum = 1;        // path 1, 2 or 3

  let pathPts = [];     // the points of the path to follow
  let pathWidth = 60;   // how wide the path is (smaller = harder)
  let tolerance = 36;   // how far from the middle still counts as "on the path"

  let trail = [];       // what the player drew: {x, y, on} (null = finger lifted)
  let tracing = false;  // is the finger down and tracing right now?
  let progress = 0;     // how far along the path they got (index in pathPts)
  let onLength = 0;     // distance traced while ON the path
  let totalLength = 0;  // all distance traced
  let offPath = false;  // is the finger off the path right now?
  let paused = false;
  let finished = false;
  let finishTimer = 0;
  let audioCtx = null;

  // how each level changes the path
  const LEVELS = [
    { name: "Easy",   width: 62, amp: 45,  waves: 1 },
    { name: "Medium", width: 50, amp: 70,  waves: 1.5 },
    { name: "Hard",   width: 40, amp: 85,  waves: 2 },
    { name: "Expert", width: 32, amp: 100, waves: 2.5 }
  ];

  // ---------- Colors ----------
  const BLUE = "#2D6CF0";
  const BLUE_HOVER = "#4A84F5";
  const NAVY = "#1B2A5A";
  const GOLD = "#FFC83D";
  const GREEN = "#2EAD5B";
  const RED = "#E5484D";

  function setup() {
    cnv = createCanvas(390, 760);
    cnv.style("touch-action", "none");    // stop the page scrolling while tracing on a phone
    textFont("Arial");

    user = loadUser();
    level = user.traceLevel || 0;
    pathNum = user.traceRound || 1;
    pathWidth = LEVELS[level].width;
    tolerance = pathWidth / 2 + 6;
    buildPath();
  }

  // =============================================
  // Make the path for this level + path number
  // =============================================
  function buildPath() {
    pathPts = [];
    let L = LEVELS[level];

    // each path starts and ends in a different spot
    let a, b;
    if (pathNum === 1) { a = { x: 70, y: 640 };  b = { x: 320, y: 220 }; }
    if (pathNum === 2) { a = { x: 70, y: 220 };  b = { x: 320, y: 640 }; }
    if (pathNum === 3) { a = { x: 195, y: 660 }; b = { x: 195, y: 200 }; }

    let dx = b.x - a.x;
    let dy = b.y - a.y;
    let len = sqrt(dx * dx + dy * dy);
    let nx = -dy / len;    // sideways direction (for the wiggles)
    let ny = dx / len;

    let N = 300;
    for (let i = 0; i <= N; i++) {
      let t = i / N;
      let squeeze = sin(PI * t);                 // no wiggle at the two ends
      let wiggle = sin(t * L.waves * TWO_PI);
      if (pathNum === 3) wiggle = sin(t * L.waves * TWO_PI) + 0.35 * sin(t * L.waves * 3 * TWO_PI);
      let off = L.amp * squeeze * wiggle;
      let x = a.x + dx * t + nx * off;
      let y = a.y + dy * t + ny * off;
      pathPts.push({ x: constrain(x, 40, width - 40), y: constrain(y, 150, height - 60) });
    }
  }

  // =============================================
  // Draw
  // =============================================
  function draw() {
    cursor(ARROW);
    drawScenery();
    drawPath();
    drawTrail();

    // the dot to start (or keep going) from
    if (!tracing && !finished) {
      let p = pathPts[progress];
      let pulse = 1 + 0.15 * sin(frameCount * 0.12);
      noStroke();
      fill(45, 108, 240, 70);
      circle(p.x, p.y, pathWidth * 1.3 * pulse);
      fill(BLUE);
      circle(p.x, p.y, pathWidth * 0.75);
      fill(255, 140);
      circle(p.x - pathWidth * 0.12, p.y - pathWidth * 0.12, pathWidth * 0.2);
    }

    // the finger dot while tracing (red with an X when off the path)
    if (tracing) drawFingerDot(mouseX, mouseY);

    drawTopBar();
    drawHint();

    if (finished) drawFinish();
    if (paused) drawPauseMenu();
  }

  function drawScenery() {
    // sky
    noStroke();
    for (let y = 0; y < height; y += 8) {
      fill(lerpColor(color("#8FD3FF"), color("#E9F7FF"), y / height));
      rect(0, y, width, 8);
    }
    // clouds
    drawCloud(80, 170);
    drawCloud(300, 120);
    drawCloud(250, 330);
    // grass hills
    fill("#A9DE8E");
    ellipse(80, height - 30, 420, 260);
    fill("#8ED07A");
    ellipse(330, height - 10, 420, 240);
  }

  function drawCloud(x, y) {
    noStroke();
    fill(255, 230);
    ellipse(x, y, 90, 26);
    circle(x - 18, y - 9, 30);
    circle(x + 10, y - 15, 40);
    circle(x + 32, y - 6, 24);
  }

  function drawPath() {
    // soft shadow, then the white road
    noFill();
    strokeJoin(ROUND);
    stroke(0, 25);
    strokeWeight(pathWidth + 8);
    drawPathLine(3);
    stroke(255, 245);
    strokeWeight(pathWidth);
    drawPathLine(0);

    // dotted guide line down the middle
    noStroke();
    fill(NAVY);
    for (let i = 0; i < pathPts.length; i += 6) {
      circle(pathPts[i].x, pathPts[i].y, 6);
    }

    // star at the end
    let end = pathPts[pathPts.length - 1];
    drawStar(end.x, end.y + sin(frameCount * 0.08) * 3, pathWidth * 0.62, pathWidth * 0.28, GOLD);
  }

  function drawPathLine(shift) {
    beginShape();
    for (let p of pathPts) vertex(p.x, p.y + shift);
    endShape();
  }

  // the line the player drew: green parts and red parts
  function drawTrail() {
    strokeWeight(pathWidth * 0.45);
    for (let i = 1; i < trail.length; i++) {
      let a = trail[i - 1];
      let b = trail[i];
      if (a === null || b === null) continue;
      stroke(b.on ? GREEN : RED);
      line(a.x, a.y, b.x, b.y);
    }
  }

  function drawFingerDot(x, y) {
    noStroke();
    fill(offPath ? RED : BLUE);
    circle(x, y, pathWidth * 0.75);
    if (offPath) {
      stroke(255);
      strokeWeight(4);
      let s = pathWidth * 0.16;
      line(x - s, y - s, x + s, y + s);
      line(x + s, y - s, x - s, y + s);
    }
  }

  function drawTopBar() {
    // pause button
    let hover = dist(mouseX, mouseY, 40, 50) < 24;
    if (hover) cursor(HAND);
    noStroke();
    fill(0, 30);
    circle(40, 53, 46);
    fill(hover ? "#EAF2FF" : 255);
    circle(40, 50, 46);
    fill(BLUE);
    rect(32, 40, 6, 20, 2);
    rect(42, 40, 6, 20, 2);

    // progress bar
    fill(255, 200);
    rect(80, 44, 210, 14, 7);
    fill(GREEN);
    rect(80, 44, 210 * progress / (pathPts.length - 1), 14, 7);

    // path counter, like "1/3"
    fill(BLUE);
    rect(304, 34, 64, 32, 16);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(16);
    textStyle(BOLD);
    text(pathNum + "/3", 336, 50);

    // level name
    fill(NAVY);
    textSize(13);
    text(LEVELS[level].name, 185, 78);
    textStyle(NORMAL);
  }

  function drawHint() {
    let msg = "";
    if (offPath && tracing) msg = "Oops! Go back to the path";
    else if (!tracing && !finished && progress === 0) msg = "Put your finger on the blue dot";
    else if (!tracing && !finished) msg = "Keep going from the blue dot";
    if (msg === "") return;

    textSize(15);
    textStyle(BOLD);
    let w = textWidth(msg) + 36;
    noStroke();
    fill(offPath && tracing ? RED : NAVY);
    rect(width / 2 - w / 2, 100, w, 34, 17);
    fill(255);
    textAlign(CENTER, CENTER);
    text(msg, width / 2, 117);
    textStyle(NORMAL);
  }

  function drawFinish() {
    finishTimer--;
    fill(255, 160);
    noStroke();
    rect(0, 0, width, height);
    let s = 1 + 0.08 * sin(frameCount * 0.3);
    drawStar(width / 2, height / 2 - 20, 70 * s, 32 * s, GOLD);
    fill(NAVY);
    textSize(26);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text("You reached the star!", width / 2, height / 2 + 80);
    textStyle(NORMAL);
    if (finishTimer <= 0) goTo("trace-result.html");
  }

  function drawPauseMenu() {
    noStroke();
    fill(27, 42, 90, 150);
    rect(0, 0, width, height);
    fill(255);
    rect(45, 230, 300, 300, 24);
    fill(NAVY);
    textSize(26);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text("Paused", width / 2, 275);
    textStyle(NORMAL);
    drawButton("Resume", 75, 315, 240, 52, true);
    drawButton("Restart", 75, 382, 240, 52, false);
    drawButton("Home", 75, 449, 240, 52, false);
  }

  // =============================================
  // Tracing with the finger / mouse
  // =============================================
  function mousePressed() {
    if (finished) return;

    if (paused) {
      if (isOver(75, 315, 240, 52)) paused = false;
      if (isOver(75, 382, 240, 52)) restart();
      if (isOver(75, 449, 240, 52)) goTo("entry.html");
      return;
    }

    // pause button
    if (dist(mouseX, mouseY, 40, 50) < 24) {
      paused = true;
      tracing = false;
      return;
    }

    // start tracing only from the blue dot
    let p = pathPts[progress];
    if (dist(mouseX, mouseY, p.x, p.y) < pathWidth * 0.8) {
      tracing = true;
      offPath = false;
      trail.push(null);                         // start a new piece of line
      trail.push({ x: mouseX, y: mouseY, on: true });
    }
  }

  function mouseDragged() {
    if (!tracing || paused || finished) return;

    let last = trail[trail.length - 1];
    let step = dist(mouseX, mouseY, last.x, last.y);
    if (step < 3) return;                       // ignore tiny wiggles

    // find the closest point of the path (from where they got to, up to the star).
    // If they skip part of the path by going off it, they can rejoin further on,
    // but the time spent off the path lowers their score.
    let best = progress;
    let bestD = 99999;
    let from = max(0, progress - 10);
    let to = pathPts.length - 1;
    for (let i = from; i <= to; i++) {
      let d = dist(mouseX, mouseY, pathPts[i].x, pathPts[i].y);
      if (d < bestD) { bestD = d; best = i; }
    }

    let on = bestD <= tolerance;
    if (!on && !offPath) buzz();                // just went off the path
    offPath = !on;

    totalLength += step;
    if (on) {
      onLength += step;
      progress = max(progress, best);
    }
    trail.push({ x: mouseX, y: mouseY, on: on });

    // reached the star?
    if (on && progress >= pathPts.length - 3) finish();
  }

  function mouseReleased() {
    if (tracing) {
      tracing = false;
      offPath = false;
    }
  }

  function finish() {
    tracing = false;
    finished = true;
    finishTimer = 70;   // a little more than 1 second

    let accuracy = totalLength > 0 ? round100(onLength / totalLength) : 100;
    user.lastTrace = { accuracy: accuracy, level: level, path: pathNum };
    saveUser(user);

    if (accuracy >= 70) playNotes([523, 659, 784, 1047], 0.12, "triangle");   // happy sound
    else playNotes([523, 466, 392], 0.18, "sine");                             // "aww" sound
  }

  function restart() {
    trail = [];
    tracing = false;
    progress = 0;
    onLength = 0;
    totalLength = 0;
    offPath = false;
    paused = false;
  }

  function round100(x) {
    return Math.round(x * 100);
  }

  // =============================================
  // Sounds (made with the browser's Web Audio, no files needed)
  // =============================================
  function playNotes(freqs, dur, type) {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtx.resume();
      for (let i = 0; i < freqs.length; i++) {
        let osc = audioCtx.createOscillator();
        let gain = audioCtx.createGain();
        let t = audioCtx.currentTime + i * dur;
        osc.type = type;
        osc.frequency.value = freqs[i];
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + dur * 1.8);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + dur * 2);
      }
    } catch (e) {}
  }

  function buzz() {
    playNotes([150], 0.08, "square");
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

  function drawButton(label, x, y, w, h, primary) {
    let hover = isOver(x, y, w, h);
    if (hover) cursor(HAND);
    stroke(BLUE);
    strokeWeight(2);
    fill(primary ? (hover ? BLUE_HOVER : BLUE) : (hover ? "#EAF2FF" : 255));
    rect(x, y, w, h, 14);
    noStroke();
    fill(primary ? 255 : BLUE);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(19);
    text(label, x + w / 2, y + h / 2);
    textStyle(NORMAL);
  }

  function isOver(x, y, w, h) {
    return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
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

  return { setup, draw, mousePressed, mouseReleased, mouseDragged };
}

// #############################################################
// 12-13. Trace the Path: Great Job / Try Again   (was trace-result.js)
// #############################################################
function traceResultPage() {
  // =============================================
  // Tiny Touch - Trace the Path: Result (p5.js)
  // Screen #12 (70% or more) "Great Job!"  -> Next Level / Home
  // Screen #13 (under 70%)   "Try Again!"  -> Retry / Home
  // Stars: 70-79% = 1 star, 80-89% = 2 stars, 90%+ = 3 stars
  // Comes from: trace-play.html
  // Goes to:    trace-play.html (Next Level / Retry), entry.html (Home),
  //             trace.html (after the very last path)
  // =============================================

  let user = {};
  let result = {};
  let passed = false;
  let stars = 0;
  let confetti = [];
  let allDone = false;    // finished Expert path 3

  const LEVEL_NAMES = ["Easy", "Medium", "Hard", "Expert"];

  // ---------- Layout ----------
  const BTN1_Y = 560;
  const BTN2_Y = 630;

  // ---------- Colors ----------
  const BLUE = "#2D6CF0";
  const BLUE_HOVER = "#4A84F5";
  const NAVY = "#1B2A5A";
  const GRAY = "#5E6A82";
  const GOLD = "#FFC83D";
  const GOLD_DARK = "#F2A900";
  const STAR_OFF = "#C9CFDB";
  const CONFETTI = ["#2D6CF0", "#FFC83D", "#E36BD6", "#2EAD5B", "#FF6A1A"];

  function setup() {
    createCanvas(390, 760);
    textFont("Arial");

    user = loadUser();
    result = user.lastTrace || { accuracy: 0, level: 0, path: 1 };
    passed = result.accuracy >= 70;

    if (result.accuracy >= 90) stars = 3;
    else if (result.accuracy >= 80) stars = 2;
    else if (passed) stars = 1;

    allDone = passed && result.level === 3 && result.path === 3;

    // confetti pieces (only when they passed)
    if (passed) {
      for (let i = 0; i < 60; i++) {
        confetti.push({
          x: random(width), y: random(-height, 0),
          speed: random(1.5, 3.5), spin: random(TWO_PI),
          col: random(CONFETTI)
        });
      }
    }
  }

  function draw() {
    cursor(ARROW);
    background(passed ? "#EAF4FF" : "#FDEFF7");

    if (passed) drawConfetti();
    else drawSparkles();

    // star buddy (happy or sad), bouncing a little
    let bounce = sin(frameCount * 0.08) * 6;
    drawStarBuddy(width / 2, 190 + bounce, passed);

    // title
    noStroke();
    textAlign(CENTER, CENTER);
    fill(NAVY);
    textStyle(BOLD);
    textSize(36);
    text(passed ? "Great Job!" : "Try Again!", width / 2, 335);
    textStyle(NORMAL);

    // the 3 stars
    for (let i = 0; i < 3; i++) {
      let on = i < stars;
      let y = i === 1 ? 392 : 400;     // middle star a bit higher
      drawStar(width / 2 - 70 + i * 70, y, 28, 13, on ? GOLD : STAR_OFF);
    }

    // accuracy
    fill(GRAY);
    textSize(17);
    text("You followed the path", width / 2, 452);
    fill(passed ? "#2EAD5B" : "#E5484D");
    textStyle(BOLD);
    textSize(30);
    text(result.accuracy + "%", width / 2, 486);
    textStyle(NORMAL);
    fill(GRAY);
    textSize(14);
    text("of the time  ·  " + LEVEL_NAMES[result.level] + ", path " + result.path + " of 3",
         width / 2, 518);

    // buttons
    let label = "Retry";
    if (passed) label = allDone ? "Play Again" : "Next Level";
    drawButton(label, 30, BTN1_Y, 330, 56, true);
    drawButton("Home", 30, BTN2_Y, 330, 56, false);

    if (allDone) {
      fill(NAVY);
      textSize(14);
      textStyle(BOLD);
      text("You finished every Trace the Path level! 🎉", width / 2, 718);
      textStyle(NORMAL);
    }
  }

  // =============================================
  // Clicks
  // =============================================
  function mousePressed() {
    if (isOver(30, BTN1_Y, 330, 56)) {
      if (!passed) {
        goTo("trace-play.html");               // Retry the same path
        return;
      }
      if (allDone) {
        user.traceLevel = 0;
        user.traceRound = 1;
        saveUser(user);
        goTo("trace.html");
        return;
      }
      // Next Level: next path, or the next difficulty after path 3
      if (result.path < 3) {
        user.traceLevel = result.level;
        user.traceRound = result.path + 1;
      } else {
        user.traceLevel = result.level + 1;
        user.traceRound = 1;
      }
      saveUser(user);
      goTo("trace-play.html");
      return;
    }

    if (isOver(30, BTN2_Y, 330, 56)) goTo("entry.html");
  }

  // =============================================
  // Drawings
  // =============================================
  function drawStarBuddy(x, y, happy) {
    // glow
    noStroke();
    fill(255, 220, 90, 70);
    circle(x, y, 230);

    drawStar(x, y + 6, 100, 48, GOLD_DARK);   // outline
    drawStar(x, y, 96, 45, GOLD);

    // eyes
    fill(NAVY);
    ellipse(x - 22, y - 8, 14, 18);
    ellipse(x + 22, y - 8, 14, 18);
    fill(255);
    circle(x - 19, y - 12, 5);
    circle(x + 25, y - 12, 5);

    // cheeks
    fill(255, 140, 140, 150);
    ellipse(x - 40, y + 12, 18, 10);
    ellipse(x + 40, y + 12, 18, 10);

    // mouth
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
      // a little tear
      noStroke();
      fill("#7CC4FF");
      ellipse(x + 26, y + 10, 8, 12);
    }
  }

  function drawConfetti() {
    noStroke();
    for (let c of confetti) {
      c.y += c.speed;
      c.spin += 0.08;
      if (c.y > height + 10) {
        c.y = random(-60, -10);
        c.x = random(width);
      }
      push();
      translate(c.x, c.y);
      rotate(c.spin);
      fill(c.col);
      rect(-5, -2, 10, 5, 1);
      pop();
    }
  }

  function drawSparkles() {
    noStroke();
    // sparkles only along the left and right edges, so they don't cover the words
    for (let i = 0; i < 14; i++) {
      let x = i % 2 === 0 ? 22 + (i * 7) % 24 : width - 22 - (i * 11) % 24;
      let y = 60 + ((i * 151) % 640);
      let a = 120 + 100 * sin(frameCount * 0.05 + i);
      drawStar(x, y, 7, 3, color(227, 107, 214, a));
    }
  }

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

  function drawButton(label, x, y, w, h, primary) {
    let hover = isOver(x, y, w, h);
    let offset = hover && mouseIsPressed ? 2 : 0;
    if (hover) cursor(HAND);

    noStroke();
    fill(0, 30);
    rect(x, y + 4, w, h, 14);
    stroke(BLUE);
    strokeWeight(2);
    fill(primary ? (hover ? BLUE_HOVER : BLUE) : (hover ? "#EAF2FF" : 255));
    rect(x, y + offset, w, h, 14);

    noStroke();
    fill(primary ? 255 : BLUE);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(21);
    text(label, x + w / 2, y + h / 2 + offset);
    textStyle(NORMAL);
  }

  function isOver(x, y, w, h) {
    return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
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

  return { setup, draw, mousePressed };
}

// #############################################################
// Car Obstacles (prototype)   (was sketch.js)
// #############################################################
function carPage() {
  function setup() {
      // create canvas
      createCanvas(400, 800);
  }

  function draw() {
      // skyblue backgroud
      background(100, 200, 300);
      // create a circle
      circle(350, 50, 100);
      // fill in circle
      fill("yellow");
      stroke("orange");
      strokeWeight(20);
      circle(350, 50, 100);
      fill("black");
      rect(100, 0, 200, 800);

      //emojis
      textSize(75);
      text("💩", 100, 250);
      text("🚗", mouseX, mouseY);
  }

  return { setup, draw };
}

// =============================================
// The real p5 functions: pass everything to the current page
// =============================================
function setup() {
  createCanvas(390, 760);
}

function draw() {
  if (nextPage) switchPage();
  if (page.draw) page.draw();
}

function mousePressed()  { if (page && page.mousePressed)  page.mousePressed(); }
function mouseReleased() { if (page && page.mouseReleased) page.mouseReleased(); }
function mouseDragged()  { if (page && page.mouseDragged)  page.mouseDragged(); }
function keyPressed()    { if (page && page.keyPressed)    page.keyPressed(); }
function windowResized() { if (page && page.windowResized) page.windowResized(); }
function mouseWheel(event) {
  if (page && page.mouseWheel) return page.mouseWheel(event);
}