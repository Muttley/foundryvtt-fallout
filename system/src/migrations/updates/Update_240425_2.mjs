import { FalloutUpdateBase } from "../FalloutUpdateBase.mjs";

export default class Update_240425_2 extends FalloutUpdateBase {

	static version = 240425.2;

	async updateItem(itemData, actorData) {
		if (itemData.type !== "weapon") return;

		const updateData = {};

		if (itemData.system.creatureAttribute === "") {
			updateData["system.creatureAttribute"] =
				CONFIG.FALLOUT.DEFAULT_CREATURE_WEAPON_ATTRIBUTE[
					itemData.system.weaponType
				];
		}

		if (itemData.system.creatureSkill === "") {
			updateData["system.creatureSkill"] =
				CONFIG.FALLOUT.DEFAULT_CREATURE_WEAPON_SKILL[
					itemData.system.weaponType
				];
		}

		return updateData;
	}
}
