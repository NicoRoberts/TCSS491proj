class Bullet {

    constructor(game, x, y, angle, damage = 20) {
        Object.assign(this, { game, x, y, angle,damage});

        this.SPEED = 7;

        this.RADIUS = 3;

        const TICKSCALE = this.game.clockTick * PARAMS.TIMESCALE;

        this.positionx = this.x - this.game.camera.x;
        this.positiony = this.y - this.game.camera.y;

        this.spritesheet = ASSET_MANAGER.getAsset("./Sprites/Bullet.png");

        this.velocity = { x: 0, y: 0 }

        this.hitbox = new HitBox(this, this.RADIUS * 2, this.RADIUS * 2, true, -1*this.RADIUS, -1*this.RADIUS);
        this.hitdealt = false;

        this.update();
    }
    update() {

        const TICKSCALE = this.game.clockTick * PARAMS.TIMESCALE;

        this.positionx = this.x - this.game.camera.x;
        this.positiony = this.y - this.game.camera.y;

        this.x += this.SPEED * Math.cos(this.angle) * TICKSCALE + this.velocity.x;
        this.y += this.SPEED * Math.sin(this.angle) * TICKSCALE + this.velocity.y;

        if (this.positionx < 0 || this.positiony < 0 || this.positionx > this.game.ctx.canvas.width || this.positiony > this.game.ctx.canvas.height) {
            this.removeFromWorld = true;
        }

        var that = this;
        this.game.entities.forEach(function (entity) {
            if (!that.hitdealt) {
                if (entity instanceof AbstractEnemy) {
                    if (that.hitbox.willCollide(entity.hitbox)) {
                        that.hitdealt = true;
                        entity.hit = true;
                        that.removeFromWorld = true;
                        entity.hpCurrent -= that.damage; // bullet damage
                    }
                }
            }
        }, false);

        this.hitbox.update();

    }2
    draw(ctx) {

        ctx.drawImage(this.spritesheet, this.positionx - this.RADIUS, this.positiony - this.RADIUS, PARAMS.PIXELSCALER * 2, PARAMS.PIXELSCALER * 2);

        if (PARAMS.DEBUG) {

            this.hitbox.draw(ctx);
        }

        
        
    }
}