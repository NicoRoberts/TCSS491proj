class YachtMap {

    constructor(game, x, y) {
        Object.assign(this, {game, x, y});

        this.spritesheet = ASSET_MANAGER.getAsset("./Maps/YachtMap.png");

        this.width = 960;
        this.height = 1440;

        this.positionx = this.x - this.game.camera.x;
        this.positiony = this.y - this.game.camera.y;

        this.priority = 1;

        this.yachtMap = new Animator(this.spritesheet, 0, 0, this.width, this.height, 1, 1, 0, false, true);

        //this.hitbox = new HitBox(this, this.width, this.height, true);
        
    };

    update() {

        this.positionx = this.x - this.game.camera.x;
        this.positiony = this.y - this.game.camera.y;
        //this.hitbox.update();
    };

    draw(ctx) {
        if (PARAMS.DEBUG) {
            //this.hitbox.draw(ctx);
        }
        this.yachtMap.drawFrame(this.game.clockTick, this.game.ctx, this.positionx, this.positiony, 1);

    };
}