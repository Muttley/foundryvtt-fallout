import { FalloutUpdateBase } from "../FalloutUpdateBase.mjs";

export default class Update_240104_1 extends FalloutUpdateBase {

	static version = 240104.1;

	async updateItem(itemData, actorData) {
		if (itemData.type !== "weapon") return;

		const updateData = {};

		for (const key in CONFIG.FALLOUT.DAMAGE_EFFECTS) {
			updateData[`system.damage.damageEffect.${key}.-=description`] = null;
			updateData[`system.damage.damageEffect.${key}.-=label`] = null;
		}

		return updateData;
	}
}
