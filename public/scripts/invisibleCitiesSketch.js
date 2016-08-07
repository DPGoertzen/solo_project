var sketchWidth = 1000;
var sketchHeight = 500;
var currentTime = millis();

function setup(){
  var myCanvas = createCanvas(sketchWidth, sketchHeight);
  myCanvas.parent('invisibleCitiesSketch');
  background(0);
  frameRate(24);
  smooth();
  fill(0,12);
}

function draw(){
   noStroke();
   fill(0,15);
   rect(0,0,width,height);
   if(frameCount % 10 == 0){
    stroke(255);
    branch(random(50, 950), height, height-random(250, 450), radians(270));
   }

}

function branch(x, y, s, a){
  strokeWeight(s*.05);
  a+=radians(1.1*random(-10,10));
  var newx = x+cos(a)*s;
  var newy = y+sin(a)*s;
  line(x,y,newx,newy);
  if(s>2){
    for(var i = 0; i < random(1,2); i++){
      branch(newx, newy, s*(random(0.15,0.75)), a+radians(random(0,45))); //make this user changable
      branch(newx, newy, s*(random(0.15,0.75)), a-radians(random(0,45)));
    }
  }
}

function mousePressed(){
   stroke(255);
   branch(mouseX, height, height-mouseY, radians(270));
}
