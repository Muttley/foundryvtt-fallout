import { FalloutUpdateBase } from "../FalloutUpdateBase.mjs";

export default class Update_240930_1 extends FalloutUpdateBase {

	static version = 240930.1;

	async updateItem(itemData, actorData) {
		if (itemData.type !== "robot_armor") {
			return;
		}

		const updateData = {
			"system.-=mods": null,
		};

		return updateData;
	}
}
