class Map{

    constructor(game,x,y){
		Object.assign(this, {game, x, y});
    
    	this.width = 6684;
        this.height = 6360;
        this.mapState = randomInt(3);
        this.maps=["./Maps/CastToTheShadowsMapBIG.png","./Maps/CastToTheShadowsMapBIGFire.png","./Maps/CastToTheShadowsMapBIGSnow.png"];
		this.positionx = this.x - this.game.camera.x;
        this.positiony = this.y - this.game.camera.y;
        
		this.spritesheet = ASSET_MANAGER.getAsset(this.maps[this.mapState]);
        this.map = new Animator(this.spritesheet, 0, 0, this.width, this.height, 1, 1, 1, false, true);
    	this.game.Map= this;

        this.priority = 0;

    }

    
    update() {

        this.positionx = this.x - this.game.camera.x;
        this.positiony = this.y - this.game.camera.y;
    }
    
    draw(ctx) {
		if (PARAMS.DEBUG) {

            ctx.beginPath();
            ctx.strokeStyle = 'Red';
			ctx.arc(this.circlex - this.game.camera.x, this.circley - this.game.camera.y, this.visualRadius, 0, Math.PI * 2, false);
			
            ctx.stroke();
			ctx.closePath();
            
        }
        this.map.drawFrame(this.game.clockTick,ctx,this.positionx,this.positiony,1);
        
        //ctx.drawImage(this.spritesheet,this.positionx,this.positiony,this.width,this.height,0,0,this.width,this.height)
	};

}