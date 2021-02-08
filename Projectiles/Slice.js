class Slice {

    constructor(game, x, y, angle) {
        Object.assign(this, {game, x, y, angle });


        this.width = 48;
        this.height = 48;

        this.velocity = { x: 0, y: 0 };

        this.reach = 0;
        this.center = { x: this.reach * Math.cos(this.angle), y: this.reach * Math.sin(this.angle) }
        this.positionx = (this.x + this.center.x) - (this.width/2);
        this.positiony = (this.y + this.center.y) - (this.height / 2);
        this.hitdealt = false;

        

        this.spritesheet = ASSET_MANAGER.getAsset("./Sprites/Slice.png");

        let sprite_offset = this.getSwipeState();
        this.animation = new Animator(this.spritesheet, 1, 1 + sprite_offset * this.height + 2 * sprite_offset, this.width, this.height, 6, 0.025, 2, false, false)

        this.hitbox = new HitBox(this, this.width, this.height, true);

        this.damage = 20;
       
    }

    getSwipeState() {
        let num;
        let angle = this.angle*180/Math.PI;
        if (this.game.player.direction == this.game.player.DIRECTION.RIGHT) {
            if (-90 < angle && angle <= 0) {
                num = 0;
            }
            else if (0 < angle && angle <= 90) {
                num = 6
            }
            else if (90 < angle && angle <= 180) {
                num = 4
            }
            else {
                num = 2;
            }
            
        }
        else {

            if (90 > angle && angle >= 0) {
                num = 3;
            }
            else if (0 > angle && angle >= -90) {
                num = 5
            }
            else if (-90 > angle && angle >= -180) {
                num = 7
            }
            else {
                num = 1;
            }
            
        }

        return num;
    }
    update() {

        const TICKSCALE = this.game.clockTick * PARAMS.TIMESCALE;

        var that = this;
        this.game.entities.forEach(function (entity) {
            if (entity instanceof Enemy) {
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

        this.animation.drawFrame(this.game.clockTick, ctx, this.positionx, this.positiony,1)
        
        if (PARAMS.DEBUG) {
            this.hitbox.draw(ctx);
        }



    }
}