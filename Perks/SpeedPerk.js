class SpeedPerk {

    constructor(game, x, y) {
        Object.assign(this, {game, x, y});

        this.spritesheet = ASSET_MANAGER.getAsset("./Sprites/Boosts/SpeedBoostSprite.png");

        this.width = 34;
        this.height = 34;

        this.positionx = this.x - this.game.camera.x;
        this.positiony = this.y - this.game.camera.y;
        
        this.priority = 4;
        this.cost = 4;

        this.perk = new Animator(this.spritesheet, 0, 0, this.width, this.height, 4, 0.25, 0, false, true);        

        this.hitbox = new HitBox(this, this.width, this.height, true);
        
    };

    update() {

        this.positionx = this.x - this.game.camera.x;
        this.positiony = this.y - this.game.camera.y;
        this.hitbox.update();

    };

    draw(ctx) {
        if (PARAMS.DEBUG) {
            this.hitbox.draw(ctx);
        }
        this.perk.drawFrame(this.game.clockTick, this.game.ctx, this.positionx, this.positiony, 1);
        
        // prints description when player hovers on item
        if (this.game.player.hitbox.collide(this.hitbox)) {
            ctx.fillStyle = "White";
            var fontsize = 50;
            ctx.font = fontsize + 'px "VT323"';

            ctx.fillText("Increases Movement Speed: " + this.cost + " Coins", this.game.player.positionx, this.game.player.positiony - 25);  // - 25 for offset
        }
    };
}