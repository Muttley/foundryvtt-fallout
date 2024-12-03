export default class FalloutMacros {

	// Work out which actor to use.  If the user running the macro is the GM use
	// the selected token.
	//
	// Players running a script always use their own character Actor unless one
	// isn't assigned, in which case it will use the.
	//
	static async _getMacroActor() {
		let actor = null;

		if (game.user.isGM) {
			const controlledTokenCount = canvas.tokens.controlled.length;
			if (controlledTokenCount > 0) {
				if (controlledTokenCount !== 1) {
					ui.notifications.warn(
						game.i18n.format("FALLOUT.MACRO.Error.TooManyTokensSelected", {
							max: 1,
						})
					);
				}
				else {
					actor = canvas.tokens.controlled[0].actor;
				}
			}
			else {
				ui.notifications.warn(
					game.i18n.format("FALLOUT.MACRO.Error.NoTokensSelected")
				);
			}
		}
		else if (game.user.character) {
			actor = game.user.character;
		}
		else {
			ui.notifications.warn(
				game.i18n.format("FALLOUT.MACRO.Error.NoPLayerCharacterAssigned")
			);
		}

		return actor;
	}


	// Work out which actors to use.  GMs need at least one token selected.
	//
	// Players always use their own character Actor.
	//
	static async _getMacroActors() {
		let actors = [];

		if (game.user.isGM) {
			const controlledTokenCount = canvas.tokens.controlled.length;
			if (controlledTokenCount > 0) {
				for (const token of canvas.tokens.controlled) {
					actors.push(token.actor);
				}
			}
			else {
				ui.notifications.warn(
					game.i18n.format("FALLOUT.MACRO.Error.NoTokensSelected")
				);
			}
		}
		else if (game.user.character) {
			actors.push(game.user.character);
		}
		else {
			ui.notifications.warn(
				game.i18n.format("FALLOUT.MACRO.Error.NoPLayerCharacterAssigned")
			);
		}

		return actors;
	}


	static async drinkDirtyWater() {
		const actor = await FalloutMacros._getMacroActor();

		if (!actor) return;

		renderTemplate(
			"systems/fallout/templates/dialogs/are-you-sure.hbs"
		).then(html => {
			new Dialog({
				title: `${game.i18n.localize("FALLOUT.MACRO.DrinkDirtyWater.name")}`,
				content: html,
				buttons: {
					Yes: {
						icon: '<i class="fa fa-check"></i>',
						label: `${game.i18n.localize("FALLOUT.UI.Yes")}`,
						callback: async () => {
							actor.drinkDirtyWater();
						},
					},
					Cancel: {
						icon: '<i class="fa fa-times"></i>',
						label: `${game.i18n.localize("FALLOUT.UI.Cancel")}`,
					},
				},
				default: "Yes",
			}).render(true);
		});
	}


	static async newScene() {
		const macroName = game.i18n.localize("FALLOUT.MACRO.NewScene.name");

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

				for (const player of players) {
					const actor = player.character;

					if (actor) actor.updateAddictions();
				}

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


	static async partySleep() {
		const macroName = game.i18n.localize("FALLOUT.APP.PartySleep.title");

		if (!game.user.isGM) {
			return ui.notifications.error(
				game.i18n.format("FALLOUT.MACRO.Error.GameMasterRoleRequired", {
					macro: macroName,
				})
			);
		}
		else {
			return new fallout.apps.FalloutPartySleep().render(true);
		}
	}
}

export async function createItemMacro(data, slot) {
	// TODO Implement proper item macro creation
	return false;
}
