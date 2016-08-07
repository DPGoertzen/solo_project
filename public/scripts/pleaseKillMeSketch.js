var fft;
var amplitude;
var song;

function preload(){
  song = loadSound('../assets/PeopleWhoDied.mp3');
}

function setup() {

   var myCanvas = createCanvas(1000,500);
   myCanvas.parent('pleaseKillMeSketch');
   background(40);
   //
  //  mic = new p5.AudioIn();
  //  mic.start();
   song.play();
   fft = new p5.FFT();
   fft.setInput(song);

   amplitude = new p5.Amplitude();
   amplitude.setInput(song);
   frameRate(120);

}

function draw() {
  fill(40, 10);
  rect(0,0,width,height);
   var spectrum = fft.analyze();
   var volume = amplitude.getLevel();
   translate(width/2, height/2);
   rotate(radians(frameCount/20));
   for(j=0; j<15; j++){
     noStroke();
     fill(255,130,0, 6);
     for(var k = 5; k <= 12; k++){
       ellipse(0,0,30*k*volume,30*k*volume);
       ellipse(0,0,50*k*volume,50*k*volume);
       ellipse(0,0,70*k*volume,70*k*volume);
     }
     beginShape();
     noFill();
     stroke(random(150,255),random(0,40),0);
     strokeWeight(random(5,10));
     for (i = 0; i<spectrum.length; i++) {
       rotate(radians(frameCount));
       vertex(i, map(spectrum[i], 0, 255, 250, 0) );
      //  translate(50*volume,0);
     }
      endShape();

    }
}
