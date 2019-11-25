/*Engine (fixed time_step) is used for different game levels*/

const Engine = function(time_step, update, render) {

  this.accumulated_time        = 0;// Amount of time that's accumulated since the last update.
  this.animation_frame_request = undefined,// animation frame request reference
  this.time                    = undefined,// Recent loop execution time_stamp.
  this.time_step               = time_step,// 1000/30 = 30 frames per second (this is voted from the other combinations that have been tried)

  this.updated = false;// Status of the update function being called since the last cycle.

  this.update = update;// function to update
  this.render = render;// function to render

  this.run = function(time_stamp) {// single game loop cycle

    /* Where updates may take longer (slow devices) we have used following where we never allows
     3 frames to pass without an update. This will help in ensuring that no undesired crashes occur */

    this.animation_frame_request = window.requestAnimationFrame(this.handleRun);

    this.accumulated_time += time_stamp - this.time;
    this.time = time_stamp;

    /* Safety statement. */
    if (this.accumulated_time >= this.time_step * 3) {

      this.accumulated_time = this.time_step;

    }

        
      /* Update is possible only when the screen is ready to draw when the run function
    is called by the requestAnimationFrame. Therefore, the we need to keep track of
    how much time has passed for an update. If multiple time steps have occured, one time
    is updated for each of them  */
    
    while(this.accumulated_time >= this.time_step) {

      this.accumulated_time -= this.time_step;

      this.update(time_stamp);

      this.updated = true; // With every update it is drawn again.

    }
    
    /* Draw only when the game has updated. */

    if (this.updated) {

      this.updated = false;
      this.render(time_stamp);

    }

  };

  this.handleRun = (time_step) => { this.run(time_step); };

};


/* Engine prototype for start and stop functions- beginning and end of game*/
Engine.prototype = {

  constructor:Engine,

  start:function() {

    this.accumulated_time = this.time_step;
    this.time = window.performance.now();
    this.animation_frame_request = window.requestAnimationFrame(this.handleRun);

  },

  stop:function() { window.cancelAnimationFrame(this.animation_frame_request); }

};
