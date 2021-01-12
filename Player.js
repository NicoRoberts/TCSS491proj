class Player{

	SET_VELOCITY = {X:3, Y:2};

	constructor(game,x,y){
		Object.assign(this, {game, x,y});
		this.velocity = {x:0, y:0};
	}
	update(){

		//Update Velocity
		if(this.game.W){
			this.velocity.y = -1*this.SET_VELOCITY.Y;
		} else if(this.game.S){
			this.velocity.y = this.SET_VELOCITY.Y;
		}
		else{
			this.velocity.y = 0;
		}

		if(this.game.A){
			this.velocity.x = -1*this.SET_VELOCITY.X;
		} else if(this.game.D){
			this.velocity.x = this.SET_VELOCITY.X;
		}
		else{
			this.velocity.x = 0;
		}

		//Update Position
		this.x += this.velocity.x
		this.y += this.velocity.y
	}
	draw(ctx){
		ctx.fillStyle = "White";
		ctx.strokeStyle = "Red";

		ctx.strokeRect(this.x,this.y,100,100);
	}

}