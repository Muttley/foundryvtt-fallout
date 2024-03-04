import { FalloutUpdateBase } from "../FalloutUpdateBase.mjs";

export default class Update_240217_2 extends FalloutUpdateBase {

	static version = 240217.2;

	async updateItem(itemData, actorData) {
		if (itemData.type !== "weapon") return;

		const updateData = {};

		for (const key in itemData.system.damage.weaponQuality) {
			const value = itemData.system.damage.weaponQuality[key].value;

			switch (key) {
				case "closeQuarters":
					updateData[`system.damage.weaponQuality.-=${key}`] = null;
					updateData["system.damage.weaponQuality.close_quarters"] = {
						value,
					};
					break;
				case "nightVision":
					updateData[`system.damage.weaponQuality.-=${key}`] = null;
					updateData["system.damage.weaponQuality.night_vision"] = {
						value,
					};
					break;
				case "twoHanded":
					updateData[`system.damage.weaponQuality.-=${key}`] = null;
					updateData["system.damage.weaponQuality.two_handed"] = {
						value,
					};
					break;
			}
		}

		return updateData;
	}
}
