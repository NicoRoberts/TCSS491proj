class LichKing extends AbstractEnemy {

	constructor(game, x, y) {
		super(game, x, y);
		Object.assign(this, { game, x, y });

		this.SET_VELOCITY = 2;
		this.SET_ROAM_VELOCITY = 0.25;

		this.DIRECTION = {
			RIGHT: 0,
			LEFT: 1,
			COUNT: 2
		};

		this.STATE = {
			BASE: 0,
			ORB: 1,
			STAFF: 2,
			COUNT: 3,
		};

		this.width = 176;
		this.height = 196;

		

		//In Pixels
		this.detectionRange = 800;
		this.safeDistance = 600;

		this.detected = false;

		this.startingPos = { x: this.x, y: this.y };
		this.roamRange = 50;
		this.clockwise = 1;
		this.switching = false;
		this.finishedRoam = true;


		this.firing = false;
		this.attackCooldown = 1000 //ms

		this.angle = 0;
		this.velocity = { x: this.SET_VELOCITY * Math.cos(this.angle), y: this.SET_VELOCITY * Math.sin(this.angle) }
		this.positionx = this.x - this.game.camera.x;
		this.positiony = this.y - this.game.camera.y;

		this.acceleration = 8000;

		this.center = { x: this.x + this.width / 2, y: this.y + this.height / 2 }

		this.spritesheet = ASSET_MANAGER.getAsset("./Sprites/LichKing.png");
		this.hitbox = new HitBox(this, this.width, this.height);

		this.direction = this.DIRECTION.LEFT;
		this.state = this.STATE.BASE;


		this.priority = 1;

		this.hpMax = 2000;
		this.hpCurrent = this.hpMax;

		this.animations = [];
		this.setupCategories();
		this.loadAnimations();

		this.healthbar = new Healthbar(this);


	};

	loadAnimations() {
		this.animations[this.STATE.BASE][this.DIRECTION.RIGHT]
			= new Animator(this.spritesheet, 1, 595, this.width, this.height, 4, 0.15, 2, false, true);
		this.animations[this.STATE.BASE][this.DIRECTION.LEFT]
			= new Animator(this.spritesheet, 1, 1, this.width, this.height, 4, 0.15, 2, false, true);

		this.animations[this.STATE.ORB][this.DIRECTION.RIGHT]
			= new Animator(this.spritesheet, 1, 793, this.width, this.height, 4, 0.15, 2, false, true);
		this.animations[this.STATE.ORB][this.DIRECTION.LEFT]
			= new Animator(this.spritesheet, 1, 199, this.width, this.height, 4, 0.15, 2, false, true);

		this.animations[this.STATE.STAFF][this.DIRECTION.RIGHT]
			= new Animator(this.spritesheet, 1, 991, this.width, this.height, 4, 0.15, 2, false, true);
		this.animations[this.STATE.STAFF][this.DIRECTION.LEFT]
			= new Animator(this.spritesheet, 1, 397, this.width, this.height, 4, 0.15, 2, false, true);
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
		this.game.addEntity(new Shards(this.game, this.x, this.y));
	};

	approach() {
		this.velocity = { x: this.SET_VELOCITY * Math.cos(this.angle), y: this.SET_VELOCITY * Math.sin(this.angle) };
	};
	pause() {

		let that = this;
		if (!this.switching) {
			this.switching = true;
			window.setTimeout(function () {
				that.clockwise *= -1;
				that.switching = false;
			}, Math.random() * 5000 + 1000)
		}

		this.velocity = {
			x: this.clockwise * this.SET_VELOCITY * Math.cos(this.angle + Math.PI / 2),
			y: this.clockwise * this.SET_VELOCITY * Math.sin(this.angle + Math.PI / 2)
		};
	};
	flee() {
		this.velocity = { x: -1 * this.SET_VELOCITY * Math.cos(this.angle), y: -1 * this.SET_VELOCITY * Math.sin(this.angle) };
	};
	chase(dx, dy) {
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
	};
	roam() {

		if (this.finishedRoam) {
			let that = this;
			this.finishedRoam = false;
			let min = { x: this.startingPos.x - this.roamRange, y: this.startingPos.y - this.roamRange };
			let max = { x: this.startingPos.x + this.roamRange, y: this.startingPos.y + this.roamRange };
			this.roamDestination = {
				x: Math.random() * (max.x - min.x + 1) + min.x,
				y: Math.random() * (max.y - min.y + 1) + min.y
			};

			let dx = (this.roamDestination.x - this.x);
			let dy = (this.roamDestination.y - this.y);
			let angle = (Math.atan(dy / dx));
			if (dx < 0) {
				angle += Math.PI;
			}

			this.velocity = {
				x: this.SET_ROAM_VELOCITY * Math.cos(angle),
				y: this.SET_ROAM_VELOCITY * Math.sin(angle)
			};

			window.setTimeout(function () {
				that.finishedRoam = true;
			}, Math.random() * 1000 + 1000)
		}



	};
	fire() {
		if (!this.firing) {
			let attackType = randomInt(100)
			let summonThreshold = 30
			if (attackType <= summonThreshold) {
				staffSummon();
			}
			else {
				orbAttack();
            }
		}
	}
	orbAttack() {

	}
	staffSummon() {

    }
	
	update() {


		var that = this;

		const TICKSCALE = this.game.clockTick * PARAMS.TIMESCALE;

		let dx = (this.game.player.x - (this.x+this.width/2));
		let dy = (this.game.player.y - (this.y+this.height/2));
		this.distance = Math.sqrt(dx * dx + dy * dy);
		this.angle = (Math.atan(dy / dx));

		if (this.distance <= this.detectionRange) {
			this.detected = true;
		}


		if (this.detected) {
			this.chase(dx, dy);
		}
		else {
			this.roam();
		}

		//if (this.state == this.STATE.ATTACK) {
		//	//this.fire();
		//}




		this.game.entities.forEach(function (entity) {
			if (entity != that && entity.hitbox) {
				if (that.hitbox.willCollide(entity.hitbox) && (entity instanceof Terrain ||
					entity instanceof HBoundary || entity instanceof VBoundary)) {
					that.clockwise *= -1;
				}
				if (!(entity instanceof AbstractEnemy)) {
					that.hitbox.collide(entity.hitbox);
				}
				if (entity instanceof Terrain) {
					that.hitbox.collide(entity.hitbox);

				}


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
			this.game.player.killCount++;
			this.dropItem();
		}

	}

	draw(ctx) {

		if (PARAMS.DEBUG) {
			this.hitbox.draw(ctx);

			ctx.beginPath();
			ctx.strokeStyle = 'Red';
			ctx.arc(this.x + this.width / 2 - this.game.camera.x, this.y + this.height / 2 - this.game.camera.y, this.detectionRange, 0, Math.PI * 2, false);

			ctx.stroke();
			ctx.closePath();

			ctx.fillStyle = "White";
			var fontsize = 15;
			ctx.font = fontsize + 'px "VT323"'

			ctx.fillText("Angle: " + Math.round(this.angle * 180 / Math.PI), this.positionx, this.positiony + 15 + this.height);
			ctx.fillText("Distance: " + Math.round(this.distance), this.positionx, this.positiony + 30 + this.height);
			ctx.fillText("X: " + Math.round(this.x) + " Y: " + Math.round(this.y), this.positionx, this.positiony + 45 + this.height);
			ctx.fillText("Vx: " + (this.velocity.x).toFixed(2) + " Vy: " + (this.velocity.y).toFixed(2), this.positionx, this.positiony + 60 + this.height);
		}
		this.healthbar.draw(ctx);
		this.animations[this.state][this.direction].drawFrame(this.game.clockTick, this.game.ctx, this.positionx, this.positiony, 1);

	}
}