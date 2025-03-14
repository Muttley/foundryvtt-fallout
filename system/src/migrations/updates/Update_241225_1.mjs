import { FalloutUpdateBase } from "../FalloutUpdateBase.mjs";

export default class Update_241225_1 extends FalloutUpdateBase {

	static version = 241225.1;

	async updateItem(itemData, actorData) {
		if (itemData.type !== "weapon_mod") return;

		const effect = itemData.system.effect;
		const perks = itemData.system.perks;
		let tmpModType = itemData.system.modType;
		let modType = "";

		// Attempt to match mod type.
		if (tmpModType.toLowerCase() in CONFIG.FALLOUT.WEAPON_MOD_TYPES) {
			modType = tmpModType.toLowerCase();
		}
		else {
			tmpModType = tmpModType.toLowerCase().replace(" mod", "");
			if (tmpModType.toLowerCase() in CONFIG.FALLOUT.WEAPON_MOD_TYPES) {
				modType = tmpModType.toLowerCase();
			}
		}

		const updateData = {
			"system.crafting.perks": perks,
			"system.-=perks": null,
			"system.modEffects.effect": effect,
			"system.-=effect": null,
			"system.modType": modType,
			"system.-=canBeScrapped": null,
			"system.-=isJunk": null,
			"system.modEffects.damage.damageEffect.-=undefined": null,
		};

		return updateData;
	}
}
