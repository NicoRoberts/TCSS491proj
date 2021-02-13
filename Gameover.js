class Gameover {

    GAMEOVER_POS = { X: 0, Y: 0 }
    KILLS_POS = { X: 1000, Y: 250};
    constructor(game, x, y) {
        Object.assign(this, {game});

        this.spritesheet = ASSET_MANAGER.getAsset("./Sprites/GameOverSprite.png");
        
        this.width = 835;
        this.height = 676;

        this.priority = 1;

        this.gameover = new Animator(this.spritesheet, 0, 0, this.width, this.height, 1, 1, 0, false, true);
    };

    update() {

    };

    draw(ctx) {
        this.gameover.drawFrame(this.game.clockTick, this.game.ctx, this.GAMEOVER_POS.X, this.GAMEOVER_POS.Y, 1);
        this.drawScores(ctx);
    };

    drawScores(ctx) {
        ctx.fillStyle = "White";
        var fontsize = 150;
        ctx.font = fontsize + 'px "VT323"';
        ctx.fillText("Kills: ", this.KILLS_POS.X, this.KILLS_POS.Y);
        ctx.fillText(this.game.player.killCount, this.KILLS_POS.X + 400, this.KILLS_POS.Y);
    }
}