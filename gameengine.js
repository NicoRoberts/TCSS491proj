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

        this.grid = null;

        this.interact = false;
        // this.maxEnemies = 2;
        // //this.spawnRate = 5;
        // this.timeLeft = 0;
        // this.enemiesCount = 0;

        this.weapon = null;
        this.weapons = [];

        this.minutes = 0;
        this.seconds = 0;
        this.millis = 0;

        //spawning
		this.upperRangeX = 1768;
		this.upperRangeY = 40;
		this.lowerRangeX = 40
		this.lowerRangeY = 732;

        this.spawnTimer = 0;
        this.maxEnemies = 0;
        this.enemiesCount = 0;
        this.spawnRate = 3; //  enemy / spawnRate (sec)
        this.adjustmentPercentage = 0;
        
        //music
        this.menuMusicPlayed = false;

        this.W = false;
        this.A = false;
        this.S = false;
        this.D = false;

        this.E = false;

        this.stage;
    };

    init(ctx) {
        this.ctx = ctx;
        this.surfaceWidth = this.ctx.canvas.width;
        this.surfaceHeight = this.ctx.canvas.height;
        this.startInput();
        this.timer = new Timer();
        this.ellapsedTime = 0;
        
        this.timeInSurvival = 0;
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

        this.ctx.canvas.addEventListener("mouseout", function (e) {
            that.click = false;
            
        }, false);

        this.ctx.canvas.addEventListener("mousemove", function (e) {
            //console.log(getXandY(e));
            that.mouse = getXandY(e);

        }, false);

        this.ctx.canvas.addEventListener("mousedown", function (e) {
            //Left mouse button
            if (e.which == 1 && (that.stage == "survival" || that.stage == "yacht") && !that.shift) {
                that.click = true;
                that.weapon.fire();
            }
            else {
                that.interact = true;
                that.click = true;
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
                case "KeyE":
                    that.E = true;
                    break;
                case "KeyR":
                    if (!that.shift) {
                        that.weapon.reload();
                    }
                    break;
                case "Escape":
                    if (!(that.stage == "pause") && !(that.stage == "menu")) {
                        that.camera.loadPause();
                    }
                    break;
                case "Digit1":
                    if (!that.weapon.reloading && !that.weapon.firing && that.weapons[0].isAvailable){
                        that.chosenWeapon = 0;
                        that.weapon = that.weapons[that.chosenWeapon];
                    }              
                    break;
                case "Digit2":
                    if (!that.weapon.reloading && !that.weapon.firing && that.weapons[1].isAvailable) {
                        that.chosenWeapon = 1;
                        that.weapon = that.weapons[that.chosenWeapon];
                    }  
                    break;
                case "Digit3":
                    if (!that.weapon.reloading && !that.weapon.firing && that.weapons[2].isAvailable) {
                        that.chosenWeapon = 2;
                        that.weapon = that.weapons[that.chosenWeapon];
                    }
                    break;
                case "Digit4":
                    if (!that.weapon.reloading && !that.weapon.firing && that.weapons[3].isAvailable) {
                        that.chosenWeapon = 3;
                        that.weapon = that.weapons[that.chosenWeapon];
                    }
                    break;
                case "ShiftLeft":
                    if (!that.weapon.reloading && !that.weapon.firing)
                    that.shift = true;
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
                case "KeyE":
                    that.E = false;
                    break;
                case "ShiftLeft":
                    that.shift = false;
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
        entity.removeFromWorld = false;
        this.entities.push(entity);
        this.sorted = false;
    };
    removeEntity(entity) {
        for (var i = this.entities.length - 1; i >= 0; --i) {
            if (this.entities[i] == entity) {
                entity.removeFromWorld = true;
            }
        }
    }
    removeAll() {
        for (var i = this.entities.length - 1; i >= 0; --i) {
            this.entities[i].removeFromWorld = true;
        }
    }

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
            let entity = this.entities[i];
            if (!(this.stage == "game over") && !(this.stage == "menu") && !(this.stage == "pause")) {
                if ((entity.positionx + entity.width > 0 && entity.positiony + entity.height > 0 && entity.positionx < this.ctx.canvas.width && entity.positiony - entity.height * 4 < this.ctx.canvas.height)
                    || entity instanceof HUD || entity instanceof Map || entity instanceof Grid || entity instanceof HBoundary || entity instanceof VBoundary
                    || entity instanceof YachtMap || entity instanceof Gangway || entity instanceof Darkness) {
                    entity.draw(this.ctx);
                }
            }
            else if (entity instanceof Gameover || entity instanceof StartMenu || entity instanceof ControlsMenu
            || entity instanceof GuideMenu || entity instanceof CreditsMenu || entity instanceof Pause
            || entity instanceof WinScreen) {
                entity.draw(this.ctx);
            }
            
            
        }

        this.camera.draw(this.ctx);

    };

    update() {
        //console.log("Stage: " + this.stage);

        this.minutes = Math.floor(this.ellapsedTime / 60);
        this.seconds = Math.floor(this.ellapsedTime % 60);

        if (this.seconds >= 60) {
            this.seconds = 0;
        }

        var entitiesCount = this.entities.length;


        for (var i = 0; i < entitiesCount; i++) {
            var entity = this.entities[i];
            
            if (!(typeof entity == 'undefined') && this.stage != "pause") {
                if (!entity.removeFromWorld) {
                    entity.update();
                }
            }
            else if (entity instanceof Pause || entity instanceof WinScreen) {
                entity.update();
            }
        }

        this.camera.update();

        if (this.stage == "survival") {
            
            //BOSS LEVEL
            if (this.player.stageLevel%5 == 0) {

            }
            else {
                this.spawnTimer += this.clockTick;
                var randomEnemy = getRandomInt(0, Math.min(this.player.stageLevel, 3));
                if (randomEnemy == 0) {
                    this.spawnSkeletons();
                } else if (randomEnemy == 1) {
                    this.spawnBanshees();
                } else {
                    this.spawnReapers();
                } 
                
            }

        }

        for (var i = this.entities.length - 1; i >= 0; --i) {
            if (this.entities[i].removeFromWorld) {
                this.entities.splice(i, 1);
            }
        }

        //For click off of screen
        if ((document.activeElement != document.getElementById("gameWorld")) && !(this.stage == "pause") && !(this.stage == "menu")) {
            this.W = false;
            this.A = false;
            this.S = false;
            this.D = false;
            this.E = false;
            this.camera.loadPause();
        }
        

    };

    spawnSkeletons() {

        var openGrids;
        var randomGridIndex;
        var spawnX;
        var spawnY;

        var entitiesCount = this.entities.length;

		if (this.spawnTimer >= this.spawnRate && (this.enemiesCount < this.maxEnemies)) {
            this.adjustmentPercentage = (0.04) * this.spawnRate //increase by numerator % per denominator in seconds
            this.spawnRate = this.spawnRate - (this.spawnRate * this.adjustmentPercentage);
            this.spawnTimer = 0;
            
            
           
            openGrids = this.grid.getSpawnableGrids();

            //modify here

            randomGridIndex = randomInt(openGrids.length);
            let grid = openGrids[randomGridIndex];
            
            spawnX = grid.x;
            spawnY = grid.y;

            var skeleton = new Skeleton(this.player, this, spawnX, spawnY);
            if (grid !== null) {
               // console.log("Column: " + grid.column + " Row: " + grid.row);
                grid.addEnemy(skeleton);
                this.enemiesCount++;
            }
            console.log("Number of enemies: " + this.enemiesCount + ", Max: " + this.maxEnemies);
            console.log("SpawnRate: " + this.spawnRate)	
        }
        

    }
    
    spawnBanshees() {
        var openGrids;
        var randomGridIndex;
        var spawnX;
        var spawnY;

        var entitiesCount = this.entities.length;

		if (this.spawnTimer >= this.spawnRate  && (this.enemiesCount < this.maxEnemies)) {
            this.adjustmentPercentage = (0.04) * this.spawnRate //increase by numerator % per denominator in seconds
            this.spawnRate = this.spawnRate - (this.spawnRate * this.adjustmentPercentage);
            this.spawnTimer = 0;
            
            
           
            openGrids = this.grid.getSpawnableGrids();

            //modify here

            randomGridIndex = randomInt(openGrids.length);
            let grid = openGrids[randomGridIndex];
            
            spawnX = grid.x;
            spawnY = grid.y;

            var banshee = new Banshee(this.player, this, spawnX, spawnY);
            if (grid !== null) {
               // console.log("Column: " + grid.column + " Row: " + grid.row);
                grid.addEnemy(banshee);
                this.enemiesCount++;
            }
            console.log("Number of enemies: " + this.enemiesCount + ", Max: " + this.maxEnemies);
            console.log("SpawnRate: " + this.spawnRate)	
        }
        

    }

    spawnReapers() {
        var openGrids;
        var randomGridIndex;
        var spawnX;
        var spawnY;

        var entitiesCount = this.entities.length;

		if (this.spawnTimer >= this.spawnRate  && (this.enemiesCount < this.maxEnemies)) {
            this.adjustmentPercentage = (0.04) * this.spawnRate; //increase by numerator % per denominator in seconds
            this.spawnRate = this.spawnRate - (this.spawnRate * this.adjustmentPercentage);
            this.spawnTimer = 0;
            
            
           
            openGrids = this.grid.getSpawnableGrids();

            //modify here

            randomGridIndex = randomInt(openGrids.length);
            let grid = openGrids[randomGridIndex];
            
            spawnX = grid.x;
            spawnY = grid.y;

            var reaper = new Reaper(this, spawnX, spawnY);
            if (grid !== null) {
               // console.log("Column: " + grid.column + " Row: " + grid.row);
                grid.addEnemy(reaper);
                this.enemiesCount++;
            }
            console.log("Number of enemies: " + this.enemiesCount + ", Max: " + this.maxEnemies);
            console.log("SpawnRate: " + this.spawnRate)	
        }
        
    }


    loop() {
        this.clockTick = this.timer.tick();

        if (this.stage == "menu") {
            this.ellapsedTime = 0;
            this.timeInSurvival = 0;
        }

        else if (this.stage == "pause") {
            // do nothing, don't increment time
        }

        else if (this.stage == "survival") {
            this.timeInSurvival += this.clockTick;
            this.ellapsedTime += this.clockTick;
        }
        else {
            this.timeInSurvival = 0;
            this.ellapsedTime += this.clockTick;
        }

        this.update();
        this.draw();
    };
};