import { FalloutUpdateBase } from "../FalloutUpdateBase.mjs";

export default class Update_250430_1 extends FalloutUpdateBase {

	static version = 250430.1;

	async updateItem(itemData, actorData) {
		if (itemData.type !== "ammo") {
			return;
		}

		const updateData = {
			"system.-=multishot": null,
		};

		if (itemData.name.match(/fusion\s+core/i)) {
			updateData["system.fusionCore"] = true;

			if (actorData) {
				const skill = actorData.items.find(
					item => item.type === "skill" && item.name.match(/science/i)
				);

				if (skill) {
					const science = skill.system.value;

					updateData["system.charges.max"] = 10 + science;
					updateData["system.shots.max"] = (10 + science) * 50;
					updateData["system.charges.current"] = Math.ceil(
						itemData.system.shots.current / 50
					);
				}
			}
		}

		return updateData;
	}

}
