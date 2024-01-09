import FalloutActorSheet from "./FalloutActorSheet.mjs";

/**
 * @extends {ActorSheet}
 */
export default class FalloutPlayerCharacterSheet extends FalloutActorSheet {

	/** @override */
	activateListeners(html) {
		super.activateListeners(html);

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

		this._prepareCharacterData(context);
		this._prepareMaterials(context);

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
	_prepareCharacterData(context) {
		let allInjuries = [];

		for (const [, bp] of Object.entries(this.actor.system.body_parts)) {
			allInjuries.push(...bp.injuries);
		}

		context.treatedInjuriesCount = allInjuries.filter(i => i === 1).length;
		context.openInjuriesCount = allInjuries.filter(i => i === 2).length;
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
