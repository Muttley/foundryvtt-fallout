import { FalloutUpdateBase } from "../FalloutUpdateBase";

export default class Update_231130_1 extends FalloutUpdateBase {

	static version = 231130.1;

	async updateActor(actorData) {
		const updateData = {
			"system.level.-=nextLevelXP": null,
		};

		const bodyParts = ["armL", "armR", "head", "legL", "legR", "torso"];
		for (const bodyPart of bodyParts) {
			updateData[`system.body_parts.${bodyPart}.-=hit`] = null;
		}

		return updateData;
	}
}
