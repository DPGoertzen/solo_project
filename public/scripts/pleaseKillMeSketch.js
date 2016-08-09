var fft;
var amplitude;
var song, song1, song2, song3, song4;
var red, green, blue;
var currentSongSettings = {};



function preload(){
  song1 = loadSound('../assets/Shadowplay.mp3');
  song2 = loadSound('../assets/WeAre138.mp3');
  song3 = loadSound('../assets/BastardsOfYoung.mp3');
  song4 = loadSound('../assets/PeopleWhoDied.mp3');
  // for reverb functionality add this
  // song.disconnect();
}

function setup() {

   var myCanvas = createCanvas(1000,500);
   myCanvas.parent('pleaseKillMeSketch');
   background(40);

   sel = createSelect();
  sel.parent('selecter');
  sel.option('Pick A Song');
  sel.option('Joy Division - Shadowplay');
  sel.option('Misfits - We Are 138');
  sel.option('The Replacements - Bastards of Young');
  sel.option('Jim Carroll Band - People Who Died');
  sel.changed(songSelector);
  fft = new p5.FFT();
  amplitude = new p5.Amplitude();
  //  song.play();
  //  fft = new p5.FFT();
  //  fft.setInput(song);
  //
  //  amplitude = new p5.Amplitude();
  //  amplitude.setInput(song);
   frameRate(120);
   smooth();
  // reverb functionality
  // reverb = new p5.Reverb();
  // reverb.process(song, 2, 0.5);
  // reverb.amp(4);
  currentSongSettings.red = 0;
  currentSongSettings.green = 0;
  currentSongSettings.blue = 0;
  currentSongSettings.alpha = 0;

}

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
      song1.play();
      fft.setInput(song1);
      amplitude.setInput(song1);
      currentSongSettings.red = 0;
      currentSongSettings.green = 0;
      currentSongSettings.blue = 0;
      currentSongSettings.alpha = 255;
      currentSongSettings.lineHeight = 150;
      currentSongSettings.lineWeight = 0.1;
      break;
    case 'Misfits - We Are 138':
      clear();
      background(40);
      song1.stop();
      song2.stop();
      song3.stop();
      song4.stop();
      song2.play();
      fft.setInput(song2);
      amplitude.setInput(song2);
      currentSongSettings.red = random(0,255);
      currentSongSettings.green = random(0,50);
      currentSongSettings.blue = random(150,255);
      currentSongSettings.alpha = 255;
      currentSongSettings.lineHeight = 250;
      currentSongSettings.lineWeight = 3;
      break;
    case 'The Replacements - Bastards of Young':
      clear();
      background(40);
      song1.stop();
      song2.stop();
      song3.stop();
      song4.stop();
      song3.play();
      fft.setInput(song3);
      amplitude.setInput(song3);
      currentSongSettings.red = 0;
      currentSongSettings.green = random(100,150);
      currentSongSettings.blue = random(100,150);
      currentSongSettings.alpha = 255;
      currentSongSettings.lineHeight = 350;
      currentSongSettings.lineWeight = 4;
      break;
    case 'Jim Carroll Band - People Who Died':
      clear();
      background(40);
      song1.stop();
      song2.stop();
      song3.stop();
      song4.stop();
      song4.play();
      fft.setInput(song4);
      amplitude.setInput(song4);
      currentSongSettings.red = random(150,255);
      currentSongSettings.green = random(0, 40);
      currentSongSettings.blue = 0;
      currentSongSettings.alpha = 255;
      currentSongSettings.lineHeight = 500;
      currentSongSettings.lineWeight = 6;
      break;
    default:
      background(40);
      break;
  }
}



function draw() {

  fill(40, 10);
  rect(0,0,1000,500);
  var spectrum = fft.analyze();
  var volume = amplitude.getLevel();
  translate(width/2, height/2);
  rotate(radians(frameCount/20));

  for(j=0; j<15; j++){
    noStroke();
    // original working blue KEEP
    // fill(random(150,255),random(0,40),0, 6);
    fill(currentSongSettings.red, currentSongSettings.green, currentSongSettings.blue, 6)
    for(var k = 5; k <= 12; k++){

       ellipse(0,0,50*k*volume,50*k*volume);
       ellipse(0,0,70*k*volume,70*k*volume);
       ellipse(0,0,90*k*volume,90*k*volume);
    }
    beginShape();
    noFill();
    stroke(.5*currentSongSettings.red, .5*currentSongSettings.green, .5*currentSongSettings.blue, currentSongSettings.alpha);
    // Working blue and red alternating. KEEP
    // stroke(random(150,255),random(0,40),0);
    // Joker colors
    // stroke(random(150,255),0,random(150, 255));
    strokeWeight(random(0+currentSongSettings.lineWeight, 2+currentSongSettings.lineWeight));
    for (i = 0; i<spectrum.length; i++) {
      rotate(radians(frameCount));
      // working version
      vertex(i, map(spectrum[i], 0, 255, currentSongSettings.lineHeight, (0-currentSongSettings.lineHeight)) );
      // vertex(i, map(spectrum[i], 0, 255, 500, -300) );
    }
    endShape();

  }
  // stroke(30);
  // original working KEEP
  // stroke(random(0,50),random(210,255),255);
  noStroke();
  stroke((1.7*currentSongSettings.red), (1.7*currentSongSettings.green), (1.7*currentSongSettings.blue), currentSongSettings.alpha);
  noSmooth();
  strokeWeight(10);
  for(l = 0; l<spectrum.length; l++){
    if(spectrum[l] != 0)
    point(cos(radians(l))*(10+2*spectrum[l]), sin(radians(l))*(10+2*spectrum[l]));
  }
  noStroke();
  fill(currentSongSettings.red, currentSongSettings.green, currentSongSettings.blue, 6);
  for(var n=0;n<10;n++){
    for(var k = 5; k <= 12; k++){

       ellipse(0,0,50*k*volume,50*k*volume);
       ellipse(0,0,70*k*volume,70*k*volume);
       ellipse(0,0,90*k*volume,90*k*volume);
    }
  }
    // THIS IS THE SHIT
  if(currentSongSettings.alpha !=0){
    filter(INVERT);
  }
}
