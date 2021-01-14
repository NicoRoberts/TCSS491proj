class BottomBoundary {
    constructor(game, x, y, w) {
        Object.assign(this, { game, x, y, w });

        this.spritesheet = ASSET_MANAGER.getAsset("./images/tile.png");

        this.BB = new BoundingBox(this.x, this.y, this.w, PARAMS.TILEHEIGHT / 2); 

    
    };

    update() {
    };

    draw(ctx) {
        let tileCount = this.w / PARAMS.TILEWIDTH;       
        for (var i = 0; i < tileCount; i++) {
            //BOTTOM
            ctx.drawImage(this.spritesheet,0,0,32,32, this.x + i * PARAMS.TILEWIDTH, this.y, PARAMS.TILEWIDTH, PARAMS.TILEHEIGHT);  
        }
        if (PARAMS.DEBUG) {
            ctx.strokeStyle = 'Red';
            ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        }       
    };
};

class TopBoundary {
    constructor(game, x, y, w) {
        Object.assign(this, { game, x, y, w });

        this.spritesheet = ASSET_MANAGER.getAsset("./images/tile.png");

        this.BB = new BoundingBox(this.x, this.y + (PARAMS.TILEWIDTH / 2), this.w, PARAMS.TILEHEIGHT / 2); 
    
    };

    update() {
    };


    draw(ctx) {
        let tileCount = this.w / PARAMS.TILEWIDTH;
        
        for (var i = 0; i < tileCount; i++) {
            //BOTTOM
            ctx.drawImage(this.spritesheet,0,0,32,32, this.x + i * PARAMS.TILEWIDTH, this.y, PARAMS.TILEWIDTH, PARAMS.TILEHEIGHT);
           
       
        }

        if (PARAMS.DEBUG) {
            ctx.strokeStyle = 'Red';
            ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        }
        
    };
};

class LeftBoundary {
    constructor(game, x, y, w) {
        Object.assign(this, { game, x, y, w });

        this.spritesheet = ASSET_MANAGER.getAsset("./images/tile.png");
        
        this.BB = new BoundingBox(this.x + (PARAMS.TILEWIDTH / 2), this.y, PARAMS.TILEWIDTH / 2, this.w); //this.w is passed for the height, refractor if there is time.

        //Tile is 32 x 32 (width x height)
    
    };

    update() {
    };


    draw(ctx) {
        let tileCount = (this.w / PARAMS.TILEHEIGHT);
        
        for (var i = 0; i < tileCount; i++) {
            ctx.drawImage(this.spritesheet,0,0,32,32, this.x, this.y  + i * PARAMS.TILEHEIGHT, PARAMS.TILEWIDTH, PARAMS.TILEHEIGHT);  
        }

        if (PARAMS.DEBUG) {
            ctx.strokeStyle = 'Red';
            ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        }
        
    };
};

class RightBoundary {
    constructor(game, x, y, w) {
        Object.assign(this, { game, x, y, w });

        this.spritesheet = ASSET_MANAGER.getAsset("./images/tile.png");

        this.BB = new BoundingBox(this.x, this.y, PARAMS.TILEWIDTH / 2, this.w); //this.w is passed for the height, refractor if there is time.
        //Tile is 32 x 32 (width x height)
    
    };

    update() {
    };


    draw(ctx) {
        let tileCount = (this.w / PARAMS.TILEHEIGHT);
        
        for (var i = 0; i < tileCount; i++) {
            ctx.drawImage(this.spritesheet,0,0,32,32, this.x, this.y  + i * PARAMS.TILEHEIGHT, PARAMS.TILEWIDTH, PARAMS.TILEHEIGHT);
        }

        if (PARAMS.DEBUG) {
            ctx.strokeStyle = 'Red';
            ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        }
        
    };
};