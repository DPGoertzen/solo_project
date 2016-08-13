var fft, amplitude, reverb;
var song, song1, song2, song3, song4, currentSong;
var currentSongSettings = {};
var checkbox, sel;

function preload(){
  song1 = loadSound('../assets/Shadowplay.mp3');
  song2 = loadSound('../assets/WeAre138.mp3');
  song3 = loadSound('../assets/BastardsOfYoung.mp3');
  song4 = loadSound('../assets/PeopleWhoDied.mp3');
  // for reverb functionality add this
  // currentSong.disconnect();
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

  // checkbox = createCheckbox('reverb', false);
  // checkbox.parent('checkbox');
  // checkbox.changed(reverbChecked);


  fft = new p5.FFT();
  amplitude = new p5.Amplitude();
  //  song.play();
  //  fft = new p5.FFT();
  //  fft.setInput(song);
  //
  //  amplitude = new p5.Amplitude();
  //  amplitude.setInput(song);
   frameRate(60);
   smooth();
  // reverb functionality
  // reverb = new p5.Reverb();

  currentSongSettings.red = 0;
  currentSongSettings.green = 0;
  currentSongSettings.blue = 0;
  currentSongSettings.alpha = 0;

}
//
// function reverbChecked(){
//   if (this.checked()) {
//     reverb = new p5.Reverb();
//     currentSong.disconnect();
//     reverb.process(currentSong, 10, 2);
//     reverb.amp(4);
//   } else {
//     currentSong.connect();
//     reverb = null;
//   }
// }

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
      currentSongSettings.pixelSize = 5;
      currentSongSettings.frameRateDivider = 20;
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
  rotate(radians(frameCount/currentSongSettings.frameRateDivider));

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
    strokeWeight(random(0+currentSongSettings.lineWeight, 2+currentSongSettings.lineWeight));
    for (i = 0; i<spectrum.length; i++) {
      rotate(radians(frameCount/currentSongSettings.frameRateDivider));
      // working version
      // vertex(i, map(spectrum[i], 0, 255, 500, -300) );
      vertex(i, map(spectrum[i], 0, 255, currentSongSettings.lineHeight, (0-currentSongSettings.lineHeight)) );
    }
    endShape();

  }
  // stroke(30);
  // original working KEEP
  // stroke(random(0,50),random(210,255),255);
  noStroke();
  stroke((1.2*currentSongSettings.red), (1.2*currentSongSettings.green), (1.2*currentSongSettings.blue), currentSongSettings.alpha);
  noSmooth();
  strokeWeight(currentSongSettings.pixelSize);
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

  if(currentSongSettings.alpha !=0){
    // THIS IS THE SHIT
    filter(INVERT);
  }
}
