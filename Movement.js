class Movement {

	constructor(player, game, enemy) {
        Object.assign(this, {player, game, enemy});
        
        
        this.timer = 0;

        //speeds
        this.walkSpeedNormal = 0.2;
        this.walkSpeedSlow = 0.1;
        this.chaseSpeed = 0.2;
        this.maxSpeed = getRandom(1.4, 2.0);
    
        //periods and states
        this.movePeriod = getRandom(3, 9);
        this.restPeriod = getRandom(1, 6);
        this.state = getRandomInt(0, 5);
        this.changeState = true;
        this.first = true;

        this.offset = getRandomInt(-24, 8) * 2;
        //physics
  
        

        // this.velocity = { x: (this.player.circlex - this.enemy.x) / dist * this.maxSpeed, y: (this.player.circley - this.enemy.y) / dist * this.maxSpeed };

        
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
        this.enemy.state = this.enemy.STATE.WALKING;

        var dist = distance(this.enemy, this.player);
        var difX = (this.player.circlex - this.enemy.x) / dist * this.maxSpeed;
        var difY = ((this.player.circley + this.offset) - this.enemy.y) / dist * this.maxSpeed;
        
        // this.enemy.velocity.x = difX;
        // this.enemy.velocity.y = difY;
        
        this.enemy.velocity.x = difX;
        this.enemy.velocity.y = difY; 

        var speed = Math.sqrt(this.enemy.velocity.x * this.enemy.velocity.x + this.enemy.velocity.y * this.enemy.velocity.y);
       

    
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