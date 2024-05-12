import { FalloutUpdateBase } from "../FalloutUpdateBase.mjs";

export default class Update_240511_2 extends FalloutUpdateBase {

	static version = 240511.2;

	async updateItem(itemData, actorData) {
		if (itemData.type !== "apparel") return;

		const updateData = {
			"system.powerArmor.frameId": "",
		};

		return updateData;
	}
}
