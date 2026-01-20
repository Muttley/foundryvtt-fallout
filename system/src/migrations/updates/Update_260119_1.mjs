import { FalloutUpdateBase } from "../FalloutUpdateBase.mjs";

export default class Update_260119_1 extends FalloutUpdateBase {

	static version = 260119.1;


	async updateItem(itemData, actorData) {
		if (itemData.type !== "weapon") {
			return;
		}

		const weaponsToUpdate = {
			"baseball-grenade": 1,
			"bottlecap-mine": 0.5,
			"frag-grenade": 0.5,
			"frag-mine": 0.5,
			"javelin": 4,
			"molotov-cocktail": 0.5,
			"nuka-grenade": 0.5,
			"nuke-mine": 0.5,
			"plasma-grenade": 0.5,
			"plasma-mine": 0.5,
			"pulse-grenade": 0.5,
			"pulse-mine": 0.5,
			"throwing-knives": 0.5,
			"tomahawk": 0.5,
		};

		const weaponSlug = itemData.name.slugify();
		const weaponWeight = weaponsToUpdate[weaponSlug];

		if (!weaponWeight) {
			return;
		}

		const updateData = {
			"system.ammo": "",
			"system.consumedOnUse": true,
			"system.weight": weaponWeight,
		};

		if (actorData) {
			const actor = game.actors.find(a => a._id === actorData._id);

			let quantity = 0;
			const migratedItems = [];
			for (const item of actor.items) {
				if (item.name.slugify() === weaponSlug && item.type === "ammo") {
					quantity += parseInt(item.system.quantity);

					if (!updateData["system.quantityRoll"]) {
						updateData["system.quantityRoll"] = item.system.quantityRoll;
					}

					migratedItems.push(item._id);
				}
			}

			updateData["system.quantity"] = quantity;
			actor.deleteEmbeddedDocuments("Item", migratedItems);
		}

		return updateData;
	}

}
