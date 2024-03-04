import { FalloutUpdateBase } from "../FalloutUpdateBase.mjs";

export default class Update_240217_3 extends FalloutUpdateBase {

	static version = 240217.3;

	async updateItem(itemData, actorData) {
		if (itemData.type !== "weapon") return;

		const updateData = {};

		for (const key in itemData.system.damage.damageEffect) {
			const value = itemData.system.damage.damageEffect[key].value;
			let rank =  itemData.system.damage.damageEffect[key].rank;
			rank = rank >= 0 ? rank : 0;

			switch (key) {
				case "piercing":
					updateData[`system.damage.damageEffect.-=${key}`] = null;
					updateData["system.damage.damageEffect.piercing_x"] = {
						rank,
						value,
					};
					break;
				default:
					updateData[`system.damage.damageEffect.${key}.-=description`] = null;
					updateData[`system.damage.damageEffect.${key}.-=hasRanks`] = null;
					updateData[`system.damage.damageEffect.${key}.-=label`] = null;
			}
		}

		return updateData;
	}
}
