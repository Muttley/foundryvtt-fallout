import { FalloutUpdateBase } from "../FalloutUpdateBase.mjs";

export default class Update_240511_1 extends FalloutUpdateBase {

	static version = 240511.1;

	async updateItem(itemData, actorData) {
		if (itemData.type !== "apparel") {
			return;
		}

		const updateData = {
			"system.-=damaged": null,
			"system.-=powered": null,
			"system.-=powerStr": null,
			"system.-=powerSystems": null,
			"system.-=special": null,
			"system.powerArmor.powered": itemData.system.powered ?? false,
		};

		return updateData;
	}
}
