class Bullet {

    SPEED = 7;

    RADIUS = 3;

    constructor(game, x, y, angle) {
        Object.assign(this, { game, x, y, angle });


        const TICKSCALE = this.game.clockTick * PARAMS.TIMESCALE;

        this.positionx = this.x - this.game.camera.x;
        this.positiony = this.y - this.game.camera.y;

        console.log("x: " + this.positionx + " y: " +this.positiony);

        this.spritesheet = ASSET_MANAGER.getAsset("./Sprites/Bullet.png");

        this.velocity = { x: this.game.player.velocity.x, y: this.game.player.velocity.y }

        this.hitbox = new HitBox(this, this.RADIUS * 2, this.RADIUS * 2, false, -1*this.RADIUS, -1*this.RADIUS);

        this.damage = 20;

        this.update();
    }
    update() {

        const TICKSCALE = this.game.clockTick * PARAMS.TIMESCALE;

        this.positionx = this.x - this.game.camera.x;
        this.positiony = this.y - this.game.camera.y;

        this.x += this.SPEED * Math.cos(this.angle) * TICKSCALE + this.velocity.x;
        this.y += this.SPEED * Math.sin(this.angle) * TICKSCALE + this.velocity.y;

        if (this.positionx < 0 || this.positiony < 0 || this.positionx > this.game.ctx.canvas.width || this.positiony > this.game.ctx.canvas.height ) {
            this.removeFromWorld = true;
        }

        var that = this;
        this.game.entities.forEach(function (entity) {
            if (entity instanceof Enemy) {
                console.log(that.hitbox.collide(entity.hitbox));
                if (that.hitbox.collide(entity.hitbox)) {
                    console.log("HIT");
                    entity.hit = true;
                    that.removeFromWorld = true;
                    entity.hpCurrent -= that.damage; // bullet damage
                }
            }
        }, false);

        this.hitbox.update();

    }
    draw(ctx) {

        ctx.drawImage(this.spritesheet, this.positionx - this.RADIUS, this.positiony - this.RADIUS, PARAMS.PIXELSCALER * 2, PARAMS.PIXELSCALER * 2);

        if (PARAMS.DEBUG) {

            this.hitbox.draw(ctx);
        }

        
        
    }
}