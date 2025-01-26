import { FalloutUpdateBase } from "../FalloutUpdateBase.mjs";

export default class Update_250103_1 extends FalloutUpdateBase {

	static version = 250103.1;

	async updateItem(itemData, actorData) {

		if (itemData.type !== "weapon") return;

		const updateData = {};

		// Damage Effects
		for (const key in itemData.system.damage.damageEffect) {
			if (itemData.system.damage.damageEffect[key].value === false) {
				updateData[`system.damage.damageEffect.${key}.value`] = 0;
			}
		}

		// Weapon Qualities
		for (const key in itemData.system.damage.weaponQuality) {
			if (itemData.system.damage.weaponQuality[key].value === false) {
				updateData[`system.damage.weaponQuality.${key}.value`] = 0;
			}
		}

		updateData["system.mods.installedMods"] = "";

		return updateData;
	}
}
