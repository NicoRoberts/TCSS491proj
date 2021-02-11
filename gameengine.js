// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

class GameEngine {
    constructor() {
        this.entities = [];
        this.sorted = false;
        this.showOutlines = false;
        this.ctx = null;
        this.click = false;
        this.mouse = null;
        this.wheel = null;
        this.surfaceWidth = null;
        this.surfaceHeight = null;

        this.maxEnemies = 2;
        this.spawnRate = 5;
        this.timeLeft = 0;
        this.enemiesCount = 0;

        this.weapon = null;
        this.weapons = [];

        this.W = false;
        this.A = false;
        this.S = false;
        this.D = false;
    };

    init(ctx) {
        this.ctx = ctx;
        this.surfaceWidth = this.ctx.canvas.width;
        this.surfaceHeight = this.ctx.canvas.height;
        this.startInput();
        this.timer = new Timer();
    };

    start() {

        var that = this;
        (function gameLoop() {
            that.loop();
            requestAnimFrame(gameLoop, that.ctx.canvas);
        })();
    };

    startInput() {
        var that = this;

        var getXandY = function (e) {
            var x = e.clientX - that.ctx.canvas.getBoundingClientRect().left;
            var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;

            return { x: x, y: y };
        }

        this.ctx.canvas.addEventListener("mousemove", function (e) {
            //console.log(getXandY(e));
            that.mouse = getXandY(e);

        }, false);

        this.ctx.canvas.addEventListener("mousedown", function (e) {
            //Left mouse button
            if (e.which == 1) {
                that.click = true;
                that.weapon.fire();
            }
        }, false);

        this.ctx.canvas.addEventListener("mouseup", function (e) {
            //Left mouse button
            if (e.which == 1) {
                that.click = false;
            }
        }, false);

        this.ctx.canvas.addEventListener("keydown", function (e) {
            //console.log(e.code + " Pressed");
            switch(e.code){
                case "KeyW":
                    that.W = true;
                    break;
                case "KeyA":
                    that.A = true;
                    break;
                case "KeyS":
                    that.S = true;
                    break;
                case "KeyD":
                    that.D = true;
                    break;
                case "KeyR":
                    that.weapon.reload();
                    break;
                case "Digit1":
                    if (!that.weapon.reloading){
                        that.weapon = that.weapons[0];
                    }              
                    break;
                case "Digit2":
                    if (!that.weapon.reloading) {
                        that.weapon = that.weapons[1];
                    }  
                    break;
                case "Digit3":
                    if (!that.weapon.reloading) {
                        that.weapon = that.weapons[2];
                    }
                    break;
            }
    
        }, false);

         this.ctx.canvas.addEventListener("keyup", function (e) {
            //console.log(e.code + " Released");
            switch(e.code){
                case "KeyW":
                    that.W = false;
                    break;
                case "KeyA":
                    that.A = false;
                    break;
                case "KeyS":
                    that.S = false;
                    break;
                case "KeyD":
                    that.D = false;
                    break;
            }
    
        }, false);

        this.ctx.canvas.addEventListener("contextmenu", function (e) {
            //console.log(getXandY(e));
            that.rightclick = getXandY(e);
            e.preventDefault();
        }, false);

        console.log("Listeners Created Successfully");
    };

    addEntity(entity) {
        //this.entities.enqueue(entity);
        this.entities.push(entity);
        this.sorted = false;
    };

    draw() {
        
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        // this.ctx.save();

        if (!this.sorted) {
            this.entities.sort((a, b) => {
                return a.priority - b.priority;
            });
            this.sorted = true;
        }

        for (var i = 0; i < this.entities.length; i++) {
            this.entities[i].draw(this.ctx);
        }

        this.camera.draw(this.ctx);

    };

    update() {

        var entitiesCount = this.entities.length;
        //console.log(entitiesCount);
        this.enemiesCount = 0;

        for (var i = 0; i < entitiesCount; i++) {
            var entity = this.entities[i];

            if (entity instanceof Enemy) {
                this.enemiesCount++;
            }
            if (!entity.removeFromWorld) {
                entity.update();
            }
        }

      

        this.camera.update();

        for (var i = this.entities.length - 1; i >= 0; --i) {
            if (this.entities[i].removeFromWorld) {
                if (this.entities[i] instanceof Enemy) {
                    this.entities[i].dropItem();
                }
                this.entities.splice(i, 1);
            }
        }

        if (this.enemiesCount < this.maxEnemies) {
            this.addEntity(new Enemy(this.player, this, 200, 200));
            this.maxEnemies--;
        }
    };


    loop() {
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();
    };
};