import { FalloutUpdateBase } from "../FalloutUpdateBase.mjs";

export default class Update_240510_1 extends FalloutUpdateBase {

	static version = 240510.1;

	async updateItem(itemData, actorData) {
		if (itemData.type !== "weapon") {
			return;
		}

		let newTear = Number(itemData.system.tear ?? "");

		if (isNaN(newTear)) {
			newTear = 1;
		}

		const updateData = {
			"system.tear": newTear,
		};

		return updateData;
	}
}
