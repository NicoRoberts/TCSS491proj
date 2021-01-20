class Weapon {

    DIRECTION = {
		RIGHT: 0,
		LEFT: 1,
		COUNT: 2
	};

    constructor(game, spritePath) {
        Object.assign(this, { game, spritePath });

        this.spritesheet = ASSET_MANAGER.getAsset(this.spritePath);

        this.width = 8;
        this.height = 8;

        this.direction = this.DIRECTION.RIGHT;

        //RAY FROM CENTER OF PLAYER
        this.x = this.game.player.x + this.game.player.width * PARAMS.PIXELSCALER / 2;
        this.y = this.game.player.y + this.game.player.height * PARAMS.PIXELSCALER / 2;
        
    }

    update() {
        //RAY FROM CENTER OF PLAYER
        this.x = this.game.player.x + this.game.player.width * PARAMS.PIXELSCALER / 2;
        this.y = this.game.player.y + this.game.player.height * PARAMS.PIXELSCALER / 2;

        if (this.game.mouse != null) {
            this.destination = { x: this.game.mouse.x, y: this.game.mouse.y };
            this.angle = Math.atan((this.game.mouse.y - this.y) / (this.game.mouse.x - this.x))
            this.angle = this.game.mouse.x >= this.x ? this.angle : this.angle + Math.PI;
            this.direction = this.game.mouse.x >= this.x ? this.DIRECTION.RIGHT : this.DIRECTION.LEFT;
            
        }
    }

    draw(ctx) {
        //Put PARAMS.DEBUG after
        
        if (this.game.mouse != null) {
            if (PARAMS.DEBUG) {
                ctx.strokeStyle = this.game.click ? "Blue" : "Red";
                
                ctx.beginPath();       
                ctx.moveTo(this.x, this.y);    
                ctx.lineTo(this.destination.x, this.destination.y);  
                ctx.stroke();          
            }

            // Create a seperate canvas for rotation
            var rotationCanvas = document.createElement('canvas');

            //Multiply by 2 to fit the whole image
            rotationCanvas.width = this.width * PARAMS.PIXELSCALER*2;
            rotationCanvas.height = this.height * PARAMS.PIXELSCALER*2;
            var rotationCtx = rotationCanvas.getContext('2d');
            rotationCtx.save();

            rotationCtx.translate(this.width * PARAMS.PIXELSCALER, this.height * PARAMS.PIXELSCALER);
            rotationCtx.rotate(this.angle);
            rotationCtx.translate(-1 * this.width * PARAMS.PIXELSCALER, -1 * this.height * PARAMS.PIXELSCALER);

            let offset = this.direction == this.DIRECTION.RIGHT ? 0 : this.width * PARAMS.PIXELSCALER;

            rotationCtx.drawImage(this.spritesheet, 1 + offset,
                1, this.width * PARAMS.PIXELSCALER, this.height * PARAMS.PIXELSCALER,
                this.width * PARAMS.PIXELSCALER / 2,
                this.height * PARAMS.PIXELSCALER / 2,
                this.width * PARAMS.PIXELSCALER, this.height * PARAMS.PIXELSCALER);
            
            if (PARAMS.DEBUG) {
                rotationCtx.strokeStyle = 'Red';
                rotationCtx.strokeRect(this.width * PARAMS.PIXELSCALER / 2,
                                    this.height * PARAMS.PIXELSCALER / 2,
                                    this.width * PARAMS.PIXELSCALER,
                                    this.height * PARAMS.PIXELSCALER);
            }

            rotationCtx.restore();
            ctx.drawImage(rotationCanvas, this.x - this.width * PARAMS.PIXELSCALER,
                this.y - this.height * PARAMS.PIXELSCALER,
                this.width * PARAMS.PIXELSCALER*2, this.height * PARAMS.PIXELSCALER*2);
           
        }
    }
}