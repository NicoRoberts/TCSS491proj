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

		let bBoundary = new BottomBoundary(this.game, 0, 832, 1888); 
		this.game.addEntity(bBoundary);

		let tBoundary = new TopBoundary(this.game, 0, 0, 1888); 
		this.game.addEntity(tBoundary);

		let lBoundary = new LeftBoundary(this.game, 0, 33, 800); 
		this.game.addEntity(lBoundary);

		let rBoundary = new RightBoundary(this.game, 1858, 33, 800); 
		this.game.addEntity(rBoundary);
		
		this.player = new Player(this.game, PARAMS.CANVAS_WIDTH/2, PARAMS.CANVAS_HEIGHT/2);
		this.game.addEntity(this.player);

		this.enemy = new Enemy(this.player, this.game, 200, 200);
		this.game.addEntity(this.enemy);

		
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