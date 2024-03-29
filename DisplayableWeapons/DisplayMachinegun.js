class DisplayMachinegun {

    constructor(game, x, y) {
        Object.assign(this, {game, x, y});

        this.spritesheet = ASSET_MANAGER.getAsset("./Sprites/WeaponsNoArm/Machinegun.png");
        
        this.width = 54;
        this.height = 36;

        this.positionx = this.x - this.game.camera.x;
        this.positiony = this.y - this.game.camera.y;

        this.priority = 5;
        this.cost = 8;

        this.machinegun = new Animator(this.spritesheet, 0, 0, this.width, this.height, 1, 1, 0, false, true);
        
        this.hitbox = new HitBox(this, this.width, this.height, true);
    };

    update() {

        this.positionx = this.x - this.game.camera.x;
        this.positiony = this.y - this.game.camera.y;
        this.hitbox.update();

    };

    draw(ctx) {
        if (PARAMS.DEBUG) {
            this.hitbox.draw(ctx);
        }
        this.machinegun.drawFrame(this.game.clockTick, this.game.ctx, this.positionx, this.positiony, 1);

        // prints description when player hovers on item
        if (this.game.player.hitbox.collide(this.hitbox)) {
            ctx.fillStyle = "White";
            var fontsize = 50;
            ctx.font = fontsize + 'px "VT323"';

            ctx.fillText("Machinegun: " + this.cost + " Coins", this.game.player.positionx, this.game.player.positiony - 75);  // - 75 for offset
            let message;
            if (this.game.player.coins < this.cost) {
                message = "Not enough coins!";
            }
            else {
                message = "Press E to purchase";
            }
            ctx.fillText(message, this.game.player.positionx, this.game.player.positiony - 25);
        }
    };
}