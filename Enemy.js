class Enemy{

	SET_VELOCITY = {X:0.2, Y:0.2};

	DIRECTION = {
		RIGHT: 0,
		LEFT: 1,
		COUNT: 2
	};
	STATE = {
		IDLE: 0,
		WALKING: 1,
		COUNT: 2,
    };

	constructor(player,game,x,y){
		Object.assign(this, {player, game, x,y});

		this.width = 75;
		this.height = 93;
		this.heightDifference = 3; //difference in height between enemy and player so that enemy chases on an even plane
		
		//position variables
		this.positionx = 0;
		this.positiony = 0;

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
			= new Animator(this.spritesheet, 503,8, this.width, this.height, 1, 1, 0, false, true);
		//Skeleton is idling and facing left
		this.animations[this.STATE.IDLE][this.DIRECTION.LEFT]
			= new Animator(this.spritesheet, 8, 8, this.width, this.height, 1, 1, 0, false, true);
		//Skeleton is walking and facing right
		this.animations[this.STATE.WALKING][this.DIRECTION.RIGHT]
			= new Animator(this.spritesheet, 599, 8, this.width, this.height, 4, 0.15, 21, false, true);
		//Skeleton is walking and facing left	
		this.animations[this.STATE.WALKING][this.DIRECTION.LEFT]
			= new Animator(this.spritesheet, 104, 8, this.width, this.height, 4, 0.15, 21, false, true);

		//ATTACK ANIMATION GOES HERE. sprite sheet might need reorder of frames.
		}

	//COLLISION IS NOT IMPLEMENTED

	updateBB() {
		this.lastBB = this.BB;
		this.BB = new BoundingBox(this.x, this.y, this.width, this.height); //100 100 Should be changed later.
	};

	update() {

      
		var dx;
		var dy = Math.floor((this.player.y - this.y + this.heightDifference));
		
		var midpoint = Math.floor((this.x + (this.width / 2)));

		console.log(Math.abs(midpoint - this.player.x));
		console.log(Math.abs(midpoint - (this.player.x + this.player.width)));

		if ((Math.abs(midpoint - this.player.x)) <= (Math.abs(midpoint - (this.player.x + this.player.width)))) { // is the skeleton closer to the left or the right of the player
			dx = Math.floor((this.player.x - (this.x + this.width)));
		} else {
			dx = Math.floor((this.player.x + this.player.width) - (this.x - 32));
		}
		
		var moving = false; //flag for skeleton movement
		//var reached = false;

		if (dx == 0 && dy == 0) {
			//reached = true;
			moving = false;
			this.velocity.x = 0;
			this.velocity.y = 0;
			if(this.x < this.player.x && (this.direction == this.DIRECTION.LEFT)) {
				this.direction = this.DIRECTION.RIGHT;
			}
		}
		
        if (dx > 0) {
			
			this.x += this.SET_VELOCITY.X;

			if(this.x + this.width < this.player.x) {
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

		this.state = (moving) ? this.STATE.WALKING : this.STATE.IDLE;
    

		//Update Position
        this.x += this.velocity.x
        this.y += this.velocity.y
		
		//position with regards to camera
		this.positionx = this.x - this.game.camera.x;
		this.positiony = this.y - this.game.camera.y;
		
		this.updateBB();

		//ENEMY COLLISION LOGIC
		// var that = this;
        // this.game.entities.forEach(function (entity) {
		// 	if (entity.BB && that.BB.collide(entity.BB)) {
		// 		if (entity instanceof Player) {
		// 			if (that.lastBB.bottom <= entity.BB.top) { //enemy above player
		// 				that.y = entity.BB.top - that.height;
		// 				if (that.velocity.y > 0) that.velocity.y = 0;

		// 			}
		// 			if (that.lastBB.top <= entity.BB.bottom) { //enemy below player
		// 				that.y = entity.BB.bottom;
		// 				if (that.velocity.y < 0) that.velocity.y = 0;

		// 			} 
		// 			if (that.lastBB.left <= entity.BB.right) { //enemy to the right of player
		// 				that.x = entity.BB.right;
		// 				if (that.velocity.x < 0) that.velocity.x = 0;

		// 			} 
		// 			if (that.lastBB.right >= entity.BB.left) { //enemy to the left of player
		// 				that.x = entity.BB.left - that.width;
		// 				if (that.velocity.x > 0) that.velocity.x = 0;
		// 			}	
		// 		}
						
				
		// 	}
				
		// });
		
		

	};

	draw(ctx) {
		//ctx.fillStyle = "Red";
		//ctx.strokeStyle = "Red";
		if (PARAMS.DEBUG) {
			ctx.strokeStyle = 'Red';
			ctx.strokeRect(this.positionx, this.positiony, this.width, this.height);
		}

		this.animations[this.state][this.direction].drawFrame(this.game.clockTick, this.game.ctx, this.positionx, this.positiony, 1);
	};

};