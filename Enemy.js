class Enemy{

	SET_VELOCITY = {X:1.0, Y:1.0};

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
		this.rightOffset = 32; //A value to offset the skeleton when the skeleton is to the right of the player.
		//position variables
		this.positionx = 0;
		this.positiony = 0;

		this.first = true; //flag to omit buggy first attack

		this.attackCooldown = 0;

		this.velocity = {x:0, y:0};

		this.spritesheet = ASSET_MANAGER.getAsset("./Sprites/SkeletonSheet.png");

		this.game.Enemy = this;

		this.updateBB();

		this.priority = 3;

		this.direction = this.DIRECTION.LEFT;
		this.state = this.STATE.IDLE;

		this.animations = [];
		this.setupCategories();
		this.loadAnimations();

    	this.updateBB(); //COLLISION IS NOT IMPLEMENTED
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

	//COLLISION IS NOT IMPLEMENTED

	updateBB() {
		this.lastBB = this.BB;
		this.lastTopBB = this.TopBB;
		this.lastBottomBB = this.BottomBB;
		this.lastLeftBB = this.LeftBB;
		this.lastRightBB = this.RightBB;

        
		this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
		this.TopBB = new BoundingBox(this.x, this.y, this.width, (PARAMS.TILEWIDTH / 4));
        this.BottomBB = new BoundingBox(this.x, this.y + this.height - (PARAMS.TILEWIDTH / 4), this.width, (PARAMS.TILEWIDTH / 4)); 
		this.LeftBB = new BoundingBox(this.x, (this.y) + (PARAMS.TILEWIDTH / 4), PARAMS.TILEWIDTH / 4, (this.height) - (PARAMS.TILEWIDTH / 4) * 2);
		this.RightBB = new BoundingBox((this.x + this.width - (PARAMS.TILEWIDTH / 4)), (this.y) + (PARAMS.TILEWIDTH / 4), PARAMS.TILEWIDTH / 4, (this.height) - (PARAMS.TILEWIDTH / 4) * 2);
		
	};

	update() {

      
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
			
			this.x += this.SET_VELOCITY.X;

			if(this.x + this.width <= this.player.x && (this.direction ==this.DIRECTION.LEFT)) {
				this.direction = this.DIRECTION.RIGHT
			}

			moving = true;
		} else if (dx < 0) {
			this.x -= this.SET_VELOCITY.X;
			
			
			if(this.x + this.width > this.player.x) {
				this.direction = this.DIRECTION.LEFT
			}

			moving = true;
		}
		
        if (dy > 0) {
			this.y += this.SET_VELOCITY.Y;
			moving = true;
        } else if (dy < 0) {
			this.y -= this.SET_VELOCITY.Y;
			moving = true;
        } 

		//set state: walking, idling, or attacking
		this.attackCooldown += this.game.clockTick;
		if (moving) {
			this.state = this.STATE.WALKING;
		} else if (!moving && this.attackCooldown <= 2) {
			this.state = this.STATE.IDLE;
		}

		if (!moving) {
			if (this.attackCooldown > 2 && !this.first) {
				this.state = this.STATE.ATTACK;

			} else {
				this.first = false;
			}
			if (this.attackCooldown >= 2.45) {
				this.attackCooldown = 0;
			}
		}
    

		//Update Position
        this.x += this.velocity.x
        this.y += this.velocity.y
		
		//position with regards to camera
		this.positionx = this.x - this.game.camera.x;
		this.positiony = this.y - this.game.camera.y;
		

		//Collision logic
		this.updateBB();

		var that = this;
		this.game.entities.forEach(function (entity) {
			if (entity.BB && that.BB.collide(entity.BB)) {

				if (entity instanceof Player) {
					if (that.BB.collide(entity.BottomBB)) { //enemy walking up into the player
						that.y = entity.BB.bottom;
						if (that.velocity.y < 0) that.velocity.y = 0;
					} else if (that.BB.collide(entity.TopBB)) { //enemy walking down into the player
						that.y = entity.BB.top - that.height;
						if (that.velocity.y > 0) that.velocity.y = 0;
					} 
					that.updateBB();
				}




				if (entity instanceof RightBoundary) {	
					//left side of the barrier
					if (that.BB.collide(entity.BB)) {
						that.x = entity.BB.left - that.width;
						if (that.velocity.x > 0) that.velocity.x = 0;					
					}
					that.updateBB();
				}
				if (entity instanceof LeftBoundary) {
					//right side of the barrier
					if (that.BB.collide(entity.BB)) {
						that.x = entity.BB.right;
						if (that.velocity.x < 0) that.velocity.x = 0;
					
					}
					that.updateBB();
				}
				if (entity instanceof TopBoundary) {

					//top side of the barrier
					if (that.BB.collide(entity.BB)) {
						that.y = entity.BB.bottom;
						if (that.velocity.y < 0) that.velocity.y = 0;
					}
					that.updateBB();
				}
				if (entity instanceof BottomBoundary) {
					//bottomside of the barrier
					if (that.BB.collide(entity.BB)) {
						that.y = entity.BB.top - that.height;
						if (that.velocity.y > 0) that.velocity.y = 0;
						
					}
					that.updateBB();
				}		
			}
		});
	};

	draw(ctx) {
		//ctx.fillStyle = "Red";
		//ctx.strokeStyle = "Red";
		if (PARAMS.DEBUG) {
			ctx.strokeStyle = 'Red';
			ctx.strokeRect(this.positionx, this.positiony, this.width, this.height);

			ctx.strokeStyle = 'Blue';
			
			ctx.strokeRect(this.TopBB.x - this.game.camera.x, this.TopBB.y - this.game.camera.y, this.TopBB.width, this.TopBB.height);
			ctx.strokeRect(this.BottomBB.x - this.game.camera.x, this.BottomBB.y - this.game.camera.y, this.BottomBB.width, this.BottomBB.height);
			ctx.strokeRect(this.LeftBB.x - this.game.camera.x, this.LeftBB.y - this.game.camera.y, this.LeftBB.width, this.LeftBB.height);
			ctx.strokeRect(this.RightBB.x - this.game.camera.x, this.RightBB.y - this.game.camera.y, this.RightBB.width, this.RightBB.height);
		}

		this.animations[this.state][this.direction].drawFrame(this.game.clockTick, this.game.ctx, this.positionx, this.positiony, 1);
	};

};