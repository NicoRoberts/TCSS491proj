class StartMenu {

    TITLE_POS = { X: 250, Y: 150 };
    START_POS = { X: 750, Y: 300 };
    constructor(game) {
        Object.assign(this, {game});

        this.priority = 1;
    };

    update() {

        if (this.game.mouse != null) {
            if ((this.game.mouse.x >= 750 && this.game.mouse.x <= 1040) && (this.game.mouse.y >= 215 && this.game.mouse.y <= 300)
            && (this.game.click)) {
    
                this.game.camera.loadArrival();
            }
            
        }
        
        
    };

    draw(ctx) {
        ctx.fillStyle = "darkslategrey";
        var fontsize = 175;
        ctx.font = fontsize + 'px "VT323"';
        // Title
        ctx.fillText("CAST TO THE SHADOWS", this.TITLE_POS.X, this.TITLE_POS.Y);

        this.drawStart(ctx);
    };

    drawStart(ctx) {
        var fontsize = 150;
        ctx.font = fontsize + 'px "VT323"';

        if (this.game.mouse != null) {
            if ((this.game.mouse.x >= 750 && this.game.mouse.x <= 1040) && (this.game.mouse.y >= 215 && this.game.mouse.y <= 300)) {
                ctx.fillStyle = "White";
                ctx.fillText("Start", this.START_POS.X, this.START_POS.Y);
            }
            else {
                ctx.fillStyle = "Gray";
                ctx.fillText("Start", this.START_POS.X, this.START_POS.Y);
            }
        }
        
    };
}