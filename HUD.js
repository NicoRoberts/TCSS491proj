class HUD {

    constructor(game, player) {
        Object.assign(this, {game, player});

        this.spritesheet = ASSET_MANAGER.getAsset("./Sprites/Hearts.png");
        this.heartStates = [];

        this.hpCurrent = this.player.hpCurrent;
        this.hpMax = this.player.hpMax;

        this.hpFullHeart = 50;
        this.hpHalfHeart = 25;

        this.heartWidth = 28;
        this.heartHeight = 28;

        this.priority = 100; // should be the last thing to be drawn to the screen

        //this.setUpHearts();
        this.loadHearts();
    };

    loadHearts() {

        var startx = 0;
        for (var i = 0; i < 3; i++) { // iterates through and loads all 3 states of heart, (full, half, empty)
            this.heartStates[i] = new Animator(this.spritesheet, startx, 0, this.heartWidth, this.heartHeight, 1, 1, 1, false, true);
            startx += this.heartWidth;
        }

    };

    update() {

        if (this.hpCurrent != this.player.hpCurrent) {

            this.hpCurrent = this.player.hpCurrent;
            this.hpMax = this.player.hpMax;

        }

    };

    draw(ctx) {

       var offset = 10; // for heart spacing/placement

       while (this.hpMax > 0) {

            if ((this.hpCurrent - this.hpFullHeart) >= 0) {

                this.hpCurrent-=this.hpFullHeart;
                this.hpMax-=this.hpFullHeart;
                this.heartStates[0].drawFrame(this.game.clockTick, this.game.ctx, offset, 785, 2.5);
                offset += this.heartWidth * 2.5;
            }

            else if ((this.hpCurrent - this.hpHalfHeart) >= 0) {

                this.hpCurrent-=this.hpHalfHeart;
                this.hpMax-=this.hpFullHeart;
                this.heartStates[1].drawFrame(this.game.clockTick, this.game.ctx, offset, 785, 2.5);
                offset += this.heartWidth * 2.5;
            }

            else {

                this.hpMax-=this.hpFullHeart;
                this.heartStates[2].drawFrame(this.game.clockTick, this.game.ctx, offset, 785, 2.5);
                offset += this.heartWidth * 2.5;

            }

       }

        
    };

};