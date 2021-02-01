var gameEngine = new GameEngine();

var ASSET_MANAGER = new AssetManager();
ASSET_MANAGER.queueDownload("./Sprites/PlayerSheet.png");
ASSET_MANAGER.queueDownload("./Sprites/Hand_Pistol.png");
ASSET_MANAGER.queueDownload("./Sprites/Bullet.png");
ASSET_MANAGER.queueDownload("./Sprites/SkeletonSheet.png");
ASSET_MANAGER.queueDownload("./Sprites/RockSheet.png");

// Black #3 Download Assets
ASSET_MANAGER.queueDownload("./images/tile.png");



ASSET_MANAGER.downloadAll(function () {

	//Constants

	PARAMS.TILEWIDTH = PARAMS.BITWIDTH * PARAMS.SCALE * 2; //* 2 because tile is 32x32 which is double the Bitwidth
	PARAMS.TILEHEIGHT = PARAMS.BITWIDTH * PARAMS.SCALE * 2; 

	PARAMS.PLAYERWIDTH = 100; 
	PARAMS.PLAYERHEIGHT = 100; 

	PARAMS.ENEMYWIDTH = 50;
	PARAMS.ENEMYHEIGHT = 50;

	var canvas = document.getElementById('gameWorld');
	var ctx = canvas.getContext('2d');
	ctx.imageSmoothingEnabled = false;

	PARAMS.CANVAS_WIDTH = canvas.width;
	PARAMS.CANVAS_HEIGHT = canvas.height; 






	gameEngine.init(ctx);

	this.scene = new SceneManager(gameEngine);
	gameEngine.addEntity(scene);

	gameEngine.start();
});
