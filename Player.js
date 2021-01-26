class Player{

	SET_VELOCITY = { X: 2, Y: 2 };

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

	constructor(game,x,y){
		Object.assign(this, {game, x, y});
    
    	this.width = 16;
    	this.height = 32;

		//POSITION VARIABLES
		this.positionx = 0;
		this.positiony = 0;

		this.velocity = { x: 0, y: 0 };

		this.spritesheet = ASSET_MANAGER.getAsset("./Sprites/PlayerSheet.png");

    	this.game.Player = this;
    
		this.direction = this.DIRECTION.RIGHT;
		this.state = this.STATE.IDLE

		this.animations = [];
		this.setupCategories();
		this.loadAnimations();
		this.updateBB();
	
		this.priority = 2;

		this.hpCurrent = 100;
		this.hpMax = 100;
	}

	setupCategories() {
	
		for (var i = 0; i < this.STATE.COUNT; i++) {
			this.animations.push([]);
			for (var j = 0; j < this.DIRECTION.COUNT; j++) {
				this.animations[i].push([]);
            }
		}
	}

	loadAnimations() {

		this.animations[this.STATE.IDLE][this.DIRECTION.RIGHT]
			= new Animator(this.spritesheet, 101, 1, this.width * PARAMS.PIXELSCALER, this.height * PARAMS.PIXELSCALER, 2, 0.2, 2, false, true);
		this.animations[this.STATE.IDLE][this.DIRECTION.LEFT]
			= new Animator(this.spritesheet, 1, 1, this.width * PARAMS.PIXELSCALER, this.height * PARAMS.PIXELSCALER, 2, 0.2, 2, false, true);

		this.animations[this.STATE.WALKING][this.DIRECTION.RIGHT]
			= new Animator(this.spritesheet, 1, 99, this.width * PARAMS.PIXELSCALER, this.height * PARAMS.PIXELSCALER, 4, 0.1, 2, false, true);
		this.animations[this.STATE.WALKING][this.DIRECTION.LEFT]
			= new Animator(this.spritesheet, 1, 197, this.width * PARAMS.PIXELSCALER, this.height * PARAMS.PIXELSCALER, 4, 0.1, 2, false, true);

    }

	updateBB() {
		this.lastBB = this.BB;
		this.BB = new BoundingBox(this.x, this.y, this.width*3, this.height*3); 
	}

	update(){
		//Update Velocity


		const TIMESCALE = 140;
		const TICKSCALE = this.game.clockTick * TIMESCALE;

		var moving = false;
		if(this.game.W){
			this.velocity.y = -1 * this.SET_VELOCITY.Y * TICKSCALE;
			moving = true;
		} else if(this.game.S){
			this.velocity.y = this.SET_VELOCITY.Y * TICKSCALE;
			moving = true;
		}else {
			this.velocity.y = 0;
		}
		if (this.game.A) {
			this.direction = this.DIRECTION.LEFT;
			moving = true;

			this.velocity.x = -1 * this.SET_VELOCITY.X * TICKSCALE;
		} else if (this.game.D) {
			this.direction = this.DIRECTION.RIGHT
			moving = true;
			this.velocity.x = this.SET_VELOCITY.X * TICKSCALE;
		}
		else {
			this.velocity.x = 0;
		}

		this.state = (moving) ? this.STATE.WALKING : this.STATE.IDLE;

		//fix velocity for diagnal movement

		let diagonal = false;
		if ((this.game.A || this.game.D) && (this.game.W || this.game.S)) {
			this.velocity.x = (this.velocity.x / 2) * Math.sqrt(2) * TICKSCALE;
			this.velocity.y = (this.velocity.y / 2) * Math.sqrt(2) * TICKSCALE;
			diagonal = true;
        }

		if (diagonal) {
		//	console.log("x speed: " + this.velocity.x
		//		+ " y speed: " + this.velocity.y
		//		+ " diagonal speed: " + Math.sqrt(this.velocity.y * this.velocity.y
		//			+ this.velocity.x * this.velocity.x));

			this.state = (moving) ? this.STATE.WALKING : this.STATE.IDLE;
		}
		else {
			//console.log("x speed: " + this.velocity.x
			//	+ " y speed: " + this.velocity.y)
        }

		//Update Position
		this.x += this.velocity.x;
		this.y += this.velocity.y;

		//position with regards to camera.
		this.positionx = this.x - this.game.camera.x;
		this.positiony = this.y - this.game.camera.y;

		this.updateBB();

		//collision
		var that = this;
		this.game.entities.forEach(function (entity) {
			if (entity.BB && that.BB.collide(entity.BB)) {
				
				if (entity instanceof RightBoundary) {
					
					
					//left side of the barrier
					if (that.BB.collide(entity.BB)) {
						that.x = entity.BB.left - that.width * PARAMS.PIXELSCALER;
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
						that.y = entity.BB.top - that.height * PARAMS.PIXELSCALER;
						if (that.velocity.y > 0) that.velocity.y = 0;
						
					}
					that.updateBB();
				}
					
			}

		});

	};

	draw(ctx) {
		if (PARAMS.DEBUG) {
			ctx.strokeStyle = 'Red';
			ctx.strokeRect(this.positionx, this.positiony, this.width*PARAMS.PIXELSCALER, this.height*PARAMS.PIXELSCALER);
		}
		console.log(this.positionx);
		this.animations[this.state][this.direction].drawFrame(this.game.clockTick, this.game.ctx, this.positionx, this.positiony, 1)

		// health bar
		ctx.strokeStyle = 'Black';
		var hpScale = 5;
		ctx.fillRect(25, 25, this.hpMax * hpScale, 5 * hpScale);

		ctx.fillStyle = 'Red';
		ctx.fillRect(25, 25, this.hpCurrent * hpScale, 5 * hpScale);

	}

}