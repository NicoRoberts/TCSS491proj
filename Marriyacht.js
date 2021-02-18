class Marriyacht {

    constructor(game, x, y) {
        Object.assign(this, {game, x, y});

        this.spritesheet = ASSET_MANAGER.getAsset("./Sprites/YachtSprite.png");

        this.scale = 1;
        this.width = 152;
        this.height = 288;

        this.positionx = this.x - this.game.camera.x;
        this.positiony = this.y - this.game.camera.y;

        this.priority = 2;

        this.marriyacht = new Animator(this.spritesheet, 0, this.height, this.width, this.height, 4, 0.25, 0, false, true);

        this.hitbox = new HitBox(this, this.width * this.scale, this.height * this.scale, false);
        
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
        this.marriyacht.drawFrame(this.game.clockTick, this.game.ctx, this.positionx, this.positiony, 1 * this.scale);

    };
}