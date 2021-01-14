class Player{

	SET_VELOCITY = {X:3, Y:2};

	constructor(game,x,y){
		Object.assign(this, {game, x,y});

		this.game.Player = this;

		this.velocity = {x:0, y:0};

		this.updateBB();

	};


	updateBB() {
		this.lastBB = this.BB;
		this.BB = new BoundingBox(this.x, this.y, 100, 100); //100 100 Should be changed later.
	};

	update() {

		//Update Velocity
		if(this.game.W) {
			this.velocity.y = -1 * this.SET_VELOCITY.Y;
		} else if (this.game.S) {
			this.velocity.y = this.SET_VELOCITY.Y;
		}
		else {
			this.velocity.y = 0;
		}

		if(this.game.A) {
			this.velocity.x = -1 * this.SET_VELOCITY.X;

		} else if (this.game.D) {
			this.velocity.x = this.SET_VELOCITY.X;
		}
		else {
			this.velocity.x = 0;
		}

		//Update Position
		this.x += this.velocity.x
		this.y += this.velocity.y
		this.updateBB();

		//collision
		var that = this;
		this.game.entities.forEach(function (entity) {
			if (entity.BB && that.BB.collide(entity.BB)) {
				
				if (entity instanceof RightBoundary) {
					
					
					//left side of the barrier
					if (that.BB.collide(entity.BB)) {
						that.x = entity.BB.left - PARAMS.PLAYERWIDTH;
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
						that.y = entity.BB.top - PARAMS.PLAYERHEIGHT;
						if (that.velocity.y > 0) that.velocity.y = 0;
					
					}
					that.updateBB();
				}
					
			}

		});
	};

	draw(ctx) {
		ctx.fillStyle = "White";
		ctx.strokeStyle = "Red";

		ctx.strokeRect(this.x,this.y,100,100);
	};

};