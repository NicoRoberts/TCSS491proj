class Terrain{

    constructor(game,x,y){
		Object.assign(this, {game, x, y});
    
    	this.width = 48;
        this.height = 48;
        this.rockState = Math.floor(Math.random()*6);
        
        this.states=[];

		this.positionx = 0;
		this.positiony = 0;

		this.spritesheet = ASSET_MANAGER.getAsset("./Sprites/RockSheet.png");

    	this.game.Terrain = this;
	
        this.priority = 1;
        
        this.setupTerrainTypes();
        this.loadStates();

        this.hitbox = new HitBox(this, this.width, this.height);

    }
   
    // 6 possible rock types
    setupTerrainTypes() {
		for (var i = 0; i < 6; i++) {
			this.states.push([]);
		}
    }
    
    loadStates() {

		this.states[0]
            = new Animator(this.spritesheet, 1, 1, this.width, this.height, 1, 1, 1, false, true);
        this.states[1]
            = new Animator(this.spritesheet, 51, 1, this.width, this.height, 1, 1, 1, false, true);
        this.states[2]
            = new Animator(this.spritesheet, 1, 51, this.width, this.height, 1, 1, 1, false, true);
        this.states[3]
            = new Animator(this.spritesheet, 51, 51, this.width, this.height, 1, 1, 1, false, true);
        this.states[4]
            = new Animator(this.spritesheet, 1, 101, this.width, this.height, 1, 1, 1, false, true);
        this.states[5]
            = new Animator(this.spritesheet, 51, 101, this.width, this.height, 1, 1, 1, false, true);
		
    }
    
    update() {

        this.positionx = this.x - this.game.camera.x;
		this.positiony = this.y - this.game.camera.y;
        this.hitbox.update();
	
    }
    
    draw(ctx) {
		if (PARAMS.DEBUG) {
			this.hitbox.draw(ctx);
        }
        this.states[this.rockState].drawFrame(this.game.clockTick,ctx,this.positionx,this.positiony,1);
        
        //ctx.drawImage(this.spritesheet,this.positionx,this.positiony,this.width,this.height,0,0,this.width,this.height)
	};

}