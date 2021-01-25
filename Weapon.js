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

        this.x = this.game.player.x;
        this.y = this.game.player.y;

        this.translate = { x: this.width * PARAMS.PIXELSCALER, y: this.width* PARAMS.PIXELSCALER };
        this.armOffset = { x: this.translate.x - PARAMS.PIXELSCALER, y: this.translate.y - 5 * PARAMS.PIXELSCALER };
        this.canvasOffset = { x: -14 * PARAMS.PIXELSCALER, y: -6 * PARAMS.PIXELSCALER };

        this.priority = 3;
        
    }

    update() {
        this.x = this.game.player.positionx;
        this.y = this.game.player.positiony;

        let facingRight = this.game.player.direction == this.DIRECTION.RIGHT;

        this.armOffset = facingRight
            ? { x: this.translate.x - PARAMS.PIXELSCALER, y: this.translate.y - 5 * PARAMS.PIXELSCALER }
            : { x: this.translate.x - 14 * PARAMS.PIXELSCALER, y: this.translate.y - 5 * PARAMS.PIXELSCALER };
        this.canvasOffset = facingRight
            ? { x: -14 * PARAMS.PIXELSCALER, y: -7 * PARAMS.PIXELSCALER }
            : { x: -3 * PARAMS.PIXELSCALER, y: -7 * PARAMS.PIXELSCALER };
        
        if (this.game.mouse != null) {


            this.source = { x: this.x + this.translate.x + this.canvasOffset.x + PARAMS.PIXELSCALER / 2, y: this.y + this.translate.y + this.canvasOffset.y + + PARAMS.PIXELSCALER / 2 };
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

            rotationCtx.translate(this.translate.x + PARAMS.PIXELSCALER / 2, this.translate.y + PARAMS.PIXELSCALER / 2);
            rotationCtx.rotate(this.angle);
            rotationCtx.translate(-1 * this.translate.x - PARAMS.PIXELSCALER / 2, -1 * this.translate.y - PARAMS.PIXELSCALER / 2);

            let drawOffset = this.game.player.direction == this.DIRECTION.RIGHT ? 1: 0;
            rotationCtx.drawImage(this.spritesheet, 1 + drawOffset*(this.width * PARAMS.PIXELSCALER + 2),
                1, this.width * PARAMS.PIXELSCALER, this.height * PARAMS.PIXELSCALER,
                this.armOffset.x,
                this.armOffset.y,
                this.width * PARAMS.PIXELSCALER, this.height * PARAMS.PIXELSCALER);

            if (PARAMS.DEBUG) {
                rotationCtx.strokeStyle = 'Red';
                rotationCtx.strokeRect(this.armOffset.x, this.armOffset.y,
                    this.width * PARAMS.PIXELSCALER, this.height * PARAMS.PIXELSCALER);

                rotationCtx.fillStyle = "Green";
                rotationCtx.fillRect(this.translate.x, this.translate.y, PARAMS.PIXELSCALER, PARAMS.PIXELSCALER);

                //rotationCtx.strokeStyle = 'Orange';
                //rotationCtx.strokeRect(0, 0,
                //    this.width * PARAMS.PIXELSCALER * 2,
                //    this.width * PARAMS.PIXELSCALER * 2);
            }

            rotationCtx.restore();

            ctx.drawImage(rotationCanvas, this.x + this.canvasOffset.x, this.y + this.canvasOffset.y,
                this.width * PARAMS.PIXELSCALER * 2, this.width * PARAMS.PIXELSCALER * 2);


            if (PARAMS.DEBUG) {

                let lineScaler = this.game.player.direction == this.DIRECTION.RIGHT ? 0.9 : -0.9;

                let angleOffset = {
                    x: lineScaler * this.width * PARAMS.PIXELSCALER * Math.cos(this.angle),
                    y: lineScaler * this.width * PARAMS.PIXELSCALER * Math.sin(this.angle)
                };

                ctx.strokeStyle = this.game.click ? "Blue" : "Red";
                ctx.beginPath();
                ctx.moveTo(this.source.x + angleOffset.x, this.source.y + angleOffset.y);
                ctx.lineTo(this.destination.x, this.destination.y);
                ctx.stroke();
            }
           
        }
    }
}