import {
	onManageActiveEffect,
	prepareActiveEffectCategories,
} from "../effects.mjs";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export default class FalloutActorSheet extends ActorSheet {

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
					initial: this.initialTab,
				},
			],
		});
	}

	get initialTab() {
		return "status";
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
			FALLOUT: CONFIG.FALLOUT,
		};

		this._prepareItems(context);

		// Biography HTML enrichment
		context.biographyHTML = await TextEditor.enrichHTML(context.system.biography, {
			secrets: this.actor.isOwner,
			rollData: context.rollData,
			async: true,
		});

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

		html.find("input.derived-value").each((i, el) => {
			el.dataset.tooltip = "FALLOUT.Actor.Warnings.DerivedValue";
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

	_prepareMaterials(context) {
		context.materials = [];
		for (const material of ["junk", "common", "uncommon", "rare"]) {
			context.materials.push({
				label: game.i18n.localize(`FALLOUT.actor.inventory.materials.${material}`),
				key: `system.materials.${material}`,
				value: this.actor.system.materials[material] ?? 0,
			});
		}
	}


}
