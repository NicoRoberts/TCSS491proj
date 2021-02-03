class Shotgun {

    DIRECTION = {
		RIGHT: 0,
		LEFT: 1,
		COUNT: 2
	};

    constructor(game) {
        Object.assign(this, { game});

        this.spritesheet = ASSET_MANAGER.getAsset("./Sprites/Shotgun.png");

        this.width = 20;
        this.height = 8;

        this.direction = this.DIRECTION.RIGHT;

        this.x = this.game.player.x;
        this.y = this.game.player.y;

        this.translate = { x: this.width * PARAMS.PIXELSCALER, y: this.width* PARAMS.PIXELSCALER};
        this.armOffset = { x: this.translate.x - PARAMS.PIXELSCALER, y: this.translate.y - 5 * PARAMS.PIXELSCALER };
        this.canvasOffset = { x: -14 * PARAMS.PIXELSCALER, y: -6 * PARAMS.PIXELSCALER };

        this.priority = 4;

        this.game.weapons[1] = this;

        this.maxAmmo = 10;
        this.maxReserves = 60;
        this.ammoCount = this.maxAmmo;
        this.reservesCount = this.maxReserves;
        
    }

    fill() {
        this.ammoCount = this.maxAmmo;
        this.reservesCount = this.maxReserves;
    }

    reload() {
        if (this.reservesCount > 0) {
            var difference = this.maxAmmo - this.ammoCount;

            this.reservesCount -= difference;

            //Stops ammo reserves from dropping below 0 on reload
            if (this.reservesCount < 0) {
                difference += this.reservesCount;
                this.reservesCount = 0;
            }
            this.ammoCount += difference;
                    
        }
        
    }

    fire() {
        if (this.ammoCount > 0) {
            

            let maxSpread = Math.PI / 48;
            let spreadCount = 2;

            this.ammoCount -= 1 + spreadCount*2;

            let angle = this.game.player.direction == this.game.player.DIRECTION.RIGHT ? this.angle : this.angle - Math.PI;
            this.game.addEntity(new Bullet(this.game, this.source.x + this.angleOffset.x + this.game.camera.x,
                this.source.y + this.angleOffset.y + this.game.camera.y, angle));

            for (var i = 1; i <= spreadCount; i++) {
                this.game.addEntity(new Bullet(this.game, this.source.x + this.angleOffset.x + this.game.camera.x,
                    this.source.y + this.angleOffset.y + this.game.camera.y, angle + maxSpread/i));
                this.game.addEntity(new Bullet(this.game, this.source.x + this.angleOffset.x + this.game.camera.x,
                    this.source.y + this.angleOffset.y + this.game.camera.y, angle - maxSpread/i));
			}
        }
    }

    update() {

        this.x = this.game.player.positionx;
        this.y = this.game.player.positiony;

        let facingRight = this.game.player.direction == this.DIRECTION.RIGHT;

        this.armOffset = facingRight
            ? { x: this.translate.x - 2*PARAMS.PIXELSCALER, y: this.translate.y - 2 * PARAMS.PIXELSCALER }
            : { x: this.translate.x - 17 * PARAMS.PIXELSCALER, y: this.translate.y - 2 * PARAMS.PIXELSCALER };
        this.canvasOffset = facingRight
            ? { x: -17* PARAMS.PIXELSCALER, y: -10 * PARAMS.PIXELSCALER }
            : { x: -8* PARAMS.PIXELSCALER, y: -10* PARAMS.PIXELSCALER };


        let lineScaler = this.game.player.direction == this.DIRECTION.RIGHT ? .8 : -.8;

        this.angleOffset = {
            x: lineScaler * this.width * PARAMS.PIXELSCALER * Math.cos(this.angle),
            y: lineScaler * this.width * PARAMS.PIXELSCALER * Math.sin(this.angle)
        };

        if (this.game.mouse != null) {


            this.source = { x: this.x + this.translate.x + this.canvasOffset.x + PARAMS.PIXELSCALER / 2, y: this.y + this.translate.y + this.canvasOffset.y + PARAMS.PIXELSCALER / 2 };
            this.destination = { x: this.game.mouse.x, y: this.game.mouse.y };
            this.angle = Math.atan((this.destination.y - this.source.y) / (this.destination.x - this.source.x))

            this.angle = this.game.mouse.x >= this.source.x ? this.angle : this.angle + Math.PI;
            this.direction = this.game.mouse.x >= this.source.x ? this.DIRECTION.RIGHT : this.DIRECTION.LEFT;
            this.angle = this.game.player.direction == this.DIRECTION.LEFT? this.angle - Math.PI: this.angle; 
            
        }

        
    }

    draw(ctx) {
        //Put PARAMS.DEBUG after
        if (this.game.weapon == this) {
            if (this.game.mouse != null) {

                // Create a seperate canvas for rotation
                var rotationCanvas = document.createElement('canvas');

                //Multiply by 2 to fit the whole image
                rotationCanvas.width = this.width * PARAMS.PIXELSCALER * 2;
                rotationCanvas.height = this.width * PARAMS.PIXELSCALER * 2;
                var rotationCtx = rotationCanvas.getContext('2d');
                rotationCtx.save();

                rotationCtx.translate(this.translate.x + PARAMS.PIXELSCALER / 2, this.translate.y + PARAMS.PIXELSCALER / 2);
                rotationCtx.rotate(this.angle);
                rotationCtx.translate(-1 * this.translate.x - PARAMS.PIXELSCALER / 2, -1 * this.translate.y - PARAMS.PIXELSCALER / 2);

                let drawOffset = this.game.player.direction == this.DIRECTION.RIGHT ? 1 : 0;
                rotationCtx.drawImage(this.spritesheet, 1 + drawOffset * (this.width * PARAMS.PIXELSCALER + 2),
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


                    ctx.strokeStyle = this.game.click ? "Blue" : "Red";
                    ctx.beginPath();
                    ctx.moveTo(this.source.x + this.angleOffset.x, this.source.y + this.angleOffset.y);
                    ctx.lineTo(this.destination.x, this.destination.y);
                    ctx.stroke();
                }

            }
        }
    }
}