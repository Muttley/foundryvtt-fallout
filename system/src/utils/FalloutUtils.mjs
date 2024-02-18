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
