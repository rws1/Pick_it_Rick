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

    for(let index = this.doors.length - 1; index > -1; -- index) {

      let door = this.doors[index];

      if (door.collideObjectCenter(this.player)) {

        this.door = door;

      };

    }

    for (let index = this.grass.length - 1; index > -1; -- index) {

      let grass = this.grass[index];

      grass.animate();

    }

    this.player.updateAnimation();

  }

};
