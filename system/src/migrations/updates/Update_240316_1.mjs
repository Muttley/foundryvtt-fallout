import { FalloutUpdateBase } from "../FalloutUpdateBase.mjs";

export default class Update_240316_1 extends FalloutUpdateBase {

	static version = 240316.1;

	async updateActor(actorData) {
		if (!["creature", "npc"].includes(actorData.type)) {
			return;
		}

		let poisonResistance = actorData.system?.resistance?.poison?.value;
		if (poisonResistance === undefined) {
			poisonResistance = 0;
		}

		const validResistance = parseInt(poisonResistance);

		const updateData = {};

		if (isNaN(validResistance)) {
			ui.notifications.warn(
				`Unable to migrate the poison resistance '${poisonResistance}' of Actor '${actorData.name}', this will need to be done manually.`,
				{permanent: true}
			);
		}
		else {
			for (const bodyPart in CONFIG.FALLOUT.BODY_VALUES) {
				updateData[`system.body_parts.${bodyPart}.resistance.poison`] = validResistance;
			}
		}

		return updateData;
	}
}
