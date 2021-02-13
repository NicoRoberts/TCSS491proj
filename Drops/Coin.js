class Coin {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y })

        this.width = 28;
        this.height = 32;

        this.positionx = this.x - this.game.camera.x;
        this.positiony = this.y - this.game.camera.y;

        this.hitbox = new HitBox(this, this.width, this.height, true);

        this.spritesheet = ASSET_MANAGER.getAsset("./Sprites/CoinSprite.png");
        this.animation = new Animator(this.spritesheet, 1, 1, this.width, this.height, 8, 0.1, 2, false, true);
        this.priority = 4;
    }

    update() {
        this.positionx = this.x - this.game.camera.x;
        this.positiony = this.y - this.game.camera.y;

        this.hitbox.update();
    }

    draw(ctx) {
        if (PARAMS.DEBUG) {
            this.hitbox.draw(ctx);
        }
        this.animation.drawFrame(this.game.clockTick, ctx, this.positionx, this.positiony, 1);
    }
}