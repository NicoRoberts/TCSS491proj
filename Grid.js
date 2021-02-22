class Grid{
	constructor(game, x, y, width, height, blockSize) {
		Object.assign(this, { game, x, y, width, height, blockSize });
		this.grid = [];
		this.positionx = this.x - this.game.camera.x;
		this.positiony = this.y - this.game.camera.y;
		this.buildGrid();
		this.priority = 6;
	}
	buildGrid() {
		for (var c = 0; c < this.width; c++) {
			this.grid.push([]);
			for (var r = 0; r < this.height; r++) {

				let newGrid = new GridBlock(this.game, this.positionx + c * this.blockSize, this.positiony + r * this.blockSize, this.blockSize, c, r)
				if (r < 3) {
					newGrid.restrict();
                }
				this.grid[c].push(newGrid);
			}
		}
	}
	gridAt(x, y) {
		let col = Math.floor((x - this.x) / this.blockSize);
		let row = Math.floor((y - this.y) / this.blockSize);
		if (col < 0 || row < 0 || col >= this.width || row > this.height) {
			return null;
		}
		return this.grid[col][row];

	}
	gridAtIndex(col, row) {
		if (col < 0 || row < 0 || col >= this.width || row > this.height) {
			return null;
		}
		return this.grid[col][row];
	}
	closeGrid(x, y, width=1, height=1) {
		let start = this.gridAt(x, y);
		let finish = this.gridAt(x + width, y + height);
		if (start == null || finish == null) {
			throw 'Parameters out of grid bounds!';
			return;
		}
		else {
			for (var c = start.column; c < finish.column; c++) {
				for (var r = start.row; r < finish.row; r++) {
					this.gridAtIndex(c, r).close();
				}
			}
        }
    }
	getOpenGrids() {
		let openGrids = [];
		for (var c = 0; c < this.width; c++) {
			for (var r = 0; r < this.height; r++) {
				let gridbox = this.grid[c][r]
				if (gridbox.isOpen()) {
					openGrids.push(gridbox);
				}
			}
		}
		return openGrids;
	}

	getSpawnableGrids() {
		let openGrids = [];
		for (var c = 0; c < this.width; c++) {
			for (var r = 0; r < this.height; r++) {
				let gridbox = this.grid[c][r]
				if ((gridbox.isOpen() || gridbox.isRestricted()) && !gridbox.playerOccupied) {
					openGrids.push(gridbox);
				}
			}
		}
		return openGrids;
	}
	
	getNonClosedGrids() {
		let openGrids = [];
		for (var c = 0; c < this.width; c++) {
			for (var r = 0; r < this.height; r++) {
				let gridbox = this.grid[c][r]
				if ((gridbox.isOpen() || gridbox.isRestricted()) && !gridbox.playerOccupied) {
					openGrids.push(gridbox);
				}
			}
		}
		return openGrids;
	}
	update() {
		for (var c = 0; c < this.width; c++) {
			for (var r = 0; r < this.height; r++) {
				this.grid[c][r].update();
			}
		}
		
	}
	draw(ctx) {
		if (PARAMS.GRID) {
			for (var c = 0; c < this.width; c++) {
				for (var r = 0; r < this.height; r++) {
					let grid = this.grid[c][r];
					if ((grid.positionx + this.blockSize > 0 && grid.positiony + this.blockSize > 0 && grid.positionx < this.game.ctx.canvas.width && grid.positiony < this.game.ctx.canvas.height)) {
						grid.draw(ctx);
					}
					
				}
			}
		}	
	}
} 

class GridBlock {
	constructor(game,x,y,blockSize,column,row) {
		Object.assign(this, {game,x, y, blockSize,column,row});
		this.STATES = {
			OPEN: 0,
			RESTRICTED: 1,
			CLOSED: 2
		};

		this.vRestrict = 4;
		this.hRestrict= 4;
		this.playerOccupied = false;	
		this.positionx = this.x - this.game.camera.x;
		this.positiony = this.y - this.game.camera.y;
		this.state = this.STATES.OPEN;
	}
	restrict() {
		this.state = this.STATES.RESTRICTED;
	}
	close() {
		this.state = this.STATES.CLOSED;
	}
	isOpen() {
		return this.state == this.STATES.OPEN;
	}
	isRestricted() {
		return this.state == this.STATES.RESTRICTED;
	}
	isClosed() {
		return this.state == this.STATES.CLOSED;
	}
	restrictRadius(entity) {
		let cstart = Math.max(this.column - this.hRestrict, 0);
		let cfinish = Math.min(this.column + this.hRestrict + Math.floor(entity.width / this.blockSize), this.game.grid.width - 1);
		let rstart = Math.max(this.row - this.vRestrict, 0);
		let rfinish = Math.min(this.row + this.vRestrict + Math.floor(entity.height / this.blockSize), this.game.grid.height - 1);

		for (let c = cstart; c <= cfinish; c++) {
			for (let r = rstart; r <= rfinish; r++) {
				if (!this.game.grid.gridAtIndex(c, r).isClosed()) {
					this.game.grid.gridAtIndex(c, r).restrict();
				}
				
			}
		}

	}
	closeBounds(entity) {
		for (let r = this.row; r < this.row + Math.ceil(entity.height / (this.blockSize)); r++) {
			for (let c = this.column; c < this.column + Math.ceil(entity.width / (this.blockSize)); c++) {
				if (this.game.grid.gridAtIndex(c, r)) {
					this.game.grid.gridAtIndex(c, r).close();
				}

			}

		}
	}
	addTerrain(entity) {
		this.game.addEntity(entity);
		this.closeBounds(entity);
		this.restrictRadius(entity);	
	}

	addEnemy(entity) {
		//console.log("Column: " + this.column + " Row: " + this.row);

		let cstart = this.column;
		let cfinish = this.column + Math.floor(entity.width / this.blockSize);
		let rstart = this.row;
		let rfinish = this.row + Math.floor(entity.height / this.blockSize);

		let isblocked = false;

		for (let c = cstart; c <= cfinish; c++) {
			for (let r = rstart; r <= rfinish; r++) {
				if (this.game.grid.gridAtIndex(c, r)) {
					if (this.game.grid.gridAtIndex(c, r).isClosed()) {
						isblocked = true;
						break;
					}
				}
			}
		}

		if (isblocked) {
			this.game.grid.gridAtIndex(this.column, this.row-1).addEnemy(entity);
		}

		else {
			entity.x = this.x;
			entity.y = this.y;
			this.game.addEntity(entity);
        }
		
    }
	
	update() {
		this.positionx = this.x - this.game.camera.x;
		this.positiony = this.y - this.game.camera.y;

		//Detect player location on grid
		if ((this.positionx + this.blockSize > 0 && this.positiony + this.blockSize > 0 && this.positionx < this.game.ctx.canvas.width && this.positiony - this.blockSize < this.game.ctx.canvas.height)) {
			this.playerOccupied = true;
		}
		else {
			this.playerOccupied = false;
		}
	}
	draw(ctx) {

	
		if (this.isOpen()) {
			ctx.fillStyle = 'rgba(255,255,255,0.3)';

		} else if (this.isRestricted()) {
			ctx.fillStyle = 'rgba(255,0,0,0.3)'
		}
		else if (this.isClosed()) {
			ctx.fillStyle = 'rgba(0,0,0,0.3)'
		}
		ctx.fillRect(this.positionx, this.positiony, this.blockSize, this.blockSize);

		ctx.strokeStyle = 'Red';
		ctx.strokeRect(this.positionx, this.positiony, this.blockSize, this.blockSize);

		if (PARAMS.DEBUG) {
			

			if (this.game.mouse != null) {
				ctx.fillStyle = "White";
				var fontsize = 20;
				ctx.font = fontsize + 'px "VT323"'
				//ctx.fillText("X: " + Math.round(this.game.mouse.x+this.game.camera.x) + " Y: " + Math.round(this.game.mouse.y+this.game.camera.y), this.game.mouse.x, this.game.mouse.y);


				fontsize = 10;
				ctx.font = fontsize + 'px "VT323"'
				let loc = this.game.grid.gridAt(this.game.mouse.x + this.game.camera.x, this.game.mouse.y + this.game.camera.y);
				if (loc == this) {
					ctx.fillText("X: " + Math.round(this.x), this.positionx + 2, this.positiony + 10);
					ctx.fillText("Y: " + Math.round(this.y), this.positionx + 2, this.positiony + 20);
					ctx.fillText("Col: " + this.column, this.positionx + 2, this.positiony + 30);
					ctx.fillText("Row: " + this.row, this.positionx + 2, this.positiony + 40);
				}
				
			}
			
		}
	}

}