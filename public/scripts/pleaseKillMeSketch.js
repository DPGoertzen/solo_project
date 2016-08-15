var myCanvas;
var fft, amplitude, reverb;
var song, song1, song2, song3, song4, currentSong;
var currentSongSettings = {};
var checkbox, sel, buttonSaveImage;

// preload our songs for the sake of not delaying between transisitions
function preload(){
  song1 = loadSound('../assets/Shadowplay.mp3');
  song2 = loadSound('../assets/WeAre138.mp3');
  song3 = loadSound('../assets/BastardsOfYoung.mp3');
  song4 = loadSound('../assets/PeopleWhoDied.mp3');
}

function setup() {
  // create our canvas and interactivity
  myCanvas = createCanvas(1000,500);
  myCanvas.parent('pleaseKillMeSketch');
  background(40);

  // this is how a selecter is implemented in P5.
  sel = createSelect();
  sel.parent('selecter');
  sel.option('Pick A Song');
  sel.option('Joy Division - Shadowplay');
  sel.option('Misfits - We Are 138');
  sel.option('The Replacements - Bastards of Young');
  sel.option('Jim Carroll Band - People Who Died');
  sel.changed(songSelector);

  buttonSaveImage = createButton('Save Image');
  buttonSaveImage.parent('saveImage');
  buttonSaveImage.mousePressed(saveOurImage);

  // setup the fast fourier transformations (FFT) and amplitude needed to
  // process our music
  fft = new p5.FFT();
  amplitude = new p5.Amplitude();

  frameRate(60);

  // we want anti-aliasing features
  smooth();

  // set our current colors to black initially, so we see no spirals to start
  currentSongSettings.red = 0;
  currentSongSettings.green = 0;
  currentSongSettings.blue = 0;
  currentSongSettings.alpha = 0;

}

function draw() {
  // these two lines create a fade out for the colors of our spirals
  // by generating a semi-transluscent rectangle over our canvas at the
  // start of each frame
  fill(40, 10);
  rect(0,0,1000,500);

  // set up our spectrum analyzer and our volume checker
  var spectrum = fft.analyze();
  var volume = amplitude.getLevel();

  // set the point at which we will rotate to the center of the canvas
  translate(width/2, height/2);
  // rotate our canvas by our frameCount divided by our spin modifier
  rotate(radians(frameCount/currentSongSettings.frameRateDivider));

  // this block does the spirograph/splatterpaint work.
  for(j=0; j<15; j++){
    // beginShape and endShape are the way one creates a container for your
    // vertices.
    beginShape();
    // we want the shapes to be empty, just lines.
    noFill();
    // mute our colors a little bit
    stroke(.7*currentSongSettings.red, .7*currentSongSettings.green, .7*currentSongSettings.blue, currentSongSettings.alpha);
    // randomly pick how thick our lines will be
    strokeWeight(random(0+currentSongSettings.lineWeight, 2+currentSongSettings.lineWeight));
    // iterate through the entire spectrum
    for (i = 0; i<spectrum.length; i++) {
      // a second rotater for maximum spin.
      rotate(radians(frameCount/currentSongSettings.frameRateDivider));
      // draw each of our vertices, mapping spectrum[i] from 0-255 to lineHeight-negative lineHeight.
      vertex(i, map(spectrum[i], 0, 255, currentSongSettings.lineHeight, (0-currentSongSettings.lineHeight)) );
    }
    endShape();

  }

  //this block generates our circles
  // make our colors a little brighter
  stroke((1.2*currentSongSettings.red), (1.2*currentSongSettings.green), (1.2*currentSongSettings.blue), currentSongSettings.alpha);
  // change the size of our circles by our song's settings
  strokeWeight(currentSongSettings.pixelSize);
  // iterate through our entire spectrum to create our circles
  for(l = 0; l<spectrum.length; l++){
    // if the spectrum indice is not zero
    if(spectrum[l] != 0){
      // draw our point in space
      point(cos(radians(l))*(10+2*spectrum[l]), sin(radians(l))*(10+2*spectrum[l]));
    }
  }

  // create our semi-transluscent ellipses based on our current color scheme
  noStroke();
  fill(currentSongSettings.red, currentSongSettings.green, currentSongSettings.blue, 25);
  // iterate a bunch of times, each time we loop through, we're making our circles
  // less transparent
  // for(var n = 0; n < 10; n++){
    // iterates again, this time generating a larger circle as we iterate.
    for(var k = 5; k <= 12; k++){

       ellipse(0,0,50*k*volume,50*k*volume);
       ellipse(0,0,70*k*volume,70*k*volume);
       ellipse(0,0,90*k*volume,90*k*volume);
    }
  // }

  // prevents the flashing from happening at the very beginning
  if(currentSongSettings.alpha !=0){
    // THIS IS THE SHIT
    // on each new frame, invert our sketch's colors, creating our two-toned
    // complementary color scheme.
    filter(INVERT);
  }
}


// when a new song is picked, stop all other songs from playing and initialize
// the settings for a new song. Eventually wish to refactor this for a number of
// reasons.
function songSelector() {
  var song = sel.value();
  switch(song){
    case 'Joy Division - Shadowplay':
      clear();
      background(40);
      song1.stop()
      song2.stop()
      song3.stop()
      song4.stop()
      currentSong = song1;
      currentSong.play();
      fft.setInput(currentSong);
      amplitude.setInput(currentSong);
      currentSongSettings.red = 0;
      currentSongSettings.green = 0;
      currentSongSettings.blue = 0;
      currentSongSettings.alpha = 255;
      currentSongSettings.lineHeight = 150;
      currentSongSettings.lineWeight = 0.1;
      currentSongSettings.pixelSize = 3;
      currentSongSettings.frameRateDivider = 120;
      break;
    case 'Misfits - We Are 138':
      clear();
      background(40);
      song1.stop();
      song2.stop();
      song3.stop();
      song4.stop();
      currentSong = song2;
      currentSong.play();
      fft.setInput(currentSong);
      amplitude.setInput(currentSong);
      currentSongSettings.red = random(0,255);
      currentSongSettings.green = random(0,50);
      currentSongSettings.blue = random(150,255);
      currentSongSettings.alpha = 255;
      currentSongSettings.lineHeight = 250;
      currentSongSettings.lineWeight = 3;
      currentSongSettings.pixelSize = 10;
      currentSongSettings.frameRateDivider = 5;
      break;
    case 'The Replacements - Bastards of Young':
      clear();
      background(40);
      song1.stop();
      song2.stop();
      song3.stop();
      song4.stop();
      currentSong = song3;
      currentSong.play();
      fft.setInput(currentSong);
      amplitude.setInput(currentSong);
      currentSongSettings.red = 0;
      currentSongSettings.green = random(100,150);
      currentSongSettings.blue = random(100,150);
      currentSongSettings.alpha = 255;
      currentSongSettings.lineHeight = 350;
      currentSongSettings.lineWeight = 4;
      currentSongSettings.pixelSize = 50;
      currentSongSettings.frameRateDivider = 60;
      break;
    case 'Jim Carroll Band - People Who Died':
      clear();
      background(40);
      song1.stop();
      song2.stop();
      song3.stop();
      song4.stop();
      currentSong = song4;
      currentSong.play();
      fft.setInput(currentSong);
      amplitude.setInput(currentSong);
      currentSongSettings.red = random(150,255);
      currentSongSettings.green = random(0, 40);
      currentSongSettings.blue = 0;
      currentSongSettings.alpha = 255;
      currentSongSettings.lineHeight = 500;
      currentSongSettings.lineWeight = 6;
      currentSongSettings.pixelSize = 10;
      currentSongSettings.frameRateDivider = 20;
      break;
    default:
      background(40);
      break;
  }
}

function saveOurImage(){
  saveCanvas(myCanvas, 'PleaseKillMe', 'jpg');
}
