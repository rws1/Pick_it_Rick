const Game = function() {

  this.world    = new Game.World();

  this.update   = function() {

    this.world.update();

  };

};

Game.prototype = {

  constructor : Game,

};

Game.World = function(friction = 0.8, gravity = 4) {

  this.collider = new Game.World.Collider();

  this.friction = friction;
  this.gravity  = gravity;

  this.columns   = 12;
  this.rows      = 9;

  /* Here's where I define the new TileSet class. I give it complete control over
  tile_size because there should only be one source for tile_size for both drawing
  and collision as this game won't use scaling on individual objects. */
  this.tile_set = new Game.World.TileSet(128, 128);
  this.player   = new Game.World.Object.Player(200, 200);// The player in its new "namespace".

  this.map = [386,386,386,386,386,386,386,386,386,386,386,386,

              260,386,386,386,386,386,258,259,259,259,260,386,

              386,258,259,259,259,260,386,386,386,386,386,258,

              386,386,386,386,386,386,258,259,260,386,386,386,

              259,259,259,260,386,386,386,386,386,258,259,259,

              386,386,386,386,386,386,258,259,260,386,386,386,

              386,258,259,259,259,260,386,386,386,258,259,259,

              386,386,386,386,386,386,386,386,386,386,386,386,

              00,01,01,01,01,01,01,01,01,01,02,385];

  this.collision_map = [00,00,00,00,00,00,00,00,00,00,00,00,
                        16,00,00,00,00,00,16,16,16,16,16,00,
                        00,16,16,16,16,16,00,00,00,00,00,16,
                        00,00,00,00,00,00,16,16,16,00,00,00,
                        16,16,16,16,00,00,00,00,00,16,16,16,
                        00,00,00,01,00,00,16,16,16,00,00,00,
                        00,16,16,16,16,16,00,00,00,16,16,16,
                        00,00,00,00,00,00,00,00,00,00,00,00,
                        01,01,01,01,01,01,01,01,01,01,03,00];

  this.height   = this.tile_set.tile_size * this.rows;   // these changed to use tile_set.tile_size
  this.width    = this.tile_set.tile_size * this.columns;// I got rid of this.tile_size in Game.World

};

Game.World.prototype = {

  constructor: Game.World,

  collideObject:function(object) {

    if      (object.getLeft()   < 0          ) { object.setLeft(0);             object.velocity_x = 0; }
    else if (object.getRight()  > this.width ) { object.setRight(this.width);   object.velocity_x = 0; }
    if      (object.getTop()    < 0          ) { object.setTop(0);              object.velocity_y = 0; }
    else if (object.getBottom() > this.height) { object.setBottom(this.height); object.velocity_y = 0; object.jumping = false; }

    var bottom, left, right, top, value;

    top    = Math.floor(object.getTop()    / this.tile_set.tile_size);
    left   = Math.floor(object.getLeft()   / this.tile_set.tile_size);
    value  = this.collision_map[top * this.columns + left];
    this.collider.collide(value, object, left * this.tile_set.tile_size, top * this.tile_set.tile_size, this.tile_set.tile_size);

    top    = Math.floor(object.getTop()    / this.tile_set.tile_size);
    right  = Math.floor(object.getRight()  / this.tile_set.tile_size);
    value  = this.collision_map[top * this.columns + right];
    this.collider.collide(value, object, right * this.tile_set.tile_size, top * this.tile_set.tile_size, this.tile_set.tile_size);

    bottom = Math.floor(object.getBottom() / this.tile_set.tile_size);
    left   = Math.floor(object.getLeft()   / this.tile_set.tile_size);
    value  = this.collision_map[bottom * this.columns + left];
    this.collider.collide(value, object, left * this.tile_set.tile_size, bottom * this.tile_set.tile_size, this.tile_set.tile_size);

    bottom = Math.floor(object.getBottom() / this.tile_set.tile_size);
    right  = Math.floor(object.getRight()  / this.tile_set.tile_size);
    value  = this.collision_map[bottom * this.columns + right];
    this.collider.collide(value, object, right * this.tile_set.tile_size, bottom * this.tile_set.tile_size, this.tile_set.tile_size);

  },

  /* This function changed to update the player's position and then do collision,
  and then update the animation based on the player's final condition. */
  update:function() {

    this.player.updatePosition(this.gravity, this.friction);

    this.collideObject(this.player);

    this.player.updateAnimation();

  }

};

Game.World.Collider = function() {

  this.collide = function(value, object, tile_x, tile_y, tile_size) {

    switch(value) {
    //top only collisions
      case  1: this.collidePlatformTop      (object, tile_y            ); break;
    // collis from the right
      case  2: this.collidePlatformRight    (object, tile_x + tile_size); break;
    // collisions from top and right
      case  3: if (this.collidePlatformTop  (object, tile_y            )) return;// If there's a collision, we don't need to check for anything else.
               this.collidePlatformRight    (object, tile_x + tile_size); break;
      case  4: this.collidePlatformBottom   (object, tile_y + tile_size); break;
      case  5: if (this.collidePlatformTop  (object, tile_y            )) return;
               this.collidePlatformBottom   (object, tile_y + tile_size); break;
      case  6: if (this.collidePlatformRight(object, tile_x + tile_size)) return;
               this.collidePlatformBottom   (object, tile_y + tile_size); break;
      case  7: if (this.collidePlatformTop  (object, tile_y            )) return;
               if (this.collidePlatformRight(object, tile_x + tile_size)) return;
               this.collidePlatformBottom   (object, tile_y + tile_size); break;
      case  8: this.collidePlatformLeft     (object, tile_x            ); break;
      case  9: if (this.collidePlatformTop  (object, tile_y            )) return;
               this.collidePlatformLeft     (object, tile_x            ); break;
      case 10: if (this.collidePlatformLeft (object, tile_x            )) return;
               this.collidePlatformRight    (object, tile_x + tile_size); break;
      case 11: if (this.collidePlatformTop  (object, tile_y            )) return;
               if (this.collidePlatformLeft (object, tile_x            )) return;
               this.collidePlatformRight    (object, tile_x + tile_size); break;
      case 12: if (this.collidePlatformLeft (object, tile_x            )) return;
               this.collidePlatformBottom   (object, tile_y + tile_size); break;
      case 13: if (this.collidePlatformTop  (object, tile_y            )) return;
               if (this.collidePlatformLeft (object, tile_x            )) return;
               this.collidePlatformBottom   (object, tile_y + tile_size); break;
      case 14: if (this.collidePlatformLeft (object, tile_x            )) return;
               if (this.collidePlatformRight(object, tile_x + tile_size)) return; // Had to change this since part 4. I forgot to add tile_size
               this.collidePlatformBottom   (object, tile_y + tile_size); break;
      case 15: if (this.collidePlatformTop  (object, tile_y            )) return;
               if (this.collidePlatformLeft (object, tile_x            )) return;
               if (this.collidePlatformRight(object, tile_x + tile_size)) return;
               this.collidePlatformBottom   (object, tile_y + tile_size); break;
      case  16: this.collidePlatformTop      (object,tile_y + 35     ); break;


    }

  }

};

Game.World.Collider.prototype = {

  constructor: Game.World.Collider,

  collidePlatformBottom:function(object, tile_bottom) {

    if (object.getTop() < tile_bottom && object.getOldTop() >= tile_bottom) {

      object.setTop(tile_bottom);
      object.velocity_y = 0;
      return true;

    } return false;

  },

  collidePlatformLeft:function(object, tile_left) {

    if (object.getRight() > tile_left && object.getOldRight() <= tile_left) {

      object.setRight(tile_left - 0.01);
      object.velocity_x = 0;
      return true;

    } return false;

  },

  collidePlatformRight:function(object, tile_right) {

    if (object.getLeft() < tile_right && object.getOldLeft() >= tile_right) {

      object.setLeft(tile_right);
      object.velocity_x = 0;
      return true;

    } return false;

  },

  collidePlatformTop:function(object, tile_top) {

    if (object.getBottom() > tile_top && object.getOldBottom() <= tile_top) {

      object.setBottom(tile_top - 0.01);
      object.velocity_y = 0;
      object.jumping    = false;
      return true;

    } return false;

  }

 };

Game.World.Object = function(x, y, width, height) {

 this.height = height;
 this.width  = width;
 this.x      = x;
 this.x_old  = x;
 this.y      = y;
 this.y_old  = y;

};

Game.World.Object.prototype = {

  constructor:Game.World.Object,

  /* These functions are used to get and set the different side positions of the object. */
  getBottom:   function()  { return this.y     + this.height; },
  getLeft:     function()  { return this.x;                   },
  getRight:    function()  { return this.x     + this.width;  },
  getTop:      function()  { return this.y;                   },
  getOldBottom:function()  { return this.y_old + this.height; },
  getOldLeft:  function()  { return this.x_old;               },
  getOldRight: function()  { return this.x_old + this.width;  },
  getOldTop:   function()  { return this.y_old                },
  setBottom:   function(y) { this.y     = y    - this.height; },
  setLeft:     function(x) { this.x     = x;                  },
  setRight:    function(x) { this.x     = x    - this.width;  },
  setTop:      function(y) { this.y     = y;                  },
  setOldBottom:function(y) { this.y_old = y    - this.height; },
  setOldLeft:  function(x) { this.x_old = x;                  },
  setOldRight: function(x) { this.x_old = x    - this.width;  },
  setOldTop:   function(y) { this.y_old = y;                  }

};

Game.World.Object.Animator = function(frame_set, delay) {

  this.count       = 0;
  this.delay       = (delay >= 1) ? delay : 1;
  this.frame_set   = frame_set;
  this.frame_index = 0;
  this.frame_value = frame_set[0];
  this.mode        = "pause";

};

Game.World.Object.Animator.prototype = {

  constructor:Game.World.Object.Animator,

  animate:function() {

    switch(this.mode) {

      case "loop" : this.loop(); break;
      case "pause":              break;

    }

  },

  changeFrameSet(frame_set, mode, delay = 10, frame_index = 0) {

    if (this.frame_set === frame_set) { return; }

    this.count       = 0;
    this.delay       = delay;
    this.frame_set   = frame_set;
    this.frame_index = frame_index;
    this.frame_value = frame_set[frame_index];
    this.mode        = mode;

  },

  loop:function() {

    this.count ++;

    while(this.count > this.delay) {

      this.count -= this.delay;

      this.frame_index = (this.frame_index < this.frame_set.length - 1) ? this.frame_index + 1 : 0;

      this.frame_value = this.frame_set[this.frame_index];

    }

  }

};

/* The player now also extends the Game.World.Object.Animator class. I also added
a direction_x variable to help determine which way the player is facing for animation. */
Game.World.Object.Player = function(x, y) {

  Game.World.Object.call(this, 100, 100, 7, 14);
  Game.World.Object.Animator.call(this, Game.World.Object.Player.prototype.frame_sets["idle-left"], 10);

  this.jumping     = true;
  this.direction_x = -1;
  this.velocity_x  = 0;
  this.velocity_y  = 0;

};

Game.World.Object.Player.prototype = {

  constructor:Game.World.Object.Player,

  /* The values in these arrays correspond to the TileSet.Frame objects in the tile_set.
  They are just hardcoded in here now, but when the tileset information is eventually
  loaded from a json file, this will be allocated dynamically in some sort of loading function. */
  frame_sets: {

    "idle-left" : [0],
    "jump-left" : [0],
    "move-left" : [0, 1,2, 3, 4,5,6,7,8,9,10,11,12,13,14,15,16,17],
    "idle-right": [18],
    "jump-right": [18],
    "move-right": [18,19,20, 21,22,23,24,25,26,27,28,29,31,32]

  },

  jump: function() {

    if (!this.jumping) {

      this.jumping     = true;
      this.velocity_y -= 80;

    }

  },

  moveLeft: function() {

    this.direction_x = -1;// Make sure to set the player's direction.
    this.velocity_x -= 1.5;

  },

  moveRight:function(frame_set) {

    this.direction_x = 1;
    this.velocity_x += 1.5;

  },

  /* Because animation is entirely dependent on the player's movement at this point,
  I made a separate update function just for animation to be called after collision
  between the player and the world. This gives the most accurate animations for what
  the player is doing movement wise on the screen. */
  updateAnimation:function() {

    if (this.velocity_y < 0) {

      if (this.direction_x < 0) this.changeFrameSet(this.frame_sets["jump-left"], "pause");
      else this.changeFrameSet(this.frame_sets["jump-right"], "pause");

    } else if (this.direction_x < 0) {

      if (this.velocity_x < -0.1) this.changeFrameSet(this.frame_sets["move-left"], "loop", 5);
      else this.changeFrameSet(this.frame_sets["idle-left"], "pause");

    } else if (this.direction_x > 0) {

      if (this.velocity_x > 0.1) this.changeFrameSet(this.frame_sets["move-right"], "loop", 5);
      else this.changeFrameSet(this.frame_sets["idle-right"], "pause");

    }

    this.animate();

  },

  /* This used to be the update function, but now it's a little bit better. It takes
  gravity and friction as parameters so the player class can decide what to do with
  them. */
  updatePosition:function(gravity, friction) {// Changed from the update function

    this.x_old = this.x;
    this.y_old = this.y;
    this.velocity_y += gravity;
    this.x    += this.velocity_x;
    this.y    += this.velocity_y;

    this.velocity_x *= friction;
    this.velocity_y *= friction;

  }

};

/* Double prototype inheritance from Object and Animator. */
Object.assign(Game.World.Object.Player.prototype, Game.World.Object.prototype);
Object.assign(Game.World.Object.Player.prototype, Game.World.Object.Animator.prototype);
Game.World.Object.Player.prototype.constructor = Game.World.Object.Player;

/* The TileSheet class was taken from the Display class and renamed TileSet.
It does all the same stuff, but it doesn't have an image reference and it also
defines specific regions in the tile set image that correspond to the player's sprite
animation frames. Later, this will all be set in a level loading function just in case
I want to add functionality to add in another tile sheet graphic with different terrain. */
Game.World.TileSet = function(columns, tile_size) {

  this.columns    = columns;
  this.tile_size  = tile_size;

  let f = Game.World.TileSet.Frame;

  /* An array of all the frames in the tile sheet image. */
  this.frames = [new f(3, 1215, 60, 65, 0, -50), // idle-left
                 new f(3, 1215, 60, 65, 0, -50), // jump-left
                 new f(514, 702, 60, 70, 0, -55), new f(5, 831, 60, 70, 0, -55), new f(129, 957, 60, 70, 0, -55), new f(258, 828, 60, 70, 0, -55), new f(385, 831, 60, 70, 0, -55),
                 new f(511, 828, 60, 70, 0, -55),new f(3, 955, 60, 70, 0, -55),new f(129, 957, 60, 70, 0, -55),new f(255, 957, 60, 70, 0, -55),
                 new f(382, 957, 60, 70, 0, -55),new f(508, 955, 60, 70, 0, -55),new f(3, 1086, 60, 70, 0, -55),new f(126, 1081, 60, 70, 0, -55),
                 new f(253, 1084, 60, 70, 0, -55),new f(387, 1086, 60, 70, 0, -55),new f(516, 1081, 60, 70, 0, -55),new f(3, 1210, 60, 70, 0, -55),new f(132, 1215, 60, 70, 0, -55),// walk-left
                  new f(258, 1213, 60, 65, 0, -55), // idle-right
                 new f(382, 1210, 60, 65, 0, -55), // jump-right
                 new f(258, 1213, 60, 65, 0, -55), new f(387, 1213, 60, 65, 0, -55), new f(511, 1213, 60, 65, 0, -55), new f(3, 1339, 60, 65, 0, -55),
                new f(129, 1342, 60, 65, 0, -55), new f(255, 1342, 60, 65, 0, -55), new f(387, 1339, 60, 65, 0, -55), new f(514, 1339, 60, 65, 0, -55),
                new f(5, 1468, 60, 65, 0, -55), new f(126, 1592, 60, 65, 0, -55), new f(253, 1595, 60, 65, 0, -55), new f(511, 1597, 60, 65, 0, -55),
                new f(3, 1724, 60, 65, 0, -55), new f(129, 1724, 60, 65, 0, -55)// walk-right
                ];

};

Game.World.TileSet.prototype = { constructor: Game.World.TileSet };

/* The Frame class just defines a region in a tilesheet to cut out. It's a rectangle.
It has an x and y offset used for drawing the cut out sprite image to the screen,
which allows sprites to be positioned anywhere in the tile sheet image rather than
being forced to adhere to a grid like tile graphics. This is more natural because
sprites often fluctuate in size and won't always fit in a 16x16 grid. */
Game.World.TileSet.Frame = function(x, y, width, height, offset_x, offset_y) {

  this.x        = x;
  this.y        = y;
  this.width    = width;
  this.height   = height;
  this.offset_x = offset_x;
  this.offset_y = offset_y;

};

Game.World.TileSet.Frame.prototype = { constructor: Game.World.TileSet.Frame };
