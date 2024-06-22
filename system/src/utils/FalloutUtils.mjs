const LBS_TO_KGS = 0.4535924;

export default class FalloutUtils {

	static calculateXpReward(level=1, category="normal") {
		if (level <= 0) return 0;

		let base;
		let levelAdjust;
		let perLevel;

		switch (category) {
			case "minion":
			case "normal":
				perLevel = 7;

				if (level < 8) {
					base = 10;
					levelAdjust = 1;
				}
				else {
					base = 60;
					levelAdjust = 8;
				}

				break;
			case "mighty":
			case "notable":
				perLevel = 14;

				if (level < 8) {
					base = 20;
					levelAdjust = 1;
				}
				else {
					base = 120;
					levelAdjust = 8;
				}

				break;
			case "legendary":
			case "major":
				perLevel = 21;

				if (level < 8) {
					base = 30;
					levelAdjust = 1;
				}
				else {
					base = 180;
					levelAdjust = 8;
				}

				break;
		}

		let xpReward = base + (perLevel * (level - levelAdjust));

		if (category === "minion") xpReward = Math.round(xpReward / 3);

		return xpReward;
	}

	static checkForTimeJump(lastChange) {
		const maxConditionCheckTimeJump = game.settings.get(
			SYSTEM_ID, "maxConditionCheckTimeJump"
		);

		const maxTimeSkip =
			maxConditionCheckTimeJump * CONFIG.FALLOUT.ONE_HOUR_IN_SECONDS;

		return Math.abs(game.time.worldTime - lastChange) > maxTimeSkip;
	}

	static foundryMinVersion(version) {
		const majorVersion = parseInt(game.version.split(".")[0]);
		return majorVersion >= version;
	}

	static getLocalizedSkillAttribute(skill) {
		return game.i18n.localize(
			`FALLOUT.AbilityAbbr.${skill.system.defaultAttribute}`
		);
	}

	static getLocalizedSkillName(skill) {
		// Get the localized name of a skill, if there is no
		// localization then it is likely a custom skill, in which
		// case we will just use it's original name
		//
		const nameKey = `FALLOUT.SKILL.${skill.name}`;
		let localizedName = game.i18n.localize(nameKey);

		if (localizedName === nameKey) localizedName = skill.name;

		return localizedName;
	}

	static getMessageStyles() {
		const messageStyles = this.foundryMinVersion(12)
			? CONST.CHAT_MESSAGE_STYLES
			: CONST.CHAT_MESSAGE_TYPES;

		return messageStyles;
	}

	static isCompendiumTableResult(result) {
		return this.foundryMinVersion(12)
			? result.type === "pack"
			: result.type === CONST.TABLE_RESULT_TYPES.COMPENDIUM;
	}

	static lbsToKgs(value) {
		return value * LBS_TO_KGS;
	}

	static minsToString(mins) {
		const MINS_PER_DAY = 1440;
		const MINS_PER_HOUR = 60;

		const stringParts = [];

		if (mins >= MINS_PER_DAY) {
			const days = Math.floor(mins / MINS_PER_DAY);
			mins -= (days * MINS_PER_DAY);

			if (days > 1) {
				stringParts.push(
					game.i18n.format("FALLOUT.TIME.DAYS_PLURAL", {days})
				);
			}
			else {
				stringParts.push(
					game.i18n.format("FALLOUT.TIME.DAYS_SINGULAR", {days})
				);
			}
		}

		if (mins >= MINS_PER_HOUR) {
			const hours = Math.floor(mins / MINS_PER_HOUR);
			mins -= (hours * MINS_PER_HOUR);

			if (hours > 1) {
				stringParts.push(
					game.i18n.format("FALLOUT.TIME.HOURS_PLURAL", {hours})
				);
			}
			else {
				stringParts.push(
					game.i18n.format("FALLOUT.TIME.HOURS_SINGULAR", {hours})
				);
			}
		}

		if (mins === 0 || mins > 1) {
			stringParts.push(
				game.i18n.format("FALLOUT.TIME.MINUTES_PLURAL", {mins})
			);
		}
		else {
			stringParts.push(
				game.i18n.format("FALLOUT.TIME.MINUTES_PLURAL", {mins})
			);
		}

		return stringParts.join(", ");
	}

	static playDiceSound() {
		const sounds = [CONFIG.sounds.dice];
		const src = sounds[0];
		game.audio.play(src);
	}

	static async sleep(millisecs=1000) {
		return new Promise((resolve, reject) => {
  			setTimeout(resolve, millisecs);
		});
	}

	// If this is a new release, show the release notes to the GM the first time
	// they login
	static async showNewReleaseNotes() {
		if (game.user.isGM) {
			const savedVersion = game.settings.get("fallout", "systemVersion");
			const systemVersion = game.system.version;

			if (systemVersion !== savedVersion) {
				Hotbar.toggleDocumentSheet(
					CONFIG.FALLOUT.JOURNAL_UUIDS.releaseNotes
				);

				game.settings.set(
					"fallout", "systemVersion",
					systemVersion
				);
			}
		}
	}
}
