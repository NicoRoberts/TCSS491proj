class Trees extends Terrain{

    constructor(game, x, y) {
        super(game, x, y);
		Object.assign(this, {game, x, y});
    
        this.width = 96;
        this.height = 48;
        this.treeState = Math.floor(Math.random()*6);
        
        this.states=[];
        this.trees=["./Sprites/TreeSheet.png","./Sprites/FireTreeSheet.png","./Sprites/SnowTreeSheet.png","./Sprites/CactusSheet.png"];

		this.positionx = this.x - this.game.camera.x;
        this.positiony = this.y - this.game.camera.y;
        this.visualRadius = 70;
        

		this.spritesheet = ASSET_MANAGER.getAsset(this.trees[this.game.Map.mapState]);

    	this.game.Terrain = this;
 
        this.circlex = this.x + (this.width / 2);
        this.circley = this.y + (this.height / 2);

        this.priority = 5;
        
        this.setupTerrainTypes();
        this.loadStates();

        this.hitbox = new HitBox(this, this.width, this.height, false);    

    }
   
    // 6 possible tree types
    setupTerrainTypes() {
		for (var i = 0; i < 6; i++) {
			this.states.push([]);
		}
    }
    
    loadStates() {

		this.states[0]
            = new Animator(this.spritesheet, 1, 1, this.width, this.height*4, 1, 1, 1, false, true);
        this.states[1]
            = new Animator(this.spritesheet, 102, 1, this.width, this.height*4, 1, 1, 1, false, true);
        this.states[2]
            = new Animator(this.spritesheet, 1, 196, this.width, this.height*4, 1, 1, 1, false, true);
        this.states[3]
            = new Animator(this.spritesheet, 102, 392, this.width, this.height*4, 1, 1, 1, false, true);
        this.states[4]
            = new Animator(this.spritesheet, 1, 392, this.width, this.height*4, 1, 1, 1, false, true);
        this.states[5]
            = new Animator(this.spritesheet, 102, 196, this.width, this.height*4, 1, 1, 1, false, true);
		
    }
    
    update() {

        this.positionx = this.x - this.game.camera.x;
        this.positiony = this.y - this.game.camera.y;
        
        this.circlex = this.x + (this.width / 2);
        this.circley = this.y + (this.height / 2);
        this.hitbox.update();
	
    }
    
    draw(ctx) {
		if (PARAMS.DEBUG) {

            this.hitbox.draw(ctx);
            
            ctx.beginPath();
            ctx.strokeStyle = 'Red';
			ctx.arc(this.circlex - this.game.camera.x, this.circley - this.game.camera.y, this.visualRadius, 0, Math.PI * 2, false);
			
            ctx.stroke();
			ctx.closePath();
            
        }
        this.states[this.treeState].drawFrame(this.game.clockTick, ctx, this.positionx, this.positiony - this.height*3, 1);
        
        //ctx.drawImage(this.spritesheet,this.positionx,this.positiony,this.width,this.height,0,0,this.width,this.height)
	};

}