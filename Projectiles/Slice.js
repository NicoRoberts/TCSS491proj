class Slice {

    constructor(game, x, y, angle) {
        Object.assign(this, {game, x, y, angle });


        this.width = 48;
        this.height = 48;

        this.velocity = { x: 0, y: 0 };

        this.reach = 0;
        this.center = { x: this.reach * Math.cos(this.angle), y: this.reach * Math.sin(this.angle) }
        this.positionx = (this.x + this.center.x) - (this.width/2);
        this.positiony = (this.y + this.center.y) - (this.height/2);

        

        this.spritesheet = ASSET_MANAGER.getAsset("./Sprites/Machete.png");   

        this.hitbox = new HitBox(this, this.width, this.height, true);

        this.damage = 20;
       
    }
    update() {

        const TICKSCALE = this.game.clockTick * PARAMS.TIMESCALE;

        var that = this;
        this.game.entities.forEach(function (entity) {
            if (entity instanceof Enemy) {
                if (that.hitbox.collide(entity.hitbox)) {
                    entity.hit = true;
                    that.removeFromWorld = true;
                    entity.hpCurrent -= that.damage; // slice damage
                }
            }
        }, false);

        this.hitbox.update();

    }
    draw(ctx) {

        //ctx.drawImage(this.spritesheet, this.positionx - this.RADIUS, this.positiony - this.RADIUS, PARAMS.PIXELSCALER * 2, PARAMS.PIXELSCALER * 2);

        
        if (PARAMS.DEBUG) {

            this.hitbox.draw(ctx);
        }



    }
}