let time = 0;
let deltaT
let centripetalAcceleration
let gravConstant = 6.67*10**-11
let marsSemiMajorAxis = 2*2.08448*10**11*(1-0.0934) //Limiting range for the canvas
let systemScaleFactor
let orbitToWindowRatio = 15/16
let planetScaleFactor
let sunScaleFactor
let sunMass = 1.9891*10**30

let imgEarth; 
let imgMars
let imgSun
let imgBackground

let slider;
let sliderValue = 0
let sliderWidth;

let startTime;
let elapsedSeconds = 0;

//let stars = []

function preload() {
//importing the images
    imgEarth = loadImage('https://pngfre.com/wp-content/uploads/earth-png-from-pngfre-8-1024x934.png');
    imgMars = loadImage('mars.png');
    imgSun = loadImage('https://files.cults3d.com/uploaders/20952150/illustration-file/22476746-7883-430e-9ee8-613ad2326143/pngwing.com-2022-02-09T121715.466.png');
    imgBackground = loadImage("starBackground.PNG");
}

function setup(){

  //Scaling
  systemScaleFactor =       
  orbitToWindowRatio*windowHeight/marsSemiMajorAxis
  sunScaleFactor = systemScaleFactor*50
  planetScaleFactor = systemScaleFactor*3500
   createCanvas(windowWidth, windowHeight);
   ellipseMode(CENTER);

   angleMode(DEGREES);

   earth  = new Planet(9.3370*10**10, -1.197634*10**11, 6371000,   5.97219*10**24, 1.496*10**11, 0.0167, planetScaleFactor, 'blue', 365.25, imgEarth);
   mars   = new Planet(1.85716*10**11, -9.063094*10**10, 3389500,    6.42*10**23, marsSemiMajorAxis, 0.0934, planetScaleFactor, 'orange', 687, imgMars);
   sun    = new Planet(0, 0, 696340000, sunMass,  0,  1,   sunScaleFactor, 'yellow', undefined, imgSun);

  slider = createSlider(0, 18, 14, 2);
  slider.position(15, windowHeight - 50);
  slider.size(windowWidth/4);
  sliderWidth = slider.size();
  slider.addClass("TimeSlider")

  startTime = millis();
  //generateStars(200)

}

function draw(){

  sliderValue = slider.value()
  //This shifts the coordinate system to the middle     of the canvas
  translate(windowWidth/2, windowHeight/2); 
  
  //Turns the y axis in the proper way
  scale(1, -1);
  //drawStars();
  image(imgBackground,0,0,windowWidth,windowHeight)
  
  earth.appear()
  mars.appear()
  sun.appear()

  earth.orbit()
  mars.orbit()
  time = millis()
  console.log(earth.timeMultiplier)
  showLine()
  timeCounter()

}

function showLine(){
  
  let distance = dist(earth.canvasX, earth.canvasY, mars.canvasX, mars.canvasY)
  textFont('Courier New');
  textSize(22)
  strokeWeight(2)
  if (distance/(systemScaleFactor*10**9)<120) stroke('rgb(0,255,0)')
  else stroke("white")
  drawingContext.setLineDash([5, 5]);
  line(earth.canvasX, earth.canvasY, mars.canvasX, mars.canvasY)

  textAlign(CENTER, CENTER);
  if (distance/(systemScaleFactor*10**9)<120) fill('rgb(0,255,0)')
  else fill("white")
  noStroke()
  push();
  scale(1, -1);
  text(`${(distance/(systemScaleFactor*10**9)).toFixed(2)} millions of km`, (mars.canvasX-earth.canvasX)/2+earth.canvasX, -((mars.canvasY-earth.canvasY)/2+earth.canvasY));
  pop();
  
}

function timeCounter(){

  let currentTime = millis();
  elapsedSeconds += (currentTime - startTime) / 1000 * 2**sliderValue;

  let secondsPassed = abs(int(elapsedSeconds));
  let minutesPassed = abs(int(secondsPassed / 60));
  let hoursPassed = abs(int(minutesPassed / 60));
  let daysPassed = abs(int(hoursPassed / 24));
  let monthsPassed = abs(int(daysPassed / 30));
  let yearsPassed = abs(float(daysPassed / 365));
  let yearsRounded = abs(yearsPassed % (2 + (2 / 12)).toFixed(1));

  noStroke()
  textSize(30);
  textFont("Times New Roman");
  textAlign(CENTER, CENTER);
  fill(255);
  let textX = 0
  let textY = windowHeight/2 - 45;
  let wordSpace = 80
  push();
  scale(1, -1);
  text(2**sliderValue + "x", (-(windowWidth/4)) + 60, textY);
  pop();

  startTime = currentTime
}

/*function generateStars(numStars){

  for (let i = 0; i < numStars; i++) { // Loop through the number of stars 
  let star = {
    x: random(width),
    y: random(height),
    size: random(1, 5)
  };
  
  }
}*/

/*function drawStars() {
  
  noStroke(); // No outline for the stars
    // Check if the star overlaps with any existing stars
    let overlapping = false;
    for (let existingStar of stars) {
      let d = dist(star.x, star.y, existingStar.x, existingStar.y); //d = value calculating the distance between the position of the current star and the position of the existing star
      if (d < star.size + existingStar.size) { //checking if the distance between the position of the current star and the position of an existing star is less than the sum of their sizes.
        overlapping = true;
        break; // Stop checking if overlap is found
      }
    }

    // If not overlapping, add the star
    if (!overlapping) {
      stars.push(star);
      fill(255); // White color for stars
      ellipse(star.x, star.y, star.size, star.size); // Draw a white circle (star)
    }
}*/

class Planet{
  constructor(spaceX, spaceY, spaceRadius, mass, spaceSemiMajorAxis, eccentricityFactor, scaleFactor, colour, daysPerRevolution, image){
    this.canvasX = spaceX*systemScaleFactor;
    this.canvasY = spaceY*systemScaleFactor;
    this.canvasRadius = spaceRadius*scaleFactor
    this.mass = mass;
    this.canvasSemiMajorAxis = spaceSemiMajorAxis*systemScaleFactor/2
    this.eccentricityFactor = eccentricityFactor
    this.scaleFactor = scaleFactor
    this.colour = colour
    this.image = image
    this.AOfOrbit = this.canvasSemiMajorAxis
    this.BOfOrbit = this.canvasSemiMajorAxis*(1-eccentricityFactor)
    this.angle = atan2(this.canvasY,this.canvasX)
    this.lastTime = millis()
    this.currentTime = 0
    this.timeMultiplier = 2**sliderValue
    this.angularSpeed = 360/(daysPerRevolution*24*60*60)

    this.spaceAcceleration =  
    gravConstant*sunMass/(dist(spaceX,spaceY,0,0))**2
    this.accelerationX = systemScaleFactor*this.spaceAcceleration*cos(this.angle)
    this.accelerationY = systemScaleFactor*this.spaceAcceleration*sin(this.angle)

    this.spaceVelocity = sqrt(dist(spaceX, spaceY,0,0)*this.spaceAcceleration)
    this.velocityX = systemScaleFactor*this.spaceVelocity*cos(this.angle)
    this.velocityY = systemScaleFactor*this.spaceVelocity*sin(this.angle)

  }

  appear(){
    /*
    fill(this.colour);
    noStroke();
    circle(this.canvasX, this.canvasY, 2*this.canvasRadius);
    */
    imageMode(CENTER)
    image(this.image, this.canvasX, this.canvasY, this.canvasRadius*2,this.canvasRadius*2)
    
  }

  orbit() {
    this.timeMultiplier = 2**sliderValue
    this.currentTime = millis()
    this.canvasX = this.AOfOrbit*cos(this.angle)
    this.canvasY = this.BOfOrbit*sin(this.angle)
    this.angle += this.angularSpeed*this.timeMultiplier
  }

}