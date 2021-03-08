//periods and states for Banshee


class BansheeMovement {

	constructor(player, game, enemy) {
        Object.assign(this, {player, game, enemy});
     
        this.maxSpeed = getRandom(1.4, 2.0);
        //periods and states for banshee
        this.bansheeDirection = getRandomInt(0, 2);
        this.startPositiveOrNegative = getRandomInt(0, 2);
        this.maxSpeedx = getRandom(1.6, 2);
        this.maxSpeedy = getRandom(0.1, 2);
        //chase point
        this.offset = getRandomInt(-24, 8) * 3;
       
        //random initial direction
        if (this.bansheeDirection == this.enemy.DIRECTION.RIGHT) {
            this.enemy.direction = this.enemy.DIRECTION.RIGHT;
        } else {
            this.enemy.direction = this.enemy.DIRECTION.LEFT;
        }
        
	};

    idleMovement() {
        const TICKSCALE = this.game.clockTick * PARAMS.TIMESCALE;
        this.enemy.state = this.enemy.STATE.WALKING;
        
        if (this.enemy.collideRight) {
            this.maxSpeedx *= -1;
            this.enemy.collideRight = false;
        } 
        if (this.enemy.collideLeft) {
            this.maxSpeedx *= -1;
            this.enemy.collideLeft = false;
        }
        if (this.enemy.collideTop) {
            this.maxSpeedy *= -1;
            this.enemy.collideTop = false;
        }
        if (this.enemy.collideBottom) {
            this.maxSpeedy *= -1;
            this.enemy.collideBottom = false;
        }

        if (this.enemy.velocity.x > 0) {
            this.enemy.direction = this.enemy.DIRECTION.RIGHT;
        } else if (this.enemy.velocity.x < 0) {
            this.enemy.direction = this.enemy.DIRECTION.LEFT;
        }

        this.enemy.velocity.x = this.maxSpeedx;
        this.enemy.velocity.y = this.maxSpeedy;
        
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