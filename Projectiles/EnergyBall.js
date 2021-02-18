class EnergyBall{

    constructor(game, x, y, angle, damage = 20) {
        Object.assign(this, { game, x, y, angle,damage});

        this.SPEED = 3;

        this.RADIUS = 32;
        this.height = this.RADIUS * 2;
        this.width = this.RADIUS * 2;

        const TICKSCALE = this.game.clockTick * PARAMS.TIMESCALE;

        this.positionx = this.x - this.game.camera.x;
        this.positiony = this.y - this.game.camera.y;

        this.spritesheet = ASSET_MANAGER.getAsset("./Sprites/ChargeSheet.png");

        this.velocity = { x: 0, y: 0 }


        this.animation = new Animator(this.spritesheet, 1, 1, this.RADIUS, this.RADIUS, 3, 0.15, 2, false, true);

        this.hitbox = new HitBox(this, this.RADIUS, this.RADIUS, true);
        this.hitdealt = false;

        this.priority = 3;

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
            if (!that.hitdealt) {
                if (entity instanceof Player) {
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

        this.animation.drawFrame(this.game.clockTick, ctx, this.positionx, this.positiony,1)
        if (PARAMS.DEBUG) {

            this.hitbox.draw(ctx);
        }

        
        
    }
}