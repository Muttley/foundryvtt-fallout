export default class FalloutConditionTracker {
	constructor() {
		this.lastWorldTime = 0;
		this.updateIntervalSecs = 60;
	}

	get isDisabled() {
		return !this.isEnabled;
	}

	get isEnabled() {
		return game.settings.get(SYSTEM_ID, "syncConditionsWithWorldClock");
	}

	_checkConditions(worldTime) {
		fallout.logger.debug("Condition Tracker: running checks");

		const actors = game.actors.filter(
			a => a.hasPlayerOwner && a.type === "character"
		).sort(
			(a, b) => a.name.localeCompare(b.name)
		);

		const skipMissingPlayers = game.settings.get(
			SYSTEM_ID, "conditionsSkipMissingPlayers"
		);
		const skipStatus = skipMissingPlayers ? "will" : "will not";

		if (skipMissingPlayers) {
			fallout.logger.debug(`Condition Tracker: ${skipStatus} skip missing players`);
		}

		for (const actor of actors) {
			if (skipMissingPlayers && actor.ownerIsOffline) {
				fallout.logger.log(`Condition Tracker: skipping character ${actor.name} as owner is offline`);
				continue;
			}

			fallout.logger.log(`Condition Tracker: checking conditions for character ${actor.name}`);
			actor.checkConditions(worldTime);
		}
	}

	onUpdateWorldTime(worldTime, worldDelta) {
		if (this.isDisabled) {
			return;
		}
		if (!game.user.isGM) {
			return;
		}

		const secondsSinceLastTick = Math.abs(worldTime - this.lastWorldTime);

		if (secondsSinceLastTick >= this.updateIntervalSecs) {
			this.lastWorldTime = worldTime;
			this._checkConditions(worldTime);
		}
	}
}
