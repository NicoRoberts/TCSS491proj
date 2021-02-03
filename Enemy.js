class Enemy{

	SET_VELOCITY = {X:0.25, Y:0.25};

	DIRECTION = {
		RIGHT: 0,
		LEFT: 1,
		COUNT: 2
	};
	STATE = {
		IDLE: 0,
		WALKING: 1,
		ATTACK: 2,
		COUNT: 3,
    };

	constructor(player,game,x,y) {
		Object.assign(this, {player, game, x,y});
		

		this.width = 75;
		this.height = 93;

		this.attackWidth = 86;
		this.attackHeight = 95;

		this.heightDifference = 3; //difference in height between enemy and player so that enemy chases on an even plane
		this.rightOffset = 32.5; //A value to offset the skeleton when the skeleton is to the right of the player.
		//position variables
		this.positionx = 0;
		this.positiony = 0;

		this.visualRadius = 300;
		this.circlex = 0;
		this.circley = 0;
		this.detect = 0;

		this.first = true; //flag to omit buggy first attack

		this.attackCooldown = 0;
		this.damageInterval = 0;
		this.damage = 25;

		this.velocity = {x:0, y:0};

		this.spritesheet = ASSET_MANAGER.getAsset("./Sprites/SkeletonSheet.png");

		this.game.Enemy = this;

		this.hitbox = new HitBox(this, this.width, this.height);

		this.priority = 1;

		this.direction = this.DIRECTION.LEFT;
		this.state = this.STATE.IDLE;

		this.animations = [];
		this.setupCategories();
		this.loadAnimations();


		this.hit = false;
		
		this.healthbar = new Healthbar(this);

		// stats
		this.hpCurrent = 100;
		this.hpMax = 100;

	};

	setupCategories() {
	
		for (var i = 0; i < this.STATE.COUNT; i++) {
			this.animations.push([]);
			for (var j = 0; j < this.DIRECTION.COUNT; j++) {
				this.animations[i].push([]);
            }
		}
	}

	loadAnimations() {
		//Skeleton is idling and facing right
		this.animations[this.STATE.IDLE][this.DIRECTION.RIGHT]
			= new Animator(this.spritesheet, 503,8, this.width, this.height, 1, 3, 0, false, true);
		//Skeleton is idling and facing left
		this.animations[this.STATE.IDLE][this.DIRECTION.LEFT]
			= new Animator(this.spritesheet, 8, 8, this.width, this.height, 1, 3, 0, false, true);
		//Skeleton is walking and facing right
		this.animations[this.STATE.WALKING][this.DIRECTION.RIGHT]
			= new Animator(this.spritesheet, 599, 8, this.width, this.height, 4, 0.15, 21, false, true);
		//Skeleton is walking and facing left	
		this.animations[this.STATE.WALKING][this.DIRECTION.LEFT]
			= new Animator(this.spritesheet, 104, 8, this.width, this.height, 4, 0.15, 21, false, true);
		//Skeleton is attacking and facing left	
		this.animations[this.STATE.ATTACK][this.DIRECTION.LEFT]
			= new Animator(this.spritesheet, 968, 5, this.attackWidth, this.attackHeight, 3, 0.15, 7, false, true);
		//Skeleton is attacking and facing right	
		this.animations[this.STATE.ATTACK][this.DIRECTION.RIGHT]
			= new Animator(this.spritesheet, 1259, 5, this.attackWidth, this.attackHeight, 3, 0.15, 13, false, true);

		//ATTACK ANIMATION GOES HERE. sprite sheet might need reorder of frames.
	}

	visionCollide(other) {
		var dx = this.circlex - other.circlex;
    	var dy = this.circley - other.circley;
    	var distance = Math.sqrt(dx * dx + dy * dy);
        return (distance < this.visualRadius + other.visualRadius);
	};


	update() {
		var that = this;
		const TICKSCALE = this.game.clockTick * PARAMS.TIMESCALE;
		var dx;
		var dy = Math.floor((this.player.y - this.y + this.heightDifference));
		
		var midpoint = Math.floor((this.x + (this.width / 2)));

		if ((Math.abs(midpoint - this.player.x)) <= (Math.abs(midpoint - (this.player.x + this.player.width)))) { // is the skeleton closer to the left or the right of the player
			dx = Math.floor((this.player.x - (this.x + this.width))); //left of character
		} else {
			dx = Math.floor((this.player.x + this.player.width) - (this.x - this.rightOffset)); //right of character
		}
		
		
		var moving = false; //flag for skeleton movement


		if (dx == 0) {
			if (dy == 0) {
				moving = false; 
			}
			this.velocity.x = 0;
			this.velocity.y = 0;

			//responsible for skeleton direction flip if on the same X coordinate
			if(this.x < this.player.x && (this.direction == this.DIRECTION.LEFT)) {
				this.direction = this.DIRECTION.RIGHT;
			} else if (this.x > (this.player.x + this.player.width) && (this.direction == this.DIRECTION.RIGHT)) {
				this.direction = this.DIRECTION.LEFT;
			}
		}
		
        if (dx > 0) {
			
			this.velocity.x = this.SET_VELOCITY.X * TICKSCALE;

			if(this.x + this.width <= this.player.x && (this.direction ==this.DIRECTION.LEFT)) {
				this.direction = this.DIRECTION.RIGHT
			}

			moving = true;
		} else if (dx < 0) {
			this.velocity.x = -1*this.SET_VELOCITY.X * TICKSCALE;
			
			
			if(this.x + this.width > this.player.x) {
				this.direction = this.DIRECTION.LEFT
			}

			moving = true;
		}
		
		if (dy > 0) {
			this.velocity.y = this.SET_VELOCITY.Y * TICKSCALE;
			moving = true;
		} else if (dy < 0) {
			this.velocity.y = -1 * this.SET_VELOCITY.Y * TICKSCALE;
			moving = true;
		} else {
			this.velocity.y = 0
			moving = true;
        }

		//set state: walking, idling, or attacking
		this.attackCooldown += this.game.clockTick;
		this.damageInterval += this.game.clockTick;

		if (moving) {
			this.state = this.STATE.WALKING;
			this.damageInterval = 0;
			this.attackCooldown = 0; // this makes enemies stall before they attack (idk if we want this, but it makes animations better)
		} else if (!moving && this.attackCooldown <= (2 - 1)) { // added -1 to all timers below
			this.state = this.STATE.IDLE;
			
		}

		if (!moving) {
			if (this.attackCooldown > (2 - 1) && !this.first) {
				this.state = this.STATE.ATTACK;
				this.damageInterval = 2.45 - 1;

			} else {
				this.first = false;
			}
			if (this.attackCooldown >= 2.45 - 1) {
				this.attackCooldown = 0;
			}

			// shitty way to implement enemy damage right now
			if (this.damageInterval >= 2.60 - 1) {
				this.game.entities.forEach(function (entity) {
					if (entity instanceof Player) {
						entity.hpCurrent -= that.damage;
					}

				});
				this.damageInterval = 0;
			}
		}
    
		//collision
		var that = this;
		this.game.entities.forEach(function (entity) {

			if (entity != that && entity.hitbox && !(entity instanceof Enemy)) {

				that.hitbox.collide(entity.hitbox)
			}

			//circle detection
			
			if (entity != that && that.visionCollide(entity)) {
				that.detect = 1;
				//console.log("true");
			} else {
				that.detect = 0;
				//console.log("false");
			}
			

		});

		//Update Position
        this.x += this.velocity.x
        this.y += this.velocity.y
		
		//update circlex, circley
		this.circlex = this.x + (this.width / 2);
		this.circley = this.y + (this.height / 2);

		//position with regards to camera
		this.positionx = this.x - this.game.camera.x;
		this.positiony = this.y - this.game.camera.y;

		this.hitbox.update();
		

		if (this.hit) {
			that.hitColor = true;
			window.setTimeout(function () {
				that.hitColor = false;
			}, 5000 / 60);
			this.hit = false;
			console.log("hit");
		}
		
		// death
		if (this.hpCurrent <= 0) {
			this.removeFromWorld = true;
		}


	};

	draw(ctx) {
		//ctx.fillStyle = "Red";
		//ctx.strokeStyle = "Red";
		if (PARAMS.DEBUG) {
			
			this.hitbox.draw(ctx);

			ctx.beginPath();
            ctx.strokeStyle = 'Red';
			ctx.arc(this.circlex - this.game.camera.x, this.circley - this.game.camera.y, this.visualRadius, 0, Math.PI * 2, false);
			
            ctx.stroke();
            ctx.closePath();


		}

		this.animations[this.state][this.direction].drawFrame(this.game.clockTick, this.game.ctx, this.positionx, this.positiony, 1);
		this.healthbar.draw(ctx);
	};

};