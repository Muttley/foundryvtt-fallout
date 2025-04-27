import { FalloutUpdateBase } from "../FalloutUpdateBase.mjs";

export default class Update_250424_1 extends FalloutUpdateBase {

	static version = 250424.1;

	async updateItem(itemData, actorData) {
		if (itemData.type !== "consumable"
			|| itemData.system.consumableType !== "beverage"
		) {
			return;
		}

		const updateData = {};

		const beveragesThatProvideCaps = [
			"Beer",
			"Nuka-Cherry",
			"Nuka-Cola Quantum",
			"Nuka-Cola",
		];

		if (beveragesThatProvideCaps.includes(itemData.name)) {
			updateData["system.providesCap"] = true;
		}

		return updateData;
	}
}
