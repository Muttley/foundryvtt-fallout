import FalloutBaseActorSheet from "./FalloutBaseActorSheet.mjs";

/**
 * @extends {ActorSheet}
 */
export default class FalloutPcSheet extends FalloutBaseActorSheet {

	chemDoseManager;

	/** @override */
	get ignoredInventoryItems() {
		if (this.actor.isRobot) {
			return ["robot_armor"];
		}
		else {
			return ["apparel"];
		}
	}

	/** @override */
	get inventorySections() {
		return [
			"addiction",
			"ammo",
			"apparel_mod",
			"books_and_magz",
			"consumable",
			"disease",
			"miscellany",
			"perk",
			"robot_mod",
			"skill",
			"trait",
			"weapon_mod",
			"weapon",
		];
	}

	/** @override */
	get template() {
		return "systems/fallout/templates/actor/pc-sheet.hbs";
	}

	/** @override */
	activateListeners(html) {
		super.activateListeners(html);

		html.find(".power-armor-monitor-health-value").change(event => {
			event.preventDefault();

			const apparelId = $(event.currentTarget).data("itemId");
			const newHealthValue = $(event.currentTarget).val();

			let apparel = this.actor.items.get(apparelId);

			if (apparel && apparel.system.appareltype === "powerArmor") {
				apparel.update({ "system.health.value": newHealthValue });
			}
		});

		html.find(".manage-session-doses").click(event => {
			event.preventDefault();
			this.chemDoseManager.render(true);
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

		//
		html.find(".item-consume").click(async ev => {
			const li = $(ev.currentTarget).parents(".item");
			const item = this.actor.items.get(li.data("itemId"));

			const allUsed = await this.actor.consumeItem(item);

			if (allUsed) li.slideUp(200, () => this.render(false));
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

		let menuSkills = [
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

		new ContextMenu(html, ".skill", menuSkills);
		// * END SKILLS
	}


	async getData(options) {
		const context = await super.getData(options);

		await this._prepareCharacterData(context);
		await this._prepareMaterials(context);
		await this._prepareRobotModDescriptions(context);

		context.disableAutoXpTarget = game.settings.get(
			SYSTEM_ID, "disableAutoXpTarget"
		);

		this._updateChemDoseManager();

		// ADD FAVOURITE ITEMS
		context.favoriteWeapons = context.itemsByType.weapon.filter(
			i => i.system.favorite
		);

		return context;
	}


	_getBodyPartStatus(injuries) {
		let maxStatus = Math.max(...injuries);
		let newStatus = "healthy";
		if (maxStatus === 1) newStatus = "wounded";
		else if (maxStatus === 2) newStatus = "crippled";
		return newStatus;
	}


	/**
	 * Organize and classify Items for Character sheets.
	 *
	 * @param {Object} actorData The actor to prepare.
	 * @return {undefined}
	 */
	async _prepareCharacterData(context) {
		let allInjuries = [];

		for (const [, bp] of Object.entries(this.actor.system.body_parts)) {
			allInjuries.push(...bp.injuries);
		}

		context.treatedInjuriesCount = allInjuries.filter(i => i === 1).length;
		context.openInjuriesCount = allInjuries.filter(i => i === 2).length;
	}


	async _prepareRobotModDescriptions(context) {
		if (this.actor.isNotRobot) return;

		context.itemsEnrichedDescriptions = {};

		for await (let item of context.itemsByType.robot_mod) {
			const descriptionRich = await TextEditor.enrichHTML(
				item.system.effect, {async: true}
			);

			context.itemsEnrichedDescriptions[item._id] = descriptionRich;
		}
	}

	_getFilteredApparelSections(context) {
		context.allApparel = [];

		const __filteredApparel = function(type, subType) {
			const list = context.items.filter(
				i => i.type === type
			).filter(
				i => i.system.appareltype === subType
			);

			return {
				apparelType: subType,
				list,
			};
		};

		let apparelSubTypes;
		if (this.actor.isRobot) {
			apparelSubTypes = ["armor", "plating"];
		}
		else {
			apparelSubTypes = [
				"armor",
				"clothing",
				"headgear",
				"outfit",
				"powerArmor",
			];
		}

		for (const subType of apparelSubTypes) {
			context.allApparel.push(
				__filteredApparel(
					this.actor.isRobot ? "robot_armor" : "apparel",
					subType
				)
			);
		}
	}

	_onSubmit(event) {
		if (!this.isEditable) return;
		if (this.actor.type !== "character") return super._onSubmit(event);

		const updateData = this._getSubmitData();

		// Update the lastChanged timestamp any changed conditions
		//
		const currentTime = game.time.worldTime;
		for (const condition of ["hunger", "thirst", "sleep"]) {
			const currentValue = this.actor.system.conditions[condition];
			const newValue = updateData[`system.conditions.${condition}`];

			if (newValue !== currentValue) {
				updateData[`system.conditions.lastChanged.${condition}`] = currentTime;
			}
		}

		this.actor.update(updateData);
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

	async _updateChemDoseManager() {
		if (this.actor.isRobot) return;

		if (!this.chemDoseManager) {
			this.chemDoseManager = new fallout.apps.FalloutChemDoses(this.actor);
		}

		this.chemDoseManager.render(false);
	}
}
