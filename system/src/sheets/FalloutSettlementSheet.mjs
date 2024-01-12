import FalloutBaseActorSheet from "./FalloutBaseActorSheet.mjs";

export default class FalloutSettlementSheet extends FalloutBaseActorSheet {

	/** @override */
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			submitOnChange: true,
		});
	}

	/** @override */
	get initialTab() {
		return "status";
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


	async _addSettler(uuid) {
		const currentSettlers = duplicate(this.actor.system.settlers);

		if (currentSettlers.find(s => s.actorUuid === uuid)) {
			ui.notifications.warn(
				game.i18n.format("FALLOUT.Actor.Warnings.NpcAlreadyResident", {
					settlementName: this.actor.name,
				})
			);
			return;
		}

		currentSettlers.push({
			actorUuid: uuid,
			action: "unnasigned",
		});

		this.actor.update({
			"system.settlers": currentSettlers,
			"system.people.value": currentSettlers.length,
		});
	}


	async _deleteMissingSettlers(missingSettlers) {
		const newSettlers = [];

		for (const settler of this.actor.system.settlers) {
			if (missingSettlers.includes(settler.actorUuid)) continue;
			newSettlers.push(settler);
		}

		return this.actor.update({
			"system.settlers": newSettlers,
			"system.people.value": newSettlers.length,
		});
	}


	async _deleteSettler(uuid) {
		const newSettlers = [];

		for (const settler of this.actor.system.settlers) {
			if (settler.actorUuid === uuid) continue;
			newSettlers.push(settler);
		}

		return this.actor.update({
			"system.settlers": newSettlers,
			"system.people.value": newSettlers.length,
		});
	}


	/** @override */
	async _onDropActor(event, data) {
		if (!game.user.isGM) return;

		const droppedActor = data?.uuid ? await fromUuid(data.uuid) : null;

		// Only NPCs can be dropped
		if (droppedActor.type !== "npc") return;

		if (droppedActor) {
			this._addSettler(droppedActor.uuid);
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
			name: "New Settler",
			type: "npc",
		};

		const newSettler = await Actor.create(actorData);

		if (newSettler) {
			await this._addSettler(newSettler.uuid);
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
		context.settlerActionCounts = {
			build: 0,
			business: 0,
			guard: 0,
			hunting_and_gathering: 0,
			scavenging: 0,
			tend_crops: 0,
			trade_caravan: 0,
			unnasigned: 0,
		};

		context.stockpile = [];
		context.stockpileUsed = 0;

		const missingSettlers = [];
		for (const settler of this.actor.system.settlers) {
			const npcActor = await fromUuid(settler.actorUuid);

			if (npcActor) {
				context.settlers.push({
					uuid: settler.actorUuid,
					name: npcActor.name,
					actionId: settler.action,
				});

				context.settlerActionCounts[settler.action]++;
			}
			else {
				missingSettlers.push(settler.actorUuid);
			}
		}

		if (missingSettlers.length > 0) {
			await this._deleteMissingSettlers(missingSettlers);
		}

		context.settlers.sort((a, b) => a.name.localeCompare(b.name));
		context.settlers.sort((a, b) => a.actionId.localeCompare(b.actionId));

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

		super._updateObject(event, formData);
	}


	async _updateSettlerActions(settlerActions) {
		const currentSettlers = duplicate(this.actor.system.settlers);

		for (const settler of currentSettlers) {
			settler.action = settlerActions[settler.actorUuid];
		}

		return await this.actor.update({"system.settlers": currentSettlers});
	}
}
