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
		this.safeDistance = 500;

		this.detected = false;

		this.startingPos = { x: this.x, y: this.y };
		this.roamRange = 50;
		this.clockwise = 1;
		this.switching = false;
		this.finishedRoam = true;


		this.firing = false;
		this.firstDetection = true;
		this.attackCooldown = 4000 //ms

		this.angle = 0;
		this.velocity = { x: this.SET_VELOCITY * Math.cos(this.angle), y: this.SET_VELOCITY * Math.sin(this.angle) }
		this.positionx = this.x - this.game.camera.x;
		this.positiony = this.y - this.game.camera.y;

		this.acceleration = 8000;

		this.center = { x: this.x + this.width / 2, y: this.y + this.height / 2 }

		this.spritesheet = ASSET_MANAGER.getAsset("./Sprites/LichKing.png");
		this.deathSpritesheet = ASSET_MANAGER.getAsset("./Sprites/LichKingDeath.png");
		this.hitbox = new HitBox(this, this.width, this.height);

		this.direction = this.DIRECTION.LEFT;
		this.state = this.STATE.BASE;


		this.priority = 1;

		this.hpMax = 4500; // originally 4500
		this.hpCurrent = this.hpMax;

		this.animations = [];
		this.deathAnimation = null;
		this.setupCategories();
		this.loadAnimations();

		this.healthbar = new Healthbar(this);

		this.removeFromWorld = false;
		this.dead = false;


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

		this.deathAnimation = new Animator(this.deathSpritesheet, 1, 1, this.width-2, this.height, 63, 0.08, 2, false, false);
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
		this.game.addEntity(new Shards(this.game, this.x + this.width / 2, this.y + this.height/2));
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
			this.firing = true;
			let attackType = randomInt(100)
			let summonThreshold = 25;
			if (attackType <= summonThreshold && this.game.enemiesCount < 8/*max enemy spawns (buffer of 1-3)*/) {
				this.staffSummon();
			}
			else {
				this.orbAttack();
            }
		}
	}
	orbAttack() {
		let that = this;
		this.state = this.STATE.ORB;
		let wpos = that.direction == that.DIRECTION.LEFT ? 0.8 : 0.2;
		
		
		window.setTimeout(function () {
			that.state = that.STATE.BASE;
			
			for (let theta = that.angle; theta < that.angle + Math.PI * 2; theta += Math.PI / 6) {
				if (!that.removeFromWorld) {
					that.game.addEntity(new EnergyBall(that.game, that.x + that.width * wpos, that.y + that.height * .2, theta));
                }
				
			}
			ASSET_MANAGER.playAsset("./Sounds/energyattack.wav");
		}, 4*0.15*1000);

		window.setTimeout(function () {
			that.firing = false;
		}, this.attackCooldown);
	}
	staffSummon() {
		let that = this;
		this.state = this.STATE.STAFF;

		window.setTimeout(function () {
			that.state = that.STATE.BASE;
			ASSET_MANAGER.playAsset("./Sounds/summon.wav");
			if (!that.removeFromWorld) {
				that.summonEnemies();
			}
			
		}, 4 * 0.15 * 1000);

		window.setTimeout(function () {
			that.firing = false;
		}, this.attackCooldown);
	}
	summonEnemies() {
		let enemiesToSpawn = [];
		let spawnCount = 3;
		
		let grids = this.game.grid.gridArea(this.x, this.y, this.width, this.height);
		for (let i = 0; i < spawnCount; i++) {
			var randomEnemy = getRandomInt(0, 3);
			let spawn = { x: grids[getRandomInt(0, grids.length)].x, y: grids[getRandomInt(0, grids.length)].y };
			if (randomEnemy == 0) {
				enemiesToSpawn.push(new Skeleton(this.game.player, this.game, spawn.x, spawn.y));
			} else if (randomEnemy == 1) {
				enemiesToSpawn.push(new Banshee(this.game.player, this.game, spawn.x, spawn.y));
			} else {
				enemiesToSpawn.push(new Reaper(this.game, spawn.x, spawn.y));
			} 
		}

		for (let i = 0; i < enemiesToSpawn.length; i++) {
			enemiesToSpawn[i].detect = true;
			enemiesToSpawn[i].detected = true;
			this.game.addEntity(enemiesToSpawn[i]);
			this.game.enemiesCount++;
        }
		
    }
	
	update() {

		if (!this.dead) {
			var that = this;

			const TICKSCALE = this.game.clockTick * PARAMS.TIMESCALE;
			let dx = (this.game.player.x - (this.x + this.width / 2));
			let dy = (this.game.player.y - (this.y + this.height / 2));
			this.distance = Math.sqrt(dx * dx + dy * dy);
			this.angle = (Math.atan(dy / dx));

			if (this.distance <= this.detectionRange) {
				this.detected = true;
			}


			if (this.detected) {
				this.chase(dx, dy);

				if (this.firstDetection) {
					this.firstDetection = false;
					this.firing = true;
					window.setTimeout(function () {
						that.firing = false;
					}, 5000); //Start attacking 5 seconds after detecting player
				}
				else {
					this.fire();
				}


			}
			else {
				this.roam();
			}

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
				this.die();
			}

		}
		else {
			this.positionx = this.x - this.game.camera.x;
			this.positiony = this.y - this.game.camera.y;
        }
		
	}
	die() {
		let that = this;
		this.dead = true;
		window.setTimeout(function () {
			that.removeFromWorld = true;
			that.game.player.killCount++;
			that.dropItem();
        },63*0.08*1000)
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
		if (!this.dead) {
			this.healthbar.draw(ctx);
			this.animations[this.state][this.direction].drawFrame(this.game.clockTick, this.game.ctx, this.positionx, this.positiony, 1);
		}
		else {
			this.deathAnimation.drawFrame(this.game.clockTick, this.game.ctx, this.positionx, this.positiony, 1);
        }
		

	}
}