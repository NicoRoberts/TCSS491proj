class Boundary {

}

class HBoundary {
    constructor(game, x, y, w, type) {
        Object.assign(this, { game, x, y, w, type});
        
        this.spritesheet = ASSET_MANAGER.getAsset("./images/tile.png");

        this.velocity = { x: 0, y: 0 };
        this.hitbox = new HitBox(this, this.w, PARAMS.TILEHEIGHT);
        this.priority = 1;
    };

    update() {
     
        this.positionx = this.x-this.game.camera.x;
        this.positiony = this.y - this.game.camera.y;
        this.hitbox.update();
    };

    draw(ctx) {
        let tileCount = this.w / PARAMS.TILEWIDTH;       
        for (var i = 0; i < tileCount; i++) {
            //BOTTOM
            ctx.drawImage(this.spritesheet, 0, 0, 32, 32, this.positionx + i * PARAMS.TILEWIDTH, this.positiony, PARAMS.TILEWIDTH, PARAMS.TILEHEIGHT);  
        }
        if (PARAMS.DEBUG) {
            this.hitbox.draw(ctx);
        }       
    };
};


class VBoundary {
    constructor(game, x, y, w, type) {
        Object.assign(this, { game, x, y, w, type });

        this.spritesheet = ASSET_MANAGER.getAsset("./images/tile.png");

        this.velocity = { x: 0, y: 0 };
        this.hitbox = new HitBox(this, PARAMS.TILEHEIGHT, this.w);
        this.priority = 1;
    
    };

    update() {
        
        this.positionx = this.x - this.game.camera.x;
        this.positiony = this.y - this.game.camera.y;
        this.hitbox.update();
    };


    draw(ctx) {
        let tileCount = (this.w / PARAMS.TILEHEIGHT);
        
        for (var i = 0; i < tileCount; i++) {
            ctx.drawImage(this.spritesheet,0,0,32,32, this.x - this.game.camera.x, this.y  + i * PARAMS.TILEHEIGHT - this.game.camera.y, PARAMS.TILEWIDTH, PARAMS.TILEHEIGHT);  
        }

        if (PARAMS.DEBUG) {
            this.hitbox.draw(ctx);
        }
        
    };
};
