import { FalloutUpdateBase } from "../FalloutUpdateBase";

// Cleans up various unused Actor data fields
//
export default class Update_231130_1 extends FalloutUpdateBase {

	static version = 231130.1;


	async updateActor(actorData) {
		// This value is auto-calculated now
		//
		const updateData = {
			"system.level.-=nextLevelXP": null,
		};

		// This information is no longer needed
		//
		const bodyParts = ["armL", "armR", "head", "legL", "legR", "torso"];
		for (const bodyPart of bodyParts) {
			updateData[`system.body_parts.${bodyPart}.-=hit`] = null;
		}

		// Make sure caps is stored as an Integer
		//
		let caps = parseInt(actorData.system.currency.caps);
		caps = isNaN(caps) ? 0 : caps;

		updateData["system.currency.caps"] = caps;

		return updateData;
	}

}
