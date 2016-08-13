var seedArray = [];
var seed = [];
var tree;
// Initial growth rate
var initGrowth = 1.2;
var selecterAngle;
var newTreeButton;
var treeWidth;
var buttonSave, buttonLoad, buttonSaveImage;
var howManyTrees = 1;

function setup() {
  // creates our canvas and interactive inputs
  myCanvas = createCanvas( 1000, 500);
  myCanvas.parent('invisibleCitiesSketch');

  selecterAngle = createSlider(0, 4, 0.75, 0.25);
  selecterAngle.parent('selecterAngle');
  newTreeButton = createButton('New Tree');
  newTreeButton.parent('newTreeButton');
  newTreeButton.mousePressed(newTreeButtonClicked);
  treeWidth = createSlider(1, 24, 12, 1);
  treeWidth.parent('treeWidth');
  buttonSave = createButton('Save');
  buttonSave.parent('InvisibleCitiesButtonSave');
  buttonSave.mousePressed(saveInfo);
  buttonLoad = createButton('Load');
  buttonLoad.parent('InvisibleCitiesButtonLoad');
  buttonLoad.mousePressed(loadInfo);
  buttonSaveImage = createButton('Save Image');
  buttonSaveImage.parent('saveImage');
  buttonSaveImage.mousePressed(saveOurImage);

  // Create an initial tree
  tree = new Tree(initGrowth, -HALF_PI+(random(-0.2, 0.2)), null, treeWidth.value());
  seedArray.push(new Seed(tree, width/2, height));
  frameRate(30);
  stroke(215);
}

function draw() {
  // the combination of a low alpha (opacity) fill combined with drawing
  // a rectangle the size of our screen creates our blur and fade.
   fill(0,15);
   rect(0,0,width,height);

  // every 40 frames, make a new semi-transluscent branch tree.
    if(frameCount % 40 == 0){
       stroke(255, 125);
       branch(random(50, 950), height, height-random(250, 450), radians(270));
    }
    stroke(215);

  // every 400 frames, clear all trees, make a new tree, and reset how many trees onscreen to 1.
  if(frameCount % 400 == 0){
    howManyTrees = 1;
    seedArray = [];
    tree = new Tree(initGrowth, -HALF_PI+(random(-0.25, 0.25)),null, treeWidth.value());
    seedArray.push(new Seed(tree, random(.25*width, .75*width), height));
  }

  // on each draw cycle, check to see if the tree can reproduce
  // also grow and display the tree
  for (var i=0; i<seedArray.length; i++) {
    seedArray[i].reproduce();
    seedArray[i].grow();
    seedArray[i].display();
  }

}

// functionality for our background branches, which are generated all at once,
// which is a much less taxing implementation of a tree (also more naturalistic)
function branch(x, y, s, a){
  strokeWeight(s*.05);
  a+=radians(1.1*random(-10,10));
  var newx = x+cos(a)*s;
  var newy = y+sin(a)*s;
  line(x,y,newx,newy);
  if(s > 2){
    for(var i = 0; i < random(1,2); i++){
      branch(newx, newy, s*(random(0.15,0.75)), a+radians(random(0,40)));
      branch(newx, newy, s*(random(0.15,0.75)), a-radians(random(0,40)));
    }
  }
}


function newTreeButtonClicked() {
  // We have rendering issues if we have more than 3 trees on screen at once
  if(howManyTrees < 3){
    tree = new Tree(initGrowth, -HALF_PI+(random(-0.2, 0.2)), null, treeWidth.value());
    seedArray.push(new Seed(tree, random(.25*width, .75*width), height));
    howManyTrees++;
  }else{
    seedArray = [];
    tree = new Tree(initGrowth, -HALF_PI+(random(-0.25, 0.25)),null, treeWidth.value());
    seedArray.push(new Seed(tree, random(.25*width, .75*width), height));
    howManyTrees = 1;
  }

}

//save our sliders and send them through to our settings route and on to the db
function saveInfo(){
  var data = {};
  data.treeWidth = treeWidth.value();
  data.selecterAngle = selecterAngle.value();
  console.log(data);
  httpPost('/addSettingsInvisibleCities', data, finished);
  function finished(response) {
    console.log(response);
  }
}

// retrieve our saved slider values
function loadInfo(){
  var params = {};
  httpGet('/retrieveSettings', params, finished);

  function finished(response) {
    var ourData = JSON.parse(response)
    treeWidth.value(ourData.treeWidth);
    selecterAngle.value(ourData.selecterAngle);
    console.log(JSON.parse(response));
  }
}

function saveOurImage(){
  saveCanvas(myCanvas, 'InvisibleCities', 'jpg');
}




// Seeds are a specific instance of a tree with an x and y position
function Seed(tree, x, y) {
  this.tree = tree;
  this.x = x;
  this.y = y;
}

Seed.prototype.display = function() {
    this.tree.display(this.x, this.y);
  }

Seed.prototype.reproduce = function() {
    this.tree.reproduce();
  }

Seed.prototype.grow = function() {
    this.tree.grow();
  }

// tree constructor
function Tree(growth, angle, parent, isw) {

  // initialize variables
  this.parent = parent;
  this.growth = growth;
  this.angle = angle;
  this.children = [];

  this.size = null;
  this.isw = isw;
  this.maxSize = 100;
  this.hasReproduced = false;

  // constructor for the initial branch (i.e. parent)
  if(growth && angle && isw) {
    this.isw = isw;
    this.growth = growth;
    this.angle = angle;
    this.parent = null;
    this.size = 0;
  }

  // This is the constructor for child branches
  if(angle && parent && isw) {
    this.isw = 0.5 * parent.isw
    this.growth = random(0.4, 0.8) * parent.growth;
    this.maxSize = 0.8 * parent.maxSize;
    this.angle = angle;
    this.parent = parent;
    this.parent.children.push(this);
    this.size = 0;
  }
}

// this function is how we grow our trees
Tree.prototype.grow = function() {

  // if our tree is bigger than maxSize, stop growing
  if (this.size > this.maxSize) {
    this.growth = 0;
  }

  this.size += this.growth;
  // iterate through our children recursively
  for (var i = 0; i<this.children.length; i++) {
    this.children[i].grow();
  }
}

// displays our tree
Tree.prototype.display = function(x, y) {
  var endX = x + (cos(this.angle)*this.size);
  var endY = y + (sin(this.angle)*this.size);
  strokeWeight(this.isw);
  line(x, y, endX, endY);

  for (var i = 0; i<this.children.length; i++) {
    this.children[i].display(endX, endY);
  }
}

// This is how our tree "reproduces" and creates new branches
Tree.prototype.reproduce = function() {
  // If our branch is big enough to reproduce,
  // and it has less than 8 children, then create a new branch
  // 8 is the absolute upper limit before our frame rate plummets.
  if ( this.size > 50 &&  this.children.length < 8) {
    var direction = (random(0, 2))*2-1;
    this.children.push(new Tree(null,-HALF_PI+(random(-selecterAngle.value(), selecterAngle.value())*direction), this, this.isw));
  }

  //  recursively reproduce
  for (var i=0; i<this.children.length; i++) {
    this.children[i].reproduce();
  }
}
