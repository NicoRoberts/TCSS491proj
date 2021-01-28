class Bullet {

    SPEED = 5;

    RADIUS = 3;

    constructor(game, x, y, angle) {
        Object.assign(this, { game, x, y, angle });

        this.positionx = this.x - this.game.camera.x;
        this.positiony = this.y - this.game.camera.y;

        this.spritesheet = ASSET_MANAGER.getAsset("./Sprites/Bullet.png");

        this.addedVelocity = { x: this.game.player.velocity.x, y: this.game.player.velocity.y}

        this.damage = 20;
    }
    update() {

        const TICKSCALE = this.game.clockTick * PARAMS.TIMESCALE;

        this.positionx = this.x - this.game.camera.x;
        this.positiony = this.y - this.game.camera.y;

        this.x += this.SPEED * Math.cos(this.angle) * TICKSCALE + this.addedVelocity.x;
        this.y += this.SPEED * Math.sin(this.angle) * TICKSCALE + this.addedVelocity.y;

        if (this.positionx < 0 || this.positiony < 0 || this.positionx > this.game.ctx.canvas.width || this.positiony > this.game.ctx.canvas.height ) {
            this.removeFromWorld = true;
        }

        var that = this;
        this.game.entities.forEach(function (entity) {
            if (entity instanceof Enemy) {
                if (that.x > entity.BB.x && that.x < entity.BB.x + entity.BB.width
                    && that.y > entity.BB.y && that.y < entity.BB.y + entity.BB.height) {
                    entity.hit = true;
                    that.removeFromWorld = true;
                    entity.hpCurrent -= that.damage; // bullet damage
                }
            }
        },false);

    }
    draw(ctx) {

        ctx.drawImage(this.spritesheet, this.positionx - this.RADIUS, this.positiony - this.RADIUS, PARAMS.PIXELSCALER * 2, PARAMS.PIXELSCALER * 2);

        if (PARAMS.DEBUG) {
            ctx.strokeStyle = "Red";
            ctx.beginPath();
            ctx.arc(this.positionx, this.positiony, this.RADIUS, 0, 2 * Math.PI);
            ctx.stroke();
        }

        
        
    }
}