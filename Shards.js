class Shards {

    constructor(game, x, y) {
        Object.assign(this, {game, x, y});

        this.spritesheet = ASSET_MANAGER.getAsset("./Sprites/Shard.png");
        
        this.scale = 2;
        this.width = 18;
        this.height = 18;

        // do later: implement a way to randomize shard location, ensure that shard is not spawned near player at start of a level
        this.positionx = this.x - this.game.camera.x;
        this.positiony = this.y - this.game.camera.y;

        this.priority = 2;

        this.shard = new Animator(this.spritesheet, 0, 0, this.width, this.height, 6, 0.2, 0, false, true);
        
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
            ctx.beginPath();
            ctx.moveTo(this.game.player.x + this.game.player.y);
            ctx.lineTo(this.x, this.y);
            ctx.stroke();
        }
        this.shard.drawFrame(this.game.clockTick, this.game.ctx, this.positionx, this.positiony, 1 * this.scale);

    };
};