class SceneManager {
	constructor(game){
		this.game = game;
		this.game.camera = this;

		//for camera scrolling
		this.x = 0;
		this.y = 0;	
		
		this.game.stage;
		
		this.shardSpawned = false;
		this.shardSpawnTime = 10;

		this.player = new Player(this.game, 300, 1800);
		this.machete = new Machete(this.game);
		this.pistol = new Pistol(this.game);
		this.shotgun = new Shotgun(this.game);
		this.machinegun = new Machinegun(this.game);
		this.hud = new HUD(this.game, this.player);
		this.rockCount = 100;
		this.treeCount = 100;
		
		

		
	};

	clearEntities(){
		this.game.entities = [];
	};

	loadYachtStage() {

		this.x = 0;
		this.y = 0;

		this.game.stage = "yacht";

		this.game.entities = [];
		
		let bBoundary = new HBoundary(this.game, -600, 2500 - 72, 1000);
		let tBoundary = new HBoundary(this.game, -600, 1250 - 72, 1000); 
		let lBoundary = new VBoundary(this.game, -600, 1250 - 72, 1250); 
		let ruBoundary = new VBoundary(this.game, 400, 1250 - 72, 500);
		let rlBoundary = new VBoundary(this.game, 400, 2000 - 72, 500);

		this.gangway = new Gangway(this.game, 400, 1750 - 72);

		this.game.addEntity(this.player);
		this.game.addEntity(lBoundary);
		this.game.addEntity(tBoundary);
		this.game.addEntity(bBoundary);	
		this.game.addEntity(ruBoundary);
		this.game.addEntity(rlBoundary);

		this.game.addEntity(this.gangway);
		this.game.addEntity(this.machete);
		this.game.addEntity(this.pistol)
		this.game.addEntity(this.shotgun);
		this.game.addEntity(this.machinegun);
		this.game.addEntity(this.hud);

		// should we make perks buyable after each stage?
		if (!this.player.healthBoost) {
			this.game.addEntity(new HealthPerk(this.game, -200, 2250));
		}
		if (!this.player.reloadBoost) {
			this.game.addEntity(new ReloadPerk(this.game, -300, 2250));
		}
		if (!this.player.speedBoost) {
			this.game.addEntity(new SpeedPerk(this.game, -400, 2250));
		}

		
		if (!this.shotgun.isAvailable) {
			this.game.addEntity(new DisplayShotgun(this.game, -400, 1800));
		}
		if (!this.machinegun.isAvailable) {
			this.game.addEntity(new DisplayMachinegun(this.game, -100, 1800));
		}
	};

	loadSurvivalStage() {

		this.game.camera = this;

		//for camera scrolling
		this.x = 0;
		this.y = 0;

		this.game.stage = "survival";

		this.shardSpawned = false;

		this.game.entities = [];

		this.marriyacht = new Marriyacht(this.game, 90, 1728);

		let dock = new Dock(this.game, 242, 1800);

		
		let bBoundary = new HBoundary(this.game, 0, 3600, 3593, "bottom"); 

		let tBoundary = new HBoundary(this.game, 0, -40, 3600, "top"); 
		
		let lBoundary = new VBoundary(this.game, 210, 0, 3590, "left"); 

		let rBoundary = new VBoundary(this.game, 3600, 0, 3590, "right"); 

		let gridblockSize = 49;
		this.grid = new Grid(this.game, lBoundary.x + PARAMS.TILEWIDTH + gridblockSize, 0, 67, 71, gridblockSize);
		this.grid.closeGrid(this.marriyacht.x + this.marriyacht.width + gridblockSize, this.marriyacht.y, this.marriyacht.width*2, this.marriyacht.height);
		this.game.grid = this.grid;
		this.game.addEntity(this.grid);
		

		this.enemy2 = new Skeleton(this.player, this.game, PARAMS.CANVAS_WIDTH/2, PARAMS.CANVAS_HEIGHT/2);

		this.banshee2 = new Banshee(this.player, this.game, PARAMS.CANVAS_WIDTH/2 + 100, PARAMS.CANVAS_HEIGHT/2 + 100);

		//testing rock generation 

		this.grid.update();

		

		for (var i = 0; i < this.rockCount; i++){
			let open = this.grid.getOpenGrids();
			if (open.length <= 0) {
				break;
            }
			let randomIndex = randomInt(open.length);
			let rock = new Terrain(this.game, open[randomIndex].x, open[randomIndex].y);
			open[randomIndex].addTerrain(rock);
		}
		
		//testing tree generation
		for (var j = 0; j < this.treeCount; j++){
			let open = this.grid.getOpenGrids();
			if (open.length <= 0) {
				break;
			}
			let randomIndex = randomInt(open.length);
			let tree = new Trees(this.game, open[randomIndex].x, open[randomIndex].y);
			open[randomIndex].addTerrain(tree);
		}

		// spawning coins to test shop system
		for(var k = 0; k < 50; k++){
			let open = this.grid.getNonClosedGrids();
			if (open.length <= 0) {
				break;
			}
			let randomIndex = randomInt(open.length);
			let coin = new Coin(this.game, open[randomIndex].x, open[randomIndex].y);
			open[randomIndex].addTerrain(coin);
		}
		

		// testing map generation
		this.map = new Map(this.game,0,0);
		
		// testing to see if entities can be added in any order
		this.game.addEntity(this.player);
		this.game.addEntity(this.map);
		this.game.addEntity(this.machete);
		this.game.addEntity(this.pistol)
		this.game.addEntity(this.shotgun);
		this.game.addEntity(this.machinegun);


		this.game.addEntity(this.enemy2);
		this.game.addEntity(this.banshee2);
		this.game.addEntity(rBoundary);
		this.game.addEntity(lBoundary);
		this.game.addEntity(tBoundary);
		this.game.addEntity(bBoundary);	
		
		this.game.addEntity(this.hud);

		this.game.addEntity(this.marriyacht);
		this.game.addEntity(dock);
		
		this.game.addEntity(new AmmoPack(this.game, 800, 500));	

		this.game.addEntity(new Reaper(this.game, 700, 400));
	};

	loadGameOver() {
		this.game.stage = "game over";
		this.game.entities = [];

		this.game.addEntity(new Gameover(this.game));
	};

	update() {
		PARAMS.DEBUG = document.getElementById("debug").checked;
		PARAMS.GRID = document.getElementById("grid").checked;
		
		let xmid = PARAMS.CANVAS_WIDTH / 2 - PARAMS.TILEWIDTH / 2;
		let ymid = PARAMS.CANVAS_HEIGHT / 2 - PARAMS.TILEHEIGHT / 2;

		this.x = this.player.x - xmid;
		this.y = this.player.y - ymid;

		this.spawnTimer += this.game.clockTick;

		// spawning shard
		if (this.game.ellapsedShardSpawnTime >= this.shardSpawnTime && !this.shardSpawned) {
			this.shardSpawned = true;

			let openGrids = this.game.grid.getNonClosedGrids();
			let randomGridIndex = randomInt(openGrids.length);
			let grid = openGrids[randomGridIndex];
			let shard = new Shards(this.game, grid.x, grid.y);
			if (grid !== null) {
				grid.addTerrain(shard);
				//console.log("spawned");
		   }
		}
	
	};

	
	

	
	
	draw(ctx) {
		if (PARAMS.DEBUG) {
			// ctx.fillStyle = "White";
            // ctx.fillText("TIME", 12.5 * PARAMS.BLOCKWIDTH, 1 * PARAMS.BLOCKWIDTH);
        	// ctx.fillText(this.game.clockTick, 13 * PARAMS.BLOCKWIDTH, 1.5 * PARAMS.BLOCKWIDTH);

            
        };
	};
};