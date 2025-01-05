import { FalloutUpdateBase } from "../FalloutUpdateBase.mjs";

export default class Update_250103_1 extends FalloutUpdateBase {

	static version = 250103.1;

	async updateItem(itemData, actorData) {
		if (itemData.type !== "weapon") return;


		const updateData = {
			// "system.crafting.perks": perks,
			// "system.-=perks": null,
			// "system.modEffects.effect": effect,
			// "system.-=effect": null,
			// "system.modType": modType,
			// "system.-=canBeScrapped": null,
			// "system.-=isJunk": null,
		};

		return updateData;
	}
}
