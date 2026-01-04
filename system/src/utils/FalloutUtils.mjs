const LBS_TO_KGS = 0.4535924;

export default class FalloutUtils {

	static calculateXpReward(level=1, category="normal") {
		if (level <= 0) {
			return 0;
		}

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

		if (category === "minion") {
			xpReward = Math.round(xpReward / 3);
		}

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


	// Attempts to get the current actor for a user.  If the current user is the
	// GM then the currently selected token actor will be used if possible,
	// otherwise
	static async getActorForUser() {
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
					game.i18n.format("FALLOUT.ERRORS.NoCharacterTokenSelected")
				);
			}
		}
		else if (game.user.character) {
			actor = game.user.character;
		}
		else {
			ui.notifications.warn(
				game.i18n.format("FALLOUT.ERRORS.NoPLayerCharacterAssigned")
			);
		}

		return actor;
	}


	/**
	 * Creates de-duplicated lists of Selected and Unselected Items.
	 *
	 * @param {allItems} Array A list of all available items
	 * @param {items} Array A list of currently selected items
	 *
	 * @returns {Promise} Promise which represents an array containing both the
	 * selected and unselected item arrays
	 */
	static async getDedupedSelectedItems(allItems, items) {
		const unselectedItems = [];
		const selectedItems = [];

		allItems.forEach(item => {
			if (!items.includes(item.uuid)) {
				unselectedItems.push(item);
			}
		});

		for (const itemUuid of items) {
			selectedItems.push(await this.getFromUuid(itemUuid));
		}

		selectedItems.sort((a, b) => a.name.localeCompare(b.name));

		return [selectedItems, unselectedItems];
	}

	static async getFromUuid(uuid) {
		const itemObj = await fromUuid(uuid);
		if (itemObj) {
			return itemObj;
		}
		else {
			return {name: "[Invalid ID]", uuid: uuid};
		}
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

		if (localizedName === nameKey) {
			localizedName = skill.name;
		}

		return localizedName;
	}

	static getMessageStyles() {
		const messageStyles = this.foundryMinVersion(12)
			? CONST.CHAT_MESSAGE_STYLES
			: CONST.CHAT_MESSAGE_TYPES;

		return messageStyles;
	}

	static getPlayerCharacters() {
		const characters = [];

		for (const player of game.users.players) {
			const actor = player.character;

			if (!actor) {
				fallout.warn(
					`[FalloutUtils::getPlayerCharacters] ${player.name} does not have an associated character`
				);

				continue;
			}

			characters.push(actor);
		}

		characters.sort((a, b) => a.name.localeCompare(b.name));

		return characters;
	}

	static isCompendiumTableResult(result) {
		return this.foundryMinVersion(12)
			? result.type === "pack"
			: result.type === CONST.TABLE_RESULT_TYPES.COMPENDIUM;
	}

	static lbsToKgs(value) {
		return value * LBS_TO_KGS;
	}


	static async loadLegacyArtMappings() {
		// search modules for legacy art mappings and convert to new format
		for (const module of game.modules) {
			if (!module.active) {
				continue;
			}
			const flags = module.flags?.[module.id];
			if (flags?.["fallout-art"]) {
				module.flags.compendiumArtMappings = {
					fallout: {
						mapping: flags["fallout-art"],
					},
				};
			}
		}
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
				this.toggleDocumentSheet(
					CONFIG.FALLOUT.JOURNAL_UUIDS.releaseNotes
				);

				game.settings.set(
					"fallout", "systemVersion",
					systemVersion
				);
			}
		}
	}


	static async toggleDocumentSheet(uuid) {
		const document = await fromUuid(uuid);

		if (!document) {
			return fallout.error(`Unable to find document with uuid '${uuid}'`);
		}

		if (document.sheet.rendered) {
			await document.sheet.close();
		}
		else {
			await document.sheet.render(true);
		}
	}
}
