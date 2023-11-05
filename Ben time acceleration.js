let slider;
let startTime;
let elapsedSeconds = 0;
let xPositionsLines = 10;
let xIntervals = 31.3;

let img;

function preload(){
  img = loadImage("starBackground.PNG");
}

function setup(){
  let sliderWidth = windowWidth - 10;
  createCanvas(windowWidth, windowHeight);
  slider = createSlider(0, 30, 0, 6);
  slider.position(15, windowHeight - 50);
  slider.size(sliderWidth - 500);
  slider.addClass("TimeSlider")

  line(15, windowHeight - 100, 15, windowHeight);

  startTime = millis();
}

function draw(){
  

  rect(9 + ((860-9)/5 * 1), 594, 1, 30);
  rect(9 + ((860-9)/5 * 2), 594, 1, 30);
  rect(9 + ((860-9)/5 * 3), 594, 1, 30);
  rect(9 + ((860-9)/5 * 4), 594, 1, 30);

  let sliderValue = slider.value();
  fill(173, 216, 230);
  noStroke();

  let speedOfUniverse = pow(2, sliderValue);
  console.log(speedOfUniverse)

  let currentTime = millis();
  elapsedSeconds += (currentTime - startTime) / 1000 * speedOfUniverse;
  
  let secondsPassed = abs(int(elapsedSeconds));
  let minutesPassed = abs(int(secondsPassed / 60));
  let hoursPassed = abs(int(minutesPassed / 60));
  let daysPassed = abs(int(hoursPassed / 24));
  let monthsPassed = abs(int(daysPassed / 30));
  let yearsPassed = abs(float(daysPassed / 365));
  let yearsRounded = abs(yearsPassed % (2 + (2 / 12)).toFixed(1));

  textSize(30);
  textFont("Times New Roman");
  fill(255);
  text("D: " + daysPassed % 30, 1050, 615); 
  text("M: " + monthsPassed % 12, 1140, 615);
  text("Y: " + yearsRounded.toFixed(1), 1230, 615);
  text(speedOfUniverse + "x", 870, 615);

  if(yearsRounded == 0){
  }

  startTime = currentTime
}
