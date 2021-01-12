class SceneManager {
	constructor(game){
		this.game = game;
		this.game.camera = this;
		this.loadLevel();
	}

	clearEntities(){
		this.game.entities = [];
	}

	loadLevel(){
		this.player = new Player(this.game,50,50);
		this.game.addEntity(this.player);
	}
}