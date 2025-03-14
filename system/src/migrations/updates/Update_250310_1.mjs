import { FalloutUpdateBase } from "../FalloutUpdateBase.mjs";

export default class Update_250310_1 extends FalloutUpdateBase {

	static version = 250310.1;

	async updateItem(itemData, actorData) {
		if (itemData.type === "weapon_mod") {
			const perks = itemData?.system?.crafting?.perks ?? undefined;

			if (perks) {
				const updateData = {
					"system.perks": perks,
					"system.-=crafting": null,
				};

				return updateData;
			}
		}
		else if (itemData.type === "weapon") {
			const weapon_mods = itemData?.system?.mods ?? {};
			const updateData = {};

			Object.entries(weapon_mods).forEach(([key, mod]) => {
				if (mod && mod.hasOwnProperty("_id")) {
					const perks = mod?.system?.crafting?.perks;
					updateData[`system.mods.${mod._id}.system.perks`] = perks ?? "";
					updateData[`system.mods.${mod._id}.system.-=crafting`] = null;
				}
			});

			return updateData;
		}
	}
}
