class HUD {

    HEART_POS = { X: 2.5, Y: 785 }
    PERK_POS = { X: 2.5, Y: 735 }
    AMMO_POS = { X: -145, Y:785}
    constructor(game, player, timer) {
        Object.assign(this, {game, player, timer});

        this.heartSprite = ASSET_MANAGER.getAsset("./Sprites/Hearts.png");
        this.heartStates = [];

        this.healthBoostSprite = ASSET_MANAGER.getAsset("./Sprites/Boosts/HealthBoostSprite.png");
        this.reloadBoostSprite = ASSET_MANAGER.getAsset("./Sprites/Boosts/ReloadBoostSprite.png");
        this.speedBoostSprite = ASSET_MANAGER.getAsset("./Sprites/Boosts/SpeedBoostSprite.png");
        this.perks = [];

        this.hpCurrent = this.player.hpCurrent;
        this.hpMax = this.player.hpMax;

        // health points for hearts
        this.hpFullHeart = 50;
        this.hpHalfHeart = 25;

        this.heartWidth = 28;
        this.heartHeight = 28;

        this.perkWidth = 34;
        this.perkHeight = 34;
        this.minutes = 0;
        this.seconds = 0;
        this.millis = 0;

        this.priority = 100; // should be the last thing to be drawn to the screen

        //difficulty bar
        this.maxDifficulty = 150; //approx 2 min
        this.currentDifficulty = 0;

        //this.setUpHearts();
        this.loadHearts();
        this.loadPerks();
    };

    loadHearts() {

        var startx = 0;
        for (var i = 0; i < 3; i++) { // iterates through and loads all 3 states of heart, (full, half, empty)
            this.heartStates[i] = new Animator(this.heartSprite, startx, 0, this.heartWidth, this.heartHeight, 1, 1, 1, false, true);
            startx += this.heartWidth;
        }

    };

    loadPerks() {

        this.healthPerk = new Animator(this.healthBoostSprite, 0, 0, this.perkWidth, this.perkHeight, 4, 0.25, 0, false, true);
        this.reloadPerk = new Animator(this.reloadBoostSprite, 0, 0, this.perkWidth, this.perkHeight, 4, 0.25, 0, false, true);
        this.speedPerk = new Animator(this.speedBoostSprite, 0, 0, this.perkWidth, this.perkHeight, 4, 0.25, 0, false, true);

        this.healthPerkObtained = false;
        this.reloadPerkObtained = false;
        this.speedPerkObtained = false;

    };

    update() {

        this.minutes = Math.floor(this.game.ellapsedTime / 60);
        this.seconds = Math.floor(this.game.ellapsedTime % 60);
        if (this.seconds >= 60) {
            this.seconds = 0;   
        }

        this.currentDifficulty = this.game.ellapsedTime;
        //this.millis = Math.floor((this.game.ellapsedTime % 1) * 1000);

        this.updateHearts();
        this.updateAmmo();
        this.updatePerks();
        

    };

    updateHearts() {
        if (this.hpCurrent != this.player.hpCurrent) {

            this.hpCurrent = this.player.hpCurrent;
            this.hpMax = this.player.hpMax;

        }
    }

    updatePerks() {
        if (this.player.healthBoost && !this.healthPerkObtained) {
            this.healthPerkObtained = true;
            this.perks.push(this.healthPerk);
        }
        if (this.player.reloadBoost && !this.reloadPerkObtained) {
            this.reloadPerkObtained = true;
            this.perks.push(this.reloadPerk);
        }
        if (this.player.speedBoost && !this.speedPerkObtained) {
            this.speedPerkObtained = true;
            this.perks.push(this.speedPerk);
        }
    }

    updateAmmo() {

    }

    draw(ctx) {

        this.drawHearts(ctx);
        this.drawAmmo(ctx);
        this.drawPerks(ctx);
        this.drawTime(ctx);
        this.drawCoins(ctx);
        this.updateDifficulty(ctx);
        this.drawWeapons(ctx);

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
                ctx.fillText("NO AMMO", ctx.canvas.width + this.AMMO_POS.X + 25, this.AMMO_POS.Y + 12);
            }
            else if (this.game.weapon.ammoCount == 0) {
                ctx.fillStyle = "Orange";
                ctx.fillText("R TO RELOAD", ctx.canvas.width + this.AMMO_POS.X + 5, this.AMMO_POS.Y + 12);
            }
            
        }
    }

    drawTime(ctx) {
        if (PARAMS.DEBUG) {
            ctx.fillStyle = "White";
            var fontsize = 50;
            var offsetx = 400;
            var offsety = 30;
            ctx.font = fontsize + 'px "VT323"'
            ctx.fillText("Time: ", ctx.canvas.width - offsetx, ctx.canvas.height - offsety);

            fontsize = 20;
            offsetx = 340;
            offsety = 10;
            ctx.font = fontsize + 'px "VT323"'
            ctx.fillText(this.minutes + ":" + this.seconds, ctx.canvas.width - offsetx, ctx.canvas.height - offsety);

        }
    }   
    drawCoins(ctx) {
        ctx.fillStyle = "White";
        var fontsize = 50;
        ctx.font = fontsize + 'px "VT323"'
        ctx.fillText("COINS: " + this.player.coins, this.HEART_POS.X+5, fontsize - 15);
    }

    updateDifficulty(ctx) {
        var offsety = 30;
        ctx.fillText("Round Difficulty", ctx.canvas.width / 2, ctx.canvas.height - offsety);
        if (this.currentDifficulty < this.maxDifficulty) {

            ctx.fillStyle = rgb(218, 165, 32); // gold
            var ratio = this.currentDifficulty / this.maxDifficulty;
            offsety = 15;
            ctx.fillRect(ctx.canvas.width / 2, ctx.canvas.height - offsety, 300 * ratio, 15);
        } else {
            offsety = 15;
            ctx.fillStyle = rgb(218, 165, 32); // gol
            ctx.fillRect(ctx.canvas.width / 2, ctx.canvas.height - offsety, 300, 15);
        }
    }
    
    drawWeapons(ctx) {
        for (var i = 0; i < 9; i++) {

        }
    }

};
