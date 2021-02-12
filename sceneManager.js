class SceneManager {
	constructor(game){
		this.game = game;
		this.game.camera = this;

		//for camera scrolling
		this.x = 0;
		this.y = 0;	
		
		this.game.stage;

		this.player = new Player(this.game, 100, 700);
		this.machete = new Machete(this.game);
		this.pistol = new Pistol(this.game);
		this.shotgun = new Shotgun(this.game);
		this.hud = new HUD(this.game, this.player);
		
		this.loadSurvivalStage();

		
	};

	clearEntities(){
		this.game.entities = [];
	};

	loadYachtStage() {
		this.game.stage = "yacht";

		this.game.entities = [];

		// this.machete = new Machete(this.game);
		// this.pistol = new Pistol(this.game);
		// this.shotgun = new Shotgun(this.game);
		
		let bBoundary = new HBoundary(this.game, -750, 1000, 1000);
		let tBoundary = new HBoundary(this.game, -750, -250, 1000); 
		let lBoundary = new VBoundary(this.game, -750, -250, 1250); 
		let ruBoundary = new VBoundary(this.game, 250, -250, 500);
		let rlBoundary = new VBoundary(this.game, 250, 500, 500);

		this.gangway = new Gangway(this.game, 250, 250);

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
		this.game.addEntity(this.hud);

		// should we make perks buyable after each stage?
		if (!this.player.healthBoost) {
			this.game.addEntity(new HealthPerk(this.game, -400, 600));
		}
		if (!this.player.reloadBoost) {
			this.game.addEntity(new ReloadPerk(this.game, -475, 600));
		}
		if (!this.player.speedBoost) {
			this.game.addEntity(new SpeedPerk(this.game, -550, 600));
		}
		
	};

	loadSurvivalStage() {

		this.game.stage = "survival";

		this.game.entities = [];

		// this.machete = new Machete(this.game);
		// this.pistol = new Pistol(this.game);
		// this.shotgun = new Shotgun(this.game);

		this.marriyacht = new Marriyacht(this.game, -110, 350);

		let bBoundary = new HBoundary(this.game, 0, 832, 1888); 
		//this.game.addEntsity(bBoundary);

		let tBoundary = new HBoundary(this.game, 0, 0, 1888); 
		//this.game.addEntity(tBoundary);

		let lBoundary = new VBoundary(this.game, 0, 33, 800); 
		//this.game.addEntity(lBoundary);

		let rBoundary = new VBoundary(this.game, 1858, 33, 800); 
		//this.game.addEntity(rBoundary);
		

		this.enemy1 = new Enemy(this.player, this.game, 200, 200);

		this.enemy2 = new Enemy(this.player, this.game, PARAMS.CANVAS_WIDTH/2, PARAMS.CANVAS_HEIGHT/2);
		//this.game.addEntity(this.enemy);

		//testing rock generation
		this.rocks = new Terrain(this.game, 300, 300);

		this.shard = new Shards(this.game, 200, 500);

		// testing to see if entities can be added in any order
		this.game.addEntity(this.player);
		this.game.addEntity(this.shard);
		this.game.addEntity(this.machete);
		this.game.addEntity(this.pistol)
		this.game.addEntity(this.shotgun);


		this.game.addEntity(this.enemy1);
		this.game.addEntity(this.enemy2);
		//this.game.addEntity(this.player);
		this.game.addEntity(rBoundary);
		this.game.addEntity(lBoundary);
		this.game.addEntity(tBoundary);
		this.game.addEntity(bBoundary);	
		this.game.addEntity(this.rocks);
		this.game.addEntity(this.hud);
		this.game.addEntity(new AmmoPack(this.game, 800, 500));

		this.game.addEntity(this.marriyacht);
		
	};

	loadGameOver() {
		this.game.stage = "game over";
		this.game.entities = [];

		this.game.addEntity(new Gameover(this.game));
	};

	update() {
        PARAMS.DEBUG = document.getElementById("debug").checked;
		
		let xmid = PARAMS.CANVAS_WIDTH / 2 - PARAMS.TILEWIDTH / 2;
		let ymid = PARAMS.CANVAS_HEIGHT / 2 - PARAMS.TILEHEIGHT / 2;

		this.x = this.player.x - xmid;
		this.y = this.player.y - ymid;
	};
	
	draw(ctx) {
		if (PARAMS.DEBUG) {
            

            
        };
	};
};