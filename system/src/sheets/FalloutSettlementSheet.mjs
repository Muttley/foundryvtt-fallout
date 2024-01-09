import FalloutActorSheet from "./FalloutActorSheet.mjs";

// import {
// 	onManageActiveEffect,
// 	prepareActiveEffectCategories,
// } from "../effects.mjs";

export default class FalloutSettlementSheet extends FalloutActorSheet {

	/** @override */
	get initialTab() {
		return "status";
	}

	/** @override */
	async getData(options) {
		const context = await super.getData(options);

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

	/** @override */
	async _onDropItem(event, data) {
		if (!this.actor.isOwner) return false;

		const item = await Item.implementation.fromDropData(data);
		const source = item.toObject();

		if (this.actor.uuid === item.parent?.uuid) {
			return this._onSortItem(event, source);
		}

		if (source.type !== "object_or_structure") {
			return super._onDropItem(event, data);
		}

		const dropTarget = event.target.closest("[data-item-id]");
		if (!dropTarget) return super._onDropItem(event, data);

		const target = this.actor.items.get(dropTarget.dataset.itemId);

		const targetIsCorrectType = target.type === "object_or_structure";
		const targetIsContainer =
			["structure", "room", "store"].includes(target.system?.itemType ?? "");

		const sourceIsNotStructure =
			source.system.itemType !== "structure";

		if (targetIsCorrectType && targetIsContainer && sourceIsNotStructure) {
			source.system.parentItem = target._id;

			// Create the owned item
			return this._onDropItemCreate(source);
		}
		else {
			return super._onDropItem(event, data);
		}
	}


	/** @override */
	_onSortItem(event, itemData) {
		const items = this.actor.items;

		const source = items.get(itemData._id);

		const dropTarget = event.target.closest("[data-item-id]");
		if ( !dropTarget ) {
			return source.update({
				"system.parentItem": "",
			});
		}

		const target = items.get(dropTarget.dataset.itemId);

		if (source.type === "object_or_structure" && target.type === "object_or_structure") {
			const targetIsContainerType =
				["structure", "room", "store"].includes(target.system.itemType);

			const sourceIsNotStructure =
				source.system.itemType !== "structure";

			if (targetIsContainerType && sourceIsNotStructure) {
				return source.update({
					"system.parentItem": target._id,
				});
			}
		}

		return super._onSortItem(event, itemData);
	}

	async _prepareItems(context) {
		context.stockpile = [];
		context.stockpileUsed = 0;

		const groupedSettlementItems = {
			crafting_table: [],
			defense: [],
			power: [],
			resource: [],
			room: [],
			store: [],
			structure: [],
			unknown: [],
		};

		for (const i of context.items) {
			if (i.type === "object_or_structure") {
				if (groupedSettlementItems[i.system.itemType]) {
					groupedSettlementItems[i.system.itemType].push(i);
				}
				else {
					groupedSettlementItems.unknown.push(i);
				}
			}
			else {

				context.stockpile.push(i);
			}
		}

		const settlementItems = [
			...groupedSettlementItems.structure,
			...groupedSettlementItems.room,
			...groupedSettlementItems.store,
			...groupedSettlementItems.defense,
			...groupedSettlementItems.power,
			...groupedSettlementItems.crafting_table,
			...groupedSettlementItems.resource,
			...groupedSettlementItems.unknown,
		];

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
