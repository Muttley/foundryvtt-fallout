import { FalloutUpdateBase } from "../FalloutUpdateBase.mjs";

export default class Update_240217_5 extends FalloutUpdateBase {

	static version = 240217.5;

	async updateItem(itemData, actorData) {
		if (itemData.type !== "consumable") {
			return;
		}

		let thirstReduction = itemData.system.thirstReduction;

		if (itemData.system.consumableType === "beverage") {
			if (thirstReduction < 1) {
				thirstReduction = 1;
			}
		}
		else {
			thirstReduction = 0;
		}

		const updateData = {
			"system.thirstReduction": thirstReduction,
		};

		return updateData;
	}
}
