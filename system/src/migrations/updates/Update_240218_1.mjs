import { FalloutUpdateBase } from "../FalloutUpdateBase.mjs";

export default class Update_240218_1 extends FalloutUpdateBase {

	static version = 240218.1;

	async updateItem(itemData, actorData) {
		if (!itemData.system.hasOwnProperty("cost")) return;

		let parsedInt = parseInt(itemData.system.cost);
		parsedInt = isNaN(parsedInt) ? 0 : parsedInt;

		const updateData = {
			"system.cost": parsedInt,
		};

		return updateData;
	}
}
