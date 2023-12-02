import { FalloutUpdateBase } from "../FalloutUpdateBase";

export default class Update_231130_1 extends FalloutUpdateBase {

	static version = 231130.1;


	async updateActor(actorData) {
		// These values are either unnused or dynamically calculated
		//
		const updateData = {
			"system.defense.-=base": null,
			"system.defense.-=mod": null,
			"system.health.-=max": null,
			"system.health.-=min": null,
			"system.health.-=mod": null,
			"system.initiative.-=base": null,
			"system.initiative.-=mod": null,
			"system.level.-=nextLevelXP": null,
			"system.meleeDamage.-=base": null,
			"system.meleeDamage.-=mod": null,
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