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
		apspend = 0,
		apbuy = 0,
	}={}) {
		// let dicesRolled = [];
		let successTreshold = parseInt(attribute) + parseInt(skill);
		let critTreshold = tag ? parseInt(skill) : 1;
		let complicationTreshold = parseInt(complication);
		let formula = `${dicenum}d20`;
		let roll = new Roll(formula);

		await roll.evaluate({ async: true });

		let hitLocation = undefined;
		let hitLocationResult = undefined;

		if (rollLocation) {
			let hitLocationRoll = await new Roll("1dh").evaluate({ async: true });
			// try initiating Dice So Nice Roll
			try {
				game.dice3d.showForRoll(hitLocationRoll);
			}
			catch(err) {}

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
			apspend: apspend,
			apbuy: apbuy,
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
		apspend = 0,
		apbuy = 0,
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
			apspend: apspend,
			apbuy: apbuy,
		});
		return dicesRolled;
	}

	static async rerollD20({
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

		let numOfDice = rerollIndexes.length;
		let formula = `${numOfDice}d20`;
		let _roll = new Roll(formula);

		await _roll.evaluate({ async: true });

		await Roller2D20.parseD20Roll({
			rollname: `${rollname} re-roll`,
			roll: _roll,
			successTreshold: successTreshold,
			critTreshold: critTreshold,
			complicationTreshold: complicationTreshold,
			dicesRolled: dicesRolled,
			rerollIndexes: rerollIndexes,
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
		apspend = 0,
		apbuy = 0,
	}={}) {
		let successesNum = Roller2D20.getNumOfSuccesses(dicesRolled);
		let complicationsNum = Roller2D20.getNumOfComplications(dicesRolled);

		let rollData = {
			rollname,
			successes: successesNum,
			complications: complicationsNum,
			results: dicesRolled,
			successTreshold,
			hitLocation: hitLocation,
			hitLocationResult: hitLocationResult,
			item: item,
			actor: actor,
			apspend: apspend,
			apbuy: apbuy,
		};

		const html = await renderTemplate("systems/fallout/templates/chat/roll2d20.hbs", rollData);

		let falloutRoll = {};
		falloutRoll.rollname = rollname;
		falloutRoll.dicesRolled = dicesRolled;
		falloutRoll.successTreshold = successTreshold;
		falloutRoll.critTreshold = critTreshold;
		falloutRoll.complicationTreshold = complicationTreshold;
		falloutRoll.rerollIndexes = rerollIndexes;
		falloutRoll.diceFace = "d20";
		falloutRoll.hitLocation= hitLocation;
		falloutRoll.hitLocationResult = hitLocationResult;
		falloutRoll.apspend = apspend;
		falloutRoll.apbuy = apbuy;
		const part1 = game.i18n.localize("FALLOUT.Buy_from_Overseer");
		const part2 = game.i18n.localize("FALLOUT.Spend_AP");
		let fla;
		if (dicesRolled.length !== 1) {
			// eslint-disable-next-line no-unused-vars
			 fla =`${part2}: ${apspend}<br>${part1}: ${apbuy}`;
		}
		else {
			fla ="";
		}
		let chatData = {
			user: game.user.id,
			speaker: ChatMessage.getSpeaker({
				actor: actor,
			}),
			flavor: fla,
			rollMode: game.settings.get("core", "rollMode"),
			content: html,
			flags: { falloutroll: falloutRoll },
			type: CONST.CHAT_MESSAGE_TYPES.ROLL,
			roll: roll,
		};

		if (["gmroll", "blindroll"].includes(chatData.rollMode)) {
			chatData.whisper = ChatMessage.getWhisperRecipients("GM");
		}
		else if (chatData.rollMode === "selfroll") {
			chatData.whisper = [game.user];
		}

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
		diceNum = 2,
		rollname = "Roll D6",
		weapon = null,
		otherdmgdice=0,
		firerateamo=0,
	}={}) {
		let dmgmod=parseInt(firerateamo);
		if (weapon.system.damage.weaponQuality.gatling.value) {
			dmgmod = 2 * dmgmod;
		}
		let formula = `${diceNum+otherdmgdice+dmgmod}dc`;
		let roll = new Roll(formula);

		await roll.evaluate({ async: true });

		await Roller2D20.parseD6Roll({
			rollname: rollname,
			roll: roll,
			weapon: weapon,
			actor: actor,
			diceNum: diceNum,
			otherdmgdice: otherdmgdice,
			firerateamo: firerateamo,
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
		diceNum =0,
		otherdmgdice =0,
		firerateamo=0,
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
			otherdmgdice: otherdmgdice,
			diceNum: diceNum,
			firerateamo: firerateamo,
		});
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
		let formula = `${numOfDice}dc`;
		let _roll = new Roll(formula);

		await _roll.evaluate({ async: true });

		return await Roller2D20.parseD6Roll({
			actor: actor,
			dicesRolled: dicesRolled,
			rerollIndexes: rerollIndexes,
			roll: _roll,
			rollname: `${rollname} [re-roll]`,
			weapon: weapon,
		});
	}

	static async addD6({ rollname = "Roll D6", dicenum = 2, falloutRoll = null, dicesRolled = [], weapon = null, actor = null } = {}) {
		let formula = `${dicenum}dc`;
		let _roll = new Roll(formula);

		await _roll.evaluate({ async: true });

		let newRollName = `${falloutRoll.rollname} [+ ${dicenum} DC]`;
		let oldDiceRolled = falloutRoll.dicesRolled;

		return await Roller2D20.parseD6Roll({
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
		otherdmgdice,
		diceNum,
		firerateamo,
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
			rollname: rollname,
			damage: damage,
			effects: effects,
			results: dicesRolled,
			weaponDamageTypesList,
			weapon,
			diceNum: diceNum,
			other: otherdmgdice,
			firerateamo: firerateamo,
		};

		const html = await renderTemplate("systems/fallout/templates/chat/rollD6.hbs", rollData);
		let falloutRoll = {};
		falloutRoll.rollname = rollname;
		falloutRoll.dicesRolled = dicesRolled;
		falloutRoll.damage = damage;
		falloutRoll.effects = effects;
		falloutRoll.rerollIndexes = rerollIndexes;
		falloutRoll.diceFace = "d6";
		falloutRoll.diceNum = diceNum;
		falloutRoll.otherdmgdice = otherdmgdice;
		falloutRoll.firerateamo = firerateamo;
		const weapondmgdice = game.i18n.localize("FALLOUT.Weapondamagedice");
		let additionaludesamo="";
		console.log(weapon);
		if ( weapon.system.weaponType === "meleeWeapons" || weapon.system.weaponType === "unarmed") {
			additionaludesamo=game.i18n.localize("FALLOUT.Additionalmeledmg");
		}
		else {
			additionaludesamo=game.i18n.localize("FALLOUT.Additionalamo");
		}
		const bonusdmg=game.i18n.localize("FALLOUT.Bonusdmg");
		let chatData = {
			// eslint-disable-next-line no-useless-concat
			flavor: `${weapondmgdice}: ${diceNum}<br>`+`${additionaludesamo}: ${firerateamo}<br>`+`${bonusdmg}: ${otherdmgdice}`,
			user: game.user.id,
			rollMode: game.settings.get("core", "rollMode"),
			content: html,
			flags: { falloutroll: falloutRoll, weapon: weapon, actor: actor },
			type: CONST.CHAT_MESSAGE_TYPES.ROLL,
			roll: roll,
		};

		if (["gmroll", "blindroll"].includes(chatData.rollMode)) {
			chatData.whisper = ChatMessage.getWhisperRecipients("GM");
		}
		else if (chatData.rollMode === "selfroll") {
			chatData.whisper = [game.user];
		}
		await ChatMessage.create(chatData);
	}
}
