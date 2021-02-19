class Marriyacht {

    constructor(game, x, y) {
        Object.assign(this, {game, x, y});

        this.spritesheet = ASSET_MANAGER.getAsset("./Sprites/YachtSprite.png");

        this.scale = 1;
        this.width = 152;
        this.height = 288;

        this.destinationy = 1728;
        this.finaldestinationy = this.destinationy * 2 + 300;

        this.positionx = this.x - this.game.camera.x;
        this.positiony = this.y - this.game.camera.y;

        this.priority = 2;
        this.speed = 2.5; // original speed is 2.5

        this.docked = new Animator(this.spritesheet, 0, this.height, this.width, this.height, 4, 0.25, 0, false, true);
        this.moving = new Animator(this.spritesheet, 0, 0, this.width, this.height, 4, 0.1, 0, false, true);

        this.hitbox = new HitBox(this, this.width * this.scale, this.height * this.scale, false);
        
    };



    update() {
        const TICKSCALE = this.game.clockTick * PARAMS.TIMESCALE;
        //console.log("UPDATE IN: " + this.game.stage);
        if (this.game.stage == "arrival" || this.game.stage == "departure") {
            this.y += this.speed*TICKSCALE;
            this.positionx = this.x - this.game.camera.x;
            this.positiony = this.y - this.game.camera.y;
        }
        else {            
            this.positionx = this.x - this.game.camera.x;
            this.positiony = this.y - this.game.camera.y;
            this.hitbox.update();
        }
        if (this.y >= this.destinationy && !(this.game.stage == "survival") && !(this.game.stage == "departure")) {
            this.game.camera.loadSurvivalStage();
        }
        if (this.y >= this.finaldestinationy && !(this.game.stage == "yacht")) {
            this.game.camera.loadYachtStage();
        }
        this.hitbox.update();
        
    };

    draw(ctx) {
        if (PARAMS.DEBUG) {
            this.hitbox.draw(ctx);
        }
        if (this.game.stage == "survival") {
            this.docked.drawFrame(this.game.clockTick, this.game.ctx, this.positionx, this.positiony, 1 * this.scale);
        }
        else {
            this.moving.drawFrame(this.game.clockTick, this.game.ctx, this.positionx, this.positiony, 1 * this.scale);
        }
       

    };
}