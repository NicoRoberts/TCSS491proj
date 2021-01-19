var gameEngine = new GameEngine();

var ASSET_MANAGER = new AssetManager();
ASSET_MANAGER.queueDownload("./Sprites/PlayerSheet.png");
ASSET_MANAGER.queueDownload("./Sprites/Pistol.png");

// Black #3 Download Assets
ASSET_MANAGER.queueDownload("./images/tile.png");


ASSET_MANAGER.downloadAll(function () {

	PARAMS.PIXELSCALER = 3;

	PARAMS.TILEWIDTH = PARAMS.BITWIDTH * PARAMS.SCALE * 2; //* 2 becuase tile is 32x32 which is double the Bitwidth
	PARAMS.TILEHEIGHT = PARAMS.BITWIDTH * PARAMS.SCALE * 2; 

	PARAMS.PLAYERWIDTH = 100; //This should be updated later
	PARAMS.PLAYERHEIGHT = 100; //This should be updated later

	PARAMS.ENEMYWIDTH = 50; //This should be updated later
	PARAMS.ENEMYHEIGHT = 50; //This should be updated later

	var canvas = document.getElementById('gameWorld');
	var ctx = canvas.getContext('2d');

	gameEngine.init(ctx);

	gameEngine.addEntity(new SceneManager(gameEngine));

	gameEngine.start();
});
