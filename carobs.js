// ---------- Colors (match the rest of Tiny Touch) ----------
const BLUE = "#2D6CF0";
const NAVY = "#1B2A5A";
const GRAY = "#5E6A82";
const BG = "#F5F8FE";
const BORDER = "#E3E8F1";
const LIGHT_BLUE = "#D7EAFB";
const YELLOW = "#FFF0B3";
const GOLD = "#FFC83D";
const RED_CAR = "#E53935";

// ----- car position -----
let carX = 195;
let carY = 650;

function setup() {
    createCanvas(390, 760);
    textFont("Arial");

}

function draw() {
    background(BG);
    drawCar(carX, carY);
}

function mouseDragged() {
    carX = x;
    carY = y;
}

function drawCar(x, y) {
    push();
    translate(x, y);
    noStroke();
    fill("orange");
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

