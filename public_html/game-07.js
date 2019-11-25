
/* Game function  */
const Game = function() {

  this.world    = new Game.World();

  this.update   = function() {

    this.world.update();

  };

};

/*Game prototype*/
Game.prototype = { constructor : Game };




/* Game Animator function  */
// Made the default animation type "loop":
Game.Animator = function(frame_set, delay, mode = "loop") {

 this.count       = 0;
 this.delay       = (delay >= 1) ? delay : 1;
 this.frame_set   = frame_set;
 this.frame_index = 0;
 this.frame_value = frame_set[0];
 this.mode        = mode;

};


/* Game Animator prototype  */
Game.Animator.prototype = {

 constructor:Game.Animator,

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


/* game collision function for tiles for different combinations
this will be used to design the collision map*/

Game.Collider = function() {


  this.collide = function(value, object, tile_x, tile_y, tile_size) {

    switch(value) {

      case  1:     this.collidePlatformTop    (object, tile_y            ); break;
      case  2:     this.collidePlatformRight  (object, tile_x + tile_size); break;
      case  3: if (this.collidePlatformTop    (object, tile_y            )) return;
                   this.collidePlatformRight  (object, tile_x + tile_size); break;
      case  4:     this.collidePlatformBottom (object, tile_y + tile_size); break;
      case  5: if (this.collidePlatformTop    (object, tile_y + 35           )) return;
                   this.collidePlatformBottom (object, tile_y + tile_size); break;
      case  6: if (this.collidePlatformRight  (object, tile_x + tile_size)) return;
                   this.collidePlatformBottom (object, tile_y + tile_size); break;
      case  7: if (this.collidePlatformTop    (object, tile_y            )) return;
               if (this.collidePlatformBottom (object, tile_y + tile_size)) return;
                   this.collidePlatformRight  (object, tile_x + tile_size); break;
      case  8:     this.collidePlatformLeft   (object, tile_x            ); break;
      case  9: if (this.collidePlatformTop    (object, tile_y            )) return;
                   this.collidePlatformLeft   (object, tile_x            ); break;
      case 10: if (this.collidePlatformLeft   (object, tile_x            )) return;
                   this.collidePlatformRight  (object, tile_x + tile_size); break;
      case 11: if (this.collidePlatformTop    (object, tile_y            )) return;
               if (this.collidePlatformLeft   (object, tile_x            )) return;
                   this.collidePlatformRight  (object, tile_x + tile_size); break;
      case 12: if (this.collidePlatformBottom (object, tile_y + tile_size)) return;
                   this.collidePlatformLeft   (object, tile_x            ); break;
      case 13: if (this.collidePlatformTop    (object, tile_y            )) return;
               if (this.collidePlatformBottom (object, tile_y + tile_size)) return;
                   this.collidePlatformLeft   (object, tile_x            ); break;
      case 14: if (this.collidePlatformBottom (object, tile_y + tile_size)) return;
               if (this.collidePlatformLeft   (object, tile_x            )) return;
                   this.collidePlatformRight  (object, tile_x + tile_size); break;
      case 15: if (this.collidePlatformTop    (object, tile_y            )) return;
               if (this.collidePlatformBottom (object, tile_y + tile_size)) return;
               if (this.collidePlatformLeft   (object, tile_x            )) return;
                   this.collidePlatformRight  (object, tile_x + tile_size); break;
      case  16: this.collidePlatformTop      (object,tile_y + 35     ); break;

    }

  }

};

Game.Collider.prototype = {

  constructor: Game.Collider,

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

// Added default values of 0 for offset_x and offset_y
Game.Frame = function(x, y, width, height, offset_x = 0, offset_y = 0) {

  this.x        = x;
  this.y        = y;
  this.width    = width;
  this.height   = height;
  this.offset_x = offset_x;
  this.offset_y = offset_y;

};
Game.Frame.prototype = { constructor: Game.Frame };

Game.Object = function(x, y, width, height) {

 this.height = height;
 this.width  = width;
 this.x      = x;
 this.y      = y;

};
Game.Object.prototype = {

  constructor:Game.Object,

  /* Does player collision detection. */
  collideObject:function(object) {

    if (this.getRight()  < object.getLeft()  ||
        this.getBottom() < object.getTop()   ||
        this.getLeft()   > object.getRight() ||
        this.getTop()    > object.getBottom()) return false;

    return true;

  },



  getBottom : function()  { return this.y + this.height;       },
  getLeft   : function()  { return this.x;                     },
  getRight  : function()  { return this.x + this.width;        },
  getTop    : function()  { return this.y;                     },
  setBottom : function(y) { this.y = y - this.height;          },
  setLeft   : function(x) { this.x = x;                        },
  setRight  : function(x) { this.x = x - this.width;           },
  setTop    : function(y) { this.y = y;                        }

};

Game.MovingObject = function(x, y, width, height, velocity_max = 55) {

  Game.Object.call(this, x, y, width, height);

  this.jumping      = false;
  this.velocity_max = velocity_max;
  this.velocity_x   = 0;
  this.velocity_y   = 0;
  this.x_old        = x;
  this.y_old        = y;

};




Game.MovingObject.prototype = {

  getOldBottom : function()  { return this.y_old + this.height;       },
  getOldLeft   : function()  { return this.x_old;                     },
  getOldRight  : function()  { return this.x_old + this.width;        },
  getOldTop    : function()  { return this.y_old;                     },
  setOldBottom : function(y) { this.y_old = y    - this.height;       },
  setOldLeft   : function(x) { this.x_old = x;                        },
  setOldRight  : function(x) { this.x_old = x    - this.width;        },
  setOldTop    : function(y) { this.y_old = y;                        }

};



Object.assign(Game.MovingObject.prototype, Game.Object.prototype);
Game.MovingObject.prototype.constructor = Game.MovingObject;

/* The mushroom class extends Game.Object and Game.Animation. */
Game.mushroom = function(x, y) {

  Game.Object.call(this, x, y, 97, 96);
  Game.Animator.call(this, Game.mushroom.prototype.frame_sets["flash"], 15);

  this.frame_index = Math.floor(Math.random() * 2);

   /* base_x and base_y are the point around which the mushroom revolves to give mushrooms
  the floating effect. */
  this.base_x     = x;
  this.base_y     = y;
  this.position_x = Math.random() * Math.PI * 2;
  this.position_y = this.position_x * 2;

};





Game.mushroom.prototype = {

  frame_sets: { "flash":[97, 96] },

  updatePosition:function() {

    this.position_x += 0.1;
    this.position_y += 0.2;

    this.x = this.base_x + Math.cos(this.position_x) * 2;
    this.y = this.base_y + Math.sin(this.position_y);

  }

};


Object.assign(Game.mushroom.prototype, Game.Animator.prototype);
Object.assign(Game.mushroom.prototype, Game.Object.prototype);
Game.mushroom.prototype.constructor = Game.mushroom;





Object.assign(Game.Animator.prototype);



Game.Player = function(x, y) {

  Game.MovingObject.call(this, x, y, 7, 12);

  Game.Animator.call(this, Game.Player.prototype.frame_sets["idle-left"], 30);

  this.jumping     = true;
  this.direction_x = -1;
  this.velocity_x  = 0;
  this.velocity_y  = 0;

};



/*Frame sets for player to move*/
Game.Player.prototype = {

  frame_sets: {

    "idle-left" : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,12,13,14,15],

   "jump-left" : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,12,13,14,15],

   "move-left" : [15, 16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33],

   "idle-right": [34,35,36,37,38,39,40,41,42,43,44,45,46,47],

   "jump-right": [34,35,36,37,38,39,40,41,42,43,44,45,46,47],

   "move-right": [49,50,51,52,53,54,55,56,57,58,59,60,61]

  },

  jump: function() {

     /* Can jump if not falling faster than 10px per frame. */
    if (!this.jumping && this.velocity_y < 50) {

      this.jumping     = true;
      this.velocity_y -= 45;

    }

  },

  moveLeft: function() {

    this.direction_x = -1;
    this.velocity_x -= 5;

  },

  moveRight:function(frame_set) {

    this.direction_x = 1;
    this.velocity_x += 5;

  },

  updateAnimation:function() {

    if (this.velocity_y < 0) {

      if (this.direction_x < 0) this.changeFrameSet(this.frame_sets["jump-left"], "pause");
      else this.changeFrameSet(this.frame_sets["jump-right"], "pause");

    } else if (this.direction_x < 0) {

      if (this.velocity_x < -0.1) this.changeFrameSet(this.frame_sets["move-left"], "loop", 3);
      else this.changeFrameSet(this.frame_sets["idle-left"], "pause");

    } else if (this.direction_x > 0) {

      if (this.velocity_x > 0.1) this.changeFrameSet(this.frame_sets["move-right"], "loop", 3);
      else this.changeFrameSet(this.frame_sets["idle-right"], "pause");

    }

    this.animate();

  },

  updatePosition:function(gravity, friction) {

    this.x_old = this.x;
    this.y_old = this.y;

    this.velocity_y += gravity;
    this.velocity_x *= friction;

    /* Made it so that velocity cannot exceed velocity_max */
    if (Math.abs(this.velocity_x) > this.velocity_max)
    this.velocity_x = this.velocity_max * Math.sign(this.velocity_x);

    if (Math.abs(this.velocity_y) > this.velocity_max)
    this.velocity_y = this.velocity_max * Math.sign(this.velocity_y);

    this.x    += this.velocity_x;
    this.y    += this.velocity_y;

  }

};
Object.assign(Game.Player.prototype, Game.MovingObject.prototype);
Object.assign(Game.Player.prototype, Game.Animator.prototype);
Game.Player.prototype.constructor = Game.Player;


/*Tile ID from the tile set used*/
Game.TileSet = function(columns, tile_size) {

  this.columns    = columns;
  this.tile_size  = tile_size;

  let f = Game.Frame;



  this.frames = [new f(253, 1721, 60, 80, 10, -58), new f(383, 1721, 60, 80, 10, -58),new f(502, 1721, 60, 80, 10, -58),new f(4, 1847, 60, 80, 10, -58),// idle-left
                 new f(126, 1847, 60, 80, 10, -58),new f(249, 1847, 60, 80, 10, -58),new f(379, 1851, 60, 80, 10, -58),new f(510, 1847, 60, 80, 10, -58),// idle-left
                 new f(4, 1974, 60, 80, 10, -58),new f(123, 1977, 60, 80, 10, -58),new f(253, 1977, 60, 80, 10, -58),new f(383, 1977, 60, 80, 10, -58),// idle-left
                 new f(510, 1977, 60, 80, 10, -58),new f(4, 2100, 60, 80, 10, -58),new f(123, 2104, 60, 80, 10, -58),// idle-left

                 new f(253, 1721, 60, 80, 10, -58), new f(383, 1721, 60, 80, 10, -58),new f(502, 1721, 60, 80, 10, -58),new f(4, 1847, 60, 80, 10, -58),// jump-left
                 new f(126, 1847, 60, 80, 10, -58),new f(249, 1847, 60, 80, 10, -58),new f(379, 1851, 60, 80, 10, -58),new f(510, 1847, 60, 80, 10, -58),// jump-left
                 new f(4, 1974, 60, 80, 10, -58),new f(123, 1977, 60, 80, 10, -58),new f(253, 1977, 60, 80, 10, -58),new f(383, 1977, 60, 80, 10, -58),// jump-left
                 new f(510, 1977, 60, 80, 10, -58),new f(4, 2100, 60, 80, 10, -58),new f(123, 2104, 60, 80, 10, -58),// jump-left

                 new f(513, 696, 60, 80, 10, -58), new f(3, 829, 60, 80, 10, -58), new f(127, 826, 60, 80, 10, -58), new f(257, 826, 60, 80, 10, -58), new f(380, 819, 60, 80, 10, -58),// walk-left
                 new f(510, 819, 60, 80, 10, -58),new f(3, 952, 60, 80, 10, -58),new f(127, 952, 60, 80, 10, -58),new f(254, 952, 60, 80, 10, -58),// walk-left
                 new f(383, 952, 60, 80, 10, -58),new f(513, 955, 60, 80, 10, -58),new f(3, 1085, 60, 80, 10, -58),new f(130, 1082, 60, 80, 10, -58),// walk-left
                 new f(257, 1082, 60, 80, 10, -58),new f(383, 1085, 60, 80, 10, -58),new f(510, 1079, 60, 80, 10, -58),new f(3, 1209, 60, 80, 10, -58),new f(130, 1206, 60, 80, 10, -58),// walk-left

                 new f(257, 2104, 60, 80, 10, -58),  new f(383, 2104, 60, 80, 10, -58), new f(517, 2104, 60, 80, 10, -58), new f(8, 2234, 60, 80, 10, -58),// idle-right
                 new f(130, 2227, 60, 80, 10, -58),  new f(261, 2234, 60, 80, 10, -58), new f(387, 2230, 60, 80, 10, -58), new f(514, 2234, 60, 80, 10, -58),// idle-right
                 new f(4, 2361, 60, 80, 10, -58),  new f(130, 2361, 60, 80, 10, -58), new f(387, 2361, 60, 80, 10, -58),// idle-right
                 new f(517, 2357, 60, 80, 10, -58),  new f(4, 2487, 60, 80, 10, -58), new f(134, 2487, 60, 80, 10, -58),// idle-right


                 new f(257, 2104, 60, 80, 10, -58),  new f(383, 2104, 60, 80, 10, -58), new f(517, 2104, 60, 80, 10, -58), new f(8, 2234, 60, 80, 10, -58),// jump-right
                 new f(130, 2227, 60, 80, 10, -58),  new f(261, 2234, 60, 80, 10, -58), new f(387, 2230, 60, 80, 10, -58), new f(514, 2234, 60, 80, 10, -58),// jump-right
                 new f(4, 2361, 60, 80, 10, -58),  new f(130, 2361, 60, 80, 10, -58),  new f(387, 2361, 60, 80, 10, -58),// jump-right
                 new f(517, 2357, 60, 80, 10, -58),  new f(4, 2487, 60, 80, 10, -58), new f(134, 2487, 60, 80, 10, -58),// jump-right


                 new f(257, 1212, 60, 80, 10, -58), new f(390, 1209, 60, 80, 10, -58), new f(513, 1212, 60, 80, 10, -58), new f(3, 1336, 60, 80, 10, -58),// walk-right
                 new f(127, 1339, 60, 80, 10, -58), new f(260, 1339, 60, 80, 10, -58), new f(386, 1339, 60, 80, 10, -58), new f(516, 1339, 60, 80, 10, -58),// walk-right
                 new f(3, 1469, 60, 80, 10, -58), new f(130, 1469, 60, 80, 10, -58), new f(260, 1469, 60, 80, 10, -58), new f(386, 1496, 60, 80, 10, -58),// walk-right
                 new f(513, 1469, 60, 80, 10, -58), new f(3, 1595, 60, 80, 10, -58), new f(130, 1595, 60, 80, 10, -58), new f(257, 1595, 60, 80, 10, -58),// walk-right
                 new f(383, 1595, 60, 80, 10, -58), new f(513, 1592, 60, 80, 10, -58), new f(3, 1719, 60, 80, 10, -58), new f(130, 1722, 60, 80, 10, -58),// walk-right


                 new f(377, 591, 60, 65, 0 , -5), new f(504, 591, 60, 65, 0, -5) // Mushroom

                 ];

};
Game.TileSet.prototype = { constructor: Game.TileSet };

Game.World = function(friction = 0.75, gravity = 4) {

  this.collider     = new Game.Collider();

  this.friction     = friction;
  this.gravity      = gravity;

  this.columns      = 12;
  this.rows         = 9;

  this.tile_set     = new Game.TileSet(128, 128);
  this.player       = new Game.Player(1000, 1000);

  this.zone_id      = "00";

  this.mushrooms      = [];// the array of mushrooms in this zone;
  this.mushroom_count = 0;// the number of mushrooms you have.
  this.doors        = [];
  this.door         = undefined;

  this.height       = this.tile_set.tile_size * this.rows;
  this.width        = this.tile_set.tile_size * this.columns;

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

  setup:function(zone) {

    this.mushrooms            = new Array();
    this.doors              = new Array();

    this.collision_map      = zone.collision_map;
    this.graphical_map      = zone.graphical_map;
    this.columns            = zone.columns;
    this.rows               = zone.rows;
    this.zone_id            = zone.id;

    for (let index = zone.mushrooms.length - 1; index > -1; -- index) {

      let mushroom = zone.mushrooms[index];
      this.mushrooms[index] = new Game.mushroom(mushroom[0] * this.tile_set.tile_size + 5, mushroom[1] * this.tile_set.tile_size - 2);

    }

    for (let index = zone.doors.length - 1; index > -1; -- index) {

      let door = zone.doors[index];
      this.doors[index] = new Game.Door(door);

    }


    if (this.door) {

      if (this.door.destination_x != -1) {

        this.player.setCenterX   (this.door.destination_x);
        this.player.setOldCenterX(this.door.destination_x);// It's important to reset the old position as well.

      }

      if (this.door.destination_y != -1) {

        this.player.setCenterY   (this.door.destination_y);
        this.player.setOldCenterY(this.door.destination_y);

      }

      this.door = undefined;// Make sure to reset this.door so we don't trigger a zone load.

    }

  },

  
  
  
  update:function() {

    this.player.updatePosition(this.gravity, this.friction);

    this.collideObject(this.player);

    for (let index = this.mushrooms.length - 1; index > -1; -- index) {

      let mushroom = this.mushrooms[index];

      mushroom.updatePosition();
      mushroom.animate();

      if (mushroom.collideObject(this.player)) {

        this.mushrooms.splice(this.mushrooms.indexOf(mushroom), 1);
        this.mushroom_count ++;
            
        
        
        
      }

    }

    



    this.player.updateAnimation();

  }

};
