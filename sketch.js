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