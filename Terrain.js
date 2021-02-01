class Terrain{

    constructor(game,x,y){
		Object.assign(this, {game, x, y});
    
    	this.width = 48;
    	this.height = 48;

		this.positionx = 0;
		this.positiony = 0;

		this.spritesheet = ASSET_MANAGER.getAsset("./Sprites/RockSheet.png");

    	this.game.Terrain = this;
	
		this.priority = 2;

    }
   

    
    update() {}
    
    draw(ctx) {
		if (PARAMS.DEBUG) {
			ctx.strokeStyle = 'Red';
			ctx.strokeRect(this.positionx, this.positiony, this.width, this.height);
			ctx.strokeStyle = 'Blue';
        }
        ctx.drawImage(this.spritesheet,0,0,this.width,this.height,0,0,this.width,this.height)
	};

}