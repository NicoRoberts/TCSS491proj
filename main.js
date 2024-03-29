 var gameEngine = new GameEngine();

var ASSET_MANAGER = new AssetManager();
ASSET_MANAGER.queueDownload("./Maps/Boat.png");
ASSET_MANAGER.queueDownload("./Maps/CastToTheShadowsMapBIG.png");
ASSET_MANAGER.queueDownload("./Maps/CastToTheShadowsMapBIGFire.png");
ASSET_MANAGER.queueDownload("./Maps/CastToTheShadowsMapBIGSnow.png");
ASSET_MANAGER.queueDownload("./Maps/SandMap.png");
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
ASSET_MANAGER.queueDownload("./Sprites/LichKing.png");
ASSET_MANAGER.queueDownload("./Sprites/LichKingDeath.png");
ASSET_MANAGER.queueDownload("./Sprites/Darkness.png");
ASSET_MANAGER.queueDownload("./Sprites/ReaperSheet.png");
ASSET_MANAGER.queueDownload("./Sprites/RockSheet.png");
ASSET_MANAGER.queueDownload("./Sprites/TreeSheet.png");
ASSET_MANAGER.queueDownload("./Sprites/CactusSheet.png");
ASSET_MANAGER.queueDownload("./Sprites/FireTreeSheet.png");
ASSET_MANAGER.queueDownload("./Sprites/SnowTreeSheet.png");
ASSET_MANAGER.queueDownload("./Sprites/Hearts.png");
ASSET_MANAGER.queueDownload("./Sprites/Shard.png");
ASSET_MANAGER.queueDownload("./Sprites/AmmoSprite.png");
ASSET_MANAGER.queueDownload("./Sprites/Boosts/HealthBoostSprite.png");
ASSET_MANAGER.queueDownload("./Sprites/Boosts/HealthBoostLevelSprite.png");
ASSET_MANAGER.queueDownload("./Sprites/Boosts/ReloadBoostSprite.png");
ASSET_MANAGER.queueDownload("./Sprites/Boosts/ReloadBoostLevelSprite.png");
ASSET_MANAGER.queueDownload("./Sprites/Boosts/SpeedBoostSprite.png");
ASSET_MANAGER.queueDownload("./Sprites/Boosts/SpeedBoostLevelSprite.png");
ASSET_MANAGER.queueDownload("./Sprites/Boosts/ReviveSprite.png");
ASSET_MANAGER.queueDownload("./Sprites/YachtSprite.png");
ASSET_MANAGER.queueDownload("./Sprites/GameOverSprite.png");
ASSET_MANAGER.queueDownload("./Sprites/CoinSprite.png");
ASSET_MANAGER.queueDownload("./Sprites/HealthSprite.png");
ASSET_MANAGER.queueDownload("./Sprites/WeaponsNoArm/Machete.png");
ASSET_MANAGER.queueDownload("./Sprites/WeaponsNoArm/Machinegun.png");
ASSET_MANAGER.queueDownload("./Sprites/WeaponsNoArm/Pistol.png");
ASSET_MANAGER.queueDownload("./Sprites/WeaponsNoArm/Shotgun.png");
ASSET_MANAGER.queueDownload("./Sprites/Dock.png");
ASSET_MANAGER.queueDownload("./Sprites/LichKingUnknown.png");

// Black #3 Download Assets
ASSET_MANAGER.queueDownload("./images/tile.png");

//music
ASSET_MANAGER.queueDownload("./Music/BoatMusic.wav");
ASSET_MANAGER.queueDownload("./Music/BossBattleVersion1.wav");
ASSET_MANAGER.queueDownload("./Music/DeathScreen.wav");
ASSET_MANAGER.queueDownload("./Music/MainGame.wav");
ASSET_MANAGER.queueDownload("./Music/TitleScreen.wav");
ASSET_MANAGER.queueDownload("./Music/Arrival.wav");

//Sound Effects
ASSET_MANAGER.queueDownload("./Sounds/Walking.wav");
ASSET_MANAGER.queueDownload("./Sounds/click.wav");
ASSET_MANAGER.queueDownload("./Sounds/slice.wav");
ASSET_MANAGER.queueDownload("./Sounds/flesh.wav");
ASSET_MANAGER.queueDownload("./Sounds/coin.wav");
ASSET_MANAGER.queueDownload("./Sounds/reload.wav");
ASSET_MANAGER.queueDownload("./Sounds/startreload.wav");
ASSET_MANAGER.queueDownload("./Sounds/finishreload.wav");
ASSET_MANAGER.queueDownload("./Sounds/shot.wav");
ASSET_MANAGER.queueDownload("./Sounds/shotgun_shot.wav");
ASSET_MANAGER.queueDownload("./Sounds/emptymag.wav");
ASSET_MANAGER.queueDownload("./Sounds/heal.wav");
ASSET_MANAGER.queueDownload("./Sounds/pickup.wav");
ASSET_MANAGER.queueDownload("./Sounds/boat.wav");
ASSET_MANAGER.queueDownload("./Sounds/buy.wav");
ASSET_MANAGER.queueDownload("./Sounds/energyattack.wav");
ASSET_MANAGER.queueDownload("./Sounds/summon.wav");


ASSET_MANAGER.downloadAll(function () {

	ASSET_MANAGER.autoRepeat("./Music/BoatMusic.wav");
	ASSET_MANAGER.autoRepeat("./Music/BossBattleVersion1.wav");
	ASSET_MANAGER.autoRepeat("./Music/MainGame.wav");
	ASSET_MANAGER.autoRepeat("./Music/TitleScreen.wav");
	//Constants
	var test;
	
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
	//this.scene.loadArrival();
	this.scene.loadStartMenu();
	gameEngine.start();
});
