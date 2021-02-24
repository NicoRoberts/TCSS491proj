class SceneManager {
	constructor(game){
		this.game = game;
		this.game.camera = this;

		//for camera scrolling
		this.x = 0;
		this.y = 0;	
		
		this.game.stage;
		
		this.shardSpawned = false;
		this.shardSpawnTime = 0; // how long before shard spawns

		this.player = new Player(this.game, 243, 1800);
		this.machete = new Machete(this.game);
		this.pistol = new Pistol(this.game);
		this.shotgun = new Shotgun(this.game);
		this.machinegun = new Machinegun(this.game);
		this.hud = new HUD(this.game, this.player);
		this.rockCount = 100;
		this.treeCount = 100;
		
		this.healthPerk = new HealthPerk(this.game, -235, 2250);
		this.reloadPerk = new ReloadPerk(this.game, -330, 2250);
		this.speedPerk = new SpeedPerk(this.game, -425, 2250);
	
	};

	clearEntities(){
		this.game.entities = [];
	};

	loadYachtStage() {

		this.x = 0;
		this.y = 0;

		this.game.stage = "yacht";

		this.game.removeAll();
		this.game.entities = [];
		
		let bBoundary = new HBoundary(this.game, -600, 2550 - 72, 1000);
		let tBoundary = new HBoundary(this.game, -600, 1150 - 72, 1000); 
		let lBoundary = new VBoundary(this.game, -600, 1150 - 72, 1400); 
		let ruBoundary = new VBoundary(this.game, 400, 1150 - 72, 600);
		let rlBoundary = new VBoundary(this.game, 400, 2000 - 72, 550);

		this.timeInYacht = 0; 
		this.gangwaySpawned = false;

		this.game.addEntity(new YachtMap(this.game, -575, 1065));

		this.player.hpCurrent = this.player.hpMax;

		this.game.addEntity(this.player);
		this.game.addEntity(lBoundary);
		this.game.addEntity(tBoundary);
		this.game.addEntity(bBoundary);	
		this.game.addEntity(ruBoundary);
		this.game.addEntity(rlBoundary);

		this.game.addEntity(this.machete);
		this.game.addEntity(this.pistol)
		this.game.addEntity(this.shotgun);
		this.game.addEntity(this.machinegun);
		this.game.addEntity(this.hud);

		// each perk can only be bought up to level 3
		if (this.player.healthBoostLevel < 3) {
			this.game.addEntity(this.healthPerk);
		}
		if (this.player.reloadBoostLevel < 3) {
			this.game.addEntity(this.reloadPerk);
		}
		if (this.player.speedBoostLevel < 3) {
			this.game.addEntity(this.speedPerk);
		}

		
		if (!this.shotgun.isAvailable) {
			this.game.addEntity(new DisplayShotgun(this.game, -325, 1600));
		}
		if (!this.machinegun.isAvailable) {
			this.game.addEntity(new DisplayMachinegun(this.game, -325, 1880));
		}
		this.update();
	};
	loadArrival() {
		this.x = 0;
		this.y = 0;
		this.game.stage = "arrival";
		this.game.entities = [];

		this.marriyacht = new Marriyacht(this.game, 91, -300);
		this.game.addEntity(this.marriyacht);

		//increase enemies per level
		this.game.enemiesCount = 0;
		this.game.maxEnemies += 50;
		this.game.spawnRate = 5;
		// if (this.game.spawnRate > 3) {
		// 	var adjustmentPercentage = (0.2 / 10) * this.game.spawnRate //increase by numerator % per denominator in seconds
        //     this.spawnRate = this.spawnRate - (this.spawnRate * adjustmentPercentage);
		// 	this.game.spawnRate = 
		// }

		let dock = new Dock(this.game, 242, 1800);


		let bBoundary = new HBoundary(this.game, 0, 3600, 3593, "bottom");

		let tBoundary = new HBoundary(this.game, 0, -40, 3600, "top");

		let lBoundary = new VBoundary(this.game, 210, 0, 3590, "left");

		let rBoundary = new VBoundary(this.game, 3600, 0, 3590, "right"); 

		let gridblockSize = 49;
		this.grid = new Grid(this.game, lBoundary.x + PARAMS.TILEWIDTH + gridblockSize * 2, gridblockSize, 64, 70, gridblockSize);
		this.grid.closeGrid(this.marriyacht.x + this.marriyacht.width + gridblockSize*2, this.marriyacht.destinationy, this.marriyacht.width * 2, this.marriyacht.height);
		this.game.grid = this.grid;
		this.game.addEntity(this.grid);

		this.grid.update();



		for (var i = 0; i < this.rockCount; i++) {
			let open = this.grid.getOpenGrids();
			if (open.length <= 0) {
				break;
			}
			let randomIndex = randomInt(open.length);
			let rock = new Terrain(this.game, open[randomIndex].x, open[randomIndex].y);
			open[randomIndex].addTerrain(rock);
		}

		//testing tree generation
		for (var j = 0; j < this.treeCount; j++) {
			let open = this.grid.getOpenGrids();
			if (open.length <= 0) {
				break;
			}
			let randomIndex = randomInt(open.length);
			let tree = new Trees(this.game, open[randomIndex].x, open[randomIndex].y);
			open[randomIndex].addTerrain(tree);
		}

		this.map = new Map(this.game, -1350, -1645);

		this.game.addEntity(this.map);
		this.game.addEntity(rBoundary);
		this.game.addEntity(lBoundary);
		this.game.addEntity(tBoundary);
		this.game.addEntity(bBoundary);
		this.game.addEntity(dock);
		this.update();
	}
	loadDeparture() {
		this.x = 0;
		this.y = 0;
		this.game.stage = "departure";

		this.game.removeEntity(this.player);
		this.game.removeEntity(this.machete);
		this.game.removeEntity(this.pistol)
		this.game.removeEntity(this.shotgun);
		this.game.removeEntity(this.machinegun);
		this.game.removeEntity(this.hud);
		this.update();

    }
	loadSurvivalStage() {

		this.game.camera = this;

		//for camera scrolling
		this.x = 0;
		this.y = 0;

		this.game.stage = "survival";

		this.shardSpawned = false;
		

		//spawning coins to test shop system
		// for(var k = 0; k < 50; k++){
		// 	let open = this.grid.getNonClosedGrids();
		// 	if (open.length <= 0) {
		// 		break;
		// 	}
		// 	let randomIndex = randomInt(open.length);
		// 	let coin = new Coin(this.game, open[randomIndex].x, open[randomIndex].y);
		// 	open[randomIndex].addTerrain(coin);
		// }
		
		// testing to see if entities can be added in any order
		this.game.addEntity(this.player);
		this.game.addEntity(this.machete);
		this.game.addEntity(this.pistol)
		this.game.addEntity(this.shotgun);
		this.game.addEntity(this.machinegun);
		this.game.addEntity(this.hud);
		
		//this.game.addEntity(new AmmoPack(this.game, 800, 500));	

		//this.game.addEntity(new Reaper(this.game, 700, 400));
		this.update();
	};

	loadGameOver() {
		this.game.stage = "game over";
		this.game.entities = [];

		this.game.addEntity(new Gameover(this.game));
		this.update();
	};

	loadStartMenu() {
		this.game.stage = "start menu";
		this.game.entities = [];

		// resets the entities to their initial values/states
		this.player = new Player(this.game, 243, 1800);
		this.shotgun = new Shotgun(this.game);
		this.machinegun = new Machinegun(this.game);
		this.hud = new HUD(this.game, this.player);
		this.healthPerk = new HealthPerk(this.game, -235, 2250);
		this.reloadPerk = new ReloadPerk(this.game, -330, 2250);
		this.speedPerk = new SpeedPerk(this.game, -425, 2250);

		this.game.addEntity(new StartMenu(this.game));
		this.update();
	}

	update() {
		PARAMS.DEBUG = document.getElementById("debug").checked;
		PARAMS.GRID = document.getElementById("grid").checked;
		
		let xmid = PARAMS.CANVAS_WIDTH / 2 - PARAMS.TILEWIDTH / 2;
		let ymid = PARAMS.CANVAS_HEIGHT / 2 - PARAMS.TILEHEIGHT / 2;

		if (this.game.stage == "arrival" || this.game.stage == "departure") {
			this.x = this.marriyacht.x - xmid + this.game.player.width * PARAMS.PIXELSCALER;
			this.y = this.marriyacht.y - ymid + this.game.player.height * PARAMS.PIXELSCALER;
			if (this.marriyacht.y < ymid - this.game.player.height * PARAMS.PIXELSCALER&& this.game.stage == "arrival") {
				this.y = 0;
			}
			if (this.marriyacht.y > 3593 - PARAMS.CANVAS_HEIGHT / 2 - PARAMS.TILEHEIGHT/2 - this.game.player.height * PARAMS.PIXELSCALER && this.game.stage == "departure") {
				this.y = 3593 - PARAMS.CANVAS_HEIGHT;
			}

		}
		else {
			this.x = this.player.x - xmid;
			this.y = this.player.y - ymid;
		}

		
		this.spawnTimer += this.game.clockTick;

		if (this.game.stage == "survival") {
			// spawning shard
			if (this.game.timeInSurvival >= this.shardSpawnTime && !this.shardSpawned) {
				this.shardSpawned = true;

				let openGrids = this.game.grid.getSpawnableGrids();
				let randomGridIndex = randomInt(openGrids.length);
				//let grid = openGrids[randomGridIndex];
				let grid = this.game.grid.gridAtIndex(5,37);
				let shard = new Shards(this.game, grid.x, grid.y);
				if (grid !== null) {
					grid.addTerrain(shard);
					//console.log("spawned");
				}
			}
		}

		

		// spawn gangway .2 seconds after loading yacht level so that player does not get forced into next stage
		if (this.game.stage == "yacht") {
			this.timeInYacht += this.game.clockTick;
			if (this.timeInYacht > .2 && !this.gangwaySpawned) {
				this.gangwaySpawned = true;
				this.game.addEntity(new Gangway(this.game, 400, 1750 - 72));
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