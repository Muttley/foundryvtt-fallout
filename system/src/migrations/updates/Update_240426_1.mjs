import { FalloutUpdateBase } from "../FalloutUpdateBase.mjs";

export default class Update_240426_1 extends FalloutUpdateBase {

	static version = 240426.1;

	async updateItem(itemData, actorData) {
		if (itemData.type !== "apparel") return;

		const updateData = {
			"system.-=armorType": null,
			"system.-=appareltype": null,
			"system.apparelType": itemData.system.appareltype,
		};

		return updateData;
	}
}
