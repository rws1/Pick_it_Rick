function setup() {
  // createCanvas code
    createCanvas(1000, 1000);
    // excute command to test the code in console on chrome
    print("setup function!");
}

function draw() {
  // create the drawing code
    background(255,0, 0);
    ellipse(150, 100, 100, 50);
    //execute command to test the code in console on chrome
    print("draw function!");
}

function draw() {
  // create the drawing code 
  // Note- code that is written at the end overrides the rest written before and is executed     
     background(255,0, 0);   
    rect(250, 150, 100, 50);
     ellipse(150, 175, 100, 50);   
    //execute command to test the code in console on chrome
    print("draw function!");
}