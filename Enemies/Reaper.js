class Reaper{

	SET_VELOCITY = 1.5;

	DIRECTION = {
		RIGHT: 0,
		LEFT: 1,
		COUNT: 2
	};
	STATE = {
		IDLE: 0,
		AGRO: 1,
		ATTACK: 2,
		COUNT: 3,
	};
	constructor(game, x, y) {
		Object.assign(this, {game, x, y});

		this.dropchance = 0.3;

		this.width = 63;
		this.height = 96;

		//In Pixels
		this.safeDistance = 300;

		

		this.angle = 0;
		this.velocity = { x: this.SET_VELOCITY * Math.cos(this.angle), y: this.SET_VELOCITY * Math.sin(this.angle) }
		this.positionx = this.x - this.game.camera.x;
		this.positiony = this.y - this.game.camera.y;

		this.center = { x: this.x + this.width / 2, y: this.y + this.height/2 }

		this.spritesheet = ASSET_MANAGER.getAsset("./Sprites/ReaperSheet.png");
		this.hitbox = new HitBox(this, this.width, this.height);

		this.direction = this.DIRECTION.LEFT;
		this.state = this.STATE.IDLE;

		this.priority = 1;

		this.hpMax = 100;
		this.hpCurrent = this.hpMax;

		this.animations = [];
		this.setupCategories();
		this.loadAnimations();

		this.healthbar = new Healthbar(this);


	}

	loadAnimations() {
		this.animations[this.STATE.IDLE][this.DIRECTION.RIGHT]
			= new Animator(this.spritesheet, 1, 491, this.width, this.height, 4, 0.15, 2, false, true);
		this.animations[this.STATE.IDLE][this.DIRECTION.LEFT]
			= new Animator(this.spritesheet, 1, 393, this.width, this.height, 4, 0.15, 2, false, true);

		this.animations[this.STATE.AGRO][this.DIRECTION.RIGHT]
			= new Animator(this.spritesheet, 1, 99, this.width, this.height, 4, 0.15, 1, false, true);
		this.animations[this.STATE.AGRO][this.DIRECTION.LEFT]
			= new Animator(this.spritesheet, 1, 1, this.width, this.height, 4, 0.15, 1, false, true);

		this.animations[this.STATE.ATTACK][this.DIRECTION.LEFT]
			= new Animator(this.spritesheet, 1, 197, this.attackWidth, this.attackHeight, 4, 0.15, 1, false, true);
		this.animations[this.STATE.ATTACK][this.DIRECTION.RIGHT]
			= new Animator(this.spritesheet, 1, 295, this.attackWidth, this.attackHeight, 4, 0.15, 1, false, true);
	};
	setupCategories() {

		for (var i = 0; i < this.STATE.COUNT; i++) {
			this.animations.push([]);
			for (var j = 0; j < this.DIRECTION.COUNT; j++) {
				this.animations[i].push([]);
			}
		}
	};

	dropItem() {
		let chance = Math.random();
		console.log(chance);
		if (chance <= this.dropchance) {
			let itemCount = 2;
			let itemType = Math.floor(Math.random() * (itemCount));
			switch (itemType) {
				case 0:
					this.game.addEntity(new AmmoPack(this.game, this.x, this.y));
					break;
				case 1:
					this.game.addEntity(new Coin(this.game, this.x, this.y));
					break;
				case 2:
					this.game.addEntity(new HealthPack(this.game, this.x, this.y));
					break;
			}
		}
	}

	approach() {
		this.velocity = { x: this.SET_VELOCITY * Math.cos(this.angle), y: this.SET_VELOCITY * Math.sin(this.angle) }
	}
	pause() {
		this.velocity = {x:0, y:0}
	}
	flee() {
		this.velocity = { x: -1*this.SET_VELOCITY * Math.cos(this.angle), y: -1*this.SET_VELOCITY * Math.sin(this.angle) }
    }
	update() {
		var that = this;


		const TICKSCALE = this.game.clockTick* PARAMS.TIMESCALE;

		let dx = (this.game.player.x - this.x);
		let dy = (this.game.player.y - this.y);
		this.distance = Math.sqrt(dx*dx + dy*dy);

		this.angle = (Math.atan(dy / dx));

		if (dx < 0) {
			this.angle += Math.PI;
		}

		if (dx > 0) {
			this.direction = this.DIRECTION.RIGHT;
		}
		else {
			this.direction = this.DIRECTION.LEFT;
		}

		
		
		if (this.distance >= this.safeDistance) {
			this.approach();
		}
		else if (this.safeDistance > this.distance && this.distance > this.safeDistance - this.width) {
			this.pause();
		}
		else {
			this.flee();
        }
		
		this.game.entities.forEach(function (entity) {
			if (entity != that && entity.hitbox) {
				that.hitbox.collide(entity.hitbox);
            }
			
		});

		this.x += this.velocity.x * TICKSCALE;
		this.y += this.velocity.y * TICKSCALE;

		this.positionx = this.x - this.game.camera.x;
		this.positiony = this.y - this.game.camera.y;

		this.hitbox.update()

		// death
		if (this.hpCurrent <= 0) {
			this.removeFromWorld = true;
		}

	}

	draw(ctx) {

		if (PARAMS.DEBUG) {
			this.hitbox.draw(ctx);
			ctx.fillStyle = "White";
			var fontsize = 15;
			ctx.font = fontsize + 'px "VT323"'

			ctx.fillText("Angle: " + Math.round(this.angle * 180 / Math.PI), this.positionx, this.positiony - 2);
			ctx.fillText("Distance: " + Math.round(this.distance), this.positionx, this.positiony - 15);

		}
		this.healthbar.draw(ctx);
		this.animations[this.state][this.direction].drawFrame(this.game.clockTick, this.game.ctx, this.positionx, this.positiony, 1);

    }
}