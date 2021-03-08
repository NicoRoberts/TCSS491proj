class Gameover {

    // increment position down by 125
    GAMEOVER_POS = { X: 600, Y: 150 };
    KILLS_POS = { X: 650, Y: 275 };
    COINS_POS = { X: 650, Y: 400 };
    LEVEL_POS = { X: 650, Y: 525 };
    TIME_POS = { X: 650, Y: 650 };
    PLAY_POS = { X: 675, Y: 775 };
    constructor(game) {
        Object.assign(this, {game});

        this.priority = 1;

        this.minutes = this.game.minutes;
        this.seconds = this.game.seconds;
    };

    update() {
        if (this.game.mouse != null) {
            if ((this.game.mouse.x >= 675 && this.game.mouse.x <= 1110) && (this.game.mouse.y >= 715 && this.game.mouse.y <= 785)
            && (this.game.click)) {

                ASSET_MANAGER.playAsset("./Sounds/click.wav");
                this.game.camera.loadStartMenu();
                this.game.menuMusicPlayed = false;
            }
        }

    };

    draw(ctx) {
        ctx.fillStyle = "White";
        var fontsize = 200;
        ctx.font = fontsize + 'px "VT323"';
        // GAME OVER
        ctx.fillText("GAME OVER", this.GAMEOVER_POS.X, this.GAMEOVER_POS.Y);

        ctx.fillStyle = "darkslategray";
        fontsize = 100;
        ctx.font = fontsize + 'px "VT323"';
        // Kill count
        ctx.fillText("Kills: ", this.KILLS_POS.X, this.KILLS_POS.Y);
        ctx.fillText(this.game.player.killCount, this.KILLS_POS.X + 300, this.KILLS_POS.Y);

        // Coins
        ctx.fillText("Coins: ", this.COINS_POS.X, this.COINS_POS.Y);
        ctx.fillText(this.game.player.totalCoinsCollected, this.COINS_POS.X + 300, this.COINS_POS.Y);

        // Level player is on
        ctx.fillText("Level: ", this.LEVEL_POS.X, this.LEVEL_POS.Y);
        ctx.fillText(this.game.player.stageLevel, this.LEVEL_POS.X + 300, this.LEVEL_POS.Y);

        // Time alive
        ctx.fillText("Time: ", this.TIME_POS.X, this.TIME_POS.Y);
        if (this.seconds < 10) {
            ctx.fillText(this.minutes + ":0" + this.seconds, this.TIME_POS.X + 300, this.TIME_POS.Y);
        }
        else {
            ctx.fillText(this.minutes + ":" + this.seconds, this.TIME_POS.X + 300, this.TIME_POS.Y);
        }

        this.drawPlayAgain(ctx);
    };

    drawPlayAgain(ctx) {

        if (this.game != null) {
            if ((this.game.mouse.x >= 675 && this.game.mouse.x <= 1110) && (this.game.mouse.y >= 715 && this.game.mouse.y <= 785)) {
                ctx.fillStyle = "darkred";
                ctx.fillText("Play Again!", this.PLAY_POS.X, this.PLAY_POS.Y);
            }
            else {
                ctx.fillStyle = "Gray";
                ctx.fillText("Play Again?", this.PLAY_POS.X, this.PLAY_POS.Y);
            }
        }
    };
}