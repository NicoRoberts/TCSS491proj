class StartMenu {

    TITLE_POS = { X: 250, Y: 150 };
    START_POS = { X: 750, Y: 300 };
    CONTROLS_POS = { X: 675, Y: 450 };
    GUIDE_POS = { X: 750, Y: 600 };
    CREDITS_POS = { X: 700, Y: 750 };
    constructor(game) {
        Object.assign(this, {game});

        this.priority = 1;
    };

    update() {

        if (this.game.mouse != null) {
            if ((this.game.mouse.x >= 750 && this.game.mouse.x <= 1040) && (this.game.mouse.y >= 215 && this.game.mouse.y <= 300)
                && (this.game.click)) {
                ASSET_MANAGER.playAsset("./Sounds/click.wav");
                this.game.camera.loadArrival();
            }
            else if ((this.game.mouse.x >= 675 && this.game.mouse.x <= 1150) && (this.game.mouse.y >= 365 && this.game.mouse.y <= 450)
                && (this.game.click)) {
                ASSET_MANAGER.playAsset("./Sounds/click.wav");
                this.game.camera.loadControlsMenu();

            }
            else if ((this.game.mouse.x >= 750 && this.game.mouse.x <= 1050) && (this.game.mouse.y >= 515 && this.game.mouse.y <= 600)
                && (this.game.click)) {
                ASSET_MANAGER.playAsset("./Sounds/click.wav");
                this.game.camera.loadGuideMenu();
            }
            else if ((this.game.mouse.x >= 700 && this.game.mouse.x <= 1110) && (this.game.mouse.y >= 665 && this.game.mouse.y <= 750)
                && (this.game.click)) {
                ASSET_MANAGER.playAsset("./Sounds/click.wav");
                this.game.camera.loadCreditsMenu();
            }
            
        }
        
        
    };

    draw(ctx) {
        
        ctx.fillStyle = "darkslategrey";
        var fontsize = 175;
        ctx.font = fontsize + 'px "VT323"';
        // Title
        ctx.fillText("CAST TO THE SHADOWS", this.TITLE_POS.X, this.TITLE_POS.Y);

        fontsize = 150;
        ctx.font = fontsize + 'px "VT323"';
        
        if (this.game.mouse != null) {
            this.drawStart(ctx);
            this.drawControls(ctx);
            this.drawGuide(ctx);
            this.drawCredits(ctx);
        }
    };

    drawStart(ctx) {

        if ((this.game.mouse.x >= 750 && this.game.mouse.x <= 1040) && (this.game.mouse.y >= 215 && this.game.mouse.y <= 300)) {
            ctx.fillStyle = "White";
            ctx.fillText("Start", this.START_POS.X, this.START_POS.Y);
        }
        else {
            ctx.fillStyle = "Gray";
            ctx.fillText("Start", this.START_POS.X, this.START_POS.Y);
        }
        
    };

    drawControls(ctx) {

        if ((this.game.mouse.x >= 675 && this.game.mouse.x <= 1150) && (this.game.mouse.y >= 365 && this.game.mouse.y <= 450)) {
            ctx.fillStyle = "White";
            ctx.fillText("Controls", this.CONTROLS_POS.X, this.CONTROLS_POS.Y);
        }
        else {
            ctx.fillStyle = "Gray";
            ctx.fillText("Controls", this.CONTROLS_POS.X, this.CONTROLS_POS.Y);
        }

    };

    drawGuide(ctx) {

        if ((this.game.mouse.x >= 750 && this.game.mouse.x <= 1050) && (this.game.mouse.y >= 515 && this.game.mouse.y <= 600)) {
            ctx.fillStyle = "White";
            ctx.fillText("Guide", this.GUIDE_POS.X, this.GUIDE_POS.Y);
        }
        else {
            ctx.fillStyle = "Gray";
            ctx.fillText("Guide", this.GUIDE_POS.X, this.GUIDE_POS.Y);
        }

    };

    drawCredits(ctx) {

        if ((this.game.mouse.x >= 700 && this.game.mouse.x <= 1110) && (this.game.mouse.y >= 665 && this.game.mouse.y <= 750)) {
            ctx.fillStyle = "White";
            ctx.fillText("Credits", this.CREDITS_POS.X, this.CREDITS_POS.Y);
        }
        else {
            ctx.fillStyle = "Gray";
            ctx.fillText("Credits", this.CREDITS_POS.X, this.CREDITS_POS.Y);
        }

    };
}