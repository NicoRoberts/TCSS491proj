class Movement {

	constructor(player, game, enemy) {
        Object.assign(this, {player, game, enemy});
        
        
        this.timer = 0;
        this.walkSpeedNormal = 0.2;
        this.walkSpeedSlow = 0.1;
        this.chaseSpeed = 0.2;

        this.maxSpeed = 0.5;
        var dist = this.distance(this.enemy, this.player);
        this.velocity = { x: (this.player.circlex - this.enemy.x) / dist * this.maxSpeed, y: (this.player.circley - this.enemy.y) / dist * this.maxSpeed };

        this.movePeriod = getRandom(3, 7);
        this.restPeriod = getRandom(2, 4);
        this.state = getRandomInt(0, 5);
        this.changeState = true;
        this.first = true;
	};

	distance(A, B) {
        return Math.sqrt((B.x - A.x) * (B.x - A.x) + (B.y - A.y)*(B.y - A.y));
    };


    idleMovement() {
        const TICKSCALE = this.game.clockTick * PARAMS.TIMESCALE;
        

        var switchDirections = getRandomInt(0, 100);
        
        this.timer += this.game.clockTick;     

        if (!this.first && this.timer <= this.movePeriod) { //move
            if (this.state == 0 && this.changeState) {
                this.enemy.state = this.enemy.STATE.WALKING;
                this.enemy.direction = this.enemy.DIRECTION.RIGHT;
                this.enemy.velocity.x = this.walkSpeedSlow ;
                this.enemy.velocity.y = -1 * this.walkSpeedNormal;
                this.state = 1;
                this.changeState = false;
                
            } else if (this.state == 1 && this.changeState) {
                this.enemy.state = this.enemy.STATE.WALKING;
                this.enemy.direction = this.enemy.DIRECTION.RIGHT;
                this.enemy.velocity.x = this.walkSpeedSlow ;
                this.enemy.velocity.y = this.walkSpeedNormal;
                this.state = 2;
                this.changeState = false;
                
            } else if (this.state == 2 && this.changeState) {
                this.enemy.state = this.enemy.STATE.WALKING;
                this.enemy.direction = this.enemy.DIRECTION.LEFT;
                this.enemy.velocity.x = -1 * this.walkSpeedNormal;
                this.enemy.velocity.y = -1 * this.walkSpeedSlow;
                this.state = 3;
                this.changeState = false;
                
            } else if (this.state == 3 && this.changeState) {
                this.enemy.state = this.enemy.STATE.WALKING;
                this.enemy.direction = this.enemy.DIRECTION.RIGHT;
                this.enemy.velocity.x = this.walkSpeedNormal;
                this.enemy.velocity.y = 0;
                this.state = 4;
                this.changeState = false;
                
            } else if (this.state == 4 && this.changeState) {
                this.enemy.state = this.enemy.STATE.WALKING;
                this.enemy.direction = this.enemy.DIRECTION.LEFT;
                this.enemy.velocity.x = -1 * this.walkSpeedNormal;
                this.enemy.velocity.y = this.walkSpeedSlow;
                this.changeState = false;
                this.state = 0;
            }

        } else if (!this.first && this.timer > this.movePeriod && this.timer <= (this.movePeriod + this.restPeriod)) { //rest

  
            this.enemy.state = this.enemy.STATE.IDLE;
            this.enemy.velocity.x = 0;
            this.enemy.velocity.y = 0;
            
            

        } else if (this.first || this.timer > this.movePeriod + this.restPeriod) {
            if (switchDirections % 2 == 0 && this.enemy.direction == this.enemy.DIRECTION.LEFT) {
                this.enemy.direction = this.enemy.DIRECTION.RIGHT;
            } else if (switchDirections % 2 == 1 && this.enemy.direction == this.enemy.DIRECTION.RIGHT) {
                this.enemy.direction = this.enemy.DIRECTION.LEFT;
            }

            this.first = false;
            this.changeState = true;
            this.timer = 0;
        }
    };

    chaseMovement() {
        const TICKSCALE = this.game.clockTick * PARAMS.TIMESCALE;
        var dist = this.distance(this.enemy, this.player);

        this.velocity = { x: (this.player.circlex - this.enemy.x) / dist * this.maxSpeed, y: (this.player.circley - this.enemy.y) / dist * this.maxSpeed };

        this.enemy.velocity.x = this.velocity.x * TICKSCALE;
        this.enemy.velocity.y = this.velocity.y * TICKSCALE;

        if (this.enemy.velocity.x > 0) {
            this.enemy.direction = this.enemy.DIRECTION.RIGHT;
        } else if (this.enemy.velocity.x < 0) {
            this.enemy.direction = this.enemy.DIRECTION.LEFT;
        }

        // const TICKSCALE = this.game.clockTick * PARAMS.TIMESCALE;
        // var that = this.enemy;


        // var dx;
        // var dy = Math.floor((this.player.y - this.enemy.y + this.enemy.heightDifference));
        
        // var midpoint = Math.floor((this.enemy.x + (this.enemy.width / 2)));

        // if ((Math.abs(midpoint - this.player.x)) <= (Math.abs(midpoint - (this.player.x + this.player.width)))) { // is the skeleton closer to the left or the right of the player
        //     dx = Math.floor((this.player.x - (this.enemy.x + this.enemy.width))); //left of character
        // } else {
        //     dx = Math.floor((this.player.x + this.player.width) - (this.enemy.x - this.enemy.rightOffset)); //right of character
        // }
                
        // var moving = false; //flag for skeleton movement


        // if (dx == 0) {
        //     if (dy == 0) {
        //         moving = false; 
        //     }
        //     this.enemy.velocity.x = 0;
        //     this.enemy.velocity.y = 0;

        //     //responsible for skeleton direction flip if on the same X coordinate
        //     if(this.enemy.x < this.player.x && (this.enemy.direction == this.enemy.DIRECTION.LEFT)) {
        //         this.enemy.direction = this.enemy.DIRECTION.RIGHT;
        //     } else if (this.enemy.x > (this.player.x + this.player.width) && (this.enemy.direction == this.enemy.DIRECTION.RIGHT)) {
        //         this.enemy.direction = this.enemy.DIRECTION.LEFT;
        //     }
        // }
        
        // if (dx > 0) {
            
        //     this.enemy.velocity.x = this.chaseSpeed * TICKSCALE;

        //     if(this.enemy.x + this.enemy.width <= this.player.x && (this.enemy.direction ==this.enemy.DIRECTION.LEFT)) {
        //         this.enemy.direction = this.enemy.DIRECTION.RIGHT
        //     }

        //     moving = true;
        // } else if (dx < 0) {
        //     this.enemy.velocity.x = -1*this.chaseSpeed  * TICKSCALE;
            
            
        //     if(this.enemy.x + this.enemy.width > this.player.x) {
        //         this.enemy.direction = this.enemy.DIRECTION.LEFT
        //     }

        //     moving = true;
        // }
        
        // if (dy > 0) {
        //     this.enemy.velocity.y = this.chaseSpeed  * TICKSCALE;
        //     moving = true;
        // } else if (dy < 0) {
        //     this.enemy.velocity.y = -1*this.chaseSpeed  * TICKSCALE;
        //     moving = true;
        // } else {
        //     this.enemy.velocity.y = 0;
        // }

        // //set state: walking, idling, or attacking
        // this.enemy.attackCooldown += this.game.clockTick;
        // this.enemy.damageInterval += this.game.clockTick;

        // if (moving) {
        //     this.enemy.state = this.enemy.STATE.WALKING;
        //     this.enemy.damageInterval = 0;
        //     this.enemy.attackCooldown = 0; // this makes enemies stall before they attack (idk if we want this, but it makes animations better)
        // } else if (!moving && this.enemy.attackCooldown <= (2 - 1)) { // added -1 to all timers below
        //     this.enemy.state = this.enemy.STATE.IDLE;
            
        // }

        // if (!moving) {
        //     if (this.enemy.attackCooldown > (2 - 1) && !this.enemy.first) {
        //         this.enemy.state = this.enemy.STATE.ATTACK;
        //         this.enemy.damageInterval = 2.45 - 1;

        //     } else {
        //         this.enemy.first = false;
        //     }
        //     if (this.enemy.attackCooldown >= 2.45 - 1) {
        //         this.enemy.attackCooldown = 0;
        //     }

        //     // shitty way to implement enemy damage right now
        //     if (this.enemy.damageInterval >= 2.60 - 1) {
        //         this.game.entities.forEach(function (entity) {
        //             if (entity instanceof Player) {
        //                 entity.hpCurrent -= that.damage;
        //             }

        //         });
        //         this.enemy.damageInterval = 0;
        //     }
        // }
    };



	update() {

	};


	draw(ctx) {
		
	};

};