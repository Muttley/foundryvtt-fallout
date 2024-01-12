export default class FalloutMacros {

	static async newSession() {
		const macroName = game.i18n.localize("FALLOUT.MACRO.NewSession.name");

		if (!game.user.isGM) {
			return ui.notifications.error(
				game.i18n.format("FALLOUT.MACRO.Error.GameMasterRoleRequired", {
					macro: macroName,
				})
			);
		}
		else {
			try {
				const players = game.users.players;

				let startingAp = 0;

				for (const player of players) {
					const actor = player.character;

					if (!actor) continue; // Player doesn't own a character

					const updateData = {
						"system.conditions.intoxication": 0,
					};

					for (const doseKey in actor.system.chemDoses) {
						updateData[`system.chemDoses.-=${doseKey}`] = null;
					}

					actor.update(updateData);

					startingAp++;
				}

				fallout.APTracker.setAP("partyAP", 0);
				fallout.APTracker.setAP("gmAP", startingAp);

				return ui.notifications.info(
					game.i18n.format("FALLOUT.MACRO.Success", {
						macro: macroName,
					})
				);
			}
			catch(e) {
				return ui.notifications.error(
					game.i18n.format("FALLOUT.MACRO.Error.CaughtError", {
						macro: macroName,
						error: e,
					})
				);
			}
		}
	}

}

export async function createItemMacro(data, slot) {
	// TODO Implement proper item macro creation
	return false;
}
