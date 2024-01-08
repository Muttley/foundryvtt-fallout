import {
	onManageActiveEffect,
	prepareActiveEffectCategories,
} from "../effects.mjs";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export default class FalloutActorSheet extends ActorSheet {

	constructor(object, options) {
		super(object, options);

		if (this.actor.type === "character") {
			this.chemDoseManager = new fallout.apps.FalloutChemDoses(this.actor);
		}
	}

	/** @override */
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ["fallout", "sheet", "actor"],
			width: 780,
			height: 940,
			tabs: [
				{
					navSelector: ".sheet-tabs",
					contentSelector: ".sheet-body",
					initial: "skills",
				},
			],
		});
	}

	/** @override */
	get template() {
		return `systems/fallout/templates/actor/actor-${this.actor.type}-sheet.hbs`;
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
			source: source.system,
			system: actorData.system,
			items: actorData.items,
			effects: prepareActiveEffectCategories(this.actor.effects),
			owner: this.actor.isOwner,
			limited: this.actor.limited,
			options: this.options,
			editable: this.isEditable,
			type: this.actor.type,
			isCharacter: this.actor.type === "character",
			isRobot: this.actor.type === "robot",
			isNPC: this.actor.type === "npc",
			isCreature: this.actor.type === "creature",
			rollData: this.actor.getRollData.bind(this.actor),
		};

		// Biography HTML enrichment
		context.biographyHTML = await TextEditor.enrichHTML(context.system.biography, {
			secrets: this.actor.isOwner,
			rollData: context.rollData,
			async: true,
		});

		// context.flags = actorData.flags

		// Prepare character data and items.
		if (actorData.type === "character" || actorData.type === "robot") {
			this._prepareItems(context);
			this._prepareCharacterData(context);

		}

		// Prepare NPC data and items.
		if (actorData.type === "npc") {
			this._prepareItems(context);
		}

		// Prepare Creature data and items.
		if (actorData.type === "creature") {
			this._prepareItems(context);
		}

		// Add roll data for TinyMCE editors.
		// context.rollData = context.actor.getRollData();

		// Prepare Items Enriched Descriptions
		const itemTypes = ["robot_mod"];
		let itemsEnrichedDescriptions = {};
		for await (let item of this.actor.items) {
			if (itemTypes.includes(item.type)) {
				const descriptionRich = await TextEditor.enrichHTML(
					item.system.effect, {async: true}
				);
				itemsEnrichedDescriptions[item._id] = descriptionRich;
			}
		}
		context.itemsEnrichedDescriptions = itemsEnrichedDescriptions;

		// Prepare active effects
		// context.effects = prepareActiveEffectCategories(this.actor.effects);
		context.FALLOUT = CONFIG.FALLOUT;

		// Update the Chem Doses Manager, but don't render it unless it's
		// already showing
		if (this.actor.type === "character") {
			this.chemDoseManager.render(false);
		}

		return context;
	}

	/**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
	_prepareCharacterData(context) {
		let allInjuries = [];

		for (const [, bp] of Object.entries(this.actor.system.body_parts)) {
			allInjuries.push(...bp.injuries);
		}

		context.treatedInjuriesCount = allInjuries.filter(i => i === 1).length;
		context.openInjuriesCount = allInjuries.filter(i => i === 2).length;

		context.materials = [];
		for (const material of ["junk", "common", "uncommon", "rare"]) {
			context.materials.push({
				label: game.i18n.localize(`FALLOUT.actor.inventory.materials.${material}`),
				key: `system.materials.${material}`,
				value: this.actor.system.materials[material] ?? 0,
			});
		}
	}

	/**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
	async _prepareItems(context) {
		context.itemsByType = {
			addiction: [],
			ammo: [],
			apparel_mod: [],
			apparel: [],
			books_and_magz: [],
			consumable: [],
			disease: [],
			miscellany: [],
			perk: [],
			robot_armor: [],
			robot_mod: [],
			skill: [],
			special_ability: [],
			trait: [],
			weapon_mod: [],
			weapon: [],
		};

		const inventory = [];

		const apparel = [];
		const robotApparel = [];

		// Iterate through items, allocating to containers
		for (const i of context.items) {
			i.img = i.img || DEFAULT_TOKEN;

			switch (i.type) {
				case "ammo":
					i.shotsAvailable = ((i.system.quantity - 1)
					* i.system.shots.max
					) + i.system.shots.current;

					context.itemsByType.ammo.push(i);
					break;
				case "apparel":
					apparel.push(i);
					break;
				case "consumable":
					let consumeIcon = "fa-pizza-slice";

					if (i.system.consumableType === "beverage") {
						consumeIcon = "fa-mug-hot";
					}

					if (i.system.consumableType === "chem") {
						consumeIcon = "fa-flask";
					}

					i.consumeIcon = consumeIcon;

					context.itemsByType.consumable.push(i);
					break;
				case "robot_armor":
					robotApparel.push(i);
					break;
				case "skill":
					const nameKey = `FALLOUT.SKILL.${i.name}`;
					i.localizedName = game.i18n.localize(nameKey);

					if (i.localizedName === nameKey) i.localizedName = i.name;

					i.localizedDefaultAttribute = game.i18n.localize(
						`FALLOUT.AbilityAbbr.${i.system.defaultAttribute}`
					);

					context.itemsByType.skill.push(i);
					break;
				case "weapon":
					if (i.system.ammo !== "") {
						const [, shotsAvailable] =
							await this.actor._getAvailableAmmoType(
								i.system.ammo
							);

						i.shotsAvailable = shotsAvailable;
					}

					context.itemsByType.weapon.push(i);
					break;
				default:
					if (!Array.isArray(context.itemsByType[i.type])) {
						inventory.push(i);
					}
					else {
						context.itemsByType[i.type].push(i);
					}
			}
		}

		context.itemsByType.skill.sort(
			(a, b) => a.localizedName.localeCompare(b.localizedName)
		);

		let clothing = apparel.filter(a => a.system.appareltype === "clothing");
		let outfit = apparel.filter(a => a.system.appareltype === "outfit");
		let headgear = apparel.filter(a => a.system.appareltype === "headgear");
		let armor = apparel.filter(a => a.system.appareltype === "armor");
		let powerArmor = apparel.filter(a => a.system.appareltype === "powerArmor");
		let plating = robotApparel.filter(a => a.system.appareltype === "plating");
		let robotArmor = robotApparel.filter(a => a.system.appareltype === "armor");

		context.allApparel = [
			{ apparelType: "clothing", list: clothing },
			{ apparelType: "outfit", list: outfit },
			{ apparelType: "headgear", list: headgear },
			{ apparelType: "armor", list: armor },
			{ apparelType: "powerArmor", list: powerArmor },
		];

		context.allRobotApparel = [
			{ apparelType: "plating", list: plating },
			{ apparelType: "armor", list: robotArmor },
		];

		// WRAP INVENTORY DEPENDING ON THE CHARACTER TYPE:
		// for example put apparel in inventory for all except the character actor.

		// NPC and Creature Inventory = all physical items that are not weapons
		if (this.actor.type === "npc" || this.actor.type === "creature") {
			context.inventory = context.items.filter(i => {
				const hasWeight = !isNaN(parseInt(i.system.weight ?? null));
				return i.type !== "weapon" && hasWeight;
			});
		}
		if (this.actor.type === "character") {
			context.inventory = [
				...robotApparel,
				...context.itemsByType.robot_mod,
				...inventory,
			];
		}
		if (this.actor.type === "robot") {
			context.inventory = [...apparel, ...inventory];
		}

		// ADD FAVOURITE ITEMS
		context.favoriteWeapons = context.items.filter(
			i => i.type === "weapon" && i.system.favorite
		);
	}

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
			this._onRollSkill(
				item.name,
				item.system.value,
				this.actor.system.attributes[item.system.defaultAttribute].value,
				item.system.tag
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

		let menuSkills = [];
		if (this.actor.type !== "npc") {
			menuSkills = [
				{
					icon: '<i class="fas fa-dice"></i>',
					name: "FALLOUT.TEMPLATES.Use_Strength",
					callback: t => {
						this._onRightClickSkill(t.data("itemId"), "str");
					},
				},
				{
					icon: '<i class="fas fa-dice"></i>',
					name: "FALLOUT.TEMPLATES.Use_Perception",
					callback: t => {
						this._onRightClickSkill(t.data("itemId"), "per");
					},
				},
				{
					icon: '<i class="fas fa-dice"></i>',
					name: "FALLOUT.TEMPLATES.Use_Endurance",
					callback: t => {
						this._onRightClickSkill(t.data("itemId"), "end");
					},
				},
				{
					icon: '<i class="fas fa-dice"></i>',
					name: "FALLOUT.TEMPLATES.Use_Charisma",
					callback: t => {
						this._onRightClickSkill(t.data("itemId"), "cha");
					},
				},
				{
					icon: '<i class="fas fa-dice"></i>',
					name: "FALLOUT.TEMPLATES.Use_Intelligence",
					callback: t => {
						this._onRightClickSkill(t.data("itemId"), "int");
					},
				},
				{
					icon: '<i class="fas fa-dice"></i>',
					name: "FALLOUT.TEMPLATES.Use_Agility",
					callback: t => {
						this._onRightClickSkill(t.data("itemId"), "agi");
					},
				},
				{
					icon: '<i class="fas fa-dice"></i>',
					name: "FALLOUT.TEMPLATES.Use_Luck",
					callback: t => {
						this._onRightClickSkill(t.data("itemId"), "luc");
					},
				},
				{
					icon: '<i class="fas fa-trash" style="color:red"></i>',
					name: "FALLOUT.TEMPLATES.Delete",
					callback: t => {
						this._onRightClickDelete(t.data("itemId"));
					},
				},
			];
		}
		else {
			menuSkills = [
				{
					icon: '<i class="fas fa-trash" style="color:red"></i>',
					name: "FALLOUT.TEMPLATES.Delete",
					callback: t => {
						this._onRightClickDelete(t.data("itemId"));
					},
				},
			];
		}

		new ContextMenu(html, ".skill", menuSkills);
		// * END SKILLS

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

		//
		html.find(".item-consume").click(async ev => {
			const li = $(ev.currentTarget).parents(".item");
			const item = this.actor.items.get(li.data("itemId"));

			const allUsed = await this.actor.consumeItem(item);

			if (allUsed) li.slideUp(200, () => this.render(false));
		});

		// * Add Inventory Item
		html.find(".item-create").click(this._onItemCreate.bind(this));

		// * Delete Inventory Item
		html.find(".item-delete").click(async ev => {
			const li = $(ev.currentTarget).parents(".item");
			const item = this.actor.items.get(li.data("itemId"));
			await item.delete();
			li.slideUp(200, () => this.render(false));
		});

		// * Toggle Stash Inventory Item
		html.find(".item-stash").click(async ev => {
			const li = $(ev.currentTarget).parents(".item");
			const item = this.actor.items.get(li.data("item-id"));
			await this.actor.updateEmbeddedDocuments("Item", [
				this._toggleStashed(li.data("item-id"), item),
			]);
		});

		// * Toggle Power on Power Armor Item
		html.find(".item-powered").click(async ev => {
			const li = $(ev.currentTarget).parents(".item");
			const item = this.actor.items.get(li.data("item-id"));
			await this.actor.updateEmbeddedDocuments("Item", [
				this._togglePowered(li.data("item-id"), item),
			]);
		});

		// * Toggle Equip Inventory Item
		html.find(".item-toggle").click(async ev => {
			const li = $(ev.currentTarget).parents(".item");
			const item = this.actor.items.get(li.data("item-id"));
			await this.actor.updateEmbeddedDocuments("Item", [
				this._toggleEquipped(li.data("item-id"), item),
			]);
		});

		// * Toggle Favorite Inventory Item
		html.find(".item-favorite").click(async ev => {
			const li = $(ev.currentTarget).parents(".item");
			const item = this.actor.items.get(li.data("item-id"));
			await this.actor.updateEmbeddedDocuments("Item", [
				this._toggleFavorite(li.data("item-id"), item),
			]);
		});

		// * INJURIES
		html.find(".injury-mark").click(async ev => {
			let status = parseInt(ev.currentTarget.dataset.status);
			// if (status === 2)
			// return;
			let index = ev.currentTarget.dataset.index;
			let bodypart = ev.currentTarget.dataset.bodypart;
			let injuries = this.actor.system.body_parts[bodypart].injuries;
			let newInjuries = [...injuries];
			newInjuries[index] = status === 2 ? 0 : 2;
			// newInjuries[index] = 2;
			let newStatus = this._getBodyPartStatus(newInjuries);
			let _update = {};
			let _dataInjuries = `system.body_parts.${bodypart}.injuries`;
			let _dataStatus = `system.body_parts.${bodypart}.status`;
			_update[_dataInjuries] = newInjuries;
			_update[_dataStatus] = newStatus;
			await this.actor.update(_update);
		});
		html.find(".injury-mark").contextmenu(async ev => {
			let status = parseInt(ev.currentTarget.dataset.status);
			// if (status === 0)
			// return;
			let index = ev.currentTarget.dataset.index;
			let bodypart = ev.currentTarget.dataset.bodypart;
			let injuries = this.actor.system.body_parts[bodypart].injuries;
			let newInjuries = [...injuries];
			newInjuries[index] = status === 1 ? 0 : 1;
			let newStatus = this._getBodyPartStatus(newInjuries);
			let _dataInjuries = `system.body_parts.${bodypart}.injuries`;
			let _dataStatus = `system.body_parts.${bodypart}.status`;
			let _update = {};
			_update[_dataInjuries] = newInjuries;
			_update[_dataStatus] = newStatus;
			await this.actor.update(_update);
		});
		// * END INJURIES

		// * Active Effect management
		html
			.find(".effect-control")
			.click(ev => onManageActiveEffect(ev, this.actor));

		// * ROLL WEAPON SKILL
		html.find(".weapon-roll").click(async ev => {
			const li = $(ev.currentTarget).parents(".item");
			const item = this.actor.items.get(li.data("item-id"));

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

				attribute = item.actor.system.attributes[skill.defaultAttribute];
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
			});
		});

		// * POWER ARMOR MONITOR
		html.find(".power-armor-monitor-health-value").change(ev => {
			const apparelId = $(ev.currentTarget).data("itemId");
			const newHealthValue = $(ev.currentTarget).val();
			let apparel = this.actor.items.get(apparelId);
			if (apparel) {
				if (apparel.system.appareltype === "powerArmor") {
					apparel.update({ "system.health.value": newHealthValue });
				}
			}
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

		html.find(".manage-session-doses").click(
			event => {
				event.preventDefault();

				this.chemDoseManager.render(true);
			}
		);

		// !CRATURES

		// ! DON'T LET NUMBER FIELDS EMPTY
		const numInputs = document.querySelectorAll("input[type=number]");
		numInputs.forEach(function(input) {
			input.addEventListener("change", function(e) {
				if (e.target.value === "") {
					e.target.value = 0;
				}
			});
		});
	}

	/**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
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
			data: data,
		};
		// Remove the type from the dataset since it's in the itemData.type prop.
		delete itemData.data.type;
		// Finally, create the item!
		return await Item.create(itemData, { parent: this.actor });
	}

	async _onRightClickDelete(itemId) {
		const item = this.actor.items.get(itemId);
		await item.delete();
		// li.slideUp(200, () => this.render(false));
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

	_onRollSkill(skillName, rank, attribute, tag) {
		fallout.Dialog2d20.createDialog({
			rollName: skillName,
			diceNum: 2,
			attribute: attribute,
			skill: rank,
			tag: tag,
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

	_getBodyPartStatus(injuries) {
		let maxStatus = Math.max(...injuries);
		let newStatus = "healthy";
		if (maxStatus === 1) newStatus = "wounded";
		else if (maxStatus === 2) newStatus = "crippled";
		return newStatus;
	}

	// Toggle Stashed Item
	_toggleStashed(id, item) {
		return {
			_id: id,
			data: {
				stashed: !item.system.stashed,
			},
		};
	}

	// Toggle Equipment
	_toggleEquipped(id, item) {
		return {
			_id: id,
			system: {
				equipped: !item.system.equipped,
			},
		};
	}

	// Toggle Powered
	_togglePowered(id, item) {
		return {
			_id: id,
			system: {
				powered: !item.system.powered,
			},
		};
	}

	// Toggle Favorite
	_toggleFavorite(id, item) {
		return {
			_id: id,
			system: {
				favorite: !item.system.favorite,
			},
		};
	}
}
