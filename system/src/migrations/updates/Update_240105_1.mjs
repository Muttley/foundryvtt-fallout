import { FalloutUpdateBase } from "../FalloutUpdateBase";

export default class Update_240105_1 extends FalloutUpdateBase {

	static version = 240105.1;

	async updateItem(itemData, actorData) {
		if (itemData.type !== "consumable") return;

		const updateData = {};

		let duration = itemData.system.duration;

		// Make an attempt to sanitize any input, as long as the name matches
		// somewhere (case insensite), then we'll use that, otherwise we'll
		// default to "instant" the same as the template
		//
		if (duration.match(/instant/i)) {
			updateData["system.duration"] = "instant";
		}
		else if (duration.match(/brief/i)) {
			updateData["system.duration"] = "brief";
		}
		else if (duration.match(/lasting/i)) {
			updateData["system.duration"] = "lasting";
		}
		else {
			updateData["system.duration"] = "instant";
		}

		return updateData;
	}
}
