class HUD {

    HEART_POS = { X: 2.5, Y: 785 }
    AMMO_POS = { X: -110, Y:785}
    constructor(game, player) {
        Object.assign(this, {game, player});

        this.spritesheet = ASSET_MANAGER.getAsset("./Sprites/Hearts.png");
        this.heartStates = [];

        this.hpCurrent = this.player.hpCurrent;
        this.hpMax = this.player.hpMax;

        this.hpFullHeart = 50;
        this.hpHalfHeart = 25;

        this.heartWidth = 28;
        this.heartHeight = 28;

        this.priority = 100; // should be the last thing to be drawn to the screen

        //this.setUpHearts();
        this.loadHearts();
    };

    loadHearts() {

        var startx = 0;
        for (var i = 0; i < 3; i++) { // iterates through and loads all 3 states of heart, (full, half, empty)
            this.heartStates[i] = new Animator(this.spritesheet, startx, 0, this.heartWidth, this.heartHeight, 1, 1, 1, false, true);
            startx += this.heartWidth;
        }

    };

    update() {

        this.updateHearts();
        this.updateAmmo();

    };

    updateHearts() {
        if (this.hpCurrent != this.player.hpCurrent) {

            this.hpCurrent = this.player.hpCurrent;
            this.hpMax = this.player.hpMax;

        }
    }

    updateAmmo() {

    }

    draw(ctx) {

        this.drawHearts(ctx);
        this.drawAmmo(ctx);
        this.drawCoins(ctx);

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

    drawCoins(ctx) {
        ctx.fillStyle = "White";
        var fontsize = 50;
        ctx.font = fontsize + 'px "VT323"'
        ctx.fillText("COINS: " + this.player.coins, this.HEART_POS.X+5, fontsize - 15);
    }

};
