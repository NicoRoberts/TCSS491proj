class SkeletonMovement {

	constructor(player, game, enemy) {
        Object.assign(this, {player, game, enemy});
        
        
        this.timer = 0;

        //speeds
        this.walkSpeedNormal = 0.2;
        this.walkSpeedSlow = 0.1;
        this.chaseSpeed = 0.2;
        this.maxSpeed = getRandom(1.4, 2.0);
    
        //periods and states for skeleton
        this.movePeriod = getRandom(3, 9);
        this.restPeriod = getRandom(1, 6);
        this.state = getRandomInt(0, 5);
        this.changeState = true;
        this.first = true;

        

        //chase point
        this.offset = getRandomInt(-24, 8) * 3;
       

        
	};



    idleMovement() {
        const TICKSCALE = this.game.clockTick * PARAMS.TIMESCALE;
        
        this.enemy.state = this.enemy.STATE.WALKING;
        var switchDirections = getRandomInt(0, 100);
        
        this.timer += this.game.clockTick;     

        if (!this.first && this.timer <= this.movePeriod) { //move
            if (this.state == 0 && this.changeState) {
                this.enemy.state = this.enemy.STATE.WALKING;
                this.enemy.direction = this.enemy.DIRECTION.RIGHT;
                if(this.enemy.collideTop) {
                    this.enemy.velocity.x = this.walkSpeedSlow ; //northeast
                    this.enemy.velocity.y = this.walkSpeedNormal;

                } else if (this.enemy.collideRight) {
                    this.enemy.velocity.x = -1 * this.walkSpeedSlow ;
                    this.enemy.velocity.y = -1 * this.walkSpeedNormal;
                    
                } else {
                    this.enemy.velocity.x = this.walkSpeedSlow ; //northeast
                    this.enemy.velocity.y = -1 * this.walkSpeedNormal;
                }
                this.state = 1;
                this.changeState = false;
                this.enemy.collideTop = false;
                this.enemy.collideRight = false;
                
            } else if (this.state == 1 && this.changeState) {
                this.enemy.state = this.enemy.STATE.WALKING;
                this.enemy.direction = this.enemy.DIRECTION.RIGHT;
                

                if(this.enemy.collideRight) {
                    this.enemy.velocity.x = -1 * this.walkSpeedSlow; //southeast
                    this.enemy.velocity.y = this.walkSpeedNormal;
                } else if (this.enemy.collideBottom) {
                    this.enemy.velocity.x = this.walkSpeedSlow; //southeast
                    this.enemy.velocity.y = -1 * this.walkSpeedNormal;
                    
                } else {
                    this.enemy.velocity.x = this.walkSpeedSlow; //southeast
                    this.enemy.velocity.y = this.walkSpeedNormal;
                }

                this.state = 2;
                this.changeState = false;
                this.enemy.collideRight = false;
                this.enemy.collideBottom = false;
                
            } else if (this.state == 2 && this.changeState) {
                this.enemy.state = this.enemy.STATE.WALKING;
                this.enemy.direction = this.enemy.DIRECTION.LEFT;
                

                if(this.enemy.collideTop) {
                    this.enemy.velocity.x = -1 * this.walkSpeedNormal; //northwest
                    this.enemy.velocity.y = this.walkSpeedSlow;
                } else if (this.enemy.collideLeft) {
                    this.enemy.velocity.x = this.walkSpeedNormal; //northwest
                    this.enemy.velocity.y = -1 * this.walkSpeedSlow;
                    
                } else {
                    this.enemy.velocity.x = -1 * this.walkSpeedNormal; //northwest
                    this.enemy.velocity.y = -1 * this.walkSpeedSlow;
                }
                this.state = 3;
                this.changeState = false;
                this.enemy.collideTop = false;
                this.enemy.collideLeft = false;
                
            } else if (this.state == 3 && this.changeState) {
                this.enemy.state = this.enemy.STATE.WALKING;
                this.enemy.direction = this.enemy.DIRECTION.RIGHT;
                

                if (this.enemy.collideRight) {
                    this.enemy.velocity.x = -1 * this.walkSpeedNormal;
                    this.enemy.velocity.y = 0;
                    
                } else {
                    this.enemy.velocity.x = this.walkSpeedNormal; //east
                    this.enemy.velocity.y = 0;
                }
                this.state = 4;
                this.changeState = false;
                this.enemy.collideRight = false;
                
            } else if (this.state == 4 && this.changeState) {
                this.enemy.state = this.enemy.STATE.WALKING;
                this.enemy.direction = this.enemy.DIRECTION.LEFT;

                

                if (this.enemy.collideLeft) {
                    this.enemy.velocity.x = this.walkSpeedNormal;
                    this.enemy.velocity.y = this.walkSpeedSlow;

                } else if (this.enemy.collideBottom) {
                    this.enemy.velocity.x = -1 * this.walkSpeedNormal; //southwest
                    this.enemy.velocity.y = -1 * this.walkSpeedSlow;
                    
                } else {
                    this.enemy.velocity.x = -1 * this.walkSpeedNormal; //southwest
                    this.enemy.velocity.y = this.walkSpeedSlow;
                }
                this.changeState = false;
                this.state = 0;
                this.enemy.collideLeft = false;
                this.enemy.collideBottom = false;
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
        this.enemy.state = this.enemy.STATE.WALKING;
        var dist = distance(this.enemy, this.player);
        var difX = (this.player.circlex - this.enemy.x) / dist;
        var difY = ((this.player.circley + this.offset) - this.enemy.y) / dist;
        this.enemy.velocity.x += difX * this.enemy.acceleration / (dist * dist);
        this.enemy.velocity.y += difY * this.enemy.acceleration / (dist * dist);
     
    //     const TICKSCALE = this.game.clockTick * PARAMS.TIMESCALE;
    //     this.enemy.state = this.enemy.STATE.WALKING;

    //     var dist = distance(this.enemy, this.player);
    //     var difX = (this.player.circlex - this.enemy.x) / dist * this.maxSpeed;
    //     var difY = ((this.player.circley + this.offset) - this.enemy.y) / dist * this.maxSpeed;
        
    //     // this.enemy.velocity.x = difX;
    //     // this.enemy.velocity.y = difY;
    //     //if (!this.enemy.collideTerrain) {
    //         if (Math.abs(this.enemy.velocity.x) > difX && Math.abs(this.enemy.velocity.y) > difY) {
    //             this.enemy.velocity.x = difX;
    //             this.enemy.velocity.y = difY;
    //         }
            
    //         this.enemy.velocity.x = difX;
    //         this.enemy.velocity.y = difY;
    //    // }
        
        
        

    //     var speed = Math.sqrt(this.enemy.velocity.x * this.enemy.velocity.x + this.enemy.velocity.y * this.enemy.velocity.y);
       

    
        //velocity += force vector

        //tag logic

        //Rock: weak repulsion

        if (this.enemy.velocity.x > 0) {
            this.enemy.direction = this.enemy.DIRECTION.RIGHT;
        } else if (this.enemy.velocity.x < 0) {
            this.enemy.direction = this.enemy.DIRECTION.LEFT;
        }

        
        
    };



	update() {

	};


	draw(ctx) {
		
	};

};