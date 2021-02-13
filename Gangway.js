class Gangway {

    constructor(game, x, y) {
        Object.assign(this, {game, x, y});

        this.positionx = this.x - this.game.camera.x;
        this.positiony = this.y - this.game.camera.y;

        this.hitbox = new HitBox(this, 25, 250, false);
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

    };
}