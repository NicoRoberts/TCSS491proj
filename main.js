var gameEngine = new GameEngine();

var ASSET_MANAGER = new AssetManager();
ASSET_MANAGER.queueDownload("./Sprites/PlayerSheet.png");
ASSET_MANAGER.queueDownload("./Sprites/Hand_Pistol.png");

// Black #3 Download Assets
ASSET_MANAGER.queueDownload("./images/tile.png");


ASSET_MANAGER.downloadAll(function () {

	//Constants
	PARAMS.PIXELSCALER = 3;

	PARAMS.TILEWIDTH = PARAMS.BITWIDTH * PARAMS.SCALE * 2; //* 2 because tile is 32x32 which is double the Bitwidth
	PARAMS.TILEHEIGHT = PARAMS.BITWIDTH * PARAMS.SCALE * 2; 

	PARAMS.PLAYERWIDTH = 100; 
	PARAMS.PLAYERHEIGHT = 100; 

	PARAMS.ENEMYWIDTH = 50;
	PARAMS.ENEMYHEIGHT = 50;

	var canvas = document.getElementById('gameWorld');
	var ctx = canvas.getContext('2d');

	PARAMS.CANVAS_WIDTH = canvas.width;
	PARAMS.CANVAS_HEIGHT = canvas.height; 






	gameEngine.init(ctx);

	gameEngine.addEntity(new SceneManager(gameEngine));

	gameEngine.start();
});
