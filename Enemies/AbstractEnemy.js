class AbstractEnemy {
	constructor(game) {
		this.game = game;
		if (new.target === AbstractEnemy) {
			throw new TpyeError("Cannot make an instance of an abstract class");
		}
	}

}