import { FalloutUpdateBase } from "../FalloutUpdateBase.mjs";

export default class Update_240217_1 extends FalloutUpdateBase {

	static version = 240217.1;

	async updateItem(itemData, actorData) {
		if (itemData.type !== "weapon") return;

		const updateData = {};

		for (const key in itemData.system.damage.weaponQuality) {
			updateData[`system.damage.weaponQuality.${key}.-=description`] = null;
			updateData[`system.damage.weaponQuality.${key}.-=label`] = null;
		}

		return updateData;
	}
}
