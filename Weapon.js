class Weapon {

    DIRECTION = {
		RIGHT: 0,
		LEFT: 1,
		COUNT: 2
	};

    constructor(game, spritePath) {
        Object.assign(this, { game, spritePath });

        this.spritesheet = ASSET_MANAGER.getAsset(this.spritePath);

        this.width = 16;
        this.height = 7;

        this.direction = this.DIRECTION.RIGHT;

        //ORIGIN CENTER OF PLAYER
        this.x = this.game.player.x + this.game.player.width;
        this.y = this.game.player.y + this.game.player.height;
        
    }

    update() {
        this.x = this.game.player.x;
        this.y = this.game.player.y;

        if (this.game.mouse != null) {

            let xOff = this.game.player.direction == this.DIRECTION.RIGHT ? 2.5 : 12;
            let yOff = 11;

            this.source = { x: this.x + xOff * PARAMS.PIXELSCALER, y: this.y + yOff * PARAMS.PIXELSCALER };
            this.destination = { x: this.game.mouse.x, y: this.game.mouse.y };
            this.angle = Math.atan((this.destination.y - this.source.y) / (this.destination.x - this.source.x))

            this.angle = this.game.mouse.x >= this.source.x ? this.angle : this.angle + Math.PI;
            this.direction = this.game.mouse.x >= this.source.x ? this.DIRECTION.RIGHT : this.DIRECTION.LEFT;

            this.angle = this.game.player.direction == this.DIRECTION.LEFT? this.angle - Math.PI: this.angle; 
            
        }
    }

    draw(ctx) {
        //Put PARAMS.DEBUG after
        
        if (this.game.mouse != null) {

            // Create a seperate canvas for rotation
            var rotationCanvas = document.createElement('canvas');

            //Multiply by 2 to fit the whole image
            rotationCanvas.width = this.width * PARAMS.PIXELSCALER*2;
            rotationCanvas.height = this.width * PARAMS.PIXELSCALER*2;
            var rotationCtx = rotationCanvas.getContext('2d');
            rotationCtx.save();


           

            //FACING RIGHT
            if (this.game.player.direction == this.DIRECTION.RIGHT) {
                rotationCtx.translate(1 * this.width * PARAMS.PIXELSCALER - 1 * PARAMS.PIXELSCALER, 1 * this.width * PARAMS.PIXELSCALER - 1 * PARAMS.PIXELSCALER);
                rotationCtx.rotate(this.angle);
                rotationCtx.translate(-1 * this.width * PARAMS.PIXELSCALER  -1 * PARAMS.PIXELSCALER, -1 * this.width * PARAMS.PIXELSCALER + 1 * PARAMS.PIXELSCALER);

                rotationCtx.drawImage(this.spritesheet, 1 + this.width * PARAMS.PIXELSCALER + 2,
                    1, this.width * PARAMS.PIXELSCALER, this.height * PARAMS.PIXELSCALER,
                    this.width * PARAMS.PIXELSCALER - 1 * PARAMS.PIXELSCALER,
                    this.width * PARAMS.PIXELSCALER - 6 * PARAMS.PIXELSCALER,
                    this.width * PARAMS.PIXELSCALER, this.height * PARAMS.PIXELSCALER);

                if (PARAMS.DEBUG) {
                    rotationCtx.strokeStyle = 'Red';
                    rotationCtx.strokeRect(this.width * PARAMS.PIXELSCALER - PARAMS.PIXELSCALER, this.width * PARAMS.PIXELSCALER - 6 * PARAMS.PIXELSCALER,
                        this.width * PARAMS.PIXELSCALER, this.height * PARAMS.PIXELSCALER);

                   // rotationCtx.strokeStyle = 'Orange';
                   // rotationCtx.strokeRect(0, 0,
                   //     this.width * PARAMS.PIXELSCALER * 2,
                   //     this.width * PARAMS.PIXELSCALER * 2);
                }
            }
            //FACING LEFT
            else {
                rotationCtx.translate(1 * this.width * PARAMS.PIXELSCALER - 1 * PARAMS.PIXELSCALER, 1 * this.width * PARAMS.PIXELSCALER - 1 * PARAMS.PIXELSCALER);
                rotationCtx.rotate(this.angle);
                rotationCtx.translate(-1 * this.width * PARAMS.PIXELSCALER + 1 * PARAMS.PIXELSCALER, -1 * this.width * PARAMS.PIXELSCALER + 1 * PARAMS.PIXELSCALER);

                rotationCtx.drawImage(this.spritesheet, 1 ,
                    1, this.width * PARAMS.PIXELSCALER, this.height * PARAMS.PIXELSCALER,
                    1 * PARAMS.PIXELSCALER,
                    this.width * PARAMS.PIXELSCALER - 6 * PARAMS.PIXELSCALER,
                    this.width * PARAMS.PIXELSCALER, this.height * PARAMS.PIXELSCALER);

                if (PARAMS.DEBUG) {
                    rotationCtx.strokeStyle = 'Red';
                    rotationCtx.strokeRect(1 * PARAMS.PIXELSCALER, this.width * PARAMS.PIXELSCALER - 6 * PARAMS.PIXELSCALER,
                        this.width * PARAMS.PIXELSCALER, this.height * PARAMS.PIXELSCALER);

                   // rotationCtx.strokeStyle = 'Orange';
                   // rotationCtx.strokeRect(0, 0,
                   //     this.width * PARAMS.PIXELSCALER * 2,
                   //     this.width * PARAMS.PIXELSCALER * 2);
                }
            }


            rotationCtx.restore();

            let xOff = this.game.player.direction == this.DIRECTION.RIGHT ? this.width * PARAMS.PIXELSCALER - 12* PARAMS.PIXELSCALER : PARAMS.PIXELSCALER;
            let yOff = 5;

            ctx.drawImage(rotationCanvas, this.x - xOff * PARAMS.PIXELSCALER, this.y - yOff* PARAMS.PIXELSCALER,
                this.width * PARAMS.PIXELSCALER * 2, this.width * PARAMS.PIXELSCALER * 2);


            if (PARAMS.DEBUG) {
                xOff = this.game.player.direction == this.DIRECTION.RIGHT ? 2.5 : 12;
                yOff = 11;

                ctx.strokeStyle = this.game.click ? "Blue" : "Red";
                ctx.beginPath();
                ctx.moveTo(this.x + xOff * PARAMS.PIXELSCALER, this.y + yOff * PARAMS.PIXELSCALER - PARAMS.PIXELSCALER);
                ctx.lineTo(this.destination.x, this.destination.y);
                ctx.stroke();
            }
           
        }
    }
}