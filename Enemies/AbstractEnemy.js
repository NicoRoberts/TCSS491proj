class AbstractEnemy {
	constructor(game, x, y) {
		if (new.target === AbstractEnemy) {
			throw new TypeError("Cannot construct Abstract instances directly");
		}
		Object.assign(game, x, y);
	};

};