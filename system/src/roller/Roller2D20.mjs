export class Roller2D20 {
	dicesRolled = [];

	successTreshold = 0;

	critTreshold = 1;

	complicationTreshold = 20;

	successes = 0;

	static async rollD20({
		actor = null,
		attribute = 0,
		complication = 20,
		dicenum = 2,
		difficulty = 1,
		item = null,
		rollLocation = false,
		rollname = "Roll xD20",
		skill = 0,
		tag = false,
	}={}) {
		// let dicesRolled = [];
		let successTreshold = parseInt(attribute) + parseInt(skill);
		let critTreshold = tag ? parseInt(skill) : 1;
		let complicationTreshold = parseInt(complication);
		let formula = `${dicenum}d20`;
		let roll = new Roll(formula);

		await roll.evaluate();

		this.showDiceSoNice(roll);
		// try {
		// 	game.dice3d.showForRoll(roll, game.user, true);
		// }
		// catch(err) {}

		let hitLocation = undefined;
		let hitLocationResult = undefined;

		if (rollLocation) {
			let hitLocationRoll = await new Roll("1dh").evaluate();
			// try initiating Dice So Nice Roll
			this.showDiceSoNice(hitLocationRoll);
			// try {
			// 	game.dice3d.showForRoll(hitLocationRoll, game.user, true);
			// }
			// catch(err) {}

			hitLocation = hitLocationRoll.terms[0].getResultLabel(
				hitLocationRoll.terms[0].results[0]
			);

			hitLocationResult = hitLocationRoll.total;
		}

		const dicesRolled = await Roller2D20.parseD20Roll({
			actor: actor,
			complicationTreshold,
			critTreshold,
			hitLocation,
			hitLocationResult,
			item: item,
			roll: roll,
			rollname: rollname,
			successTreshold,
		});
		return {roll: roll, dicesRolled: dicesRolled};
	}

	static async parseD20Roll({
		actor = null,
		complicationTreshold = 20,
		critTreshold = 1,
		dicesRolled = [],
		hitLocation=null,
		hitLocationResult=null,
		item = null,
		rerollIndexes = [],
		roll = null,
		rollname = "Roll xD20",
		successTreshold = 0,
		flavor = null,
	}={}) {
		let i = 0;
		roll.dice.forEach(d => {
			d.results.forEach(r => {
				let diceSuccess = 0;
				let diceComplication = 0;

				if (r.result <= successTreshold) {
					diceSuccess++;
				}

				critTreshold = Math.max(critTreshold, 1);

				if (r.result <= critTreshold) {
					diceSuccess++;
				}

				if (r.result >= complicationTreshold) {
					diceComplication = 1;
				}

				// If there are no rollIndexes sent then it is a new roll.
				// Otherwise it's a re-roll and we should replace dices at given
				// indexes
				if (!rerollIndexes.length) {
					dicesRolled.push({
						success: diceSuccess,
						reroll: false,
						result: r.result,
						complication: diceComplication,
					});
				}
				else {
					dicesRolled[rerollIndexes[i]] = {
						success: diceSuccess,
						reroll: true,
						result: r.result,
						complication: diceComplication,
					};

					i++;
				}
			});
		});

		await Roller2D20.sendToChat({
			actor: actor,
			complicationTreshold: complicationTreshold,
			critTreshold: critTreshold,
			dicesRolled: dicesRolled,
			hitLocation: hitLocation,
			hitLocationResult: hitLocationResult,
			item: item,
			rerollIndexes: rerollIndexes,
			roll: roll,
			rollname: rollname,
			successTreshold: successTreshold,
			flavor: flavor,
		});
		return dicesRolled;
	}

	static async rerollD20({
		actor = null,
		complicationTreshold = 20,
		critTreshold = 1,
		dicesRolled = [],
		rerollIndexes = [],
		roll = null,
		rollname = "Roll xD20",
		successTreshold = 0,
	}={}) {
		if (!rerollIndexes.length) {
			ui.notifications.notify("Select Dice you want to Reroll");
			return;
		}
		let number_of_dice_to_reroll = 0;
		let used_luck_points = 0;
		let non_spend_luck_value = 0;
		const actordata = game.actors.get(actor);
		let numOfDice = rerollIndexes.length;
		if (actordata.type === "character" || actordata.type === "robot") {
			const rolltype = 20;
			// eslint-disable-next-line max-len
			({number_of_dice_to_reroll, used_luck_points, non_spend_luck_value } = await reroll.spendLuck({ actordata, numOfDice, rolltype }));
		}
		let formula = `${number_of_dice_to_reroll}d20`;
		let _roll = new Roll(formula);
		const flavor = `${game.i18n.localize("FALLOUT.UI.YOU_RE-ROLL")} ${number_of_dice_to_reroll} ${game.i18n.localize("FALLOUT.UI.DICE")}\n${game.i18n.localize("FALLOUT.UI.SPENDING")} ${used_luck_points} ${game.i18n.localize("FALLOUT.UI.LUCK_POINT")}k\n ${game.i18n.localize("FALLOUT.UI.AND_YOU_RE-ROLL")} ${non_spend_luck_value} ${game.i18n.localize("FALLOUT.UI.DICE_WITOUT_LUCK")}`;

		await _roll.evaluate();

		this.showDiceSoNice(_roll);
		// try {
		// 	game.dice3d.showForRoll(_roll, game.user, true);
		// }
		// catch(err) {}

		await Roller2D20.parseD20Roll({
			rollname: `${rollname} re-roll`,
			roll: _roll,
			successTreshold: successTreshold,
			critTreshold: critTreshold,
			complicationTreshold: complicationTreshold,
			dicesRolled: dicesRolled,
			rerollIndexes: rerollIndexes,
			actor: actordata,
			flavor: flavor,
		});
	}

	static async sendToChat({
		actor = null,
		complicationTreshold = 20,
		critTreshold = 1,
		dicesRolled = [],
		hitLocation=null,
		hitLocationResult=null,
		item = null,
		rerollIndexes = [],
		roll = null,
		rollname = "Roll xD20",
		successTreshold = 0,
		flavor = null,
	}={}) {
		let successesNum = Roller2D20.getNumOfSuccesses(dicesRolled);
		let complicationsNum = Roller2D20.getNumOfComplications(dicesRolled);

		let rollData = {
			actor: actor,
			complications: complicationsNum,
			hitLocation: hitLocation,
			hitLocationResult: hitLocationResult,
			item: item,
			results: dicesRolled,
			rollname,
			successes: successesNum,
			successTreshold,
			flavor: flavor,
		};

		const html = await renderTemplate("systems/fallout/templates/chat/roll2d20.hbs", rollData);

		let falloutRoll = {};
		falloutRoll.complicationTreshold = complicationTreshold;
		falloutRoll.critTreshold = critTreshold;
		falloutRoll.diceFace = "d20";
		falloutRoll.dicesRolled = dicesRolled;
		falloutRoll.hitLocation= hitLocation;
		falloutRoll.hitLocationResult = hitLocationResult;
		falloutRoll.rerollIndexes = rerollIndexes;
		falloutRoll.rollname = rollname;
		falloutRoll.successTreshold = successTreshold;
		falloutRoll.flavor = flavor;

		let chatData = {
			content: html,
			flags: { falloutroll: falloutRoll },
			roll,
			rollMode: game.settings.get("core", "rollMode"),
			speaker: ChatMessage.getSpeaker({actor: actor}),
			user: game.user.id,
		};

		ChatMessage.applyRollMode(chatData, game.settings.get("core", "rollMode"));

		// if (["gmroll", "blindroll"].includes(chatData.rollMode)) {
		// 	chatData.whisper = ChatMessage.getWhisperRecipients("GM");
		// }
		// else if (chatData.rollMode === "selfroll") {
		// 	chatData.whisper = [game.user];
		// }

		await ChatMessage.create(chatData);
	}

	static getNumOfSuccesses(results) {
		let s = 0;
		results.forEach(d => {
			s += d.success;
		});
		return s;
	}

	static getNumOfComplications(results) {
		let r = 0;
		results.forEach(d => {
			r += d.complication;
		});
		return r;
	}

	static async rollD6({
		actor = null,
		dicenum = 2,
		rollname = "Roll D6",
		weapon = null,
	}={}) {
		let formula = `${dicenum}dc`;
		let roll = new Roll(formula);

		await roll.evaluate();


		this.showDiceSoNice(roll);
		// try {
		// 	game.dice3d.showForRoll(roll, game.user, true);
		// }
		// catch(err) {}


		return Roller2D20.parseD6Roll({
			rollname: rollname,
			roll: roll,
			weapon: weapon,
			actor: actor,
		});
	}

	static async parseD6Roll({
		actor = null,
		addDice = [],
		dicesRolled = [],
		rerollIndexes = [],
		roll = null,
		rollname = "Roll D6",
		weapon = null,
		flavor = null,
	}={}) {
		let diceResults = [
			{ result: 1, effect: 0 },
			{ result: 2, effect: 0 },
			{ result: 0, effect: 0 },
			{ result: 0, effect: 0 },
			{ result: 1, effect: 1 },
			{ result: 1, effect: 1 },
		];

		let i = 0;
		roll.dice.forEach(d => {
			d.results.forEach(r => {
				let diceResult = diceResults[r.result - 1];
				diceResult.face = r.result;
				// if there are no rollIndexes sent then it is a new roll.
				// Otherwise it's a re-roll and we should replace dices at given
				// indexes
				if (!rerollIndexes.length) {
					dicesRolled.push(diceResult);
				}
				else {
					dicesRolled[rerollIndexes[i]] = diceResult;
					i++;
				}
			});
		});

		if (addDice.length) {
			dicesRolled = addDice.concat(dicesRolled);
		}

		await Roller2D20.sendD6ToChat({
			actor: actor,
			dicesRolled: dicesRolled,
			rerollIndexes: rerollIndexes,
			roll: roll,
			rollname: rollname,
			weapon: weapon,
			flavor: flavor,
		});

		return dicesRolled;
	}

	static async rerollD6({
		actor = null,
		dicesRolled = [],
		rerollIndexes = [],
		roll = null,
		rollname = "Roll D6",
		weapon = null,
	}={}) {
		if (!rerollIndexes.length) {
			ui.notifications.notify("Select Dice you want to Reroll");
			return;
		}
		let numOfDice = rerollIndexes.length;
		const actordata = game.actors.get(actor);
		let number_of_dice_to_reroll = 0;
		let spend_luck_value = 0;
		let used_luck_points = 0;
		let non_spend_luck_value = 0;

		if (actordata.type === "character" || actordata.type === "robot") {
			const rolltype = 6;
			// eslint-disable-next-line max-len
			({number_of_dice_to_reroll, spend_luck_value, used_luck_points, non_spend_luck_value } = await reroll.spendLuck({ actordata, numOfDice, rolltype }));
		}
		let formula = `${number_of_dice_to_reroll}dc`;
		let _roll = new Roll(formula);
		const flavor = `${game.i18n.localize("FALLOUT.UI.YOU_RE-ROLL")} ${spend_luck_value} ${game.i18n.localize("FALLOUT.UI.DICE")}\n${game.i18n.localize("FALLOUT.UI.SPENDING")} ${used_luck_points} ${game.i18n.localize("FALLOUT.UI.LUCK_POINT")}k\n ${game.i18n.localize("FALLOUT.UI.AND_YOU_RE-ROLL")} ${non_spend_luck_value} ${game.i18n.localize("FALLOUT.UI.DICE_WITOUT_LUCK")}`;
		await _roll.evaluate();

		this.showDiceSoNice(_roll);
		// try {
		// 	game.dice3d.showForRoll(_roll, game.user, true);
		// }
		// catch(err) {}

		return Roller2D20.parseD6Roll({
			actor: actordata,
			dicesRolled: dicesRolled,
			rerollIndexes: rerollIndexes,
			roll: _roll,
			rollname: `${rollname} [re-roll]`,
			weapon: weapon,
			flavor: flavor,
		});
	}

	static async addD6({ rollname = "Roll D6", dicenum = 2, falloutRoll = null, dicesRolled = [], weapon = null, actor = null } = {}) {
		let formula = `${dicenum}dc`;
		let _roll = new Roll(formula);

		await _roll.evaluate();

		this.showDiceSoNice(_roll);
		// try {
		// 	game.dice3d.showForRoll(roll, game.user, true);
		// }
		// catch(err) {}

		let newRollName = `${falloutRoll.rollname} [+ ${dicenum} DC]`;
		let oldDiceRolled = falloutRoll.dicesRolled;

		return Roller2D20.parseD6Roll({
			rollname: newRollName,
			roll: _roll,
			dicesRolled: dicesRolled,
			addDice: oldDiceRolled,
			weapon: weapon,
			actor: actor,
		});
	}

	static async sendD6ToChat({
		actor = null,
		dicesRolled = [],
		rerollIndexes = [],
		roll = null,
		rollname = "Roll D6",
		weapon = null,
		flavor = null,
	}={}) {
		let damage = dicesRolled.reduce(
			(a, b) => ({ result: a.result + b.result })
		).result;

		let effects = dicesRolled.reduce(
			(a, b) => ({ effect: a.effect + b.effect })
		).effect;

		let weaponDamageTypesList = [];

		if (weapon != null) {
			weaponDamageTypesList = Object.keys(
				weapon.system.damage.damageType
			).filter(
				dt => weapon.system.damage.damageType[dt]
			);

			// Check for Vicious damage effect and add to damage for each effect
			// rolled
			for (let de in weapon.system.damage.damageEffect) {
				const effect = weapon.system.damage.damageEffect[de];

				if (effect.value && de === "vicious") {
					damage += effects;
					break;
				}
			}
		}

		let rollData = {
			damage,
			effects,
			results: dicesRolled,
			rollname,
			weapon,
			weaponDamageTypesList,
			actor,
			flavor,
		};

		const html = await renderTemplate(
			"systems/fallout/templates/chat/rollD6.hbs",
			rollData
		);

		let falloutRoll = {};
		falloutRoll.damage = damage;
		falloutRoll.diceFace = "d6";
		falloutRoll.dicesRolled = dicesRolled;
		falloutRoll.effects = effects;
		falloutRoll.rerollIndexes = rerollIndexes;
		falloutRoll.rollname = rollname;
		falloutRoll.actor = actor;
		falloutRoll.flavor = flavor;

		const flags = {
			actor,
			falloutroll: falloutRoll,
			weapon,
		};

		const { whisper, blind } = this.getRollModeSettings();

		const chatData = {
			blind,
			content: html,
			flags: flags,
			roll,
			rollMode: game.settings.get("core", "rollMode"),
			speaker: ChatMessage.getSpeaker({actor: actor}),
			user: game.user.id,
			whisper,
		};


		// ChatMessage.applyRollMode(chatData, game.settings.get("core", "rollMode"));

		// if (["gmroll", "blindroll"].includes(chatData.rollMode)) {
		// 	chatData.whisper = ChatMessage.getWhisperRecipients("GM");
		// }
		// else if (chatData.rollMode === "selfroll") {
		// 	chatData.whisper = [game.user];
		// }
		await ChatMessage.create(chatData);
	}

	/**
	 * Add support for the Dice So Nice module
	 * @param {Object} roll
	 * @param {String} rollMode
	 */
	static async showDiceSoNice(roll) {
		if (game.modules.get("dice-so-nice")
			&& game.modules.get("dice-so-nice").active
		) {
			const { whisper, blind } = Roller2D20.getRollModeSettings();

			await game.dice3d.showForRoll(roll, game.user, true, whisper, blind);
		}
	}

	static getRollModeSettings() {
		const rollMode = game.settings.get("core", "rollMode");

		let blind = false;
		let whisper = null;

		switch (rollMode) {
			case "blindroll": {
				blind = true;
			}
			case "gmroll": {
				const gmList = game.users.filter(user => user.isGM);
				const gmIDList = [];
				gmList.forEach(gm => gmIDList.push(gm.id));
				whisper = gmIDList;
				break;
			}
			case "roll": {
				const userList = game.users.filter(user => user.active);
				const userIDList = [];
				userList.forEach(user => userIDList.push(user.id));
				whisper = userIDList;
				break;
			}
			case "selfroll": {
				whisper = [game.user.id];
				break;
			}
			default: {
				break;
			}
		}
		return { whisper, blind };
	}
}
export class reroll extends Dialog {
	constructor(
		actordata,
		numOfDice,
		rolltype,
		dialogData={},
		options={}
	) {
		super(dialogData, options);
		this.actor = actordata;
		this.numOfDice = numOfDice;
		this.rolltype = rolltype;
	}

	activateListeners(html) {
		super.activateListeners(html);
		html.on("change", ".spend-luck", event =>  {
			let usedluckpoints = 0;
			const reroll_dices = parseInt($(event.currentTarget).val());
			if (this.rolltype === 6) {
				usedluckpoints = reroll_dices/ 3;
			}
			else {
				usedluckpoints = reroll_dices;
			}
			const nonSpendLuck = html.find(".non-spend-luck");
			const nonSpendLucknumofdice = parseInt($(nonSpendLuck).val());
			nonSpendLuck.empty();
			for (let i = 0; i <= this.numOfDice - reroll_dices; i++) {
				const adjustedValue = Math.max(0, i);
				const selected = i === 0 ? "selected" : "";
				nonSpendLuck.append(`<option value="${adjustedValue}" ${selected}>${adjustedValue}</option>`);
				nonSpendLuck[0].selectedIndex = nonSpendLucknumofdice;
			}
			const avaliableluck = this.actor.system.luckPoints;
			if (usedluckpoints > avaliableluck) {
				const part1 = game.i18n.localize("FALLOUT.UI.Not_Enough");
				const part2 = game.i18n.localize("FALLOUT.AbilityLuc");
				const part3 = game.i18n.localize("FALLOUT.TEMPLATES.Points");
				ui.notifications.warn(`${part1} ${part2} ${part3}`);
				html.find(".spend-luck")[0].selectedIndex = 0;
				html.find(".spend-luck").trigger("change");

			}
		});
		html.on("change", ".non-spend-luck", event => {
			const freedicetoreroll = parseInt($(event.currentTarget).val());
			const SpendLuck = html.find(".spend-luck");
			const spendLucknumofdice =  parseInt($(SpendLuck).val());
			SpendLuck.empty(); // Clear existing options
			for (let i = 0; i <= this.numOfDice - freedicetoreroll; i++) {
				const adjustedValue = Math.max(0, i);
				const selected = i === 0 ? "selected" : "";
				SpendLuck.append(`<option value="${adjustedValue}" ${selected}>${adjustedValue}</option>`);
				SpendLuck[0].selectedIndex = spendLucknumofdice;
			}
		});

	}

	static async spendLuck({actordata, numOfDice, rolltype }) {
		return new Promise(async (resolve, reject) => {
			const html = await renderTemplate("systems/fallout/templates/dialogs/reroll.hbs", {numOfDice});
			// eslint-disable-next-line max-len
			let d = new reroll(actordata, numOfDice, rolltype, {
				title: "spend luck",
				content: html,
				buttons: {
					spendluk: {
						icon: '<i class="fas fa-check"></i>',
						label: "Re-Roll",
						callback: html => {
							let spend_luck_value = parseInt(html.find(".spend-luck").val());
							if (spend_luck_value === undefined) {
								spend_luck_value = 0;
							}
							let non_spend_luck_value = parseInt(html.find(".non-spend-luck").val());
							if (non_spend_luck_value === undefined) {
								non_spend_luck_value = 0;
							}
							// eslint-disable-next-line max-len
							const number_of_dice_to_reroll = spend_luck_value + non_spend_luck_value;

							const actor = actordata;
							const current_luck_points = actor.system.luckPoints;

							let used_luck_points = 0;
							if (rolltype === 6) {
								used_luck_points = spend_luck_value / 3;
								used_luck_points = Math.ceil(used_luck_points);
							}
							else {
								used_luck_points = spend_luck_value;
							}

							const new_luck_points = current_luck_points - used_luck_points;
							actor.update({ "system.luckPoints": new_luck_points });
							// eslint-disable-next-line max-len
							resolve({number_of_dice_to_reroll, spend_luck_value, used_luck_points, non_spend_luck_value});
						},
					},
				},
				close: () => { },
			});
			d.render(true);
		});
	}
}
