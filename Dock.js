class Dock {

    constructor(game, x, y) {
        Object.assign(this, {game, x, y});

        this.spritesheet = ASSET_MANAGER.getAsset("./Sprites/Dock.png");

        this.scale = .5;
        this.width = 160;
        this.height = 160;

        this.positionx = this.x - this.game.camera.x;
        this.positiony = this.y - this.game.camera.y;

        this.priority = 2;

        this.dock = new Animator(this.spritesheet, 0, 0, this.width, this.height, 1, 1, 0, false, true);

        this.hitbox = new HitBox(this, this.width * this.scale, this.height * this.scale, true);
        
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
        this.dock.drawFrame(this.game.clockTick, this.game.ctx, this.positionx, this.positiony, 1 * this.scale);

    };
}