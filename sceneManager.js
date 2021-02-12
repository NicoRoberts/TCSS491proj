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

		let bBoundary = new HBoundary(this.game, 0, 832, 1888); 
		//this.game.addEntsity(bBoundary);

		let tBoundary = new HBoundary(this.game, 0, 0, 1888); 
		//this.game.addEntity(tBoundary);

		let lBoundary = new VBoundary(this.game, 0, 33, 800); 
		//this.game.addEntity(lBoundary);

		let rBoundary = new VBoundary(this.game, 1858, 33, 800); 
		//this.game.addEntity(rBoundary);
		
		this.player = new Player(this.game, 100, 700);
		this.game.player = this.player;
		//this.game.addEntity(this.player);

		this.machete = new Machete(this.game);
		this.pistol = new Pistol(this.game);
		this.shotgun = new Shotgun(this.game);
		//this.game.addEntity(this.weapon);

		this.enemy1 = new Enemy(this.player, this.game, 200, 200);

		this.enemy2 = new Enemy(this.player, this.game, PARAMS.CANVAS_WIDTH/2, PARAMS.CANVAS_HEIGHT/2);

		this.banshee1 = new Banshee(this.player, this.game, 350, 350);

		this.banshee2 = new Banshee(this.player, this.game, PARAMS.CANVAS_WIDTH/2 + 100, PARAMS.CANVAS_HEIGHT/2 + 100);
		//this.game.addEntity(this.enemy);

		//testing rock generation
		this.rocks = new Terrain(this.game, 300, 300);

		this.shard = new Shards(this.game, 1600, 500);

		this.hud = new HUD(this.game, this.player);

		// testing to see if entities can be added in any order
		this.game.addEntity(this.shard);
		this.game.addEntity(this.machete);
		this.game.addEntity(this.pistol)
		this.game.addEntity(this.shotgun);


		this.game.addEntity(this.enemy1);
		this.game.addEntity(this.enemy2);
		this.game.addEntity(this.banshee1);
		this.game.addEntity(this.banshee2);
		this.game.addEntity(this.player);
		this.game.addEntity(rBoundary);
		this.game.addEntity(lBoundary);
		this.game.addEntity(tBoundary);
		this.game.addEntity(bBoundary);	
		this.game.addEntity(this.rocks);
		this.game.addEntity(this.hud);
		this.game.addEntity(new AmmoPack(this.game, 800, 500));
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
	};
	
	draw(ctx) {
		if (PARAMS.DEBUG) {
            

            
        };
	};
};