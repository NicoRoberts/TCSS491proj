class EnemyAttack {

    constructor(game, x, y, angle) {
        Object.assign(this, {game, x, y, angle });


        this.width = 48;
        this.height = 48;

        this.velocity = { x: 0, y: 0 };

        this.reach = 0;
        
        this.positionx = this.x - this.game.camera.x;
        this.positiony = this.y - this.game.camera.y;
        this.hitdealt = false;

        

        //this.spritesheet = ASSET_MANAGER.getAsset("./Sprites/Slice.png");


        this.hitbox = new HitBox(this, this.width, this.height, true);

        this.damage = 25;
       
    }

    update() {

        const TICKSCALE = this.game.clockTick * PARAMS.TIMESCALE;
        this.positionx = this.x - this.game.camera.x;
        this.positiony = this.y - this.game.camera.y;
        
        var that = this;
        this.game.entities.forEach(function (entity) {
            if (entity instanceof Player) {
                if (that.hitbox.collide(entity.hitbox) && (!that.hitdealt)) {
                    that.hitdealt = true;
                    entity.hit = true;
                    entity.hpCurrent -= that.damage; // slice damage
                }
            }
        }, false);

        this.hitbox.update();

    }
    draw(ctx) {

        
        if (PARAMS.DEBUG) {

           
            this.hitbox.draw(ctx);
        }



    }
}