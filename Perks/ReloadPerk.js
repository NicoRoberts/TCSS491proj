class ReloadPerk {

    constructor(game, x, y) {
        Object.assign(this, {game, x, y});

        this.spritesheet = ASSET_MANAGER.getAsset("./Sprites/Boosts/ReloadBoostSprite.png");

        this.width = 34;
        this.height = 34;

        this.positionx = this.x - this.game.camera.x;
        this.positiony = this.y - this.game.camera.y;
        
        this.priority = 2;

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
    };
}