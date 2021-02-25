class GuideMenu {

    TITLE_POS = { X: 750, Y: 150 };
    ENEMIES_POS = { X: 175, Y: 300 };
    PERKS_POS = { X: 750, Y: 300 };
    GAME_POS = { X: 1205, Y: 300 };
    BACK_POS = { X: 10, Y: 65 };
    constructor(game) {
        Object.assign(this, {game});

        this.priority = 1;
    };

    update() {

        if (this.game.mouse != null) {
            if ((this.game.mouse.x >= 10 && this.game.mouse.x <= 225) && (this.game.mouse.y >= 20 && this.game.mouse.y <= 65)
            && (this.game.click)) {

                this.game.camera.loadStartMenu();
            }
            
        }
    };

    draw(ctx) {
        
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

        if ((this.game.mouse.x >= 175 && this.game.mouse.x <= 590) && (this.game.mouse.y >= 215 && this.game.mouse.y <= 300)) {
            ctx.fillStyle = "White";
            ctx.fillText("Enemies", this.ENEMIES_POS.X, this.ENEMIES_POS.Y);
        }
        else {
            ctx.fillStyle = "Gray";
            ctx.fillText("Enemies", this.ENEMIES_POS.X, this.ENEMIES_POS.Y);
        }
    };

    drawPerks(ctx) {

        if ((this.game.mouse.x >= 750 && this.game.mouse.x <= 1045) && (this.game.mouse.y >= 215 && this.game.mouse.y <= 300)) {
            ctx.fillStyle = "White";
            ctx.fillText("Perks", this.PERKS_POS.X, this.PERKS_POS.Y);
        }
        else {
            ctx.fillStyle = "Gray";
            ctx.fillText("Perks", this.PERKS_POS.X, this.PERKS_POS.Y);
        }
    };

    drawGameplay(ctx) {

        if ((this.game.mouse.x >= 1205 && this.game.mouse.x <= 1680) && (this.game.mouse.y >= 215 && this.game.mouse.y <= 300)) {
            ctx.fillStyle = "White";
            ctx.fillText("Gameplay", this.GAME_POS.X, this.GAME_POS.Y);
        }
        else {
            ctx.fillStyle = "Gray";
            ctx.fillText("Gameplay", this.GAME_POS.X, this.GAME_POS.Y);
        }
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