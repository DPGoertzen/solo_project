
var sketchWidth = 1000;
var sketchHeight = 500;
var lineLength=35; //length of line
var x, y; //start of line
var img, img2;
var lightOn = true
var firstTime = 5000
var secondTime = 10000


function preload() {
  img = loadImage("../assets/blurSkyline.png");
  img2 = loadImage("../assets/fragSkyline.png");
}

function setup() {
  // createCanvas(window.innerWidth, window.innerHeight);
  var myCanvas = createCanvas(sketchWidth, sketchHeight);
  myCanvas.parent('neuromancerSketch');
  background('#72a9be');
  noStroke();
  frameRate(60);
  image(img, 0, 0);
  image(img2, 0, 5);

}

function randomNumber(min, max) {
  return (Math.random() * (max - min)) + min;
}

function draw() {
  var time = millis();
    for (var i=0;i<=0.5*sketchWidth;i++) {
      // stroke(randomNumber(0,80), randomNumber(100,160), randomNumber(150,200));
      stroke(randomNumber(40,190), randomNumber(60,230), randomNumber(70,245));
      x = randomNumber(0,sketchWidth);
      y = randomNumber(0,(sketchHeight-130));
      line(x,y,x+randomNumber(0,lineLength),y);
    }
    image(img, 0, 0);
    image(img2, 0, 5);
    if(time < firstTime){
      noStroke;
      fill(180, 0, 0);
      
      rectMode(RADIUS);

      rect(123,170,4,4);


    }else if (time < secondTime){
      noStroke;
      fill('#72a9be');
      rectMode(RADIUS);
      rect(123,170,8,8);
      rotate(45);
    } else {
      firstTime += 10000
      secondTime += 10000
    }
}
