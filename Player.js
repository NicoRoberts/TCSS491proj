class Player{

	

	constructor(game, x, y) {

		Object.assign(this, { game, x, y });

		this.sprintBonus = 1.3;
		this.SET_VELOCITY = { X: 2, Y: 2 };

		this.DIRECTION = {
			RIGHT: 0,
			LEFT: 1,
			COUNT: 2
		};
		this.STATE = {
			IDLE: 0,
			WALKING: 1,
			SPRINTING: 2,
			COUNT: 3,
		};
    
    	this.width = 16;
    	this.height = 32;

		//POSITION VARIABLES
		this.positionx = this.x - this.game.camera.x;
		this.positiony = this.y - this.game.camera.y;

		this.velocity = { x: 0, y: 0 };

		//detection/attack radius
		this.visualRadius = 55;
		this.circlex = this.x + ((this.width * PARAMS.PIXELSCALER) / 2);
		this.circley = this.y + ((this.height * PARAMS.PIXELSCALER) / 2);

		this.play = true;
		this.spritesheet = ASSET_MANAGER.getAsset("./Sprites/PlayerSheet.png");

		this.game.player = this;
		
		this.direction = this.DIRECTION.RIGHT;
		this.state = this.STATE.IDLE

		this.animations = [];
		this.setupCategories();
		this.loadAnimations();

		this.hitbox = new HitBox(this, this.width * PARAMS.PIXELSCALER, this.height * PARAMS.PIXELSCALER);
	
		this.priority = 3;

		// player game stats
		this.coins = 0; // player's current coins
		this.totalCoinsCollected = 0;
		this.killCount = 0;
		this.shardObtained = false;

		// player stats
		this.hpCurrent = 40; // originally 40
		this.hpMax = 40;
		this.hit = false;
		this.stageLevel = 1; // start at 1

		// perks
		this.healthBoostLevel = 0;
		this.reloadBoostLevel = 0;
		this.speedBoostLevel = 0;
		this.secondChance = false;

		// stat buff from each perk
		this.healthBuff = 10;
		this.reloadBuff = .85;
		this.speedBuff = 0;

		//i-frames
		this.invincibilityDuration = 1000;
		this.drawInvis = false;

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

		this.animations[this.STATE.SPRINTING][this.DIRECTION.RIGHT]
			= new Animator(this.spritesheet, 1, 99, this.width * PARAMS.PIXELSCALER, this.height * PARAMS.PIXELSCALER, 4, 0.1 / this.sprintBonus, 2, false, true);
		this.animations[this.STATE.SPRINTING][this.DIRECTION.LEFT]
			= new Animator(this.spritesheet, 1, 197, this.width * PARAMS.PIXELSCALER, this.height * PARAMS.PIXELSCALER, 4, 0.1 / this.sprintBonus, 2, false, true);

	}
	takeDamage(damage) {
		if (!this.hit) {
			let that = this;
			this.hit = true;
			this.hpCurrent -= damage;
			let id = window.setInterval(function () {
				that.drawInvis = !that.drawInvis;
			}, 75);
			window.setTimeout(function () {
				that.hit = false;
				window.clearInterval(id);
				that.drawInvis = false;
			}, this.invincibilityDuration);
        }
		
    }

	update() {
		
		if (this.hpCurrent <= 0 && this.secondChance) {
			this.hpCurrent = this.hpMax / 2;
			this.secondChance = false;
		}
		if (this.hpCurrent <= 0 && !this.secondChance) {
			this.game.camera.loadGameOver();
		}
		
		const TICKSCALE = this.game.clockTick * PARAMS.TIMESCALE;	


		//Sprint speed
		let bonus = 1;
		if (this.game.shift) {
			bonus = this.sprintBonus;
		}
		//Update Velocity
		var moving = false;
		
		if (this.game.W) {
			this.velocity.y = -1 * (this.SET_VELOCITY.Y * bonus + this.speedBuff) * TICKSCALE;
			moving = true;
		} else if(this.game.S){
			this.velocity.y = (this.SET_VELOCITY.Y * bonus + this.speedBuff) * TICKSCALE;
			moving = true;
		}else {
			this.velocity.y = 0;
		}
		if (this.game.A) {
			if (!this.game.weapon.swinging) {
				this.direction = this.DIRECTION.LEFT;
			}
			moving = true;

			this.velocity.x = -1 * (this.SET_VELOCITY.X * bonus + this.speedBuff) * TICKSCALE;
		} else if (this.game.D) {
			if (!this.game.weapon.swinging) {
				this.direction = this.DIRECTION.RIGHT;
			}
			moving = true;
			this.velocity.x = (this.SET_VELOCITY.X * bonus + this.speedBuff) * TICKSCALE;
		}
		else {
			this.velocity.x = 0;
		}

		let movementState = this.game.shift ? this.STATE.SPRINTING : this.STATE.WALKING;
		this.state = (moving) ? movementState : this.STATE.IDLE;

		//fix velocity for diagonal movement

		let diagonal = false;
		if ((this.game.A || this.game.D) && (this.game.W || this.game.S)) {
			this.velocity.x = (this.velocity.x / 2) * Math.sqrt(2);
			this.velocity.y = (this.velocity.y / 2) * Math.sqrt(2);
			diagonal = true;
		}

		/*Footsteps*/
		if (moving && this.play) {
			let that = this;
			this.play = false;
			ASSET_MANAGER.playAsset("./Sounds/Walking.wav");
			window.setTimeout(function () {
				that.play = true;
			}, 250*1/bonus)
		}
		/**/ 

		

		//collision
		var that = this;
		this.game.entities.forEach(function (entity) {
			if (entity != that && entity.hitbox && !(entity instanceof AbstractEnemy)) {

				
				if (entity instanceof AmmoPack && that.hitbox.collide(entity.hitbox)) {
					if (that.game.weapon.reservesCount != that.game.weapon.maxReserves) {
						ASSET_MANAGER.playAsset("./Sounds/reload.wav");
						that.game.weapon.fill();
						entity.removeFromWorld = true;
					}
					else {  // buyable drop on yacht
						if ((that.game.weapon.reservesCount != that.game.weapon.maxReserves) && (that.game.E)
						&& (that.coins >= entity.cost)) {
							that.game.weapon.fill();
							that.coins -= entity.cost;
						}
					}
					
				}
				else if (entity instanceof Coin && that.hitbox.collide(entity.hitbox)) {
					ASSET_MANAGER.playAsset("./Sounds/coin.wav");
					that.coins += 1;
					that.totalCoinsCollected += 1;
					entity.removeFromWorld = true;
				}
				else if (entity instanceof HealthPack && that.hitbox.collide(entity.hitbox)) {
					if (that.game.stage == "survival") {
						if (that.hpCurrent != that.hpMax) {
							ASSET_MANAGER.playAsset("./Sounds/heal.wav");
							that.hpCurrent = that.hpMax;
							entity.removeFromWorld = true;
						}
					}
					else {
						if ((that.hpCurrent != that.hpMax) && (that.game.E)
						&& (that.coins >= entity.cost)) {
							that.hpCurrent = that.hpMax;
							that.coins -= entity.cost;
						}
					}
					
				}

				if (entity instanceof Shards) {
					if (that.hitbox.collide(entity.hitbox)) {
						ASSET_MANAGER.playAsset("./Sounds/pickup.wav");
						entity.removeFromWorld = true;
						that.shardObtained = true;
					}
				}

				if (entity instanceof HealthPerk) {
					if (that.hitbox.collide(entity.hitbox)) {
						if (that.game.E) {
							if (that.coins >= entity.cost && that.healthBoostLevel < 3) {
								ASSET_MANAGER.playAsset("./Sounds/buy.wav");
								entity.removeFromWorld = true;
								that.coins -= entity.cost;
								that.healthBoostLevel++;
								entity.level++;
								that.hpMax += that.healthBuff;
								that.hpCurrent += that.healthBuff;
							}
						}
					}
				}

				if (entity instanceof ReloadPerk) {
					if (that.hitbox.collide(entity.hitbox)) {
						if (that.game.E) {
							if (that.coins >= entity.cost && that.reloadBoostLevel < 3) {
								ASSET_MANAGER.playAsset("./Sounds/buy.wav");
								entity.removeFromWorld = true;
								that.coins -= entity.cost;
								that.reloadBoostLevel++;
								entity.level++;
								for (var i = 0; i < that.game.weapons.length; i++) {
									((that.game.weapons)[i]).reloadTime *= that.reloadBuff;
								}
							}
						}
					}
				}

				if (entity instanceof SpeedPerk) {
					if (that.hitbox.collide(entity.hitbox)) {
						if (that.game.E) {
							if (that.coins >= entity.cost && that.speedBoostLevel < 3) {
								ASSET_MANAGER.playAsset("./Sounds/buy.wav");
								entity.removeFromWorld = true;
								that.coins -= entity.cost;
								that.speedBoostLevel++;
								entity.level++;
								that.speedBuff += 0.4;
							}
						}
					}
				}

				if (entity instanceof RevivePerk) {
					if (that.hitbox.collide(entity.hitbox)) {
						if (that.game.E) {
							if (that.coins >= entity.cost && !(entity.purchased)) {
								ASSET_MANAGER.playAsset("./Sounds/buy.wav");
								entity.removeFromWorld = true;
								that.coins -= entity.cost;
								that.secondChance = true;
								entity.purchased = true;
							}
						}
					}
				}

				if (entity instanceof DisplayShotgun) {
					if (that.hitbox.collide(entity.hitbox)) {
						if (that.game.E) {
							if (that.coins >= entity.cost) {
								ASSET_MANAGER.playAsset("./Sounds/buy.wav");
								entity.removeFromWorld = true;
								that.coins -= entity.cost;
								that.game.weapons[2].isAvailable = true;
							}
						}
					}
				}

				if (entity instanceof DisplayMachinegun) {
					if (that.hitbox.collide(entity.hitbox)) {
						if (that.game.E) {
							if (that.coins >= entity.cost) {
								ASSET_MANAGER.playAsset("./Sounds/buy.wav");
								entity.removeFromWorld = true;
								that.coins -= entity.cost;
								that.game.weapons[3].isAvailable = true;
							}
						}
					}
				}

				if (entity instanceof Marriyacht) {
					if (that.hitbox.collide(entity.hitbox) && that.shardObtained) {
						that.x = 275;
						that.y = 1775;
						that.game.camera.loadDeparture();
					}
				}

				if (entity instanceof Gangway) {
					if (that.hitbox.collide(entity.hitbox)) {

						//console.log("Good luck");

						that.shardObtained = false;
						that.stageLevel++;
						that.x = 243;
						that.y = 1800;
						that.game.camera.loadArrival();
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

			ctx.fillStyle = "White";
			var fontsize = 15;
			ctx.font = fontsize + 'px "VT323"'


			//ctx.fillText("Angle: " + Math.round(this.game.weapon.angle * 180 / Math.PI), this.positionx, this.positiony + 15 + this.height * PARAMS.PIXELSCALER);
			ctx.fillText("X: " + Math.round(this.x) + " Y: " + Math.round(this.y), this.positionx, this.positiony + 30 + this.height * PARAMS.PIXELSCALER);
			ctx.fillText("Vx: " + (this.velocity.x).toFixed(2) + " Vy: " + (this.velocity.y).toFixed(2), this.positionx, this.positiony + 45 + this.height * PARAMS.PIXELSCALER);

			ctx.beginPath();
            ctx.strokeStyle = 'White';
			ctx.arc(this.circlex - this.game.camera.x, this.circley - this.game.camera.y, this.visualRadius, 0, Math.PI * 2, false);
            ctx.stroke();
			ctx.closePath();
			
			
		}
		if (!this.drawInvis) {
			this.animations[this.state][this.direction].drawFrame(this.game.clockTick, this.game.ctx, this.positionx, this.positiony, 1);
        }
		

	}

}