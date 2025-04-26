import { FalloutUpdateBase } from "../FalloutUpdateBase.mjs";

export default class Update_250426_1 extends FalloutUpdateBase {

	static version = 250426.1;

	async updateItem(itemData, actorData) {
		// Only attempt to upgrade Perk items owned by Actors
		if (itemData.type !== "perk" || !actorData) {
			return;
		}

		const allPerks = await fallout.compendiums.perks(false);

		// see if we can find compendium version of perk with the same name
		const newPerk = allPerks.find(perk => perk.name === itemData.name);

		const updateData = {};

		if (newPerk) {
			updateData["system.requirementsEx"] = newPerk.system.requirementsEx;
		}
		else {
			ui.notifications.warn(
				`Failed to update Perk '${itemData.name}' belonging to Actor '${actorData.name}'. Unable find appropriate Perk in compendium; this Perk's requirements will need to be updated manually.`,
				{ permanent: true }
			);
		}

		return updateData;
	}

}
