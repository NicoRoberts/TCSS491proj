class Skeleton extends AbstractEnemy{

	constructor(player, game, x, y) {
		super(game, x, y);
		Object.assign(this, {player, game, x,y});

		this.SET_VELOCITY = { X: 0.25, Y: 0.25 };

		this.DIRECTION = {
			RIGHT: 0,
			LEFT: 1,
			COUNT: 2
		};
		this.STATE = {
			IDLE: 0,
			WALKING: 1,
			ATTACK: 2,
			COUNT: 3,
		};

		this.dropchance = .4; //Drop chance of an item (between 0 and 1)

		this.width = 75;
		this.height = 93;

		this.attackWidth = 86;
		this.attackHeight = 95;

		this.attackx = 90;
		this.attacky = 90;

		this.heightDifference = 3; //difference in height between enemy and player so that enemy chases on an even plane
		this.rightOffset = 32.5; //A value to offset the skeleton when the skeleton is to the right of the player.
		//position variables
		this.positionx = this.x - this.game.camera.x;
		this.positiony = this.y - this.game.camera.y;

		this.visualRadius = 300;
		this.attackRadius = 60;
		this.circlex = this.x + (this.width / 2);
		this.circley = this.y + (this.height / 2);
		this.detect = false;
		this.attack = false;
		this.finishedAttack = true;


		var chance = getRandomInt(0, 10);
		if (chance == 1) {
			this.detect = true;
		}

		this.first = true; //flag to omit buggy first attack

		this.attackCooldown = 0;
		this.damageInterval = 0;
		this.damage = 25;

		this.velocity = {x:2, y:2};

		this.spritesheet = ASSET_MANAGER.getAsset("./Sprites/SkeletonSheet.png");

		this.game.Enemy = this;

		this.hitbox = new HitBox(this, this.width, this.height);
		this.attackHitbox = new HitBox(this, this.width - 20, this.height - 20, false, 10, 10);

		this.priority = 1;

		this.direction = this.DIRECTION.LEFT;
		this.state = this.STATE.IDLE;

		this.animations = [];
		this.setupCategories();
		this.loadAnimations();


		//enemy movement
		this.movement = new SkeletonMovement(this.player, this.game, this); //this is a reference to THIS enemy
		this.swinging = false;
		this.attack = false;
		this.collideTerrain = false;
		this.timeLeft = 0;
		this.hit = false;
		this.attackTime = 0.3; //0.45
		this.restTime = 3;
		this.despawnTime = 0.3;
		this.maxSpeed = getRandom(1.4, 2.0);
		this.acceleration = 80000;
		
		this.healthbar = new Healthbar(this);

		// stats
		this.hpCurrent = 100;
		this.hpMax = 100;

		//spawning
		this.upperRangeX = 1768;
		this.upperRangeY = 40;
		this.lowerRangeX = 40
		this.lowerRangeY = 732;

		this.spawnTimer = 0;
		this.spawnRate = 10; // 1 enemy / spawnRate (sec)

	};

	setupCategories() {
	
		for (var i = 0; i < this.STATE.COUNT; i++) {
			this.animations.push([]);
			for (var j = 0; j < this.DIRECTION.COUNT; j++) {
				this.animations[i].push([]);
            }
		}
	};

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
			= new Animator(this.spritesheet, 968, 5, this.attackWidth, this.attackHeight, 3, 0.1, 7, false, true);
		//Skeleton is attacking and facing right	
		this.animations[this.STATE.ATTACK][this.DIRECTION.RIGHT]
			= new Animator(this.spritesheet, 1259, 5, this.attackWidth, this.attackHeight, 3, 0.1, 13, false, true);

		//ATTACK ANIMATION GOES HERE. sprite sheet might need reorder of frames.
	};

	visionCollide(other) {
		
		var dx = this.circlex - other.circlex;
    	var dy = this.circley - other.circley;
    	var distance = Math.sqrt(dx * dx + dy * dy);
        return (distance < this.visualRadius + other.visualRadius);
	};

	attackCollide(other) {
		
		var dx = this.circlex - other.circlex;
    	var dy = this.circley - other.circley;
		var distance = Math.sqrt(dx * dx + dy * dy);
		var i = this.attackRadius;
		var j = other.visualRadius;
        return (distance < this.attackRadius + other.visualRadius);
	};

	testSpeed() {
        var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
        if (speed > this.maxSpeed) {
            var ratio = this.maxSpeed / speed;
            this.velocity.x *= ratio;
            this.velocity.y *= ratio;
        }
	};
	
	dropItem() {
		let chance = Math.random();
		if (chance <= this.dropchance) {
			let itemCount = 3;
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

	doAttack(entity) {

		let that = this
		that.attack = true;

		// that.velocity.x = 0;
		// that.velocity.y = 0;

		//that.hitbox.collide(entity.hitbox);
		if (!that.swinging) {
			
			that.enemyAttack = new EnemyAttack(that.game, that.x,
				that.y, that.angle, that.width, that.height);
			that.swinging = true;
			
			
			that.timeLeft = that.attackTime * 1000;
			that.timeLeft2 = that.restTime * 1000;
			that.timeLeft3 = that.despawnTime * 1000;
			
			let interval_id = window.setInterval(function () {
				that.timeLeft -= 10;
				that.state = that.STATE.ATTACK;
				that.finishedAttack = false;
				
				
				if (that.timeLeft <= 0) {
					
					that.timeLeft = 0;
					that.game.addEntity(that.enemyAttack);
					//that.state = that.STATE.IDLE;
					window.clearInterval(interval_id);
					
					that.finishedAttack = true;

					let interval_id3 = window.setInterval(function () {						
						that.timeLeft3 -= 10;				
						if (that.timeLeft3 <= 0) {
							that.enemyAttack.removeFromWorld = true;				
							window.clearInterval(interval_id3);
						}
					}, 10);

					let interval_id2 = window.setInterval(function () {
						
						that.timeLeft2 -= 10;
						that.state = that.STATE.IDLE;
						
						if (that.timeLeft2 <= 0) {
							
							that.timeLeft2 = 0;
							that.swinging = false;
							
							window.clearInterval(interval_id2);
						}
					}, 10);
				}
			}, 10);
		}
	}

	
	
	update() {
		var that = this;
		const TICKSCALE = this.game.clockTick * PARAMS.TIMESCALE;

		
		if (that.detect && !that.attack) { //chase the player
			that.movement.chaseMovement();	
		} else if (!that.detect) { //idle movement
			that.movement.idleMovement();
		}
		//collision
		this.game.entities.forEach(function (entity) {

			if (entity instanceof Player && that.attackHitbox.willCollide(entity.hitbox)) { //change to circle
				that.doAttack(entity);

			}
		
			else if (entity instanceof Player && !that.attackHitbox.willCollide(entity.hitbox) && that.finishedAttack) {
				that.attack = false;
			} 

			if (entity != that && entity.hitbox && !(entity instanceof AbstractEnemy) && !(entity instanceof Player)) {

				that.hitbox.collide(entity.hitbox);
			}

			if ((entity instanceof Player) && (that.visionCollide(entity) || (that.hpCurrent < that.hpMax))) { // enemy detects player
				that.detect = true;
			}
			
			if (entity instanceof Terrain && that.attackCollide(entity)) {
				var dist = distance(that, that.player);
				var difX = (entity.positionx - that.positionx) / dist;
                var difY = (entity.positiony - that.positiony) / dist;
                that.velocity.x -= difX * that.acceleration / (dist * dist);
				that.velocity.y -= difY * that.acceleration / (dist * dist);
				
				if (that.velocity.x > 0 && !that.detect) {
					that.direction = that.DIRECTION.RIGHT;
				} else if (that.velocity.x < 0 && !that.detect) {
					that.direction = that.DIRECTION.LEFT;
				}
			}
			// 	that.collideTerrain = true;
			// 	var dist = distance(that, entity);
			// 	//that.hitbox.collide(entity.hitbox);
			// 	if (dist == 0) {
			// 		dist = 1;
			// 	}
			// 	var difX = (entity.positionx - that.positionx) / dist;
            //     var difY = (entity.positiony - that.positiony) / dist;
            //     that.velocity.x -= difX * (that.acceleration) / (dist * dist);
            //     that.velocity.y -= difY * (that.acceleration * 3) / (dist * dist);
			// } else if (entity instanceof Terrain && !that.attackCollide(entity)) {
			// 	that.collideTerrain = false;
			// }


		});
		this.testSpeed();

		

		//Update Position
		if(!this.attack){	
			this.x += this.velocity.x * TICKSCALE;
			this.y += this.velocity.y * TICKSCALE;
		}
		
		//update circlex, circley
		this.circlex = this.x + (this.width / 2);
		this.circley = this.y + (this.height / 2);

		//position with regards to camera
		this.positionx = this.x - this.game.camera.x;
		this.positiony = this.y - this.game.camera.y;

		this.attackHitbox.update();
		this.hitbox.update();
		
		// death
		if (this.hpCurrent <= 0) {
			this.removeFromWorld = true;
			this.game.enemiesCount--;
			this.player.killCount++;
			this.dropItem();
		};

		//spawn Skeletons
		// this.spawnTimer += this.game.clockTick;
		// this.spawnSkeletons();


	};

	// spawnSkeletons() {

		
	// 	if (this.spawnTimer >= this.spawnRate) {
	// 		this.spawnTimer = 0;
	// 		var RandomX = getRandomInt(this.lowerRangeX, this.upperRangeX);
	// 		var RandomY = getRandomInt(this.lowerRangeY, this.upperRangeY);
	// 		var skeleton = new Enemy(this.player, this.game, RandomX, RandomY);
	// 		this.game.addEntity(skeleton);
	// 	}

	// }

	// spawnSkeletons(randomX, randomY) {
	// 	this.spawnTimeLeft = this.spawnTime * 1000;
	// 	let interval_id = window.setInterval(function () {
	// 		this.spawnTimeLeft -= 10;
	// 		if (this.spawnTimeLeft <= 0) {
	// 			this.game.addEntity(new Enemy(this.player, this.game, randomX, randomY));
	// 			window.clearInterval(interval_id);
	// 		}
	// 	}, 10);

	// }

	draw(ctx) {
		//ctx.fillStyle = "Red";
		//ctx.strokeStyle = "Red";
		if (PARAMS.DEBUG) {
			this.attackHitbox.draw(ctx);
			this.hitbox.draw(ctx);

			ctx.fillStyle = "White";
			var fontsize = 15;
			ctx.font = fontsize + 'px "VT323"'

			ctx.fillText("X: " + Math.round(this.x) + " Y: " + Math.round(this.y), this.positionx, this.positiony + 15 + this.height);
			ctx.fillText("Vx: " + (this.velocity.x).toFixed(2) + " Vy: " + (this.velocity.y).toFixed(2), this.positionx, this.positiony + 30 + this.height);

			ctx.beginPath();
            ctx.strokeStyle = 'Red';
			ctx.arc(this.circlex - this.game.camera.x, this.circley - this.game.camera.y, this.visualRadius, 0, Math.PI * 2, false);
			
            ctx.stroke();
			ctx.closePath();
			
			ctx.beginPath();
            ctx.strokeStyle = 'White';
			ctx.arc(this.circlex - this.game.camera.x, this.circley - this.game.camera.y, this.attackRadius, 0, Math.PI * 2, false);
			
            ctx.stroke();
            ctx.closePath();

			ctx.strokeStyle = 'Purple';
		}

		this.animations[this.state][this.direction].drawFrame(this.game.clockTick, this.game.ctx, this.positionx, this.positiony, 1);
		this.healthbar.draw(ctx);
	};

};