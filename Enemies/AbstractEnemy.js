class AbstractEnemy {
	constructor(game,x,y,) {
		Object.assign(game, x, y);
		if (new.target === AbstractEnemy) {
			throw new TpyeError("Cannot make an instance of an abstract class");
		}
	}

}