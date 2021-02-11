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

		//detection/attack radius
		this.visualRadius = 55;
		this.circlex = this.x + ((this.width * PARAMS.PIXELSCALER) / 2);
		this.circley = this.y + ((this.height * PARAMS.PIXELSCALER) / 2);

		this.spritesheet = ASSET_MANAGER.getAsset("./Sprites/PlayerSheet.png");

		this.game.Player = this;
		
		this.direction = this.DIRECTION.RIGHT;
		this.state = this.STATE.IDLE

		this.animations = [];
		this.setupCategories();
		this.loadAnimations();

		this.hitbox = new HitBox(this, this.width * PARAMS.PIXELSCALER, this.height * PARAMS.PIXELSCALER, true);
	
		this.priority = 3;

		this.coins = 0;

		// stats
		this.hpCurrent = 150;
		this.hpMax = 150;
		this.shardObtained = false;
		this.hit = false;
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

	update(){
		

		
		const TICKSCALE = this.game.clockTick * PARAMS.TIMESCALE;

		//Update Velocity
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
			if (!this.game.weapon.swinging) {
				this.direction = this.DIRECTION.LEFT;
			}
			moving = true;

			this.velocity.x = -1 * this.SET_VELOCITY.X * TICKSCALE;
		} else if (this.game.D) {
			if (!this.game.weapon.swinging) {
				this.direction = this.DIRECTION.RIGHT;
			}
			moving = true;
			this.velocity.x = this.SET_VELOCITY.X * TICKSCALE;
		}
		else {
			this.velocity.x = 0;
		}

		this.state = (moving) ? this.STATE.WALKING : this.STATE.IDLE;

		//fix velocity for diagonal movement

		let diagonal = false;
		if ((this.game.A || this.game.D) && (this.game.W || this.game.S)) {
			this.velocity.x = (this.velocity.x / 2) * Math.sqrt(2);
			this.velocity.y = (this.velocity.y / 2) * Math.sqrt(2);
			diagonal = true;
        }

		

		//collision
		var that = this;
		this.game.entities.forEach(function (entity) {

			if (entity instanceof Shards && that.hitbox.intersects(entity.hitbox)) {
				entity.removeFromWorld = true;
				that.shardObtained = true;
			}

			else if (entity != that && entity.hitbox && !(entity instanceof Enemy)) {

				
				if (entity instanceof AmmoPack && that.hitbox.collide(entity.hitbox)) {
					if (that.game.weapon.reservesCount != that.game.weapon.maxReserves) {
						that.game.weapon.fill();
						entity.removeFromWorld = true;
					}
				}
				else if (entity instanceof Coin && that.hitbox.collide(entity.hitbox)) {
					that.coins += 1;
					entity.removeFromWorld = true;
				}
				else if (entity instanceof HealthPack && that.hitbox.collide(entity.hitbox)) {
					if (that.hpCurrent != that.hpMax) {
						that.hpCurrent = that.hpMax;
						entity.removeFromWorld = true;
                    }
					
				}

				that.hitbox.collide(entity.hitbox)

				
			}
			

		});

		//Update Position
		this.x += this.velocity.x;
		this.y += this.velocity.y;

		this.circlex = this.x + ((this.width * PARAMS.PIXELSCALER) / 2);
		this.circley = this.y + ((this.height * PARAMS.PIXELSCALER) / 2);

		//Update circlex, circley;

		//position with regards to camera.
		this.positionx = this.x - this.game.camera.x;
		this.positiony = this.y - this.game.camera.y;

		this.hitbox.update();

		
		
	};

	draw(ctx) {
		if (PARAMS.DEBUG) {
			this.hitbox.draw(ctx);

			ctx.beginPath();
            ctx.strokeStyle = 'White';
			ctx.arc(this.circlex - this.game.camera.x, this.circley - this.game.camera.y, this.visualRadius, 0, Math.PI * 2, false);
            ctx.stroke();
			ctx.closePath();
			
			
		}
		this.animations[this.state][this.direction].drawFrame(this.game.clockTick, this.game.ctx, this.positionx, this.positiony, 1);

	}

}