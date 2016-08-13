
var sketchWidth = 1000;
var sketchHeight = 500;
var lineLength=35; //length of line
var x, y; //start of line
var img, img2;
var lightOn = true;
var firstTime = 5000;
var secondTime = 10000;
var yoff = 0;
var yoff2 = 0;
var sliderRed;
var sliderGreen;
var sliderBlue;
var buttonSave;
var buttonLoad;

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
  frameRate(24);
  image(img, 0, 0);
  image(img2, 0, 5);
  buttonSave = createButton('Save');
  buttonSave.parent('neuromancerButtonSave');
  buttonSave.mousePressed(saveInfo);

  buttonLoad = createButton('Load');
  buttonLoad.parent('neuromancerButtonLoad');
  buttonLoad.mousePressed(loadInfo);

  sliderRed = createSlider(0, 50, 25);
  sliderRed.parent('neuromancerSliderRed');
  sliderGreen = createSlider(-20, 50, 15);
  sliderGreen.parent('neuromancerSliderGreen');
  sliderBlue = createSlider(-50, 50, 0);
  sliderBlue.parent('neuromancerSliderBlue');
}

function randomNumber(min, max) {
  return (Math.random() * (max - min)) + min;
}

function saveInfo(){
  var data = {};
  data.sliderRed = sliderRed.value();
  data.sliderGreen = sliderGreen.value();
  data.sliderBlue = sliderBlue.value();
  console.log(data);
  httpPost('/addSettingsNeuromancer', data, finished);

  function finished(response) {
    console.log(response);
  }
}

function loadInfo(){
  var params = {};
  httpGet('/retrieveSettings', params, finished);

  function finished(response) {
    var ourData = JSON.parse(response)
    sliderRed.value(ourData.sliderRed);
    sliderGreen.value(ourData.sliderGreen);
    sliderBlue.value(ourData.sliderBlue);
    console.log(JSON.parse(response));
  }
}

function draw() {
  var time = millis();
    for (var i=0;i<=0.5*sketchWidth;i++) {
      // stroke(randomNumber(0,80), randomNumber(100,160), randomNumber(150,200));
      stroke(randomNumber(40+sliderRed.value(),190+sliderRed.value()), randomNumber(60+sliderGreen.value(),230+sliderGreen.value()), randomNumber(70+sliderBlue.value(),245+sliderBlue.value()));
      x = randomNumber(0,sketchWidth);
      y = randomNumber(0,(sketchHeight-130));
      line(x,y,x+randomNumber(0,lineLength),y);
    }

  // fill(3,16,59);
  fill(3,16,59);
  rectMode(CORNER)
  rect(0, 360, 1000, 160)

  for(var j = 1; j < 20; j++){
    fill(3,16,(50+j*12));
    stroke(3,16,(50+j*13));
    // We are going to draw a polygon out of the wave points
    beginShape();

    var xoff = 0;       // Option #1: 2D Noise
    // var xoff = yoff; // Option #2: 1D Noise

    // Iterate over horizontal pixels
    for (var x = 0; x <= width; x += 10) {
      // Calculate a y value according to noise, map to

      // Option #1: 2D Noise
      var y = map(noise(xoff, yoff), 0, 1, 200,300);

      // Set the vertex
      vertex(x, (1.5+ (j/20)) * y);
      // Increment x dimension for noise
      xoff += 0.05;
    }
    // increment y dimension for noise
    yoff += 0.001;
    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);
  }




  // Draw buildings
    image(img, 0, 0);
    image(img2, 0, 5);

}
