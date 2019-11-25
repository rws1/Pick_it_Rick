/* Updated Engine with ssfety statement to avoid crashes*/

const Engine = function(time_step, update, render) {

  this.accumulated_time        = 0;
  this.animation_frame_request = undefined,
  this.time                    = undefined,
  this.time_step               = time_step,

  this.updated = false;

  this.update = update;
  this.render = render;

  this.run = function(time_stamp) {

    /*Game update function moved up with the safety if statement will
    not allow 3 frames to pass without an update to sensure the game doesnot
    crash even if the game logic in advanced levels in too long*/

    this.animation_frame_request = window.requestAnimationFrame(this.handleRun);

    this.accumulated_time += time_stamp - this.time;
    this.time = time_stamp;

    /* Safety statement. */
    if (this.accumulated_time >= this.time_step * 3) {

      this.accumulated_time = this.time_step;

    }

    while(this.accumulated_time >= this.time_step) {

      this.accumulated_time -= this.time_step;

      this.update(time_stamp);

      this.updated = true;

    }

    if (this.updated) {

      this.updated = false;
      this.render(time_stamp);

    }

  };

  this.handleRun = (time_step) => { this.run(time_step); };

};

Engine.prototype = {

  constructor:Engine,

  start:function() {

    this.accumulated_time = this.time_step;
    this.time = window.performance.now();
    this.animation_frame_request = window.requestAnimationFrame(this.handleRun);

  },

  stop:function() { window.cancelAnimationFrame(this.animation_frame_request); }

};
