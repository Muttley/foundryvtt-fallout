import { FalloutUpdateBase } from "../FalloutUpdateBase.mjs";

export default class Update_231231_1 extends FalloutUpdateBase {

	static version = 231231.1;

	async updateItem(itemData, actorData) {
		if (itemData.type !== "consumable") return;

		const addiction = itemData.system.addictive ?? 0;
		const addictive = addiction > 0 ? true : false;

		const updateData = {
			"system.addiction": addiction,
			"system.addictive": addictive,
		};

		return updateData;
	}
}
