const LBS_TO_KGS = 0.4535924;

export default class FalloutUtils {

	static calculateXpReward(level=1, category="normal") {
		if (level <= 0) return 0;

		let base;
		let levelAdjust;
		let perLevel;

		switch (category) {
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

		return base + (perLevel * (level - levelAdjust));
	}

	static checkForTimeJump(lastChange) {
		const maxConditionCheckTimeJump = game.settings.get(
			SYSTEM_ID, "maxConditionCheckTimeJump"
		);

		const maxTimeSkip =
			maxConditionCheckTimeJump * CONFIG.FALLOUT.ONE_HOUR_IN_SECONDS;

		return Math.abs(game.time.worldTime - lastChange) > maxTimeSkip;
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

		if (localizedName === nameKey) localizedName = this.name;

		return localizedName;
	}

	static lbsToKgs(value) {
		return value * LBS_TO_KGS;
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
