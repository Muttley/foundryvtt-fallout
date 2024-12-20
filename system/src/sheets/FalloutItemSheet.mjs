import {
	onManageActiveEffect,
	prepareActiveEffectCategories,
} from "../effects.mjs";

/**
 * @extends {ItemSheet}
 */
export default class FalloutItemSheet extends ItemSheet {

	/** @override */
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ["fallout", "sheet", "item"],
			width: 600,
			height: "auto",
			tabs: [{
				navSelector: ".sheet-tabs",
				contentSelector: ".sheet-body",
				initial: "attributes",
			}],
		});
	}

	/** @override */
	get template() {
		const path = "systems/fallout/templates/item";
		return `${path}/${this.item.type}-sheet.hbs`;
	}

	/** @inheritdoc */
	get title() {
		const type = game.i18n.localize(`TYPES.Item.${this.item.type}`);
		return `[${type}] ${this.item.name}`;
	}

	/* -------------------------------------------- */

	/** @override */
	async getData(options) {
		// Retrieve base data structure.
		const context = await super.getData(options);
		const item = context.item;
		const source = item.toObject();

		foundry.utils.mergeObject(context, {
			descriptionHTML: await TextEditor.enrichHTML(item.system.description, {
				secrets: item.isOwner,
				async: true,
			}),
			effects: prepareActiveEffectCategories(item.transferredEffects),
			FALLOUT: CONFIG.FALLOUT,
			flags: item.flags,
			isEmbedded: item.isEmbedded,
			isGM: game.user.isGM,
			source: source.system,
			system: item.system,
			type: item.type,
			useKgs: game.settings.get("fallout", "carryUnit") === "kgs",
		});

		context.allSources = await fallout.compendiums.sources();

		// Enrich Mods Text
		if (item.system.mods) {
			foundry.utils.mergeObject(context, {
				modsListHTML: await TextEditor.enrichHTML(item.system.mods.list, {
					secrets: item.isOwner,
					async: true,
				}),
			});
		}

		// Enrich Effect Text
		if (item.system.effect) {
			foundry.utils.mergeObject(context, {
				effectHTML: await TextEditor.enrichHTML(item.system.effect, {
					secrets: item.isOwner,
					async: true,
				}),
			});
		}

		// Gather any additional data required for specific item types
		switch (item.type) {
			case "apparel":
				await this.getPowerArmorPieceData(context);
				break;
			case "object_or_structure":
				await this.getObjectOrStructureData(context, source, item);
				break;
			case "origin":
				await this.getOriginSelectorConfigs(context);
				break;
			case "perk":
				await this.getPerkSelectorConfigs(context);
				break;
			case "weapon":
				await this.getWeaponData(context, item);
				break;
			default:
		}

		return context;
	}

	async getPowerArmorPieceData(context) {
		if (!this.item.isOwned) return;

		let availablePieces = foundry.utils.duplicate(
			this.item.actor.items.filter(
				i => i.system.apparelType === "powerArmor"
					&& (i.system.powerArmor.frameId === ""
						|| i.system.powerArmor.frameId === this.item._id
					)
					&& !i.system.powerArmor.isFrame
			)
		);

		availablePieces = availablePieces.sort(
			(a, b) => a.name.localeCompare(b.name)
		);

		availablePieces = availablePieces.sort(
			(a, b) => {
				const aIsAttached = a.system.powerArmor.frameId === item._id;
				const bIsAttached = b.system.powerArmor.frameId === item._id;

				return (bIsAttached ? 1 : 0) - (aIsAttached ? 1 : 0);
			}
		);

		context.powerArmorPieces = availablePieces;
	}

	async getOriginSelectorConfigs(context) {

		const [fixedTraits, availableFixedTraits] =
			await fallout.utils.getDedupedSelectedItems(
				await fallout.compendiums.traits(),
				this.item.system.traits.fixed ?? []
			);

		context.traitSelectionConfig = {
			availableItems: availableFixedTraits,
			choicesKey: "traits.fixed",
			isItem: true,
			label: game.i18n.localize("FALLOUT.Item.Origin.Traits.label"),
			name: "system.traits.fixed",
			prompt: game.i18n.localize("FALLOUT.Item.Origin.Traits.prompt"),
			selectedItems: fixedTraits,
		};
	}

	async getObjectOrStructureData(context, source, item) {
		context.materials = [];
		for (const material of ["common", "uncommon", "rare"]) {
			context.materials.push({
				label: game.i18n.localize(`FALLOUT.actor.inventory.materials.${material}`),
				key: `system.materials.${material}`,
				value: source.system.materials[material] ?? 0,
			});
		}

		const __getDescendants = function(output, actor, item) {
			const descendants = actor.items.filter(
				i => i.system.parentItem === item._id
			);

			for (const nextDescendant of descendants) {
				output.push(nextDescendant);
				__getDescendants(output, actor, nextDescendant);
			}
		};

		if (context.isEmbedded) {
			const descendants = [];
			__getDescendants(descendants, this.item.actor, item);

			let possibleParents = await this.item.actor.items.filter(i => ["structure", "room", "store"].includes(i.system.itemType)
				&& item._id !== i._id
				&& (!descendants.find(d => d._id === i._id))
			) ?? [];

			if (this.item.system.itemType === "structure") possibleParents = [];

			if (this.item.system.itemType === "room") {
				possibleParents = possibleParents.filter(
					i => i.system.itemType === "structure"
				);
			}

			const parentChoices = [];
			for (const possibleParent of possibleParents) {
				parentChoices.push({
					id: possibleParent._id,
					name: possibleParent.name,
				});
			}

			context.parentChoices = parentChoices.sort(
				(a, b) => a.name.localeCompare(b.name)
			);
		}
	}

	async getPerkSelectorConfigs(context) {
		const [selectedMagazines, availableMagazines] =
			await fallout.utils.getDedupedSelectedItems(
				await fallout.compendiums.books_and_magz(false),
				this.item.system.requirementsEx.magazineUuids ?? []
			);

		context.magazineSelectionConfig = {
			availableItems: availableMagazines,
			choicesKey: "requirementsEx.magazineUuids",
			isItem: true,
			label: game.i18n.localize("FALLOUT.Item.Perk.Magazine.label"),
			name: "system.requirementsEx.magazineUuids",
			prompt: game.i18n.localize("FALLOUT.Item.Perk.Magazine.prompt"),
			selectedItems: selectedMagazines,
		};
	}

	async getWeaponData(context, item) {
		context.isWeaponBroken = this.item.isWeaponBroken;

		for (const [uuid, name] of Object.entries(CONFIG.FALLOUT.AMMO_BY_UUID)) {
			if (name === this.item.system.ammo) {
				context.weaponAmmo = await fromUuid(uuid);
				break;
			}
		}
		context.ammoTypes = CONFIG.FALLOUT.AMMO_TYPES;

		context.damageTypes = [];
		for (const key in CONFIG.FALLOUT.DAMAGE_TYPES) {
			context.damageTypes.push({
				active: item.system?.damage?.damageType[key] ?? false,
				key,
				label: CONFIG.FALLOUT.DAMAGE_TYPES[key],
			});
		}

		const weaponQualities = [];
		for (const key in CONFIG.FALLOUT.WEAPON_QUALITIES) {
			weaponQualities.push({
				active: item.system?.damage?.weaponQuality[key].value ?? false,
				hasRank: CONFIG.FALLOUT.WEAPON_QUALITY_HAS_RANK[key],
				rank: item.system?.damage?.weaponQuality[key].rank,
				key,
				label: CONFIG.FALLOUT.WEAPON_QUALITIES[key],
			});
		}

		context.weaponQualities = weaponQualities.sort(
			(a, b) => a.label.localeCompare(b.label)
		);

		const damageEffects = [];
		for (const key in CONFIG.FALLOUT.DAMAGE_EFFECTS) {
			damageEffects.push({
				active: item.system?.damage?.damageEffect[key].value ?? false,
				hasRank: CONFIG.FALLOUT.DAMAGE_EFFECT_HAS_RANK[key],
				rank: item.system?.damage?.damageEffect[key].rank,
				key,
				label: CONFIG.FALLOUT.DAMAGE_EFFECTS[key],
			});
		}

		context.damageEffects = damageEffects.sort(
			(a, b) => a.label.localeCompare(b.label)
		);

		context.isOwnedByCreature = item.isOwnedByCreature;

		const allSkills = await fallout.compendiums.skills();
		context.availableSkills = {};

		let availableSkillNames = [];
		for (const skill of allSkills) {
			availableSkillNames.push(skill.name);
		}

		availableSkillNames = availableSkillNames.sort(
			(a, b) => a.localeCompare(b)
		);

		for (const skillName of availableSkillNames) {
			context.availableSkills[skillName] = skillName;
		}
	}

	/* -------------------------------------------- */

	/** @override */
	activateListeners(html) {
		super.activateListeners(html);

		html.find("[data-action='delete-choice']").click(
			async event => this._deleteChoiceItem(event)
		);

		// Send To Chat
		html.find(".chaty").click(ev => {
			this.item.sendToChat();
		});

		// Everything below here is only needed if the sheet is editable
		if (!this.isEditable) return;

		html.find(".ammo-quantity-roll").click(this._rollAmmoQuantity.bind(this));

		// Effects.
		html.find(".effect-control").click(ev => {
			if (this.item.isOwned) {
				return ui.notifications.warn("Managing Active Effects within an Owned Item is not currently supported and will be added in a subsequent update.");
			}
			onManageActiveEffect(ev, this.item);
		});

		// DON't LET NUMBER FIELDS EMPTY
		const numInputs = document.querySelectorAll("input[type=number]");
		numInputs.forEach(function(input) {
			input.addEventListener("change", function(e) {
				if (e.target.value === "") {
					e.target.value = 0;
				}
			});
		});

		html.find(".item-attach").click(async event => {
			event.preventDefault();

			const li = $(event.currentTarget).parents(".item");

			const itemId = li.data("itemId");
			const item = this.actor.items.get(itemId);

			const newFrameId = item.system.powerArmor.frameId === ""
				? this.item._id
				: "";

			await item.update({
				"system.equipped": this.item.system.equipped,
				"system.powerArmor.frameId": newFrameId,
				"system.powerArmor.powered": this.item.system.powerArmor.powered,
				"system.stashed": this.item.system.stashed,
			});

			const frames = this.actor.items.filter(i =>
				i.type === "apparel"
					&& i.system.apparelType === "powerArmor"
					&& i.system.powerArmor.isFrame
			);

			for (const frame of frames) {
				frame.sheet.render(false);
			}

			this.actor.sheet.render(false);
		});
	}

	async _deleteChoiceItem(event) {
		event.preventDefault();
		event.stopPropagation();

		const deleteUuid = event.currentTarget.dataset.uuid;
		const choicesKey = event.currentTarget.dataset.choicesKey;

		let currentChoices = choicesKey
			.split(".")
			.reduce((obj, path) => obj ? obj[path]: [], this.item.system);

		const newChoices = [];
		for (const itemUuid of currentChoices) {
			if (itemUuid === deleteUuid) continue;
			newChoices.push(itemUuid);
		}

		const updateData = {};
		updateData[`system.${choicesKey}`] = newChoices;

		await this.item.update(updateData);

		return this.render(true);
	}

	async _onChangeChoiceList(event, choicesKey, isItem) {
		const options = event.target.list.options;
		const value = event.target.value;

		let uuid = null;
		for (const option of options) {
			if (option.value === value) {
				uuid = option.getAttribute("data-uuid");
				break;
			}
		}

		if (uuid === null) return;

		// handles cases where choicesKey is nested property.
		let currentChoices = choicesKey
			.split(".")
			.reduce((obj, path) => obj ? obj[path]: [], this.item.system);

		if (currentChoices.includes(uuid)) return; // No duplicates

		currentChoices.push(uuid);

		const choiceItems = [];
		for (const itemUuid of currentChoices) {
			if (isItem) {
				choiceItems.push(await fromUuid(itemUuid));
			}
			else {
				choiceItems.push(itemUuid);
			}
		}

		if (isItem) {
			choiceItems.sort((a, b) => a.name.localeCompare(b.name));
		}
		else {
			choiceItems.sort((a, b) => a.localeCompare(b));
		}

		const sortedChoiceUuids = isItem
			? choiceItems.map(item => item.uuid)
			: choiceItems;

		return this.item.update({[event.target.name]: sortedChoiceUuids});
	}

	async _onChangeInput(event) {
		const choicesKey = $(event.currentTarget).data("choices-key");
		const isItem = $(event.currentTarget).data("is-item") === "true";
		if (event.target.list && choicesKey) {
			return await this._onChangeChoiceList(event, choicesKey, isItem);
		}

		await super._onChangeInput(event);
	}

	_onSubmit(event) {
		if (!this.isEditable) return;

		switch (this.item.type) {
			case "origin": {
				const updateData = this._getSubmitData();

				delete updateData["system.traits.fixed"];
				delete updateData["system.traits.selectOptions"];
				delete updateData["system.traits"];

				this.item.update(updateData);
				break;
			}
			case "perk": {
				const updateData = this._getSubmitData();

				delete updateData["system.requirementsEx.magazineUuid"];

				this.item.update(updateData);
				break;
			}
			case "weapon": {
				const updateData = this._getSubmitData();

				const weaponType = updateData["system.weaponType"];
				if (weaponType !== this.item.system.weaponType) {
					updateData["system.creatureAttribute"] =
						CONFIG.FALLOUT.DEFAULT_CREATURE_WEAPON_ATTRIBUTE[
							weaponType
						];
					updateData["system.creatureSkill"] =
						CONFIG.FALLOUT.DEFAULT_CREATURE_WEAPON_SKILL[
							weaponType
						];
				}

				this.item.update(updateData);
				break;
			}
			default:
				super._onSubmit(event);
		}
	}

	async _rollAmmoQuantity(event) {
		if (this.item.type !== "ammo") return;

		event.preventDefault();

		if (this.item.system.quantityRoll === "") {
			return ui.notifications.warn(`No roll formula set on Ammo item ${this.item.name}`);
		}


		const content = await renderTemplate(
			"systems/fallout/templates/dialogs/roll-ammo.hbs"
		);

		const dialogData = {
			title: game.i18n.localize("FALLOUT.dialog.roll_ammo.title"),
			content,
			buttons: {
				create: {
					label: game.i18n.localize("FALLOUT.dialog.roll_ammo.button.create"),
					callback: () => "create",
				},
				update: {
					label: game.i18n.localize("FALLOUT.dialog.roll_ammo.button.update"),
					callback: () => "update",
				},
				chat: {
					label: game.i18n.localize("FALLOUT.dialog.roll_ammo.button.chat"),
					callback: () => "chat",
				},
			},
			close: () => null,
			default: "update",
		};

		const mode = await Dialog.wait(dialogData);

		if (mode) await this.item.rollAmmoQuantity(mode);
	}
}
