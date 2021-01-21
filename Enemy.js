class Enemy{

	SET_VELOCITY = {X:1, Y:1};

	constructor(player,game,x,y){
		Object.assign(this, {player, game, x,y});

		this.game.Enemy = this;

		this.velocity = {x:0, y:0};

		this.updateBB();

	};


	updateBB() {
		this.lastBB = this.BB;
		this.BB = new BoundingBox(this.x, this.y, 100, 100); //100 100 Should be changed later.
	};

	update() {

        //Update Position

        //Get difference from player and enemy
        var dx = this.player.x - this.x;
        var dy = this.player.y - this.y;

        if(dx > 0){
            this.x +=1;
        }
        else{
            this.x -=1
        }
        if(dy > 0){
            this.y +=1;
        }
        else{
            this.y -=1
        }
    

		//Update Velocity
        this.x += this.velocity.x
        this.y += this.velocity.y
        
    
		this.updateBB();

	};

	draw(ctx) {
		ctx.fillStyle = "Red";
		ctx.strokeStyle = "Red";

		ctx.strokeRect(this.x - this.game.camera.x,this.y - this.game.camera.y,100,100);
	};

};