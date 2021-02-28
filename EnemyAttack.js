class EnemyAttack {

    constructor(game, x, y, angle, width, height) {
        Object.assign(this, {game, x, y, angle, width, height });


    

        this.velocity = { x: 0, y: 0 };

        this.reach = 0;
        
        this.positionx = this.x - this.game.camera.x;
        this.positiony = this.y - this.game.camera.y;
        this.hitdealt = false;

        console.log(this.game.entity);

        //this.spritesheet = ASSET_MANAGER.getAsset("./Sprites/Slice.png");

       
        var offset = 10;
        this.hitbox = new HitBox(this, this.width + offset*2, this.height + offset*2, true,  -1 * offset, -1 * offset);

        this.damage = 5;
       
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
                    //entity.hpCurrent -= 0;
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