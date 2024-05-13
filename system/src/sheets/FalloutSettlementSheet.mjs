import FalloutBaseActorSheet from "./FalloutBaseActorSheet.mjs";

export default class FalloutSettlementSheet extends FalloutBaseActorSheet {

	/** @override */
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			submitOnChange: true,
		});
	}

	/** @override */
	get initialTab() {
		return "status";
	}

	get settlers() {
		return game.actors.filter(a => a.type === "npc"
			&& a.system.settlement.uuid === this.actor.uuid
		);
	}

	activateListeners(html) {
		super.activateListeners(html);

		// -------------------------------------------------------------
		// ! Everything below here is only needed if the sheet is editable
		if (!this.isEditable) return;

		html.find(".settler-create").click(this._onSettlerCreate.bind(this));

		html.find(".settler-delete").click(async event => {
			const settlerUuid = $(event.currentTarget).data("settlerId");
			this._deleteSettler(settlerUuid);
		});
		html.find(".settler-open").click(async event => {
			const settlerUuid = $(event.currentTarget).data("settlerId");
			const actor = await fromUuid(settlerUuid);

			if (actor) actor.sheet.render(true);
		});
	}

	/** @override */
	async getData(options) {
		const context = await super.getData(options);

		await this._prepareMaterials(context);

		const actions = [];
		for (const action in CONFIG.FALLOUT.SETTLEMENT_ACTIONS) {
			actions.push({
				id: action,
				name: CONFIG.FALLOUT.SETTLEMENT_ACTIONS[action],
			});
		}
		context.actions = actions.sort((a, b) => a.name.localeCompare(b.name));

		context.candidates = [...context.settlers];

		const playerCharacters = game.actors.filter(
			a => a.type === "character" && a.hasPlayerOwner
		);

		for (const character of playerCharacters) {
			context.candidates.push({
				uuid: character.uuid,
				name: character.name,
			});
		}

		context.candidates = context.candidates.sort(
			(a, b) => a.name.localeCompare(b.name)
		);

		return context;
	}


	async _addSettler(newSettler) {
		await newSettler.update({
			"system.settlement.uuid": this.actor.uuid,
			"system.settlement.action": "unnasigned",
		});

		this.actor._prepareSettlementData();

		this.render(true);
	}


	async _deleteSettler(uuid) {
		const settler = await fromUuid(uuid);

		await settler.update({
			"system.settlement.uuid": "",
			"system.settlement.action": "unnasigned",
		});

		this.actor._prepareSettlementData();

		this.render(true);
	}


	/** @override */
	async _onDropActor(event, data) {
		if (!game.user.isGM) return;

		const droppedActor = data?.uuid ? await fromUuid(data.uuid) : null;

		// Only NPCs can be dropped
		if (droppedActor.type !== "npc") return;

		if (droppedActor) {
			this._addSettler(droppedActor);
		}
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

			return this._onDropItemCreate(source);
		}
		else {
			return super._onDropItem(event, data);
		}
	}


	async _onSettlerCreate(event) {
		event.preventDefault();

		const actorData = {
			"name": "New Settler",
			"type": "npc",
			"system.settlement.uuid": this.actor.uuid,
		};

		const newSettler = await Actor.create(actorData);

		if (newSettler) {
			await this._addSettler(newSettler);
			newSettler.sheet.render(true);
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
		context.settlers = [];

		const assignments = foundry.utils.duplicate(this.actor.system.assignments ?? {});

		context.settlerActionCounts = foundry.utils.mergeObject({
			build: 0,
			business: 0,
			guard: 0,
			hunting_and_gathering: 0,
			scavenging: 0,
			tend_crops: 0,
			trade_caravan: 0,
			unnasigned: 0,
		}, assignments);

		context.stockpile = [];
		context.stockpileUsed = 0;

		const settlers = this.settlers;
		for (const settler of settlers) {
			const action = settler.system.settlement?.action ?? "unnasigned";
			context.settlerActionCounts[action]++;
		}

		context.settlers = settlers.sort((a, b) => a.name.localeCompare(b.name));
		context.settlers.sort((a, b) => a.system.settlement.action.localeCompare(
			b.system.settlement.action
		));

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

		context.stockpile.sort((a, b) => {
			const aTypeLocalized = CONFIG.FALLOUT.ITEM_TYPES[a.type];
			const bTypeLocalized = CONFIG.FALLOUT.ITEM_TYPES[b.type];

			return aTypeLocalized.localeCompare(bTypeLocalized);
		});

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

		const __calcDepth = async function(item, depth) {
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


	async _updateObject(event, formData) {
		const settlerActions = {};
		const re = /^action__(.*)$/;

		for (const dataKey in formData) {
			const result = dataKey.match(re);

			if (result) {
				settlerActions[result[1]] = formData[dataKey];
				delete formData[dataKey];
			}
		}

		await this._updateSettlerActions(settlerActions);

		await super._updateObject(event, formData);

		this.render(false);
	}


	async _updateSettlerActions(settlerActions) {
		for (const settler of this.settlers) {
			const action = settlerActions[settler.uuid];
			await settler.update({"system.settlement.action": action});
		}
	}
}
