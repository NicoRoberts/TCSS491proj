class AmmoPack {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y })

        this.width = 28;
        this.height = 32;

        this.positionx = this.x - this.game.camera.x;
        this.positiony = this.y - this.game.camera.y;

        this.hitbox = new HitBox(this, this.width, this.height, true);

        this.spritesheet = ASSET_MANAGER.getAsset("./Sprites/AmmoSprite.png");
        this.animation = new Animator(this.spritesheet, 1, 1, this.width, this.height, 8, 0.1, 2, false, true);
        this.priority = 4;

        this.cost = 2;
    }

    update() {
        this.positionx = this.x - this.game.camera.x;
        this.positiony = this.y - this.game.camera.y;

        this.hitbox.update();
    }

    draw(ctx) {
        if (PARAMS.DEBUG) {
            this.hitbox.draw(ctx);
        }
        this.animation.drawFrame(this.game.clockTick, ctx, this.positionx, this.positiony, 1);

        if (this.game.stage == "yacht") {
            if (this.game.player.hitbox.collide(this.hitbox)) {
                ctx.fillStyle = "White";
                var fontsize = 50;
                ctx.font = fontsize + 'px "VT323"';

                ctx.fillText("Refill Ammo: " + this.cost + " Coins", this.game.player.positionx - 300, this.game.player.positiony + 137.5);
                let message;
                if (this.game.weapon.reservesCount == this.game.weapon.maxReserves) {
                    message = "Ammo already full";
                }
                else if (this.game.player.coins < this.cost) {
                    message = "Not enough coins!";
                }
                else {
                    message = "Press E to purchase";
                }
                ctx.fillText(message, this.game.player.positionx - 287.5, this.game.player.positiony + 187.5);
            }
        }
    }
}