import {
	onManageActiveEffect,
	prepareActiveEffectCategories,
} from "../effects.mjs";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export default class FalloutBaseActorSheet extends ActorSheet {

	/** @override */
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ["fallout", "sheet", "actor"],
			width: 780,
			height: 970,
			tabs: [
				{
					navSelector: ".sheet-tabs",
					contentSelector: ".sheet-body",
					initial: this.initialTab,
				},
			],
		});
	}

	get initialTab() {
		return "status";
	}

	get ignoredInventoryItems() {
		return [];
	}

	get inventorySections() {
		return [];
	}

	/** @override */
	get template() {
		return `systems/fallout/templates/actor/${this.actor.type}-sheet.hbs`;
	}

	/** @inheritdoc */
	get title() {
		const type = game.i18n.localize(`TYPES.Actor.${this.actor.type}`);
		return `[${type}] ${this.actor.name}`;
	}

	/* -------------------------------------------- */

	/** @override */
	async getData(options) {

		// Use a safe clone of the actor data for further operations.
		const source = this.actor.toObject();
		const actorData = this.actor.toObject(false);

		// Sort all items alphabetically for display on the character sheet
		actorData.items.sort((a, b) => a.name.localeCompare(b.name));

		const context = {
			actor: actorData,
			editable: this.isEditable,
			effects: prepareActiveEffectCategories(this.actor.effects),
			FALLOUT: CONFIG.FALLOUT,
			hasCategory: ["creature", "npc"].includes(this.actor.type),
			isCharacter: this.actor.type === "character",
			isCreature: this.actor.type === "creature",
			isNPC: this.actor.type === "npc",
			isRobot: this.actor.type === "robot",
			isSettlement: this.actor.type === "settlement",
			items: this.actor.items,
			limited: this.actor.limited,
			options: this.options,
			owner: this.actor.isOwner,
			rollData: this.actor.getRollData.bind(this.actor),
			source: source.system,
			system: actorData.system,
			type: this.actor.type,
			useKgs: this.actor.useKgs,
		};

		await this._prepareItems(context);
		await this._prepareMaterials(context);

		// Biography HTML enrichment
		context.biographyHTML = await TextEditor.enrichHTML(context.system.biography, {
			secrets: this.actor.isOwner,
			rollData: context.rollData,
			async: true,
		});

		return context;
	}

	/**
	 * Organize and classify Items for Character sheets.
	 *
	 * @param {Object} actorData The actor to prepare.
	 *
	 * @return {undefined}
	 */
	async _prepareItems(context) {
		context.itemsByType = {};

		if (this.actor.isCreature) {
			context.butcheryItems = [];
		}

		// Different Actor types require specific inventory sections which
		// are filtered from the full list of items
		//
		for (const inventorySection of this.inventorySections) {
			context.itemsByType[inventorySection] = [];
		}

		this._getFilteredApparelSections(context);

		// Build the inventory and its sections by processing each item,
		// decorating it where required and storing it in the correct inventory
		// location
		//
		context.inventory = [];

		for (const i of context.actor.items) {
			i.img = i.img || DEFAULT_TOKEN;

			// Make sure Robots can't equip Character armor, and vice-versa
			//
			i.canBeEquipped = i.system.equippable ?? false;
			if (i.type === "apparel" && this.actor.isRobot) i.canBeEquipped = false;
			if (i.type === "robot_armor" && this.actor.isNotRobot) i.canBeEquipped = false;
			if (i.type === "skill") {
				i.localizedName = fallout.utils.getLocalizedSkillName(i);
				i.localizedDefaultAttribute = fallout.utils.getLocalizedSkillAttribute(i);
			}

			if (i.type === "consumable" && this.actor.isCreature) {
				if (i.system.butchery) {
					context.butcheryItems.push(i);
					continue;
				}
			}

			// Skip moving this into its own section if it's not going to be
			// separated into a specific inventory section
			//
			// Items that don't have their own section just go into the main
			// inventory to appear in the "Unsorted" section
			//
			// Some inventory items are completely ignored, for example apparel
			// and robot_armor as these are handled differently
			//
			if (this.inventorySections.includes(i.type)) {
				context.itemsByType[i.type].push(i);
			}
			else if (!this.ignoredInventoryItems.includes(i.type)) {
				context.inventory.push(i);
			}
		}

		// Sort skills by their localized name for convenience of non-English
		// speakers
		//
		context.itemsByType.skill.sort(
			(a, b) => a.localizedName.localeCompare(b.localizedName)
		);
	}

	_getFilteredApparelSections(context) {}

	/* -------------------------------------------- */

	/** @override */
	activateListeners(html) {
		super.activateListeners(html);

		// SWITCH TABS
		html.find(".tab-switch").click(evt => {
			evt.preventDefault();
			const el = evt.currentTarget;
			const tab = el.dataset.tab;
			this._tabs[0].activate(tab);
		});

		// Render the item sheet for viewing/editing prior to the editable check.
		html.find(".item-edit").click(ev => {
			const li = $(ev.currentTarget).parents(".item");
			const item = this.actor.items.get(li.data("itemId"));
			item.sheet.render(true);
		});

		// -------------------------------------------------------------
		// ! Everything below here is only needed if the sheet is editable
		if (!this.isEditable) return;

		// * SKILLS LISTENERS [clic, right-click, value change, tag ]
		// Click Skill Item
		html.find(".skill .item-name").click(ev => {
			const li = $(ev.currentTarget).parents(".item");
			const item = this.actor.items.get(li.data("itemId"));
			let ap = 0;
			let gmap = 0;
			let apcost=0;
			if (this.actor.type === "creature" && this.actor.type === "npc") {
				ap = game.settings.get("fallout", "gmAP");
			}
			else {
				ap = parseInt(game.settings.get("fallout", "partyAP"));
				gmap = parseInt(game.settings.get("fallout", "gmAP"));
			}
			this._onRollSkill(
				item.localizedName,
				item.system.value,
				this.actor.system.attributes[item.system.defaultAttribute].value,
				item.system.tag,
				ap,
				gmap,
				apcost
			);
		});

		// Change Skill Rank value
		html.find(".skill .item-skill-value input").change(async ev => {
			let newRank = parseInt($(ev.currentTarget).val());
			const li = $(ev.currentTarget).parents(".item");
			const item = this.actor.items.get(li.data("itemId"));
			let updatedItem = { _id: item.id, system: { value: newRank } };
			await this.actor.updateEmbeddedDocuments("Item", [updatedItem]);
		});

		// Toggle Tag value
		html.find(".skill .item-skill-tag").click(async ev => {
			const li = $(ev.currentTarget).parents(".item");
			const item = this.actor.items.get(li.data("itemId"));
			let updatedItem = { _id: item.id, system: { tag: !item.system.tag } };
			await this.actor.updateEmbeddedDocuments("Item", [updatedItem]);
		});

		// * AMMO COUNT UPDATE
		html.find(".item-quantity").change(async ev => {
			ev.preventDefault();
			let newQuantity = parseInt($(ev.currentTarget).val());
			const li = $(ev.currentTarget).parents(".item");
			const item = this.actor.items.get(li.data("itemId"));
			let updatedItem = { _id: item.id, system: { quantity: newQuantity } };
			await this.actor.updateEmbeddedDocuments("Item", [updatedItem]);
		});

		// * CLICK TO EXPAND
		html.find(".expandable-info").click(async event => this._onItemSummary(event));

		html.find(".immune-toggle").click(this._onImmunityToggle.bind(this));

		// * Add Inventory Item
		html.find(".item-create").click(this._onItemCreate.bind(this));

		// * Delete Inventory Item
		html.find(".item-delete").click(async ev => {
			const li = $(ev.currentTarget).parents(".item");
			const item = this.actor.items.get(li.data("itemId"));
			await item.delete();
			li.slideUp(200, () => this.render(false));
		});

		// * Active Effect management
		html
			.find(".effect-control")
			.click(ev => onManageActiveEffect(ev, this.actor));

		// * ROLL WEAPON SKILL
		html.find(".weapon-roll").click(async ev => {
			const li = $(ev.currentTarget).parents(".item");
			const item = this.actor.items.get(li.data("item-id"));
			let ap = 0;
			let gmap = 0;
			let apcost=0;
			if (this.actor.type === "creature" && this.actor.type === "npc") {
				ap = game.settings.get("fallout", "gmAP");
			}
			else {
				ap = parseInt(game.settings.get("fallout", "partyAP"));
				gmap = parseInt(game.settings.get("fallout", "gmAP"));
			}

			let attribute;
			let rollName = item.name;
			let skill;
			let skillName;

			if (item.actor?.type === "creature") {
				skillName = game.i18n.localize(
					`FALLOUT.CREATURE.${item.system.skill}`
				);
				skill = item.actor.system[item.system.skill];
				skill.tag = true;
				attribute = item.actor.system[item.system.attribute];
			}
			else {
				skillName = CONFIG.FALLOUT.WEAPON_SKILLS[item.system.weaponType];

				let skillItem = item.actor.items.find(i => i.name === skillName);

				if (skillItem) {
					skill = skillItem.system;
				}
				else {
					skill = { value: 0, tag: false, defaultAttribute: "str"};
				}

				const attributeOverride = CONFIG.FALLOUT.WEAPON_ATTRIBUTE_OVERRIDE[
					item.system.weaponType
				];

				if (attributeOverride) {
					attribute = item.actor.system.attributes[attributeOverride];
				}
				else {
					attribute = item.actor.system.attributes[skill.defaultAttribute];
				}
			}

			// REDUCE AMMO
			const autoCalculateAmmo = game.settings.get(
				"fallout", "automaticAmmunitionCalculation"
			);

			const actorCanUseAmmo =
				["character", "robot"].includes(this.actor.type);

			const ammoPopulated = item.system.ammo !== "";

			if (autoCalculateAmmo && actorCanUseAmmo && ammoPopulated) {
				const [ammo, shotsAvailable] = await this.actor._getAvailableAmmoType(
					item.system.ammo
				);

				if (!ammo) {
					ui.notifications.warn(`Ammo ${item.system.ammo} not found`);
					return;
				}

				if (shotsAvailable < item.system.ammoPerShot) {
					ui.notifications.warn(`Not enough ${item.system.ammo} ammo`);
					return;
				}
			}

			// Check for unreliable weapon quality
			let complication = parseInt(this.actor.system.complication);
			if (item.system.damage.weaponQuality.unreliable.value) {
				complication -= 1;
			}


			fallout.Dialog2d20.createDialog({
				rollName: rollName,
				diceNum: 2,
				attribute: attribute.value,
				skill: skill.value,
				tag: skill.tag,
				complication: complication,
				rollLocation: true,
				actor: this.actor,
				item: item,
				ap: ap,
				gmap: gmap,
				apcost: apcost,
			});
		});

		// * ROLL WEAPON DAMAGE
		html.find(".weapon-roll-damage").click(ev => {
			const li = $(ev.currentTarget).parents(".item");
			const item = this.actor.items.get(li.data("item-id"));

			let numOfDice = parseInt(item.system.damage.rating);

			if (["meleeWeapons", "unarmed"].includes(item.system.weaponType)) {
				let damageBonus = this.actor.system?.meleeDamage?.value ?? 0;
				numOfDice += damageBonus;
			}

			let rollName = item.name;

			let actorUUID;
			let _token = this.actor.token;
			if (_token) actorUUID = this.actor.token.uuid;
			else actorUUID = this.actor.uuid;

			// console.warn(fromUuidSync(actorUUID).actor)

			fallout.DialogD6.createDialog({
				rollName: rollName,
				diceNum: numOfDice,
				actor: actorUUID,
				weapon: item,
				otherdmgdice: 0,
				firerateamo: 0,
			});
		});

		// Drag events for macros.
		if (this.actor.isOwner) {
			let handler = ev => this._onDragStart(ev);
			html.find("li.item").each((i, li) => {
				if (li.classList.contains("inventory-header")) return;
				if (li.classList.contains("skill")) return;
				li.setAttribute("draggable", true);
				li.addEventListener("dragstart", handler, false);
			});
		}


		// ! DON'T LET NUMBER FIELDS EMPTY
		const numInputs = document.querySelectorAll("input[type=number]");
		numInputs.forEach(function(input) {
			input.addEventListener("change", function(e) {
				if (e.target.value === "") {
					e.target.value = 0;
				}
			});
		});

		// Disable any fields that have been overridden by Active Effects and
		// add a tooltip explaining why
		//
		const overridden = Object.keys(
			foundry.utils.flattenObject(this.actor.overrides)
		);

		for (const override of overridden) {
			html.find(
				`input[name="${override}"],select[name="${override}"]`
			).each((i, el) => {
				el.disabled = true;
				el.dataset.tooltip = "FALLOUT.Actor.Warnings.ActiveEffectOverride";
			});
		}
	}

	async _onImmunityToggle(event) {
		event.preventDefault();
		const immunityType = $(event.currentTarget).data("immunityType");
		this.actor._toggleImmunity(immunityType);
	}


	/**
	 * Handle creating a new Owned Item for the actor using initial data defined
	 * in the HTML dataset
	 * @param {Event} event	 The originating click event
	 * @private
	 */
	async _onItemCreate(event) {
		event.preventDefault();
		const header = event.currentTarget;
		// Get the type of item to create.
		const type = header.dataset.type;
		// Grab any data associated with this control.
		const data = duplicate(header.dataset);
		// Initialize a default name.
		const name = `New ${type.capitalize()}`;
		// Prepare the item object.
		const itemData = {
			name: name,
			type: type,
			system: data,
		};
		// Remove the type from the dataset since it's in the itemData.type prop.
		delete itemData.system.type;
		// Finally, create the item!
		const newItem = await Item.create(itemData, { parent: this.actor });
		if (newItem) newItem.sheet.render(true);
	}

	async _onRightClickDelete(itemId) {
		const item = this.actor.items.get(itemId);
		await item.delete();
	}

	_onRightClickSkill(itemId, attribute) {
		const item = this.actor.items.get(itemId);
		this._onRollSkill(
			item.name,
			item.system.value,
			this.actor.system.attributes[attribute].value,
			item.system.tag
		);
	}

	_onRollSkill(skillName, rank, attribute, tag, ap, gmap, apcost) {
		fallout.Dialog2d20.createDialog({
			rollName: skillName,
			diceNum: 2,
			attribute: attribute,
			skill: rank,
			tag: tag,
			ap: ap,
			gmap: gmap,
			apcost: apcost,
			actor: this.actor,
			complication: parseInt(this.actor.system.complication),
		});
	}

	async _onItemSummary(event) {
		event.preventDefault();
		let li = $(event.currentTarget).parents(".item");
		let item = this.actor.items.get(li.data("itemId"));
		let moreInfo = "";

		if (item.system.effect && item.system.effect !== "") {
			moreInfo = await TextEditor.enrichHTML(item.system.effect, {
				secrets: item.isOwner,
				async: true,
			});
		}
		else {
			moreInfo = await TextEditor.enrichHTML(item.system.description, {
				secrets: item.isOwner,
				async: true,
			});
		}
		// Toggle summary
		if (li.hasClass("expanded")) {
			let summary = li.children(".item-summary");
			summary.slideUp(200, () => {
				summary.remove();
			});
		}
		else {
			let div = $(
				`<div class="item-summary"><div class="item-summary-wrapper"><div>${moreInfo}</div></div></div>`
			);
			li.append(div.hide());
			div.slideDown(200);
		}
		li.toggleClass("expanded");
	}

	async _prepareButcheryMaterials(context) {
		context.butcheryMaterials = [];

		for (const material of ["common", "uncommon", "rare"]) {
			context.butcheryMaterials.push({
				label: game.i18n.localize(`FALLOUT.actor.inventory.materials.${material}`),
				key: `system.butchery.${material}`,
				value: this.actor.system.butchery[material] ?? 0,
			});
		}
	}

	async _prepareMaterials(context) {
		context.inventoryMaterials = [];

		for (const material of ["junk", "common", "uncommon", "rare"]) {
			context.inventoryMaterials.push({
				label: game.i18n.localize(`FALLOUT.actor.inventory.materials.${material}`),
				key: `system.materials.${material}`,
				value: this.actor.system.materials[material] ?? 0,
			});
		}
	}
}
