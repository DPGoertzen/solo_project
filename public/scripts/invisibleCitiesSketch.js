var seedArray = [];
var seed = [];
var tree;
// var initialStrokeWeight = 12;
// Initial growth rate
var initGrowth = 1.2;
var selecterAngle;
var newTreeButton;
var treeWidth;
var buttonSave, buttonLoad;
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


  // Create an initial tree
  tree = new Tree(initGrowth, -HALF_PI+(random(-0.2, 0.2)), null, treeWidth.value());
  seedArray.push(new Seed(tree, width/2, height));
  frameRate(30);
  stroke(215);
}

function draw() {
   fill(0,15);
   rect(0,0,width,height);

    if(frameCount % 40 == 0){
       stroke(255, 125);
       branch(random(50, 950), height, height-random(250, 450), radians(270));
    }
    stroke(215);

  if(frameCount%500 == 0){
    howManyTrees = 1;
    seedArray = [];
    tree = new Tree(initGrowth, -HALF_PI+(random(-0.25, 0.25)),null, treeWidth.value());
    seedArray.push(new Seed(tree, random(.25*width, .75*width), height));
  }

  for (var i=0; i<seedArray.length; i++) {
    seedArray[i].reproduce();
  }

  for (var i=0; i<seedArray.length; i++) {
    seedArray[i].grow();
    seedArray[i].display();
  }

  // Display seed sizes -- unnecessary
  // for (var i=0; i<seedArray.length; i++) {
  //   console.log(seedArray[i].getNbrBlades() + " ");
  // }
}

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

Seed.prototype.isAlive = function() {
    return this.tree.life;
  }

// unnecessary -- takes up processing overhead
// Seed.prototype.getNbrBlades = function() {
//     return this.tree.getNbrBranches();
// }


function Tree(growth, angle, parent, isw) {

  // Tree parent;
  this.parent = parent;
  this.growth = growth;
  this.angle = angle;
  this.children = [];


  this.size = null;
  this.age = null;
  this.isw = isw;

  this.maxSize = 100;
  this.maxAge = 600; // about 10 seconds
  this.life = true;
  this.hasReproduced = false;

  // -------------------------------------------------------- parent constructor
  if(growth && angle && isw) {
    this.isw = isw;
    this.growth = growth;
    this.angle = angle;
    this.parent = null;
    this.size = 0;
    this.age = 0;
  }

  // -------------------------------------------------------- children constructor
  if(angle && parent && isw) {
    this.isw = 0.5 * parent.isw
    this.growth = random(0.4, 0.8) * parent.growth;
    this.maxSize = 0.8 * parent.maxSize;
    this.angle = angle;
    this.parent = parent;
    this.parent.children.push(this);
    this.size = 0;
    this.age = 0;
  }
}

// -------------------------------------------------------- grow()
Tree.prototype.grow = function() {

  // --------------------------------------- growth stops if maximum size is reached
  if (this.size > this.maxSize) {
    this.growth = 0;
  }

  // --------------------------------------------- life stops after a while
  if (this.age > this.maxAge) {
    this.life = false;
  }
  // -------------------------------------------------------- life pass
  this.size += this.growth;
  this.age += 1;

  for (var i = 0; i<this.children.length; i++) {
    this.children[i].grow();
  }
}

// -------------------------------------------------------- display()
Tree.prototype.display = function(x, y) {
  var endX = x + (cos(this.angle)*this.size);
  var endY = y + (sin(this.angle)*this.size);
  strokeWeight(this.isw);
  line(x, y, endX, endY);

  for (var i = 0; i<this.children.length; i++) {
    this.children[i].display(endX, endY);
  }
}

// -------------------------------------------------------- reproduce
Tree.prototype.reproduce = function() {
  // Must be a certain size before the branch can reproduce
  // Alos limit the number of children to afunction expontial growth
  if ( this.size > 50 &&  this.children.length < 8) {
    var direction = (random(0, 2))*2-1;
    this.children.push(new Tree(null,-HALF_PI+(random(-selecterAngle.value(), selecterAngle.value())*direction), this, this.isw));
  }

  // ---------------- recursive !

  for (var i=0; i<this.children.length; i++) {
    this.children[i].reproduce();
  }
}

// -------------- the number of branches in the tree
// unnecessary -- takes up processing overhead
// Tree.prototype.getNbrBranches = function() {
//   var n = this.children.length;
//   for (var i=0; i<this.children.length; i++)
//     n += this.children[i].getNbrBranches();
//   return n;
// }
