class Darkness {
    constructor(game) {
        this.game = game;
        this.priority = 50;
        this.darkness = ASSET_MANAGER.getAsset("./Sprites/Darkness.png");
        
    }
    update() {
        //console.log("DARKNESS");
        //DO NOTHING
    }
    draw(ctx) {
        if (!PARAMS.DEBUG) {
            ctx.drawImage(this.darkness, 0, 0, ctx.canvas.width, ctx.canvas.height);
        }
        
    }
}