class ControlsMenu {

    TITLE_POS = { X: 650, Y: 150 };
    MOVEMENT_POS = { X: 125, Y: 275 };
    ACTION_POS = { X: 950, Y : 275 };
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

        ctx.fillText("CONTROLS", this.TITLE_POS.X, this.TITLE_POS.Y);

        ctx.fillStyle = "White";
        fontsize = 125;
        ctx.font = fontsize + 'px "VT323"';

        ctx.fillText("W : move up", this.MOVEMENT_POS.X, this.MOVEMENT_POS.Y, 800);
        ctx.fillText("A : move left", this.MOVEMENT_POS.X, this.MOVEMENT_POS.Y + 150, 800);
        ctx.fillText("S : move down", this.MOVEMENT_POS.X, this.MOVEMENT_POS.Y + 300, 800);
        ctx.fillText("D : move right", this.MOVEMENT_POS.X, this.MOVEMENT_POS.Y + 450, 800);

        ctx.fillText("Click : shoot/slash", this.ACTION_POS.X, this.ACTION_POS.Y, 800);
        ctx.fillText("1-4 : switch wepons", this.ACTION_POS.X, this.ACTION_POS.Y + 150, 800);
        ctx.fillText("R : reload weapon", this.ACTION_POS.X, this.ACTION_POS.Y + 300, 800);
        ctx.fillText("E : purchase item", this.ACTION_POS.X, this.ACTION_POS.Y + 450, 800);

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