class HUD {

    HEART_POS = { X: 2.5, Y: 785 }
    PERK_POS = { X: 2.5, Y: 735 }
    AMMO_POS = { X: -145, Y:785}
    constructor(game, player, timer, shardSpawned) {
        Object.assign(this, {game, player, timer, shardSpawned});

        this.heartSprite = ASSET_MANAGER.getAsset("./Sprites/Hearts.png");
        this.heartStates = [];

        this.healthBoostSprite = ASSET_MANAGER.getAsset("./Sprites/Boosts/HealthBoostLevelSprite.png");
        this.reloadBoostSprite = ASSET_MANAGER.getAsset("./Sprites/Boosts/ReloadBoostLevelSprite.png");
        this.speedBoostSprite = ASSET_MANAGER.getAsset("./Sprites/Boosts/SpeedBoostLevelSprite.png");

        this.weaponSprites = [];
        this.weaponSprites.push(ASSET_MANAGER.getAsset("./Sprites/WeaponsNoArm/Machete.png"));
        this.weaponSprites.push(ASSET_MANAGER.getAsset("./Sprites/WeaponsNoArm/Pistol.png"));
        this.weaponSprites.push(ASSET_MANAGER.getAsset("./Sprites/WeaponsNoArm/Shotgun.png"));
        this.weaponSprites.push(ASSET_MANAGER.getAsset("./Sprites/WeaponsNoArm/Machinegun.png"));
        this.weaponSprites.push(ASSET_MANAGER.getAsset("./Sprites/WeaponsNoArm/Machete.png"));

        this.perks = [];
        this.weapons = [];
        this.inventorySize = 65;

        this.hpCurrent = this.player.hpCurrent;
        this.hpMax = this.player.hpMax;

        // health points for hearts
        this.hpFullHeart = 10;
        this.hpHalfHeart = 5;

        this.heartWidth = 28;
        this.heartHeight = 28;

        this.perkWidth = 34;
        this.perkHeight = 34;

        this.minutes = 0;
        this.seconds = 0;
        this.millis = 0;
        this.shardTimer = this.timer;

        this.priority = 100; // should be the last thing to be drawn to the screen

        this.healthPerk = [];
        this.reloadPerk = [];
        this.speedPerk = [];
        this.reviveSprite = ASSET_MANAGER.getAsset("./Sprites/Boosts/ReviveSprite.png");
        this.revivePerk = new Animator(this.reviveSprite, 0, 0, this.perkWidth, this.perkHeight, 5, .15, 0, false, true);

        //difficulty bar
        this.maxDifficulty = 150; //approx 2 min
        this.currentDifficulty = 0;

        //this.setUpHearts();
        this.loadHearts();
        this.loadPerks();
        this.loadWeapons();
    };

    loadHearts() {

        var startx = 0;
        for (var i = 0; i < 3; i++) { // iterates through and loads all 3 states of heart, (full, half, empty)
            this.heartStates[i] = new Animator(this.heartSprite, startx, 0, this.heartWidth, this.heartHeight, 1, 1, 1, false, true);
            startx += this.heartWidth;
        }

    };

    loadWeapons() {
        for (let i = 0; i < this.weaponSprites.length; i++) {
            this.weapons.push(new Animator(this.weaponSprites[i], 0, 0, this.weaponSprites[i].width, this.weaponSprites[i].height, 1, 1, 0, false, true));
        }
    }

    loadPerks() {

        var offset = 0;
        for (var i = 0; i < 3; i++) {

            this.healthPerk.push(new Animator(this.healthBoostSprite, 0 + offset, 0, this.perkWidth, this.perkHeight, 1, 1, 0, false, true));
            this.reloadPerk.push(new Animator(this.reloadBoostSprite, 0 + offset, 0, this.perkWidth, this.perkHeight, 1, 1, 0, false, true));
            this.speedPerk.push(new Animator(this.speedBoostSprite, 0 + offset, 0, this.perkWidth, this.perkHeight, 1, 1, 0, false, true));
            
            offset += this.perkWidth;
        }

    };
    
    update() {

        this.minutes = Math.floor(this.game.ellapsedTime / 60);
        this.seconds = Math.floor(this.game.ellapsedTime % 60);
        if (this.seconds >= 60) {
            this.seconds = 0;   
        }

        this.currentDifficulty = this.game.timeInSurvival;
        //this.millis = Math.floor((this.game.ellapsedTime % 1) * 1000);
        
        if (!this.shardSpawned) {
            if (this.shardTimer < -0.99) {
                this.shardTimer = this.timer;
            }
        }

        this.shardTimer -=  this.game.clockTick;

        this.updateHearts();
        this.updatePerks();

    };

    updateHearts() {
        if (this.hpCurrent != this.player.hpCurrent) {

            this.hpCurrent = this.player.hpCurrent;
            this.hpMax = this.player.hpMax;

        }
    }

    updatePerks() {
        this.perks = [];
        if (this.player.healthBoostLevel > 0) {
            this.perks.push(this.healthPerk[this.player.healthBoostLevel - 1]); // - 1 for indexing
        }
        if (this.player.reloadBoostLevel > 0) {
            this.perks.push(this.reloadPerk[this.player.reloadBoostLevel - 1]);
        }
        if (this.player.speedBoostLevel > 0) {
            this.perks.push(this.speedPerk[this.player.speedBoostLevel - 1]);
        }
        if (this.player.secondChance) {
            this.perks.push(this.revivePerk);
        }
    }

    draw(ctx) {

        this.drawHearts(ctx);
        this.drawAmmo(ctx);
        this.drawPerks(ctx);
        this.drawTime(ctx);
        this.drawCoins(ctx);
        this.updateDifficulty(ctx);
        this.drawWeapons(ctx);
        this.drawMessage(ctx);

    };

    drawHearts(ctx) {

        var offset = 10; // for heart spacing/placement

        while (this.hpMax > 0) {
            this.hpMax -= this.hpFullHeart;
            var state = 2;
            if ((this.hpCurrent - this.hpFullHeart) >= 0) {

                this.hpCurrent -= this.hpFullHeart;
                state = 0;
            }
            else if ((this.hpCurrent - this.hpHalfHeart) >= 0) {

                this.hpCurrent -= this.hpHalfHeart;
                state = 1;
            }

            this.heartStates[state].drawFrame(this.game.clockTick, ctx, offset, this.HEART_POS.Y, this.HEART_POS.X);
            offset += this.heartWidth * 2.5;
        }
    }

    drawPerks(ctx) {

        var offset = 10;
        var scale = 1.5

        for (var i = 0; i < this.perks.length; i++) {
            this.perks[i].drawFrame(this.game.clockTick, ctx, this.PERK_POS.X + offset, this.PERK_POS.Y, 1 * scale);
            offset += this.perkWidth * scale;
        }
    }

    drawAmmo(ctx) {

        if (!(this.game.weapon instanceof Machete)) {
            ctx.fillStyle = "White";
            var fontsize = 50;
            ctx.font = fontsize + 'px "VT323"'


            var numdigits = 3

            var left_padding = "0".repeat(numdigits - this.game.weapon.ammoCount.toString().length);
            var right_padding = "0".repeat(numdigits - this.game.weapon.maxAmmo.toString().length);
            ctx.fillText(left_padding + this.game.weapon.ammoCount + "/" + right_padding + this.game.weapon.maxAmmo, ctx.canvas.width + this.AMMO_POS.X, this.AMMO_POS.Y + fontsize);
            
            var fontsize = 20;
            ctx.font = fontsize + 'px "VT323"';
            ctx.fillText("AMMO", ctx.canvas.width + this.AMMO_POS.X + 5, this.AMMO_POS.Y + 70);
            
            left_padding = "0".repeat(numdigits - this.game.weapon.reservesCount.toString().length);
            right_padding = "0".repeat(numdigits - this.game.weapon.maxReserves.toString().length);

            ctx.fillText(left_padding + this.game.weapon.reservesCount + "/" + right_padding + this.game.weapon.maxReserves, ctx.canvas.width + this.AMMO_POS.X + 83, this.AMMO_POS.Y + 70);

            if (this.game.weapon.reservesCount == 0 && this.game.weapon.ammoCount == 0) {
                ctx.fillStyle = "Red";
                ctx.fillText("NO AMMO", this.game.player.positionx - 10, this.game.player.positiony - 20);
                ctx.fillText("NO AMMO", ctx.canvas.width + this.AMMO_POS.X, this.AMMO_POS.Y + 12);
            }
            else if (this.game.weapon.ammoCount == 0) {
                ctx.fillStyle = "Orange";
                ctx.fillText("R TO RELOAD", this.game.player.positionx -22, this.game.player.positiony-20);
                ctx.fillText("R TO RELOAD", ctx.canvas.width + this.AMMO_POS.X + 5, this.AMMO_POS.Y + 12);
            }
            
        }
    }

    drawTime(ctx) {
        

            ctx.fillStyle = "White";
            var fontsize = 50;
            var offsetx = 205;
            var offsety = 35;
            ctx.font = fontsize + 'px "VT323"'
            ctx.fillText("Time: ", ctx.canvas.width - offsetx, offsety);;

            var left_padding = "0".repeat(2 - this.minutes.toString().length);
            var right_padding = "0".repeat(2 - this.seconds.toString().length);

            offsetx = offsetx - 100;
            ctx.fillText(left_padding + this.minutes + ":" + right_padding + this.seconds, ctx.canvas.width - offsetx,  offsety);

        
    }   
    drawCoins(ctx) {
        ctx.fillStyle = "White";
        var fontsize = 50;
        ctx.font = fontsize + 'px "VT323"'
        ctx.fillText("COINS: " + this.player.coins, this.HEART_POS.X+5, fontsize - 15);
    }

    updateDifficulty(ctx) {

        ctx.fillStyle = "White";
        var fontsize = 50;
        ctx.font = fontsize + 'px "VT323"'

        var offsety = 35;
        var offsetx = 150;
        var titleOffsetX = 160;
        ctx.fillText("Round " + this.game.player.stageLevel + " Difficulty", ctx.canvas.width / 2 - titleOffsetX, offsety);
        //startColor = rgb(0, 255, 0);
        //endColor = rgb(255, 0, 0);
        let red = ((255 - 0) / (this.maxDifficulty)) * (this.currentDifficulty - 0) + 0;
        let green = ((0 - 255) / (this.maxDifficulty)) * (this.currentDifficulty - 0) + 255;
        let blue = ((0 - 0) / (this.maxDifficulty)) * (this.currentDifficulty - 0) + 0;   
        ctx.fillStyle = rgb(red,green,blue);

        if (this.currentDifficulty < this.maxDifficulty) {
            
            var ratio = this.currentDifficulty / this.maxDifficulty;
            offsety = 50;
            ctx.fillRect(ctx.canvas.width / 2 - offsetx, offsety, 300 * ratio, 15);
        } else {
            offsety = 50;
            ctx.fillRect(ctx.canvas.width / 2 - offsetx, offsety, 300, 15);
        }

        ctx.strokeStyle = "Black";
        ctx.strokeRect(ctx.canvas.width / 2 - offsetx, offsety, 300, 15);

    }

    drawMessage(ctx) {
        if (this.game.stage == "survival") {
            var offsety = 100;
            var offsetx = 350;
            var fontsize = 50;
            ctx.font = fontsize + 'px "VT323"'
            if ((this.shardTimer > 0) && (this.player.stageLevel != 5)) {
                ctx.fillStyle = "darkred";
                ctx.fillText(Math.ceil(this.shardTimer) + " seconds until the shard spawns.", ctx.canvas.width / 2 - offsetx, offsety);
            }
            else {
                if (this.game.player.shardObtained) {
                    ctx.fillStyle = "Blue";
                    ctx.fillText("Shard obtained! Return to the boat!", ctx.canvas.width / 2 - offsetx, offsety);
                }
                else if (this.game.camera.shardSpawned) {
                    ctx.fillStyle = "Red";
                    ctx.fillText("The shard has spawned! Go find it!", ctx.canvas.width / 2 - offsetx, offsety);
                }
            }
        }
        
    }
    
    drawWeapons(ctx) {
        ctx.fillStyle = "White";
        ctx.strokeStyle = "White";
        var fontsize = 20;
        ctx.font = fontsize + 'px "VT323"'
        let count = 4
        let chosen = this.game.chosenWeapon;
        for (var i = 0; i < count; i++) {
            let size = this.inventorySize;
            let scale = 1.29
            let extra = scale * size - size
            let xoffset = ctx.canvas.width / 2 - (count-1) * size / 2 - extra;
            let yoffset = ctx.canvas.height - size - 5;
            
            
            if (i < chosen) {
                if (this.game.weapons[i].isAvailable) {
                    this.weapons[i].drawFrame(this.game.clockTick, ctx, xoffset + size * i - extra / 2 + 10, yoffset + 5, 1);
                }
                
                ctx.strokeRect(xoffset + size * i - extra / 2, yoffset, size, size);
                ctx.fillText(i + 1, xoffset + size * i - extra / 2 + 1, yoffset + 13)
                

            }
            else if (i == chosen) {
                if (this.game.weapons[i].isAvailable) {
                    this.weapons[i].drawFrame(this.game.clockTick, ctx, xoffset + size * i - extra / 2 + 10, yoffset - extra + 5, 1);
                }
                ctx.strokeRect(xoffset + size * i - extra / 2, yoffset - extra, size * scale, size * scale);
                ctx.fillText(i+1, xoffset + size * i - extra / 2 + 1, yoffset - extra + 13)
            } else {
                if (this.game.weapons[i].isAvailable) {
                    this.weapons[i].drawFrame(this.game.clockTick, ctx, xoffset + size * i + extra / 2 + 10, yoffset + 5, 1);
                }
                
                ctx.strokeRect(xoffset + size * i + extra / 2, yoffset, size, size);
                ctx.fillText(i+1, xoffset + size * i + extra / 2 + 1, yoffset + 13)

            }
            
        }
    }

};
