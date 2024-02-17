const LBS_TO_KGS = 0.4535924;

export default class FalloutUtils {

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
