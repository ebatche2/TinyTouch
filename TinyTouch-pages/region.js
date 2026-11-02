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
