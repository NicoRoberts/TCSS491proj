class WinScreen {

    TITLE_POS = { X: 525, Y: 100 };
    KILLS_POS = { X: 225, Y: 400 };
    COINS_POS = { X: 225, Y: 550 };
    TIME_POS = { X: 275, Y: 700 };
    PLAY_POS = { X: 1050, Y: 400 };
    END_POS = { X: 1050, Y: 700 };
    constructor(game) {
        Object.assign(this, {game});

        this.priority = 1;

        this.minutes = this.game.minutes;
        this.seconds = this.game.seconds;
    };

    update() {
        if ((this.game.mouse != null)) {

            if ((this.game.mouse.x >= 1031.25 && this.game.mouse.x <= 1562.5) && (this.game.mouse.y >= 312.5 && this.game.mouse.y <= 550)
            && (this.game.click)) {
                ASSET_MANAGER.playAsset("./Sounds/click.wav");
                this.game.stage = "yacht";
                this.removeFromWorld = true;
            }
            if ((this.game.mouse.x >= 1050 && this.game.mouse.x <= 1525) && (this.game.mouse.y >= 600 && this.game.mouse.y <= 700)
            && (this.game.click)) {
                ASSET_MANAGER.playAsset("./Sounds/click.wav");
                this.game.camera.loadStartMenu();
            }
        }
    };

    draw(ctx) {
        ctx.fillStyle = "Black";
        ctx.fillRect(0, 0, PARAMS.CANVAS_WIDTH, PARAMS.CANVAS_HEIGHT);

        ctx.fillStyle = "White";
        var fontsize = 125;
        ctx.font = fontsize + 'px "VT323"';

        ctx.fillText("CONGRATULATIONS!", this.TITLE_POS.X, this.TITLE_POS.Y);
        ctx.fillText("You have defeated the Lich King", this.TITLE_POS.X - 350, this.TITLE_POS.Y + 100);

        ctx.fillStyle = "darkslategray";
        fontsize = 125;
        ctx.font = fontsize + 'px "VT323"';

        // Kill count
        ctx.fillText("Kills: ", this.KILLS_POS.X, this.KILLS_POS.Y);
        ctx.fillText(this.game.player.killCount, this.KILLS_POS.X + 325, this.KILLS_POS.Y);

        // Coins
        ctx.fillText("Coins: ", this.COINS_POS.X, this.COINS_POS.Y);
        ctx.fillText(this.game.player.totalCoinsCollected, this.COINS_POS.X + 325, this.COINS_POS.Y);

        // Time alive
        ctx.fillText("Time: ", this.TIME_POS.X, this.TIME_POS.Y);
        if (this.seconds < 10) {
            ctx.fillText(this.minutes + ":0" + this.seconds, this.TIME_POS.X + 275, this.TIME_POS.Y);
        }
        else {
            ctx.fillText(this.minutes + ":" + this.seconds, this.TIME_POS.X + 275, this.TIME_POS.Y);
        }

        fontsize = 150;
        ctx.font = fontsize + 'px "VT323"';

        this.drawFreePlay(ctx);
        this.drawEndGame(ctx);
    };

    drawFreePlay(ctx) {
        if (this.game.mouse != null) {
            if ((this.game.mouse.x >= 1031.25 && this.game.mouse.x <= 1562.5) && (this.game.mouse.y >= 312.5 && this.game.mouse.y <= 550)) {
                ctx.fillStyle = "White";
                ctx.fillText("Continue", this.PLAY_POS.X, this.PLAY_POS.Y);
                ctx.fillText("Free Play", this.PLAY_POS.X - 25, this.PLAY_POS.Y + 125);
            }
            else {
                ctx.fillStyle = "Gray";
                ctx.fillText("Continue", this.PLAY_POS.X, this.PLAY_POS.Y);
                ctx.fillText("Free Play", this.PLAY_POS.X - 25, this.PLAY_POS.Y + 125);
            }
        }
    };

    drawEndGame(ctx) {
        if (this.game.mouse != null) {
            if ((this.game.mouse.x >= 1050 && this.game.mouse.x <= 1525) && (this.game.mouse.y >= 600 && this.game.mouse.y <= 700)) {
                ctx.fillStyle = "White";
                ctx.fillText("End Game", this.END_POS.X, this.END_POS.Y);
            }
            else {
                ctx.fillStyle = "Gray";
                ctx.fillText("End Game", this.END_POS.X, this.END_POS.Y);
            }
        }
    };

}