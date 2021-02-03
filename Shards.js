class Shards {

    constructor(game, x, y) {
        Object.assign(this, {game, x, y});

        this.spritesheet = ASSET_MANAGER.getAsset("./Sprites/Shard.png");

        this.width = 32;
        this.height = 32;

        // do later: implement a way to randomize shard location, ensure that shard is not spawned near player at start of a level
        this.positionx = 0;
        this.positiony = 0;

        this.priority = 2;

        this.shard = new Animator(this.spritesheet, 0, 0, this.width, this.height, 1, 1, 1, false, true);
        
        this.hitbox = new HitBox(this, this.width, this.height);
    
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
        this.shard.drawFrame(this.game.clockTick, this.game.ctx, this.positionx, this.positiony, 1);

    };
};