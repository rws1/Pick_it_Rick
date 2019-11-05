const Display = function(canvas) {
// two 2d rendering contexts,  context in onscreen rendering, buffer if offscreen canvas sized to match the world height and width.
  this.buffer  = document.createElement("canvas").getContext("2d"),
  this.context = canvas.getContext("2d");

  
  
  //creates a rectangle and fills it with colour
  this.drawRectangle = function(x, y, width, height, color) {

    this.buffer.fillStyle = color;
    // the math function rounds off to ensure any half pixels cannot be drawn producing non sharp edges. 
    this.buffer.fillRect(Math.floor(x), Math.floor(y), width, height);

  };

  this.fill = function(color) {

   // takes a colour and draws it to the offscreen canvas
    this.buffer.fillStyle = color;
    this.buffer.fillRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height);

  };
// takes the buffer canvas and renders it to the screen  
  this.render = function() { this.context.drawImage(this.buffer.canvas, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height, 0, 0, this.context.canvas.width, this.context.canvas.height); };

  this.resize = function(width, height, height_width_ratio) {

    if (height / width > height_width_ratio) {

      this.context.canvas.height = width * height_width_ratio;
      this.context.canvas.width = width;

    } else {

      this.context.canvas.height = height;
      this.context.canvas.width = height / height_width_ratio;

    }

    this.context.imageSmoothingEnabled = false;

  };

};

Display.prototype = {

  constructor : Display

};
