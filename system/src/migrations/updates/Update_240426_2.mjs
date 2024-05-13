import { FalloutUpdateBase } from "../FalloutUpdateBase.mjs";

export default class Update_240426_2 extends FalloutUpdateBase {

	static version = 240426.2;

	async updateItem(itemData, actorData) {
		if (itemData.type !== "robot_armor") return;

		const updateData = {
			"system.-=appareltype": null,
			"system.apparelType": itemData.system.appareltype,
		};

		return updateData;
	}
}
