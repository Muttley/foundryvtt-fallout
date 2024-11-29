import FalloutBaseActorSheet from "./FalloutBaseActorSheet.mjs";

/**
 * @extends {FalloutBaseActorSheet}
 */export default class FalloutVehicleSheet extends FalloutBaseActorSheet {

	/** @override */
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ["fallout", "sheet", "vehicle"],
			width: 700,
			height: 710,
			tabs: [
				{
					navSelector: ".sheet-tabs",
					contentSelector: ".sheet-body",
					initial: this.initialTab,
				},
			],
		});
	}

	/** @override */
	get initialTab() {
		return "abilities";
	}

	/** @override */
	get inventorySections() {
		return [
			"weapon",
			"ammo",
		];
	}

	/** @override */
	get template() {
		return "systems/fallout/templates/actor/vehicle-sheet.hbs";
	}

	 /** @override */
	 activateListeners(html) {
		 super.activateListeners(html);

		 // * Toggle Favorite Inventory Item
		 html.find(".item-favorite").click(async ev => {
			 const li = $(ev.currentTarget).parents(".item");
			 const item = this.actor.items.get(li.data("item-id"));

			 item.update({ "system.favorite": !item.system.favorite });
		 });


		 // * Toggle Stash Inventory Item
		 html.find(".item-stash").click(async ev => {
			 const li = $(ev.currentTarget).parents(".item");
			 const attachedToId = li.data("item-attached") ?? "";

			 const itemId = li.data("item-id") ?? "";
			 const item = this.actor.items.get(itemId);

			 const newValue = !item.system.stashed;

			 const isFrame = item.system.powerArmor?.isFrame ?? false;

			 if (attachedToId !== "" || isFrame) {
				 const myFrameId = isFrame ? itemId : attachedToId;

				 const updateData = [{
					 "_id": myFrameId,
					 "system.stashed": newValue,
					 "system.equipped": newValue ? false : item.system.equipped,
				 }];

				 const attachments = this.actor.items.filter(
					 i => i.type === "apparel"
						 && i.system.powerArmor.frameId === myFrameId
				 ).map(i => i._id);

				 for (const attachmentId of attachments) {
					 updateData.push({
						 "_id": attachmentId,
						 "system.stashed": newValue,
						 "system.equipped": newValue ? false : item.system.equipped,
					 });
				 }

				 await Item.updateDocuments(updateData, { parent: this.actor });

				 if (item.type === "apparel") {
					 this.actor._calculateCharacterBodyResistance();
				 }
			 }
			 else {
				 item.update({
					 "system.stashed": newValue,
					 "system.equipped": newValue ? false : item.system.equipped,
				 });
			 }
		 });
	 }

	async getData(options) {
		const context = await super.getData(options);

		const bodyPartData = this.actor.system.body_parts;

		context.bodyParts = [];

		let bodyType = "vehicle";
		let valueConfig = {};

		switch (this.actor.system.bodyType) {
			case "apc":
				valueConfig = CONFIG.FALLOUT.VEHICLE_APC_VALUES;
				break;
			case "armored":
				valueConfig = CONFIG.FALLOUT.VEHICLE_ARMORED_VALUES;
				break;
			case "bus":
				valueConfig = CONFIG.FALLOUT.VEHICLE_BUS_VALUES;
				break;
			case "carTruck":
				valueConfig = CONFIG.FALLOUT.VEHICLE_CARTRUCK_VALUES;
				break;
			case "motorcycle":
				valueConfig = CONFIG.FALLOUT.VEHICLE_MOTORCYCLE_VALUES;
				break;
			case "sportsCar":
				valueConfig = CONFIG.FALLOUT.VEHICLE_SPORTSCAR_VALUES;
				break;
			case "vertibird":
				valueConfig = CONFIG.FALLOUT.VEHICLE_VERTIBIRD_VALUES;
				break;
			default:
				valueConfig = CONFIG.FALLOUT.VEHICLE_CARTRUCK_VALUES;
		}


		for (const part in valueConfig) {
			const name = game.i18n.localize(
				`FALLOUT.BodyTypes.${bodyType}.${part}`
			);
			context.bodyParts.push({
				name: name,
				roll: valueConfig[part],
				basePath: `system.body_parts.${part}`,
				resistanceValues: bodyPartData[part].resistance,
				injuryOpenCount: bodyPartData[part].injuryOpenCount ?? 0,
				injuryTreatedCount: bodyPartData[part].injuryTreatedCount ?? 0,
			});
		}

		await this._getVehicleQualities(context, this.actor);


		context.settlements = [];

		const settlements = game.actors.filter(a => a.type === "settlement");
		settlements.sort((a, b) => a.name.localeCompare(b.name));

		for (const settlement of settlements) {
			context.settlements.push({
				uuid: settlement.uuid,
				name: settlement.name,
			});
		}

		// ADD FAVOURITE ITEMS
		context.favoriteWeapons = context.itemsByType.weapon.filter(
			i => i.system.favorite
		);

		return context;
	}

	async _updateObject(event, formData) {

		for (const resistanceType of ["energy", "physical"]) {
			const key = `_all_${resistanceType}`;
			const val = formData[key] ?? null;

			if (val !== null && val >= 0) {
				// Update all locations
				for (const bodyPart in this.actor.system.body_parts) {
					const bodyPartKey = `system.body_parts.${bodyPart}.resistance.${resistanceType}`;
					formData[bodyPartKey] = val;
				}
			}

			delete formData[key];
		}

		return super._updateObject(event, formData);

	}

	async _getVehicleQualities(context, actor) {

		const vehicleQualities = [];
		for (const key in CONFIG.FALLOUT.VEHICLE_QUALITIES) {
			vehicleQualities.push({
				active: actor.system?.vehicleQuality[key].value ?? false,
				hasRank: CONFIG.FALLOUT.VEHICLE_QUALITY_HAS_RANK[key],
				rank: actor.system?.vehicleQuality[key].rank,
				key,
				label: CONFIG.FALLOUT.VEHICLE_QUALITIES[key],
			});
		}

		context.vehicleQualities = vehicleQualities.sort(
			(a, b) => a.label.localeCompare(b.label)
		);
	}

}
