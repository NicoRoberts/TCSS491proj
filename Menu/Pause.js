class Pause {

    TITLE_POS = { X: 750, Y: 150 };
    RESUME_POS = { X: 1300, Y: 400 };
    QUIT_POS = { X: 1362.5, Y: 650 };
    CONTROLS_POS = { X: 50, Y: 300 };
    constructor(game) {
        Object.assign(this, {game});
        
        this.previousStage = this.game.stage;
        this.priority = 1;
    };

    update() {

        if ((this.game.mouse != null)) {

            if ((this.game.mouse.x >= 1300 && this.game.mouse.x <= 1655) && (this.game.mouse.y >= 315 && this.game.mouse.y <= 400)
            && (this.game.click)) {
                ASSET_MANAGER.playAsset("./Sounds/click.wav");
                this.game.stage = this.previousStage;
                this.removeFromWorld = true;
            }
            if ((this.game.mouse.x >=1362.5 && this.game.mouse.x <= 1587.5) && (this.game.mouse.y >= 565 && this.game.mouse.y <= 650)
            && (this.game.click)) {
                ASSET_MANAGER.playAsset("./Sounds/click.wav");
                this.game.camera.loadStartMenu();
            }
        }
        
    };

    draw(ctx) {
        ctx.fillStyle = "Black";
        ctx.fillRect(0, 0, PARAMS.CANVAS_WIDTH, PARAMS.CANVAS_HEIGHT);

        ctx.fillStyle = "darkslategray";
        var fontsize = 150;
        ctx.font = fontsize + 'px "VT323"';

        ctx.fillText("PAUSED", this.TITLE_POS.X, this.TITLE_POS.Y);

        fontsize = 150;
        ctx.font = fontsize + 'px "VT323"';

        if (this.game.mouse != null) {
            this.drawResume(ctx);
            this.drawQuit(ctx);
        }
        
        this.drawControls(ctx);
    };

    drawResume(ctx) {
        if ((this.game.mouse.x >= 1300 && this.game.mouse.x <= 1655) && (this.game.mouse.y >= 315 && this.game.mouse.y <= 400)) {
            ctx.fillStyle = "White";
            ctx.fillText("Resume", this.RESUME_POS.X, this.RESUME_POS.Y);
        }
        else {
            ctx.fillStyle = "Gray";
            ctx.fillText("Resume", this.RESUME_POS.X, this.RESUME_POS.Y);
        }
    };

    drawQuit(ctx) {
        if ((this.game.mouse.x >=1362.5 && this.game.mouse.x <= 1587.5) && (this.game.mouse.y >= 565 && this.game.mouse.y <= 650)) {
            ctx.fillStyle = "White";
            ctx.fillText("Quit", this.QUIT_POS.X, this.QUIT_POS.Y);
        }
        else {
            ctx.fillStyle = "Gray";
            ctx.fillText("Quit", this.QUIT_POS.X, this.QUIT_POS.Y);
        }
    };

    drawControls(ctx) {
        ctx.fillStyle = "White";
        var fontsize = 75;
        ctx.font = fontsize + 'px "VT323"';

        ctx.fillText("W : move up", this.CONTROLS_POS.X, this.CONTROLS_POS.Y, 500);
        ctx.fillText("A : move left", this.CONTROLS_POS.X, this.CONTROLS_POS.Y + 125, 500);
        ctx.fillText("S : move down", this.CONTROLS_POS.X, this.CONTROLS_POS.Y + 250, 500);
        ctx.fillText("D : move right", this.CONTROLS_POS.X, this.CONTROLS_POS.Y + 375, 500);
        ctx.fillText("Shift : sprint", this.CONTROLS_POS.X, this.CONTROLS_POS.Y + 500, 500);

        ctx.fillText("Click : shoot/slash", this.CONTROLS_POS.X + 500, this.CONTROLS_POS.Y, 500);
        ctx.fillText("1-4 : switch weapons", this.CONTROLS_POS.X + 500, this.CONTROLS_POS.Y + 125, 500);
        ctx.fillText("R : reload weapon", this.CONTROLS_POS.X + 500, this.CONTROLS_POS.Y + 250, 500);
        ctx.fillText("E : purchase item", this.CONTROLS_POS.X + 500, this.CONTROLS_POS.Y + 375, 500);
        ctx.fillText("Esc : pause game", this.CONTROLS_POS.X + 500, this.CONTROLS_POS.Y + 500, 500);
    };
}