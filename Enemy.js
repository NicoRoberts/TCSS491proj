class Enemy{

	SET_VELOCITY = {X:1, Y:1};

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

		this.width = 74;
		this.height = 92;
		
		//position variables
		this.positionx = 0;
		this.positiony = 0;

		this.velocity = {x:0, y:0};

		this.spritesheet = ASSET_MANAGER.getAsset("./Sprites/SkeletonSheet.png");

		this.game.Enemy = this;

		this.priority = 3;

		this.direction = this.DIRECTION.LEFT;
		this.state = this.STATE.IDLE;

		this.animations = [];
		this.setupCategories();
		this.loadAnimations();

		this.updateBB(); //COLLISION IS NOT IMPLEMENTED
		
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
	}

	loadAnimations() {
		//Skeleton is idling and facing right
		this.animations[this.STATE.IDLE][this.DIRECTION.RIGHT]
			= new Animator(this.spritesheet, 518,23, this.width, this.height, 1, 0.15, 0, false, false);
		//Skeleton is idling and facing left
		this.animations[this.STATE.IDLE][this.DIRECTION.LEFT]
			= new Animator(this.spritesheet, 23, 23, this.width, this.height, 1, 0.15, 0, false, false);
		//Skeleton is walking and facing right
		this.animations[this.STATE.WALKING][this.DIRECTION.RIGHT]
			= new Animator(this.spritesheet, 518, 23, this.width, this.height, 5, 0.15, 24, false, true);
		//Skeleton is walking and facing left	
		this.animations[this.STATE.WALKING][this.DIRECTION.LEFT]
			= new Animator(this.spritesheet, 23, 23, this.width, this.height, 5, 0.15, 24, false, true);

		//ATTACK ANIMATION GOES HERE. sprite sheet might need reorder of frames.
		}

	//COLLISION IS NOT IMPLEMENTED
	updateBB() {
		//this.lastBB = this.BB;
		//this.BB = new BoundingBox(this.x, this.y, 100, 100); //100 100 Should be changed later.
	};

	update() {

        //Update Position

        //Get difference from player and enemy
        var dx = this.player.x - this.x;
		var dy = this.player.y - this.y;
		
		
		var moving = false; //flag for skeleton movement
        if (dx > 0) {
			this.x += this.SET_VELOCITY.X;
			this.direction = this.DIRECTION.RIGHT;
			moving = true;
        } else {
			this.x -= this.SET_VELOCITY.X;
			this.direction = this.DIRECTION.LEFT;
			moving = true;
		}
		
        if(dy > 0) {
			this.y += this.SET_VELOCITY.Y;
			moving = true;
        } else {
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

		//COLLISION LOGIC HERE

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