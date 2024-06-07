export default class SalvageJunk extends FormApplication {
	constructor(object, options={}) {
		super(object, options);

		this.actor = object;

		this.maxJunk = this.actor.system?.materials?.junk ?? 0;
		this.maxJunk += this.actor.items.filter(
			i => i.system.canBeScrapped && i.system.isJunk
		).length;

		this.minJunk = this.maxJunk > 0 ? 1 : 0;

		this.junkedItems = 0;
		this.junkToProcess = this.minJunk;
	}

	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ["fallout", "salvage-junk"],
			width: 400,
			height: "auto",
			submitOnChange: true,
			closeOnSubmit: false,
		});
	}

	/** @inheritdoc */
	get template() {
		return "systems/fallout/templates/apps/salvage-junk.hbs";
	}

	/** @inheritdoc */
	get title() {
		return `${game.i18n.localize("FALLOUT.APP.SalvageJunk.title")}`;
	}

	activateListeners(html) {
		super.activateListeners(html);

		html.find(".start-salvaging-button").click(async event => {
			await this._onStartSalvaging();
			this.close();
		});
	}

	getData() {
		const context = super.getData();

		context.minJunk = this.minJunk;
		context.maxJunk = this.maxJunk;

		context.junkToProcess = this.junkToProcess;
		context.timeToProcess = this.timeToSalvageDisplay(this.junkToProcess);

		return context;
	}

	timeToSalvage() {
		return this.junkToProcess * CONFIG.FALLOUT.DEFAULT_JUNK_SALVAGE_MINS;
	}

	timeToSalvageDisplay() {
		return fallout.utils.minsToString(
			this.timeToSalvage()
		);
	}

	async _onStartSalvaging() {
		const junkItems = this.actor.items.filter(
			i => i.system.canBeScrapped && i.system.isJunk
		);

		this.junkedItems = 0;
		for (const junkItem of junkItems) {
			if (this.junkedItems >= this.junkToProcess) break;

			this.junkedItems++;

			junkItem.delete();
		}

		const skillItem = this.actor.items.find(i => i.name === "Repair");

		const intelligence = this.actor?.system?.attributes?.int?.value ?? 0;
		const repair = skillItem?.system?.value ?? 0;
		const tag = skillItem?.system?.tag ?? false;

		const salvageConfig = {
			critSuccess: tag ? repair : 1,
			scrapper: this.actor.perkLevel("scrapper"),
			tn: intelligence + repair,
		};

		return this._salvage(salvageConfig);
	}

	async _performMaterialRolls(config, rollData) {
		const diceToRoll = this.junkToProcess
			+ rollData.repair.successes
			+ rollData.repair.criticals;

		let rollInstance = new Roll(`${diceToRoll}dc`);
		let salvageRoll = await rollInstance.roll();

		const results = {
			common: 0,
			uncommon: 0,
			rare: 0,
		};

		let effects = 0;

		salvageRoll.terms[0].results.forEach(roll => {
			const effect = roll.result >= 5 ? 1 : 0;
			const value = roll.result <= 2 ? roll.result : 0;

			results.common += value + effect;
			effects += effect;
		});

		if (config.scrapper >= 1) {
			results.uncommon = effects;
		}
		if (config.scrapper >= 2) {
			results.rare = Math.floor(effects / 2);
		}

		return results;
	}

	async _performRepairRolls(config) {
		const results = {
			successes: 0,
			criticals: 0,
			complications: 0,
		};

		const numDice = this.junkToProcess * 2;

		let rollInstance = new Roll(`${numDice}d20cs<=${config.tn}cf>=20`);
		let salvageRoll = await rollInstance.roll();

		salvageRoll.terms[0].results.forEach(roll => {
			const critical = roll.result <= config.critSuccess;

			results.successes += roll.success ? 1 : 0;
			results.criticals += critical ? 1 : 0;
			results.complications += roll.failure ? 1 : 0;
		});

		return results;
	}

	async _salvage(config) {
		const rollData = { config };

		rollData.repair = await this._performRepairRolls(config);
		rollData.materials = await this._performMaterialRolls(config, rollData);

		rollData.junkToProcess = this.junkToProcess;
		rollData.junkedItems = this.junkedItems;
		rollData.type = "salvage-junk";
		rollData.timeToSalvage = this.timeToSalvageDisplay(this.junkToProcess);
		rollData.timeToSalvageMins = this.timeToSalvage(this.junkToProcess);

		// Update the actor
		const actorMaterials = this.actor.system.materials;

		actorMaterials.junk -= (this.junkToProcess - this.junkedItems);
		actorMaterials.common += rollData.materials.common;
		actorMaterials.uncommon += rollData.materials.uncommon;
		actorMaterials.rare += rollData.materials.rare;

		this.actor.update({"system.materials": actorMaterials});

		// Send a chat message
		const content = await renderTemplate(
			"systems/fallout/templates/chat/salvage-results.hbs",
			rollData
		);

		let chatData = {
			content,
			"flags.data": rollData,
			"rollMode": game.settings.get("core", "rollMode"),
			"user": game.user.id,
		};

		ChatMessage.applyRollMode(chatData, game.settings.get("core", "rollMode"));

		await ChatMessage.create(chatData);

		fallout.utils.playDiceSound();
	}

	/** @inheritdoc */
	async _updateObject(event, formData) {
		this.junkToProcess = formData.junkToProcess;
		this.render(false);
	}
}
