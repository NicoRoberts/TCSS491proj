class CreditsMenu {

    TITLE_POS = { X: 750, Y: 150 };
    NICO_POS = { X: 675, Y: 300 };
    JAKE_POS = { X: 687.5, Y: 450 };
    TIEN_POS = { X: 737.5, Y: 600 };
    ROMI_POS = { X: 662.5, Y: 750 };
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

        ctx.fillText("CREDITS", this.TITLE_POS.X, this.TITLE_POS.Y);

        ctx.fillStyle = "White";
        fontsize = 125;
        ctx.font = fontsize + 'px "VT323"';

        ctx.fillText("NICO ROBERTS", this.NICO_POS.X, this.NICO_POS.Y);
        ctx.fillText("JAKE SOUSIE", this.JAKE_POS.X, this.JAKE_POS.Y);
        ctx.fillText("TIEN TANG", this.TIEN_POS.X, this.TIEN_POS.Y);
        ctx.fillText("ROMI TSHIORNY", this.ROMI_POS.X, this.ROMI_POS.Y);

        if (this.game.mouse != null) {
            this.drawGoBack(ctx);
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