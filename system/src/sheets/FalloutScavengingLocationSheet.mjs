import FalloutBaseActorSheet from "./FalloutBaseActorSheet.mjs";

export default class FalloutScavengingLocationSheet extends FalloutBaseActorSheet {

	drawItemsLut;

	/** @override */
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			submitOnChange: true,
		});
	}

	/** @override */
	get initialTab() {
		return "details";
	}

	activateListeners(html) {
		super.activateListeners(html);

		// -------------------------------------------------------------
		// ! Everything below here is only needed if the sheet is editable
		if (!this.isEditable) return;

		html.find(".reset-ap-spend").click(event => {
			event.preventDefault();
			const update = {};

			for (const category of Object.keys(CONFIG.FALLOUT.SCAVENGING_ITEM_TYPES)) {
				update[`system.item_types.${category}.spend`] = 0;
			}

			this.actor.update(update);
		});

		html.find("#clearScavengingResults").click(event => {
			event.preventDefault();
			this._clearResults();
		});

		html.find("#scavengeLocationButton").click(event => {
			event.preventDefault();
			this._scavengeLocation();
		});
	}

	/** @override */
	async getData(options) {
		const context = await super.getData(options);

		// const rollTables = await fallout.compendiums.rolltables();
		const rollTables = await fallout.compendiums.scavengingRolltables();

		context.itemTables = {};
		for (const rollTable of rollTables) {
			context.itemTables[rollTable.uuid] = rollTable.name;
		}

		context.notesHTML = await TextEditor.enrichHTML(context.system.notes, {
			secrets: this.actor.isOwner,
			rollData: context.rollData,
			async: true,
		});

		return context;
	}


	async _prepareMaterials(context) {
		context.simpleItems = [];

		context.simpleItems.push({
			label: game.i18n.localize("FALLOUT.UI.CAPS"),
			key: "system.currency.caps",
			value: this.actor.system.currency.caps ?? 0,
		});

		for (const material of ["common", "uncommon", "rare"]) {
			context.simpleItems.push({
				label: game.i18n.localize(`FALLOUT.actor.inventory.materials.${material}`),
				key: `system.materials.${material}`,
				value: this.actor.system.materials[material] ?? 0,
			});
		}
	}


	async _clearResults() {
		renderTemplate(
			"systems/fallout/templates/dialogs/are-you-sure.hbs"
		).then(html => {
			new Dialog({
				title: `${game.i18n.localize("FALLOUT.SCAVENGING_LOCATION.ClearResults.title")}`,
				content: html,
				buttons: {
					Yes: {
						icon: '<i class="fa fa-check"></i>',
						label: `${game.i18n.localize("FALLOUT.UI.Yes")}`,
						callback: async () => {
							const ids = this.actor.items.map(i => i._id);
							Item.deleteDocuments(ids, {parent: this.actor});

							this.actor.update({
								"system.currency.caps": 0,
								"system.materials.common": 0,
								"system.materials.rare": 0,
								"system.materials.uncommon": 0,
							});

							ui.notifications.notify(
								game.i18n.localize("FALLOUT.SCAVENGING_LOCATION.ClearResults.notify")
							);
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


	async _rollLocationItemsForCategory(category, count, tableUuid) {
		const table = await fromUuid(tableUuid);

		const items = [];

		if (table) {
			for (let i = 0; i < count; i++) {
				const draw = await table.draw({displayChat: false});
				const result = draw.results.find(
					// TODO remove use of this method once v11 support dropped
					r => fallout.utils.isCompendiumTableResult(r)
				);

				if (!result) continue;

				const itemUuid = [
					"Compendium",
					result.documentCollection,
					result.documentId,
				].join(".");

				this.drawItemsLut[itemUuid] = true;

				const item = await fromUuid(itemUuid);

				if (item) {
					const itemData = item.toObject();
					itemData._stats.compendiumSource = itemUuid;
					items.push(itemData);
				}
			}
		}
		else if (category === "junk") {
			const junkDiceCount = 2 * count;
			const formula = `${junkDiceCount}d20`;
			const roll = new Roll(formula);
			await roll.evaluate();

			const item = await fromUuid(CONFIG.FALLOUT.ITEM_UUIDS.junk);

			if (item) {
				const itemData = item.toObject();
				itemData._stats.compendiumSource = CONFIG.FALLOUT.ITEM_UUIDS.junk;
				itemData.system.quantity = parseInt(roll.result);

				items.push(itemData);
			}
		}

		await this.actor.createEmbeddedDocuments("Item", items);
	}

	async _scavengeLocation() {
		this.drawItemsLut = {};

		for (const category of Object.keys(this.actor.system.item_types)) {
			const categoryDetails = this.actor.system.item_types[category];

			const rollCount = categoryDetails.min + categoryDetails.spend;

			if (rollCount <= 0) continue;

			if (categoryDetails.table === "" && category !== "junk") {
				ui.notifications.warn(
					game.i18n.format("FALLOUT.SCAVENGING_LOCATION.Warn.NoItemTableSet", {category})
				);
			}
			else {
				await this._rollLocationItemsForCategory(
					category,
					rollCount,
					categoryDetails.table
				);
			}
		}

		// Update ammo counts if needed
		for (const item of this.actor.items) {
			if (item.type === "ammo") item.rollQuantity("update");
		}

		// Roll for caps if necessary
		//
		const capsRollFormula = this.actor.system.caps_roll ?? "";
		if (capsRollFormula !== "") {
			const roll = new Roll(capsRollFormula);
			try {
				await roll.evaluate();

				this.actor.update({
					"system.currency.caps": parseInt(roll.result),
				});
			}
			catch(e) {
				fallout.logger.error(e);
			}
		}

		// Roll for pre-war money if necessary
		//
		const prewarRollFormula = this.actor.system.prewar_roll ?? "";
		if (prewarRollFormula !== "") {
			const roll = new Roll(prewarRollFormula);
			try {
				await roll.evaluate();

				const item = await fromUuid(CONFIG.FALLOUT.ITEM_UUIDS.prewar_money);

				if (item) {
					const itemData = item.toObject();
					itemData._stats.compendiumSource = CONFIG.FALLOUT.ITEM_UUIDS.prewar_money;
					itemData.system.quantity = parseInt(roll.result);

					await this.actor.createEmbeddedDocuments("Item", [itemData]);
				}
			}
			catch(e) {
				fallout.logger.error(e);
			}
		}

		fallout.chat.renderGeneralMessage(
			this,
			{
				title: game.i18n.localize("FALLOUT.CHAT_MESSAGE.scavenging.title"),
				body: game.i18n.format("FALLOUT.CHAT_MESSAGE.scavenging.body",
					{
						location: this.actor.name,
						time: CONFIG.FALLOUT.LOCATION_TIME_TAKEN[this.actor.system.scale],
					}
				),
			},
			CONST.DICE_ROLL_MODES.PUBLIC
		);
	}


	async _updateObject(event, formData) {

		if (formData["system.category"] === "") {
			// We won't automatically updated min/max values ever for custom
			// category scavenging locations
			//
			return await super._updateObject(event, formData);
		}

		const categoryChanged = formData["system.category"] !== this.actor.system.category;
		const degreeChanged = formData["system.degree"] !== this.actor.system.degree;
		const scaleChanged = formData["system.scale"] !== this.actor.system.scale;

		if (categoryChanged || degreeChanged || scaleChanged) {
			// Only recalculate min/max values if one of these changed
			console.log(formData);
			const itemTypes = this.actor.system.item_types;

			const locationData = CONFIG.FALLOUT.SCAVENGING_LOCATION_DATA[
				formData["system.category"]
			] ?? {};

			const sizeMultiplier = CONFIG.FALLOUT.LOCATION_SCALE_MULTIPLIER[
				formData["system.scale"]
			] ?? 1;

			for (const category of Object.keys(CONFIG.FALLOUT.SCAVENGING_ITEM_TYPES)) {
				const baseline = locationData[category] * sizeMultiplier;

				formData[`system.item_types.${category}.min`] = baseline;
				formData[`system.item_types.${category}.max`] = baseline;
			}

			let reduction = (CONFIG.FALLOUT.SEARCHED_DEGREE_REDUCTION[
				formData["system.degree"]
			] ?? 1) * sizeMultiplier;

			while (reduction > 0) {
				for (const category of Object.keys(CONFIG.FALLOUT.SCAVENGING_ITEM_TYPES)) {
					const max = formData[`system.item_types.${category}.max`];
					let min = formData[`system.item_types.${category}.min`];

					if (min > 0) {
						min--;
						reduction--;

						formData[`system.item_types.${category}.min`] = min;
						formData[`system.item_types.${category}.spend`] =
							Math.min((max - min), (itemTypes[category]?.spend ?? 0));
					}

					if (reduction === 0) break;
				}
			}

			console.log(formData);
		}

		// update maxSpend value
		for (const category of Object.keys(CONFIG.FALLOUT.SCAVENGING_ITEM_TYPES)) {
			const max = formData[`system.item_types.${category}.max`];
			const min = formData[`system.item_types.${category}.min`];

			formData[`system.item_types.${category}.maxSpend`] = max - min;
		}

		return await super._updateObject(event, formData);
	}


}
