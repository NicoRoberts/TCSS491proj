class Weapon {
    constructor(game, spritePath) {
        Object.assign(this, { game, spritePath });

        this.spritesheet = ASSET_MANAGER.getAsset(this.spritePath);

        this.width = 8;
        this.height = 8;

        //RAY FROM CENTER OF PLAYER
        this.x = this.game.player.x + this.game.player.width * PARAMS.PIXELSCALER / 2;
        this.y = this.game.player.y + this.game.player.height * PARAMS.PIXELSCALER / 2;

        this.loadAnimations();
        
    }

    loadAnimations() {
        this.animation = new Animator(this.spritesheet, 0, 0, this.width * PARAMS.PIXELSCALER, this.height * PARAMS.PIXELSCALER,1,1,0,false,true)
    }

    update() {
        //RAY FROM CENTER OF PLAYER
        this.x = this.game.player.x + this.game.player.width * PARAMS.PIXELSCALER / 2;
        this.y = this.game.player.y + this.game.player.height * PARAMS.PIXELSCALER / 2;
    }

    draw(ctx) {
        //Put PARAMS.DEBUG after
        
        if (this.game.mouse != null) {
            let destination = {x:this.game.mouse.x, y:this.game.mouse.y };
            if (PARAMS.DEBUG) {
                ctx.strokeStyle = this.game.click ? "Blue" : "Red";
                
                ctx.beginPath();       // Start a new path
                ctx.moveTo(this.x, this.y);    
                ctx.lineTo(destination.x, destination.y);  
                ctx.stroke();          
            }

            this.animation.drawFrame(this.game.clockTick, ctx,
                this.x - this.width * PARAMS.PIXELSCALER / 2,
                this.y - this.height * PARAMS.PIXELSCALER / 2, 1)
            
        }
    }
}