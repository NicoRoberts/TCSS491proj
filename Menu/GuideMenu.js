class GuideMenu {

    TITLE_POS = { X: 750, Y: 150 };
    ENEMIES_POS = { X: 175, Y: 300 };
    PERKS_POS = { X: 750, Y: 300 };
    GAME_POS = { X: 1205, Y: 300 };
    BACK_POS = { X: 10, Y: 65 };
    constructor(game) {
        Object.assign(this, {game});

        this.selected;
        this.priority = 1;

        // enemy sprites and animations
        this.skeletonSprite = ASSET_MANAGER.getAsset("./Sprites/SkeletonSheet.png");
        this.skeleton = new Animator(this.skeletonSprite, 94, 0, 94, 106, 4, 0.25, 0, false, true);
        this.bansheeSprite = ASSET_MANAGER.getAsset("./Sprites/Banshee.png");
        this.banshee = new Animator(this.bansheeSprite, 384, 0, 96, 96, 4, 0.15, 0, true, true);
        this.reaperSprite = ASSET_MANAGER.getAsset("./Sprites/ReaperSheet.png");
        this.reaper = new Animator(this.reaperSprite, 1, 197, 63, 96, 4, 0.15, 2, false, true);
        this.lichKingSprite = ASSET_MANAGER.getAsset("./Sprites/LichKingUnknown.png");
        this.lichKing = new Animator(this.lichKingSprite, 0, 0, 176, 196, 1, 1, 0, false, true);

        // perk sprites and animtions
        this.perkWidth = 34;
        this.perkHeight = 34;
        this.healthPerkSprite = ASSET_MANAGER.getAsset("./Sprites/Boosts/HealthBoostSprite.png");
        this.healthPerk = new Animator(this.healthPerkSprite, 0, 0, this.perkWidth, this.perkHeight, 4, 0.25, 0, false, true);
        this.reloadPerkSprite = ASSET_MANAGER.getAsset("./Sprites/Boosts/ReloadBoostSprite.png");
        this.reloadPerk = new Animator(this.reloadPerkSprite, 0, 0, this.perkWidth, this.perkHeight, 4, 0.25, 0, false, true);
        this.speedPerkSprite = ASSET_MANAGER.getAsset("./Sprites/Boosts/SpeedBoostSprite.png");
        this.speedPerk = new Animator(this.speedPerkSprite, 0, 0, this.perkWidth, this.perkHeight, 4, 0.25, 0, false, true);

        // gameplay sprites (drops, shard, marriyacht)
        this.dropWidth = 28;
        this.dropHeight = 32;
        this.shardSprite = ASSET_MANAGER.getAsset("./Sprites/Shard.png");
        this.shard = new Animator(this.shardSprite, 0, 0, 18, 18, 6, 0.2, 0, false, true);
        this.coinSprite = ASSET_MANAGER.getAsset("./Sprites/CoinSprite.png");
        this.coin = new Animator(this.coinSprite, 1, 1, this.dropWidth, this.dropHeight, 8, 0.1, 2, false, true);
        this.healthPackSprite = ASSET_MANAGER.getAsset("./Sprites/HealthSprite.png");
        this.healthPack = new Animator(this.healthPackSprite, 1, 1, this.dropWidth, this.dropHeight, 8, 0.1, 2, false, true);
        this.ammoPackSprite = ASSET_MANAGER.getAsset("./Sprites/AmmoSprite.png");
        this.ammoPack = new Animator(this.ammoPackSprite, 1, 1, this.dropWidth, this.dropHeight, 8, 0.1, 2, false, true);
        this.marriyachtSprite = ASSET_MANAGER.getAsset("./Sprites/YachtSprite.png");
        this.marriyacht = new Animator(this.marriyachtSprite, 0, 288, 152, 288, 4, 0.25, 0, false, true);
    };

    update() {

        if (this.game.mouse != null) {
            
            if ((this.game.mouse.x >= 175 && this.game.mouse.x <= 590) && (this.game.mouse.y >= 215 && this.game.mouse.y <= 300)
            && (this.game.click)) {
                this.selected = "Enemies";
            }
            else if ((this.game.mouse.x >= 750 && this.game.mouse.x <= 1045) && (this.game.mouse.y >= 215 && this.game.mouse.y <= 300)
            && (this.game.click)) {
                this.selected = "Perks";
            }
            else if ((this.game.mouse.x >= 1205 && this.game.mouse.x <= 1680) && (this.game.mouse.y >= 215 && this.game.mouse.y <= 300)
            && (this.game.click)) {
                this.selected = "Gameplay";
            }
            else if ((this.game.mouse.x >= 10 && this.game.mouse.x <= 225) && (this.game.mouse.y >= 20 && this.game.mouse.y <= 65)
            && (this.game.click)) {
                this.game.camera.loadStartMenu();
            }
        }
    };

    draw(ctx) {

        ctx.fillStyle = rgb(20, 20, 20);
        ctx.fillRect(0, 0, PARAMS.CANVAS_WIDTH, PARAMS.CANVAS_HEIGHT);

        ctx.fillStyle = "darkslategray";
        var fontsize = 150;
        ctx.font = fontsize + 'px "VT323"';

        ctx.fillText("GUIDE", this.TITLE_POS.X, this.TITLE_POS.Y);

        if (this.game.mouse != null) {
            this.drawEnemies(ctx);
            this.drawPerks(ctx);
            this.drawGameplay(ctx);

            this.drawGoBack(ctx);
        }

    };

    drawEnemies(ctx) {
        var fontsize = 150;
        ctx.font = fontsize + 'px "VT323"';
        if (this.selected == "Enemies") {
            ctx.fillStyle = "White";
            ctx.fillText("Enemies", this.ENEMIES_POS.X, this.ENEMIES_POS.Y);
            this.expandEnemies(ctx);
        }
        else if ((this.game.mouse.x >= 175 && this.game.mouse.x <= 590) && (this.game.mouse.y >= 215 && this.game.mouse.y <= 300)) {
            ctx.fillStyle = "lightgray";
            ctx.fillText("Enemies", this.ENEMIES_POS.X, this.ENEMIES_POS.Y);
        }
        else {
            ctx.fillStyle = "Gray";
            ctx.fillText("Enemies", this.ENEMIES_POS.X, this.ENEMIES_POS.Y);
        }
    };

    expandEnemies(ctx) {
        
        ctx.fillStyle = "White";
        var fontsize = 50;
        ctx.font = fontsize + 'px "VT323"';

        this.skeleton.drawFrame(this.game.clockTick, this.game.ctx, 100, 400, 2.5);
        ctx.fillText("Skeletons", 150, 725, 250);
        ctx.fillText("Most Basic Enemy", 125, 800, 275);

        this.banshee.drawFrame(this.game.clockTick, this.game.ctx, 575, 400, 2.5);
        ctx.fillText("Banshees", 650, 725, 250);
        ctx.fillText("Ignores Terrain", 600, 800, 275);
        
        this.reaper.drawFrame(this.game.clockTick, this.game.ctx, 1100, 400, 2.5);
        ctx.fillText("Reapers", 1125, 725, 250);
        ctx.fillText("Shoots Energy", 1075, 800, 275);
        ctx.fillText("Orbs", 1175, 850, 100);


        this.lichKing.drawFrame(this.game.clockTick, this.game.ctx, 1437.5, 300, 2);
        ctx.fillStyle = "maroon";
        fontsize = 300;
        ctx.font = fontsize + 'px "VT323"';
        ctx.fillText("?", 1575, 610);
        fontsize = 50;
        ctx.font = fontsize + 'px "VT323"';
        ctx.fillText("Hidden Enemy", 1525, 725, 250);
        ctx.fillText("Survive to Round 5", 1500, 800, 300);
        ctx.fillText("to Encounter", 1537.5, 850, 275);
    };

    drawPerks(ctx) {
        var fontsize = 150;
        ctx.font = fontsize + 'px "VT323"';
        if (this.selected == "Perks") {
            ctx.fillStyle = "White";
            ctx.fillText("Perks", this.PERKS_POS.X, this.PERKS_POS.Y);
            this.expandPerks(ctx);
        }
        else if ((this.game.mouse.x >= 750 && this.game.mouse.x <= 1045) && (this.game.mouse.y >= 215 && this.game.mouse.y <= 300)) {
            ctx.fillStyle = "lightgray";
            ctx.fillText("Perks", this.PERKS_POS.X, this.PERKS_POS.Y);
        }
        else {
            ctx.fillStyle = "Gray";
            ctx.fillText("Perks", this.PERKS_POS.X, this.PERKS_POS.Y);
        }
    };

    expandPerks(ctx) {

        ctx.fillStyle = "White";
        var fontsize = 50;
        ctx.font = fontsize + 'px "VT323"';

        this.healthPerk.drawFrame(this.game.clockTick, this.game.ctx, 200, 400, 5);
        ctx.fillText("Health Perk", 175, 650, 250);
        ctx.fillText("Boosts Player Health", 155, 725, 275);
        ctx.fillText("Can Be Upgraded Twice", 145, 775, 300);

        this.reloadPerk.drawFrame(this.game.clockTick, this.game.ctx, 600, 400, 5);
        ctx.fillText("Reload Perk", 585, 650, 250);
        ctx.fillText("Boosts Reload Speed", 565, 725, 275);
        ctx.fillText("Can Be Upgraded Twice", 555, 775, 300);

        this.speedPerk.drawFrame(this.game.clockTick, this.game.ctx, 1000, 400, 5);
        ctx.fillText("Speed Perk", 990, 650, 250);
        ctx.fillText("Boosts Movement Speed", 960, 725, 275);
        ctx.fillText("Can Be Upgraded Twice", 950, 775, 300);
        
        ctx.fillStyle = "lightslategray";
        fontsize = 300;
        ctx.font = fontsize + 'px "VT323"';
        ctx.fillText("?", 1450, 575);
        fontsize = 50;
        ctx.font = fontsize + 'px "VT323"';
        ctx.fillText("Secret Perk", 1420, 650, 250);
        ctx.fillText("Upgrade Each Perk to", 1400, 725, 275);
        ctx.fillText("Max Level to Unlock the", 1390, 775, 300);
        ctx.fillText("Secret Perk", 1425, 825, 325);
    };

    drawGameplay(ctx) {
        var fontsize = 150;
        ctx.font = fontsize + 'px "VT323"';
        if (this.selected == "Gameplay") {
            ctx.fillStyle = "White";
            ctx.fillText("Gameplay", this.GAME_POS.X, this.GAME_POS.Y);
            this.expandGameplay(ctx);
        }
        else if ((this.game.mouse.x >= 1205 && this.game.mouse.x <= 1680) && (this.game.mouse.y >= 215 && this.game.mouse.y <= 300)) {
            ctx.fillStyle = "lightgray";
            ctx.fillText("Gameplay", this.GAME_POS.X, this.GAME_POS.Y);
        }
        else {
            ctx.fillStyle = "Gray";
            ctx.fillText("Gameplay", this.GAME_POS.X, this.GAME_POS.Y);
        }
    };

    expandGameplay(ctx) {

        ctx.fillStyle = "White";
        var fontsize = 25;
        ctx.font = fontsize + 'px "VT323"';

        this.coin.drawFrame(this.game.clockTick, this.game.ctx, 150, 450, 2);
        ctx.fillText("Coin", 155, 440, 75);

        this.ammoPack.drawFrame(this.game.clockTick, this.game.ctx, 250, 525, 2);
        ctx.fillText("Ammo Pack", 240, 620, 75);

        this.healthPack.drawFrame(this.game.clockTick, this.game.ctx, 350, 450, 2);
        ctx.fillText("Health Pack", 340, 440, 75);

        this.shard.drawFrame(this.game.clockTick, this.game.ctx, 850, 475, 5);

        this.marriyacht.drawFrame(this.game.clockTick, this.game.ctx, 1500, 400, .75);


        fontsize = 100;
        ctx.font = fontsize + 'px "VT323"';
        ctx.fillText("Enemies have Chance to Drop", 75, 700, 450);

        ctx.fillText("Shard", 800, 700, 450);

        ctx.fillText("Marri-Yacht", 1350, 700, 450);
        

        fontsize = 50;
        ctx.font = fontsize + 'px "VT323"';
        ctx.fillText("Collect Coins to Buy/Upgrade Perks and Weapons", 50, 750, 500);
        ctx.fillText("Collect Health Packs to Replenish Health", 50, 800, 500);
        ctx.fillText("Collect Ammo Packs to Refill Ammo", 50, 850, 500);

        ctx.fillText("Shards Spawn After A Certain Amount of Time,", 675, 750, 500);
        ctx.fillText("Collect the Shard of Each Level To Progress", 675, 800, 500);
        ctx.fillText("Marri-Yacht Accessible After Shard Obtained", 675, 850, 500);

        ctx.fillText("Board the Marri-Yacht to Cruise onto Next Level", 1325, 750, 500);
        ctx.fillText("Weapons and Perks are Located on Deck", 1325, 800, 500);
        ctx.fillText("Make It Past Level 5 to Win", 1325, 850, 500);

    };

    drawGoBack(ctx) {

        var fontsize = 75;
        ctx.font = fontsize + 'px "VT323"';
        if ((this.game.mouse.x >= 10 && this.game.mouse.x <= 225) && (this.game.mouse.y >= 20 && this.game.mouse.y <= 65)) {
            ctx.fillStyle = "White";
            ctx.fillText("Go Back", this.BACK_POS.X, this.BACK_POS.Y);
        }
        else {
            ctx.fillStyle = "Gray";
            ctx.fillText("Go Back", this.BACK_POS.X, this.BACK_POS.Y);
        }
    };
}