import { FalloutUpdateBase } from "../FalloutUpdateBase.mjs";

export default class Update_240218_2 extends FalloutUpdateBase {

	static version = 240218.2;

	async updateActor(actorData) {
		if (!["creature", "npc"].includes(actorData.type)) return;

		const updateData = {};

		const level = actorData.system.level?.value ?? 0;
		const currentXP = actorData.system.level?.currentXP;

		let categories;
		if (actorData.type === "creature") {
			categories = ["normal", "mighty", "legendary"];
		}
		else {
			categories = ["normal", "notable", "major"];
		}

		let newCategory = "";
		for (const category of categories) {
			const expectedXP = fallout.utils.calculateXpReward(level, category);
			if (currentXP === expectedXP) {
				newCategory = category;
				break;
			}
		}

		if (newCategory === "") {
			newCategory = "normal";
			ui.notifications.warn(
				game.i18n.format(
					"Failed to derive the category of level {level} {type} named '{name}' with an XP reward value of '{xp}'. Setting to category 'normal'",
					{
						level,
						type: actorData.type,
						name: actorData.name,
						xp: currentXP,
					}
				),
				{permanent: true}
			);
		}

		updateData["system.category"] = newCategory;

		return updateData;
	}

}
