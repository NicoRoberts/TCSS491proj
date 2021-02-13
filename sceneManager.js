class SceneManager {
	constructor(game){
		this.game = game;
		this.game.camera = this;

		//for camera scrolling
		this.x = 0;
		this.y = 0;
		
		
		
		this.loadLevel();

		
	};

	clearEntities(){
		this.game.entities = [];
	};

	loadLevel() {

		

		let bBoundary = new HBoundary(this.game, 0, 3600, 3593, "bottom"); 
		//this.game.addEntsity(bBoundary);

		let tBoundary = new HBoundary(this.game, 0, -40, 3600, "top"); 
		
		//this.game.addEntity(tBoundary);

		let lBoundary = new VBoundary(this.game, 210, 0, 3590, "left"); 
		//this.game.addEntity(lBoundary);

		let rBoundary = new VBoundary(this.game, 3600, 0, 3590, "right"); 
		this.game.addEntity(rBoundary);
		
		this.player = new Player(this.game, 700, 700);
		this.game.player = this.player;
		//this.game.addEntity(this.player);

		this.machete = new Machete(this.game);
		this.pistol = new Pistol(this.game);
		this.shotgun = new Shotgun(this.game);
		this.machinegun = new Machinegun(this.game);
		//this.game.addEntity(this.weapon);

		//this.enemy1 = new Enemy(this.game.player, this.game, 200, 200);

		this.enemy2 = new Skeleton(this.player, this.game, PARAMS.CANVAS_WIDTH/2, PARAMS.CANVAS_HEIGHT/2);

		//this.banshee1 = new Banshee(this.player, this.game, 350, 350);

		this.banshee2 = new Banshee(this.player, this.game, PARAMS.CANVAS_WIDTH/2 + 100, PARAMS.CANVAS_HEIGHT/2 + 100);
		//this.game.addEntity(this.enemy);

		//testing rock generation
		for(var i = 0; i < 25; i++){
			var rX = Math.random()*3200;
			var rY = Math.random()*3600;
			this.rocks = new Terrain(this.game, rX+242, rY-50);
			this.game.addEntity(this.rocks);
		}
		
		//testing tree generation
		for(var j = 0; j < 25; j++){
			var treeRX = Math.random()sd*3200;
			var treeRY = Math.random()*3600;
			this.trees = new Trees(this.game, treeRX+242, treeRY-190);
			this.game.addEntity(this.trees);
		}
		

		this.shard = new Shards(this.game, 1600, 500);

		this.hud = new HUD(this.game, this.player);

		// testing map generation
		this.map = new Map(this.game,0,0);
		
		// testing to see if entities can be added in any order
		this.game.addEntity(this.map);
		this.game.addEntity(this.shard);
		this.game.addEntity(this.machete);
		this.game.addEntity(this.pistol)
		this.game.addEntity(this.shotgun);
		this.game.addEntity(this.machinegun);


		this.game.addEntity(this.enemy2);
		this.game.addEntity(this.banshee2);
		//this.game.addEntity(this.banshee1);
		//this.game.addEntity(this.banshee2);
		this.game.addEntity(this.player);
		this.game.addEntity(rBoundary);
		this.game.addEntity(lBoundary);
		this.game.addEntity(tBoundary);
		this.game.addEntity(bBoundary);	
		
		this.game.addEntity(this.hud);
		this.game.addEntity(new AmmoPack(this.game, 800, 500));	

		this.game.addEntity(new Reaper(this.game, 700, 400));
	};

	// loadGameOver() {
	//	
	// };

	update() {
        PARAMS.DEBUG = document.getElementById("debug").checked;
		
		let xmid = PARAMS.CANVAS_WIDTH / 2 - PARAMS.TILEWIDTH / 2;
		let ymid = PARAMS.CANVAS_HEIGHT / 2 - PARAMS.TILEHEIGHT / 2;

		this.x = this.player.x - xmid;
		this.y = this.player.y - ymid;

		this.spawnTimer += this.game.clockTick;

	
	};

	
	

	
	
	draw(ctx) {
		if (PARAMS.DEBUG) {
			// ctx.fillStyle = "White";
            // ctx.fillText("TIME", 12.5 * PARAMS.BLOCKWIDTH, 1 * PARAMS.BLOCKWIDTH);
        	// ctx.fillText(this.game.clockTick, 13 * PARAMS.BLOCKWIDTH, 1.5 * PARAMS.BLOCKWIDTH);

            
        };
	};
};