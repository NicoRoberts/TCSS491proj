class Map{

    constructor(game,x,y){
		Object.assign(this, {game, x, y});
    
    	this.width = 6684;
        this.height = 6360;
        this.mapState = 0
        
        this.states=[];

		this.positionx = this.x - this.game.camera.x;
        this.positiony = this.y - this.game.camera.y;
        
        this.spritesheet = ASSET_MANAGER.getAsset("./Maps/CastToTheShadowsMapBIG.png");
        

    	this.game.Map= this;

        this.priority = 0;
        
        this.setupMapType();
        this.loadStates();

    }
   
    // 6 possible Maps
    setupMapType() {
	//	for (var i = 0; i < 6; i++) {
			this.states.push([0]);
		//}
    }
    
    loadStates() {

		
		this.states[0] = new Animator(this.spritesheet, 0, 0, this.width, this.height, 1, 1, 1, false, true);
		
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
        this.states[0].drawFrame(this.game.clockTick, ctx, this.positionx, this.positiony, 1);
        
        //ctx.drawImage(this.spritesheet,this.positionx,this.positiony,this.width,this.height,0,0,this.width,this.height)
	};

}