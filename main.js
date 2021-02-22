var gameEngine = new GameEngine();

var ASSET_MANAGER = new AssetManager();
ASSET_MANAGER.queueDownload("./Maps/Boat.png");
ASSET_MANAGER.queueDownload("./Maps/CastToTheShadowsMapBIG.png");
ASSET_MANAGER.queueDownload("./Maps/YachtMap.png")
ASSET_MANAGER.queueDownload("./Sprites/PlayerSheet.png");
ASSET_MANAGER.queueDownload("./Sprites/Hand_Pistol2.png");
ASSET_MANAGER.queueDownload("./Sprites/Machete.png");
ASSET_MANAGER.queueDownload("./Sprites/Slice.png");
ASSET_MANAGER.queueDownload("./Sprites/Shotgun.png");
ASSET_MANAGER.queueDownload("./Sprites/MachineGun.png");
ASSET_MANAGER.queueDownload("./Sprites/Bullet.png");
ASSET_MANAGER.queueDownload("./Sprites/ChargeSheet.png");
ASSET_MANAGER.queueDownload("./Sprites/SkeletonSheet.png");
ASSET_MANAGER.queueDownload("./Sprites/Banshee.png");
ASSET_MANAGER.queueDownload("./Sprites/ReaperSheet.png");
ASSET_MANAGER.queueDownload("./Sprites/RockSheet.png");
ASSET_MANAGER.queueDownload("./Sprites/TreeSheet.png");
ASSET_MANAGER.queueDownload("./Sprites/Hearts.png");
ASSET_MANAGER.queueDownload("./Sprites/Shard.png");
ASSET_MANAGER.queueDownload("./Sprites/AmmoSprite.png");
ASSET_MANAGER.queueDownload("./Sprites/Boosts/HealthBoostSprite.png");
ASSET_MANAGER.queueDownload("./Sprites/Boosts/ReloadBoostSprite.png");
ASSET_MANAGER.queueDownload("./Sprites/Boosts/SpeedBoostSprite.png");
ASSET_MANAGER.queueDownload("./Sprites/YachtSprite.png");
ASSET_MANAGER.queueDownload("./Sprites/GameOverSprite.png");
ASSET_MANAGER.queueDownload("./Sprites/CoinSprite.png");
ASSET_MANAGER.queueDownload("./Sprites/HealthSprite.png");
ASSET_MANAGER.queueDownload("./Sprites/WeaponsNoArm/Machete.png");
ASSET_MANAGER.queueDownload("./Sprites/WeaponsNoArm/Machinegun.png");
ASSET_MANAGER.queueDownload("./Sprites/WeaponsNoArm/Pistol.png");
ASSET_MANAGER.queueDownload("./Sprites/WeaponsNoArm/Shotgun.png");
ASSET_MANAGER.queueDownload("./Sprites/Dock.png");

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

	PARAMS.RIGHTWALL = 1858;
	PARAMS.LEFTWALL = PARAMS.TILEWIDTH;
	PARAMS.TOPWALL = PARAMS.TILEHEIGHT;
	PARAMS.BOTTOMWALL = 832;






	gameEngine.init(ctx);

	this.scene = new SceneManager(gameEngine);
	gameEngine.addEntity(scene);
	this.scene.loadArrival();
	gameEngine.start();
});
