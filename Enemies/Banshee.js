class Banshee extends AbstractEnemy {

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
		super(game, x, y);
		Object.assign(this, {player, game, x,y});
		

		this.dropchance = 0.25; //Drop chance of an item (between 0 and 1)

		this.width = 86;
		this.height = 85;

		this.attackWidth = 86;
		this.attackHeight = 95;

		this.heightDifference = 3; //difference in height between enemy and player so that enemy chases on an even plane
		this.rightOffset = 32.5; //A value to offset the skeleton when the skeleton is to the right of the player.
		//position variables
		this.positionx = this.x - this.game.camera.x;
		this.positiony = this.y - this.game.camera.y;

		this.visualRadius = 100;
		this.attackRadius = 55;
		this.circlex = this.x + (this.width / 2);
		this.circley = this.y + (this.height / 2);
		this.detect = false;
		this.attack = false;

		this.first = true; //flag to omit buggy first attack

		this.attackCooldown = 0;
		this.damageInterval = 0;
		this.damage = 25;

		this.velocity = {x:2, y:2};

		this.spritesheet = ASSET_MANAGER.getAsset("./Sprites/Banshee.png");

		this.game.Enemy = this;

		this.hitbox = new HitBox(this, this.width, this.height);

		this.priority = 2;

		this.direction = this.DIRECTION.LEFT;
		this.state = this.STATE.IDLE;

		this.animations = [];
		this.setupCategories();
		this.loadAnimations();


		//enemy movement
		this.movement = new BansheeMovement(this.player, this.game, this); //this is a reference to THIS enemy
		this.swinging = false;
		this.attack = false;
		this.collideTerrain = false;
		this.timeLeft = 0;
		this.hit = false;
		this.attackTime = 0.45;
		this.restTime = 3;
		this.maxSpeed = 2;
		this.acceleration = 20;

		//For banshee idle movement
		this.collideRight = false;
		this.collideLeft = false;
		this.collideTop = false;
		this.collideBottom = false;
		
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
	};

	loadAnimations() {
		//Skeleton is idling and facing right
		this.animations[this.STATE.IDLE][this.DIRECTION.RIGHT]
			= new Animator(this.spritesheet, 9, 5, this.width, this.height, 1, 3, 0, false, true);
		//Skeleton is idling and facing left
		this.animations[this.STATE.IDLE][this.DIRECTION.LEFT]
			= new Animator(this.spritesheet, 384, 2, this.width, this.height, 1, 3, 0, false, true);
		//Skeleton is walking and facing right
		this.animations[this.STATE.WALKING][this.DIRECTION.RIGHT]
			= new Animator(this.spritesheet, 9, 5, this.width, this.height, 4, 0.15, 10, false, true);
		//Skeleton is walking and facing left	
		this.animations[this.STATE.WALKING][this.DIRECTION.LEFT]
			= new Animator(this.spritesheet, 384, 2, this.width, this.height, 4, 0.15, 10, false, true);
		//Skeleton is attacking and facing left	
		this.animations[this.STATE.ATTACK][this.DIRECTION.LEFT]
			= new Animator(this.spritesheet, 1152, 0, this.attackWidth, this.attackHeight, 4, 0.05, 10, false, true);
		//Skeleton is attacking and facing right	
		this.animations[this.STATE.ATTACK][this.DIRECTION.RIGHT]
			= new Animator(this.spritesheet, 777, 0, this.attackWidth, this.attackHeight, 4, 0.05, 10, false, true);

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
		console.log(chance);
		if (chance <= this.dropchance) {
			let itemCount = 1;
			let itemType = Math.floor(Math.random() * (itemCount));
			switch (itemType) {
				case 0:
					this.game.addEntity(new AmmoPack(this.game, this.x, this.y));
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
			that.game.addEntity(that.enemyAttack);
			
			that.timeLeft = that.attackTime * 1000;
			that.timeLeft2 = that.restTime * 1000;
			
			let interval_id = window.setInterval(function () {
				that.timeLeft -= 10;
				that.state = that.STATE.ATTACK;
				
				
				if (that.timeLeft <= 0) {
					
					that.timeLeft = 0;
					
					//that.state = that.STATE.IDLE;
					window.clearInterval(interval_id);
					that.enemyAttack.removeFromWorld = true;

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

		
		
		//collision
		this.game.entities.forEach(function (entity) {

			if (entity instanceof Player && that.hitbox.willCollide(entity.hitbox)) {
				that.doAttack(entity);

			}
		
			else if (entity instanceof Player && !that.hitbox.willCollide(entity.hitbox)) {
				that.attack = false;
			} 

			if (entity != that && entity.hitbox && !(entity instanceof AbstractEnemy)  && !(entity instanceof Player) ) {

				that.hitbox.collide(entity.hitbox);
			}

			if ((entity instanceof Player) && that.visionCollide(entity)) { // enemy detects player
				that.detect = true;
			}

			//Banshee "Pong" movement algorithm
			if (entity != that && entity.hitbox &&
				((entity instanceof VBoundary) && entity.type == "right")
				 && that.hitbox.willCollide(entity.hitbox)) {
			   that.collideRight = true;
		   	} 
		   	if (entity != that && entity.hitbox &&
			   ((entity instanceof VBoundary) && entity.type == "left")
				&& that.hitbox.willCollide(entity.hitbox)) {
			   that.collideLeft = true;
		   	} 
		   	if (entity != that && entity.hitbox &&
			   ((entity instanceof HBoundary) && entity.type == "top")
				&& that.hitbox.willCollide(entity.hitbox)) {
			   that.collideTop = true;
		   	} 
		   	if (entity != that && entity.hitbox &&
			   ((entity instanceof HBoundary) && entity.type == "bottom")
				&& that.hitbox.willCollide(entity.hitbox)) {
			   that.collideBottom = true;
		   	}	
			
			if (entity instanceof Terrain && that.attackCollide(entity)) {
				that.collideTerrain = true;
				var dist = distance(that, entity);
				that.hitbox.collide(entity.hitbox);
				if (dist == 0) {
					dist = 1;
				}
				var difX = (entity.positionx - that.positionx) / dist;
                var difY = (entity.positiony - that.positiony) / dist;
                that.velocity.x -= difX * (that.acceleration) / (dist * dist);
                that.velocity.y -= difY * (that.acceleration / 2) / (dist * dist);
			} else if (entity instanceof Terrain && !that.attackCollide(entity)) {
				that.collideTerrain = false;
			}


		});
		this.testSpeed();

		
		if (that.detect && !that.attack) { //chase the player
			that.movement.chaseMovement();	
		} else if (!that.detect) { //idle movement
			that.movement.idleMovement();
		}

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

		this.hitbox.update();
		
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