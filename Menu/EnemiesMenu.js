class EnemiesMenu {

    TITLE_POS = { X: 650, Y: 150 };
    BACK_POS = { X: 10, Y: 65 };
    constructor(game) {
        Object.assign(this, {game});

        this.priority = 1;
    };

    update() {

        if (this.game.mouse != null) {
            if ((this.game.mouse.x >= 10 && this.game.mouse.x <= 225) && (this.game.mouse.y >= 20 && this.game.mouse.y <= 65)
            && (this.game.click)) {
                ASSET_MANAGER.playAsset("./Sounds/click.wav");
                this.game.camera.loadGuideMenu();
            }
        }
    };

    draw(ctx) {


        this.drawGoBack(ctx);

    };

    drawGoBack(ctx) {

        var fontsize = 75;
        ctx.font = fontsize + 'px "VT323"';
        if (this.game.mouse != null) {
            if ((this.game.mouse.x >= 10 && this.game.mouse.x <= 225) && (this.game.mouse.y >= 20 && this.game.mouse.y <= 65)) {
                ctx.fillStyle = "White";
                ctx.fillText("Go Back", this.BACK_POS.X, this.BACK_POS.Y);
            }
            else {
                ctx.fillStyle = "Gray";
                ctx.fillText("Go Back", this.BACK_POS.X, this.BACK_POS.Y);
            }
        }

    };
}