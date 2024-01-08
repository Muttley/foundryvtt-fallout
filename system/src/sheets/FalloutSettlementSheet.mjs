import {
	onManageActiveEffect,
	prepareActiveEffectCategories,
} from "../effects.mjs";

export default class FalloutSettlementSheet extends ActorSheet {

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
					initial: "status",
				},
			],
		});
	}

	/** @override */
	get template() {
		return "systems/fallout/templates/actor/settlement-sheet.hbs";
	}

	/** @inheritdoc */
	get title() {
		const type = game.i18n.localize(`TYPES.Actor.${this.actor.type}`);
		return `[${type}] ${this.actor.name}`;
	}

	/** @override */
	activateListeners(html) {
		super.activateListeners(html);

		// -------------------------------------------------------------
		// ! Everything below here is only needed if the sheet is editable
		if (!this.isEditable) return;

		// Active Effect management
		html
			.find(".effect-control")
			.click(ev => onManageActiveEffect(ev, this.actor));

		// * Add Inventory Item
		html.find(".item-create").click(this._onItemCreate.bind(this));

		// Render the item sheet for viewing/editing prior to the editable check.
		html.find(".item-edit").click(ev => {
			const li = $(ev.currentTarget).parents(".item");
			const item = this.actor.items.get(li.data("itemId"));
			item.sheet.render(true);
		});

		// * Delete Inventory Item
		html.find(".item-delete").click(async ev => {
			const li = $(ev.currentTarget).parents(".item");
			const item = this.actor.items.get(li.data("itemId"));
			if (item.type === "object_or_structure") {
				await item.deleteSettlementStructure();
			}
			await item.delete();
			li.slideUp(200, () => this.render(false));
		});

	}

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
			items: actorData.items,
			limited: this.actor.limited,
			options: this.options,
			owner: this.actor.isOwner,
			rollData: this.actor.getRollData.bind(this.actor),
			source: source.system,
			system: actorData.system,
			type: this.actor.type,
		};

		// Biography HTML enrichment
		context.biographyHTML = await TextEditor.enrichHTML(context.system.biography, {
			secrets: this.actor.isOwner,
			rollData: context.rollData,
			async: true,
		});

		// Setup materials
		context.materials = [];
		for (const material of ["junk", "common", "uncommon", "rare"]) {
			context.materials.push({
				label: game.i18n.localize(`FALLOUT.actor.inventory.materials.${material}`),
				key: `system.materials.${material}`,
				value: this.actor.system.materials[material] ?? 0,
			});
		}

		this._prepareItems(context);

		return context;
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
		const typeName = game.i18n.localize(`TYPES.Item.${type}`);
		const name = `New ${typeName}`;
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

	async _prepareItems(context) {
		context.stockpile = [];
		const settlementItems = [];

		for (const i of context.items) {
			if (i.type === "object_or_structure") {
				settlementItems.push(i);
			}
			else {
				context.stockpile.push(i);
			}
		}

		for (const i of settlementItems) {
			i.hasNoParent = i.system.parentItem === "";
			i.hasChildren = false;
			i.children = [];

			if (["room", "store", "structure"].includes(i.system.itemType)) {
				i.children = settlementItems.filter(
					item => item.system.parentItem === i._id
				);

				i.hasChildren = i.children.length > 0;
			}
		}

		const topLevelItems = settlementItems.filter(i => i.hasNoParent);

		const __calcDepth = function(item, depth) {
			item.depth = depth;

			for (const child of item.children) {
				__calcDepth(child, depth + 1);
			}
		};

		for (const item of topLevelItems) {
			__calcDepth(item, 0);
		}

		context.settlementObjects = topLevelItems;
	}
}
