import { FalloutUpdateBase } from "../FalloutUpdateBase.mjs";

export default class Update_241218_1 extends FalloutUpdateBase {

	static version = 241218.1;

	async updateItem(itemData, actorData) {
		if (itemData.type !== "books_and_magz") {
			return;
		}

		const updateData = {
			"system.-=issue": null,
			"system.-=learned": null,
			"system.-=perk": null,
			"system.read": itemData.system.learned ?? false,
		};

		return updateData;
	}
}
