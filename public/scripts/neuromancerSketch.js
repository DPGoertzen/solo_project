var myCanvas;
var sketchWidth = 1000;
var sketchHeight = 500;
var lineLength=35; //maximum length of line
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
var buttonSave, buttonSaveImage, buttonLoad;

// preload our image files so that everything loads correctly on pageload
function preload() {
  img = loadImage("../assets/blurSkyline.png");
  img2 = loadImage("../assets/fragSkyline.png");
}

function setup() {
  // createCanvas(window.innerWidth, window.innerHeight);
  myCanvas = createCanvas(sketchWidth, sketchHeight);
  myCanvas.parent('neuromancerSketch');
  background('#72a9be');
  noStroke();
  frameRate(24);
  //position our images
  image(img, 0, 0);
  image(img2, 0, 5);
  //create our user interactivity
  buttonSave = createButton('Save Settings');
  buttonSave.parent('neuromancerButtonSave');
  buttonSave.mousePressed(saveInfo);

  buttonLoad = createButton('Load Settings');
  buttonLoad.parent('neuromancerButtonLoad');
  buttonLoad.mousePressed(loadInfo);

  sliderRed = createSlider(0, 50, 25);
  sliderRed.parent('neuromancerSliderRed');
  sliderGreen = createSlider(-20, 50, 15);
  sliderGreen.parent('neuromancerSliderGreen');
  sliderBlue = createSlider(-50, 50, 0);
  sliderBlue.parent('neuromancerSliderBlue');

  buttonSaveImage = createButton('Save Image');
  buttonSaveImage.parent('saveImage');
  buttonSaveImage.mousePressed(saveOurImage);
}

function draw() {
  var time = millis();
    for (var i=0;i<=0.5*sketchWidth;i++) {
      // pick our colors semi-randomly based on a seed and slider value
      stroke(random(40+sliderRed.value(),190+sliderRed.value()), random(60+sliderGreen.value(),230+sliderGreen.value()), random(70+sliderBlue.value(),245+sliderBlue.value()));
      x = random(0,sketchWidth);
      // don't draw to the bottom, save our processor since it will be covered anyway
      y = random(0,(sketchHeight-130));
      // draw our line, whose length in the x-direction is semi-random
      line(x,y,x+random(0,lineLength),y);
    }
  // draw a rectangle covering the bottom third of the sketch,
  // getting us ready for our waves
  fill(3,16,59);
  rectMode(CORNER)
  rect(0, 360, 1000, 160)

  // create our waves
  for(var j = 1; j < 20; j++){
    // set the fill color to be lighter as it goes downwards
    fill(3,16,(50+j*12));
    // set our stroke to be even lighter
    stroke(3,16,(50+j*13));
    // We are going to draw a polygon out of the wave points
    beginShape();

    var xoff = 0;
    // Iterate through our x axis
    for (var x = 0; x <= width; x += 10) {
    // pick our y-axis though perlin noise
      var y = map(noise(xoff, yoff), 0, 1, 200,300);
      vertex(x, (1.5+ (j/20)) * y);
      // Increment x's noise
      xoff += 0.05;
    }
    // increment y dimension for noise
    yoff += 0.001;
    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);
  }

  // Draw buildings last so they stay on top
    image(img, 0, 0);
    image(img2, 0, 5);
}



//save our sliders and send them through to our settings route and on to the db
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

// retrieve our saved slider settings
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

function saveOurImage(){
  saveCanvas(myCanvas, 'Neuromancer', 'jpg');
}
