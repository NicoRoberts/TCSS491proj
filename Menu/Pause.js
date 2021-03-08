class Pause {

    TITLE_POS = { X: 750, Y: 150 };
    RESUME_POS = { X: 350, Y: 450 };
    QUIT_POS = { X: 1150, Y: 450 };
    constructor(game) {
        Object.assign(this, {game});
        
        this.previousStage = this.game.stage;
        this.priority = 1;
    };

    update() {

        if ((this.game.mouse != null)) {

            if ((this.game.mouse.x >= 350 && this.game.mouse.x <= 750) && (this.game.mouse.y >= 350 && this.game.mouse.y <= 450)
            && (this.game.click)) {
                this.game.stage = this.previousStage;
                this.removeFromWorld = true;
            }
            if ((this.game.mouse.x >=1150 && this.game.mouse.x <= 1375) && (this.game.mouse.y >= 365 && this.game.mouse.y <= 450)
            && (this.game.click)) {
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
    };

    drawResume(ctx) {
        if ((this.game.mouse.x >= 350 && this.game.mouse.x <= 705) && (this.game.mouse.y >= 365 && this.game.mouse.y <= 450)) {
            ctx.fillStyle = "White";
            ctx.fillText("Resume", this.RESUME_POS.X, this.RESUME_POS.Y);
        }
        else {
            ctx.fillStyle = "Gray";
            ctx.fillText("Resume", this.RESUME_POS.X, this.RESUME_POS.Y);
        }
    };

    drawQuit(ctx) {
        if ((this.game.mouse.x >=1150 && this.game.mouse.x <= 1375) && (this.game.mouse.y >= 365 && this.game.mouse.y <= 450)) {
            ctx.fillStyle = "White";
            ctx.fillText("Quit", this.QUIT_POS.X, this.QUIT_POS.Y);
        }
        else {
            ctx.fillStyle = "Gray";
            ctx.fillText("Quit", this.QUIT_POS.X, this.QUIT_POS.Y);
        }
    };
}