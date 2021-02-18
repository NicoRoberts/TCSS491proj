class Machete {

    DIRECTION = {
        RIGHT: 0,
        LEFT: 1,
        COUNT: 2
    };

    constructor(game) {
        Object.assign(this, { game });

        this.spritesheet = ASSET_MANAGER.getAsset("./Sprites/Machete.png");

        this.width = 12;
        this.height = 20;

        this.direction = this.DIRECTION.RIGHT;
        this.x = this.game.player.x;
        this.y = this.game.player.y;

        this.translate = { x: this.height * PARAMS.PIXELSCALER, y: this.height * PARAMS.PIXELSCALER};
        this.armOffset = { x: this.translate.x - PARAMS.PIXELSCALER, y: this.translate.y - 5 * PARAMS.PIXELSCALER };
        this.canvasOffset = { x: -14 * PARAMS.PIXELSCALER, y: -6 * PARAMS.PIXELSCALER };

        this.priority = 4;
        
        this.game.weapons[0] = this;

        this.swinging = false;

        this.maxAmmo = 18;
        this.maxReserves = 96;
        this.ammoCount = this.maxAmmo;
        this.reservesCount = this.maxReserves;

        this.isAvailable = true;

    }

    fill() {
        this.ammoCount = this.maxAmmo;
        this.reservesCount = this.maxReserves;
    }

    reload() {
        //Shouldn't do anything
        this.reloading = false;
    }

    fire() {
        let swingSpeed = Math.PI / 24;
        swingSpeed = this.game.player.direction == this.DIRECTION.RIGHT ? 1 * swingSpeed : -1 * swingSpeed;
        let swingDistance = Math.PI*2;
        let startingAngle = this.angle;

       

        if (!this.swinging) {
            this.slice = new Slice(this.game, this.source.x + this.angleOffset.x,
                this.source.y + this.angleOffset.y, this.angle);
            this.swinging = true;
            this.game.addEntity(this.slice);

            //console.log((startingAngle+2*Math.PI) * 180 / Math.PI);

            let that = this;
            let interval_id = window.setInterval(function () {
                that.angle += swingSpeed;
                if (swingSpeed > 0) {
                    //console.log(that.angle*180/Math.PI);
                    if (that.angle >= startingAngle + swingDistance) {
                        that.swinging = false;
                        that.angle = startingAngle;
                        window.clearInterval(interval_id);
                        that.slice.removeFromWorld = true;
                    }
                }
                else {
                    if (that.angle <= startingAngle - swingDistance) {
                        that.swinging = false;
                        that.angle = startingAngle;
                        window.clearInterval(interval_id);
                        that.slice.removeFromWorld = true;
                    }
                }

            }, 5)
        }
    }

    update() {

        this.x = this.game.player.positionx;
        this.y = this.game.player.positiony;
        this.positionx = this.x;
        this.positiony = this.y;

        let facingRight = this.game.player.direction == this.DIRECTION.RIGHT;

        this.armOffset = facingRight
            ? { x: this.translate.x - 2 * PARAMS.PIXELSCALER, y: this.translate.y - 13* PARAMS.PIXELSCALER }
            : { x: this.translate.x - 9 * PARAMS.PIXELSCALER, y: this.translate.y - 13 * PARAMS.PIXELSCALER };
        this.canvasOffset = facingRight
            ? { x: -17* PARAMS.PIXELSCALER, y: -10 * PARAMS.PIXELSCALER }
            : { x: -8 * PARAMS.PIXELSCALER, y: -10 * PARAMS.PIXELSCALER };


        let lineScaler = this.game.player.direction == this.DIRECTION.RIGHT ? .8 : -.8;

        this.angleOffset = {
            x: lineScaler * this.width * PARAMS.PIXELSCALER * Math.cos(this.angle),
            y: lineScaler * this.width * PARAMS.PIXELSCALER * Math.sin(this.angle)
        };

        if (this.game.mouse != null && !this.swinging) {


            this.source = { x: this.x + this.translate.x + this.canvasOffset.x + PARAMS.PIXELSCALER / 2, y: this.y + this.translate.y + this.canvasOffset.y + PARAMS.PIXELSCALER / 2 };
            this.destination = { x: this.game.mouse.x, y: this.game.mouse.y };
            this.angle = Math.atan((this.destination.y - this.source.y) / (this.destination.x - this.source.x))

            this.angle = this.game.mouse.x >= this.source.x ? this.angle : this.angle + Math.PI;
            this.direction = this.game.mouse.x >= this.source.x ? this.DIRECTION.RIGHT : this.DIRECTION.LEFT;
            this.angle = this.game.player.direction == this.DIRECTION.LEFT ? this.angle - Math.PI : this.angle;

        }


    }

    draw(ctx) {
        //Put PARAMS.DEBUG after
        if (this.game.weapon == this) {
            if (this.game.mouse != null) {

                // Create a seperate canvas for rotation
                var rotationCanvas = document.createElement('canvas');

                //Multiply by 2 to fit the whole image
                rotationCanvas.width = this.height * PARAMS.PIXELSCALER * 2;
                rotationCanvas.height = this.height * PARAMS.PIXELSCALER * 2;
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
                        //this.height * PARAMS.PIXELSCALER * 2,
                        //this.height * PARAMS.PIXELSCALER * 2);
                }

                rotationCtx.restore();

                ctx.drawImage(rotationCanvas, this.x + this.canvasOffset.x, this.y + this.canvasOffset.y,
                    this.height * PARAMS.PIXELSCALER * 2, this.height * PARAMS.PIXELSCALER * 2);

                if (PARAMS.DEBUG) {
                    //ctx.fillStyle = "White";
                    //var fontsize = 25;
                    //ctx.font = fontsize + 'px "VT323"'
                    //ctx.fillText("Angle: " + Math.round(this.angle * 180 / (Math.PI)), this.x + 75, this.y - 50);

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