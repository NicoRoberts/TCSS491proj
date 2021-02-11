class HUD {

    HEART_POS = { X: 2.5, Y: 785 }
    PERK_POS = { X: 2.5, Y: 735 }
    AMMO_POS = { X: -110, Y: 785 } 
    constructor(game, player) {
        Object.assign(this, {game, player});

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

        this.priority = 100; // should be the last thing to be drawn to the screen

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

            var left_padding = this.game.weapon.ammoCount < 10 ? "0" : "";
            var right_padding = this.game.weapon.maxAmmo < 10 ? "0" : "";
            ctx.fillText(left_padding + this.game.weapon.ammoCount + "/" + right_padding + this.game.weapon.maxAmmo, ctx.canvas.width + this.AMMO_POS.X, this.AMMO_POS.Y + fontsize);

            var fontsize = 20;
            ctx.font = fontsize + 'px "VT323"';
            ctx.fillText("AMMO", ctx.canvas.width + this.AMMO_POS.X + 5, this.AMMO_POS.Y + 70);

            left_padding = this.game.weapon.reservesCount < 10 ? "0" : "";
            right_padding = this.game.weapon.maxReserves < 10 ? "0" : "";
            ctx.fillText(left_padding + this.game.weapon.reservesCount + "/" + right_padding + this.game.weapon.maxReserves, ctx.canvas.width + this.AMMO_POS.X + 58, this.AMMO_POS.Y + 70);

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

};
