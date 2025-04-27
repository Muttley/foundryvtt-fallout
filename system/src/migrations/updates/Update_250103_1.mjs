import { FalloutUpdateBase } from "../FalloutUpdateBase.mjs";

export default class Update_250103_1 extends FalloutUpdateBase {

	static version = 250103.1;

	async updateItem(itemData, actorData) {

		if (itemData.type !== "weapon") {
			return;
		}

		const updateData = {};

		// Damage Effects
		for (const key in itemData.system.damage?.damageEffect) {
			const value = itemData.system.damage?.damageEffect[key]?.value ?? false;

			if (Number.isInteger(value)) {
				continue;
			}

			const newValue = value === true ? 1 : 0;

			updateData[`system.damage.damageEffect.${key}.value`] = newValue;
		}

		// Weapon Qualities
		for (const key in itemData.system.damage?.weaponQuality) {
			const value = itemData.system.damage?.weaponQuality[key]?.value;

			if (Number.isInteger(value)) {
				continue;
			}

			const newValue = value === true ? 1 : 0;

			updateData[`system.damage.weaponQuality.${key}.value`] = newValue;
		}

		return updateData;
	}
}
