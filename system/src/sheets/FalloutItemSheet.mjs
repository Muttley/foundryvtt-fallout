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
			dragDrop: [{ /* dragSelector: ".item",*/ dropSelector: "form.itemDrop" }],
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

	/** @inheritdoc */
	_canDragDrop(selector) {
		return this.isEditable;
	}

	/** @inheritdoc */
	_onDragStart(event) {
		const itemId = event.currentTarget.dataset.itemId;
		const dragData = { type: "Item", id: itemId };
		// event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
		console.log("_onDragStart data:", dragData);
	}

	/** @inheritdoc */
	async _onDrop(event) {
		const data = TextEditor.getDragEventData(event);

		switch (data.type) {
			case "Item":
				return this._onDropItem(event, data);
			default:
				return super._onDrop();
		}
	}

	async _onDropItem(event, data) {

		const myType = this.item.type;

		// Allow the dropping of spells onto the followin Item types to make
		// creating them easier
		//
		// const allowedType = ["Potion", "Scroll", "Wand"].includes(myType);

		// Get dropped item
		const droppedItem = await fromUuid(data.uuid);

		switch (droppedItem.type) {

			case "apparel_mod":
				break;
			case "perk":
				break;
			case "robot_mod":
				break;
			case "weapon_mod":
				if (myType === "weapon") {
					const updateData = {};
					updateData[`system.mods.${droppedItem._id}`] = foundry.utils.duplicate(droppedItem);
					this.item.update(updateData);
				}
				break;
			default:
		}

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

		// Enrich Weapon Mod Effect Text
		if (item.system.modEffects?.effect) {
			foundry.utils.mergeObject(context, {
				effectHTML: await TextEditor.enrichHTML(item.system.modEffects.effect, {
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
			case "weapon_mod":
				await this.getWeaponModData(context, item);
				break;
			default:
		}

		return context;
	}

	async getPowerArmorPieceData(context) {
		if (!this.item.isOwned) return;

		const item = context.item;

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
				active: item.system?.damage?.weaponQuality[key].value ?? 0,
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
				active: item.system?.damage?.damageEffect[key].value ?? 0,
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

		// Weapon Mods
		let modsByType = await this._getModsByType(item);


		context.modsByType = modsByType;
		context.modded = item.system.mods.modded;

		// End Weapon Mods
	}

	async getWeaponModData(context, item) {


		for (const [uuid, name] of Object.entries(CONFIG.FALLOUT.AMMO_BY_UUID)) {
			if (name === this.item.system.modEffects.ammo) {
				context.weaponAmmo = await fromUuid(uuid);
				break;
			}
		}
		context.ammoTypes = CONFIG.FALLOUT.AMMO_TYPES;

		context.damageTypes = [];
		for (const key in CONFIG.FALLOUT.DAMAGE_TYPES) {
			context.damageTypes.push({
				active: item.system?.modEffects?.damage?.damageType[key] ?? 0,
				key,
				label: CONFIG.FALLOUT.DAMAGE_TYPES[key],
			});
		}

		const weaponQualities = [];
		for (const key in CONFIG.FALLOUT.WEAPON_QUALITIES) {
			weaponQualities.push({
				active: item.system?.modEffects?.damage?.weaponQuality[key].value ?? 0,
				hasRank: CONFIG.FALLOUT.WEAPON_QUALITY_HAS_RANK[key],
				rank: item.system?.modEffects?.damage?.weaponQuality[key].rank,
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
				active: item.system?.modEffects?.damage?.damageEffect[key].value ?? 0,
				hasRank: CONFIG.FALLOUT.DAMAGE_EFFECT_HAS_RANK[key],
				rank: item.system?.modEffects?.damage?.damageEffect[key].rank,
				key,
				label: CONFIG.FALLOUT.DAMAGE_EFFECTS[key],
			});
		}

		context.damageEffects = damageEffects.sort(
			(a, b) => a.label.localeCompare(b.label)
		);

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
		context.overrideDamage = item.system.modEffects.damage.overrideDamage;

		context.modSummary = this.getWeaponModSummary(item);


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

		html.find(".quantity-roll").click(this._rollQuantity.bind(this));

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


		// * MODS
		html.find(".toggle-label").click(async ev => {
			if (!["weapon_mod", "weapon"].includes(this.item.type)) return;
			if (ev.target.className === "num-short-2") return;
			if (this.item.system.mods?.modded) return;

			const dataSets = ev.currentTarget.dataset;

			let active = parseInt(dataSets.active) ?? 0;
			const name = dataSets.name;
			const type = dataSets.type;

			active = active === 1 ? 0 : 1;

			let dataPath = "";
			if (this.item.type === "weapon_mod") dataPath = type === "quality"
				? `system.modEffects.damage.weaponQuality.${name}.value`
				: `system.modEffects.damage.damageEffect.${name}.value`;
			else dataPath = type === "quality"
				? `system.damage.weaponQuality.${name}.value`
				: `system.damage.damageEffect.${name}.value`;


			let dataUpdate = {};
			dataUpdate[dataPath] = active;

			await this.item.update(dataUpdate);
		});

		html.find(".toggle-label").contextmenu(async ev => {
			if (!this.item.type === "weapon_mod") return;
			if (ev.target.className === "num-short-2") return;

			const dataSets = ev.currentTarget.dataset;

			let active = parseInt(dataSets.active) ?? 0;
			const name = dataSets.name;
			const type = dataSets.type;

			active = active === -1 ? 0 : -1;

			let dataPath = type === "quality"
				? `system.modEffects.damage.weaponQuality.${name}.value`
				: `system.modEffects.damage.damageEffect.${name}.value`;


			let dataUpdate = {};
			dataUpdate[dataPath] = active;

			await this.item.update(dataUpdate);
		});

		// CLICK TO EXPAND
		html.find(".expandable-info").click(async event => this._onModSummary(event));

		// Install mod
		html.find(".toggle-mod").click(async event => this._onToggleMod(event));

		// Delete mod
		html.find(".item-delete").click(async ev => {
			ev.preventDefault();

			let li = $(ev.currentTarget).parents(".weapon_mod");
			li.slideUp(200, () => this.render(false));

			const updateData = {};

			let mod = this.item.system.mods[li.data("itemId")];
			updateData[`system.mods.-=${mod._id}`] = null;

			await this.item.update(updateData);
		});
		// * END MODS

	}


	async _getModsByType(item) {

		// Weapon Mods
		let modsByType = {};

		for (let mod in item.system.mods) {
			if (item.system.mods[mod].system?.modType in CONFIG.FALLOUT.WEAPON_MOD_TYPES) {
				if (!(item.system.mods[mod].system?.modType in modsByType)) {
					modsByType[item.system.mods[mod].system?.modType] = [];
					modsByType[item.system.mods[mod].system?.modType].installed = false;
				}
				item.system.mods[mod].system.modEffects.summary =
					this.getWeaponModSummary(item.system.mods[mod]);
				modsByType[item.system.mods[mod].system?.modType].push(item.system.mods[mod]);

				if (item.system.mods[mod].system.attached) {
					modsByType[item.system.mods[mod].system?.modType].installed = true;
				}
			}
		}


		for (let key in modsByType) {
			modsByType[key] = modsByType[key].sort(
				(a, b) => a.name.localeCompare(b.name)
			);
		}

		return modsByType;
	}

	async _onToggleMod(event) {
		event.preventDefault();
		let li = $(event.currentTarget).parents(".weapon_mod");
		let mod = this.item.system.mods[li.data("itemId")];
		const updateData = {};

		const installed = !mod.system.attached;

		// Check if this type is already installed.
		let modsByType = await this._getModsByType(this.item);
		if (modsByType[mod.system.modType].installed && installed) {
			ui.notifications.warn("Only one mod per type allowed to be installed.");
			return;
		}

		updateData[`system.mods.${mod._id}.system.attached`] = installed;

		// Keep track of the name of installed mods for the chat output.
		if (installed) {
			// Add mod.system.name if it's not already in the list
			updateData["system.mods.installedMods"] = this.item.system.mods.installedMods
				? `${this.item.system.mods.installedMods}, ${mod.name}`.split(", ")
					.filter((item, index, arr) => arr.indexOf(item) === index)
					.join(", ")
				: mod.name;
		}
		else {
			// Remove mod.system.name if it exists
			updateData["system.mods.installedMods"] = this.item.system.mods.installedMods
				.split(", ")
				.filter(item => item.trim() !== mod.name)
				.join(", ");
		}


		// weapon damage
		if (mod.system.modEffects.damage.rating !== 0) {
			if (installed) {
				updateData["system.damage.originalRating"] = this.item.system.damage.rating;
				if (mod.system.modEffects.damage.overrideDamage === "modify") updateData["system.damage.rating"] = this.item.system.damage.rating + mod.system.modEffects.damage.rating;
				else updateData["system.damage.rating"] = mod.system.modEffects.damage.rating;
			}
			else updateData["system.damage.rating"] = this.item.system.damage.originalRating;
		}

		// ammo type
		if (mod.system.modEffects.ammo !== "") updateData["system.ammo"] = mod.system.modEffects.ammo;

		// ammo per shot
		if (mod.system.modEffects.ammoPerShot !== 0) {
			if (installed) updateData["system.ammoPerShot"] = this.item.system.ammoPerShot + mod.system.modEffects.ammoPerShot;
			else updateData["system.ammoPerShot"] = this.item.system.ammoPerShot - mod.system.modEffects.ammoPerShot;
		}

		// fire rate
		if (mod.system.modEffects.fireRate !== 0) {
			if (installed) updateData["system.fireRate"] = this.item.system.fireRate + mod.system.modEffects.fireRate;
			else updateData["system.fireRate"] = this.item.system.fireRate - mod.system.modEffects.fireRate;
		}

		// weapon range
		if (mod.system.modEffects.range !== 0) {
			if (installed) updateData["system.range"] = this._updateRange(this.item.system.range, mod.system.modEffects.range);
			else updateData["system.range"] = this._updateRange(this.item.system.range, -mod.system.modEffects.range);
		}


		// Damage type
		if (mod.system.modEffects.damage.damageType.energy
			|| mod.system.modEffects.damage.damageType.physical
			|| mod.system.modEffects.damage.damageType.poison
			|| mod.system.modEffects.damage.damageType.radiation
		) {
			if (installed) {
				updateData["system.damage.originalDamageType"] = this.item.system.damage.damageType;
				updateData["system.damage.damageType"] = mod.system.modEffects.damage.damageType;
			}
			else updateData["system.damage.damageType"] = this.item.system.damage.originalDamageType;
		}

		// Damage Effects
		for (const key in mod.system.modEffects.damage.damageEffect) {
			const tmpDamageEffect = mod.system.modEffects.damage.damageEffect[key];
			if (tmpDamageEffect.value > 0) if (installed) {
				updateData[`system.damage.damageEffect.${key}.value`] = this.item.system.damage.damageEffect[key].value + tmpDamageEffect.value;
				updateData[`system.damage.damageEffect.${key}.rank`] = this.item.system.damage.damageEffect[key].rank + tmpDamageEffect.rank;
			}
			else {
				updateData[`system.damage.damageEffect.${key}.value`] = this.item.system.damage.damageEffect[key].value - tmpDamageEffect.value;
				updateData[`system.damage.damageEffect.${key}.rank`] = this.item.system.damage.damageEffect[key].rank - tmpDamageEffect.rank;
			}
		}


		// Weapon Qualities
		for (const key in mod.system.modEffects.damage.weaponQuality) {
			const tmpWeaponQualities = mod.system.modEffects.damage.weaponQuality[key];
			if (tmpWeaponQualities.value > 0) if (installed) {
				updateData[`system.damage.weaponQuality.${key}.value`] = this.item.system.damage.weaponQuality[key].value + tmpWeaponQualities.value;
				updateData[`system.damage.weaponQuality.${key}.rank`] = this.item.system.damage.weaponQuality[key].rank + tmpWeaponQualities.rank;
			}
			else {
				updateData[`system.damage.weaponQuality.${key}.value`] = this.item.system.damage.weaponQuality[key].value - tmpWeaponQualities.value;
				updateData[`system.damage.weaponQuality.${key}.rank`] = this.item.system.damage.weaponQuality[key].rank - tmpWeaponQualities.rank;
			}
		}

		// cost
		if (mod.system.cost !== 0) {
			if (installed) updateData["system.cost"] = this.item.system.cost + mod.system.cost;
			else updateData["system.cost"] = this.item.system.cost - mod.system.cost;
		}

		// weight
		if (mod.system.weight !== 0) {
			if (installed) updateData["system.weight"] = this.item.system.weight + mod.system.weight;
			else updateData["system.weight"] = this.item.system.weight - mod.system.weight;
		}


		// Lock if mod is attached.
		if (installed) updateData["system.mods.modded"] = true;
		else {
			// Unlock if all mods removed.
			updateData["system.mods.modded"] = false;
			for (const key in this.item.system.mods) {
				if (this.item.system.mods[key].system?.attached && mod._id !== key) {
					updateData["system.mods.modded"] = true;
					break;
				}
			}
		}
		this.item.update(updateData);
	}

	_updateRange(currentRange, step) {
		const keys = Object.keys(CONFIG.FALLOUT.RANGES);
		let currentIndex = keys.indexOf(currentRange);

		// Compute the new index, clamping to bounds
		let newIndex = Math.min(Math.max(currentIndex + step, 0), keys.length - 1);

		return keys[newIndex];
	}

	async _onModSummary(event) {
		event.preventDefault();
		let li = $(event.currentTarget).parents(".weapon_mod");
		let mod = this.item.system.mods[li.data("itemId")];

		const html = await renderTemplate("systems/fallout/templates/item/weapon/_partials/mod-desc.hbs", {
			mod: mod,
			modExtraEffect: mod.system.modEffects.effect,
			crafting: mod.system.crafting,
		});

		// Toggle summary
		if (li.hasClass("expanded")) {
			let summary = li.children(".item-summary");
			summary.slideUp(200, () => {
				summary.remove();
			});
		}
		else {
			let div = $(
				`<div class="item-summary"><div class="item-summary-wrapper"><div>${html}</div></div></div>`
			);
			li.append(div.hide());
			div.slideDown(200);
		}
		li.toggleClass("expanded");
	}

	getWeaponModSummary(mod) {
		let modSummary = [];
		let modEffects = mod.system.modEffects;

		if (modEffects.damage.rating !== 0) {

			if (modEffects.damage.overrideDamage === "modify") modSummary.push(`${modEffects.damage.rating > 0 ? "+" : ""}${modEffects.damage.rating} CD ${game.i18n.localize("FALLOUT.UI.Damage")}`);
			else modSummary.push(game.i18n.format("FALLOUT.WEAPON_MOD.summary.damageRatingOverride", { rating: modEffects.damage.rating }));
		}

		if (modEffects.ammo !== "") modSummary.push(game.i18n.format("FALLOUT.WEAPON_MOD.summary.ammo", { ammo: modEffects.ammo }));

		if (modEffects.ammoPerShot !== 0) modSummary.push(game.i18n.format("FALLOUT.WEAPON_MOD.summary.ammoPerShot", { ammoPerShot: modEffects.ammoPerShot }));

		if (modEffects.fireRate !== 0) modSummary.push(`${modEffects.fireRate > 0 ? "+" : ""}${modEffects.fireRate} ${game.i18n.localize("FALLOUT.WEAPON_MOD.summary.fireRate")}`);

		if (modEffects.range !== 0) modSummary.push(game.i18n.format("FALLOUT.WEAPON_MOD.summary.range", { range: modEffects.range }));


		// Damage type
		if (modEffects.damage.damageType.energy
			|| modEffects.damage.damageType.physical
			|| modEffects.damage.damageType.poison
			|| modEffects.damage.damageType.radiation
		) {
			let damageTypes = [];
			if (modEffects.damage.damageType.energy) damageTypes.push("Energy");
			if (modEffects.damage.damageType.physical) damageTypes.push("Physical");
			if (modEffects.damage.damageType.poison) damageTypes.push("Poison");
			if (modEffects.damage.damageType.radiation) damageTypes.push("Radiation");

			modSummary.push(game.i18n.format("FALLOUT.WEAPON_MOD.summary.damageType", { damageType: damageTypes.join(", ") }));
		}

		// Damage Effects
		let damageEffects = [];
		for (const key in modEffects.damage.damageEffect) {
			const tmpDamageEffect = modEffects.damage.damageEffect[key];
			if (tmpDamageEffect.value === 1) damageEffects.push(`${game.i18n.localize("FALLOUT.WEAPON_MOD.summary.gain")} ${game.i18n.localize(CONFIG.FALLOUT.DAMAGE_EFFECTS[key])}${tmpDamageEffect.rank > 0 ? ` ${tmpDamageEffect.rank}` : ""}`);
			else if (tmpDamageEffect.value === -1) damageEffects.push(`${game.i18n.localize("FALLOUT.WEAPON_MOD.summary.remove")} ${game.i18n.localize(CONFIG.FALLOUT.DAMAGE_EFFECTS[key])}`);
		}
		if (damageEffects.length > 0) modSummary.push(`${damageEffects.join(", ")}`);

		// CONFIG.FALLOUT.DAMAGE_EFFECTS[key]

		// Weapon Qualities
		let weaponQuality = [];
		for (const key in modEffects.damage.weaponQuality) {
			const tmpWeaponQualities = modEffects.damage.weaponQuality[key];
			if (tmpWeaponQualities.value === 1) weaponQuality.push(`${game.i18n.localize("FALLOUT.WEAPON_MOD.summary.gain")} ${game.i18n.localize(CONFIG.FALLOUT.WEAPON_QUALITIES[key])}${tmpWeaponQualities.rank > 0 ? ` Rank ${tmpWeaponQualities.rank} ` : ""}`);
			else if (tmpWeaponQualities.value === -1) weaponQuality.push(`${game.i18n.localize("FALLOUT.WEAPON_MOD.summary.remove")} ${game.i18n.localize(CONFIG.FALLOUT.WEAPON_QUALITIES[key])}`);
		}
		if (weaponQuality.length > 0) modSummary.push(`${weaponQuality.join(", ")}`);

		if (modSummary.length > 1) return modSummary.join(", ");
		else return modSummary;
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
			.reduce((obj, path) => obj ? obj[path] : [], this.item.system);

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

		return this.item.update({ [event.target.name]: sortedChoiceUuids });
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

				delete updateData["system.requirementsEx.magazineUuids"];

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

	async _rollQuantity(event) {
		if (!["ammo", "consumable", "miscellany","weapon"].includes(this.item.type)) return;

		event.preventDefault();

		if (this.item.system.quantityRoll === "") {
			return ui.notifications.warn(`No roll formula set on item ${this.item.name}`);
		}


		const content = await renderTemplate(
			"systems/fallout/templates/dialogs/roll-quantity.hbs"
		);

		const dialogData = {
			title: game.i18n.localize("FALLOUT.dialog.roll_quantity.title"),
			content,
			buttons: {
				create: {
					label: game.i18n.localize("FALLOUT.dialog.roll_quantity.button.create"),
					callback: () => "create",
				},
				update: {
					label: game.i18n.localize("FALLOUT.dialog.roll_quantity.button.update"),
					callback: () => "update",
				},
				chat: {
					label: game.i18n.localize("FALLOUT.dialog.roll_quantity.button.chat"),
					callback: () => "chat",
				},
			},
			close: () => null,
			default: "update",
		};

		const mode = await Dialog.wait(dialogData);

		if (mode) await this.item.rollQuantity(mode);
	}

}
