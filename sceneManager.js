class SceneManager {
	constructor(game){
		this.game = game;
		this.game.camera = this;
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
		
		this.player = new Player(this.game, 50, 50);
		this.game.player = this.player;
		this.game.addEntity(this.player);

		this.weapon = new Weapon(this.game, "./Sprites/Hand_Pistol.png");
		this.game.addEntity(this.weapon)

		this.enemy = new Enemy(this.player, this.game, 200, 200);
		this.game.addEntity(this.enemy);

		
	};

	update() {
        PARAMS.DEBUG = document.getElementById("debug").checked;
		//console.log(PARAMS.DEBUG);
	};
	
	draw(ctx) {
		if (PARAMS.DEBUG) {
            

            
        };
	};
};