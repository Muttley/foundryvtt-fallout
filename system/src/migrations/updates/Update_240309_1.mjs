import { FalloutUpdateBase } from "../FalloutUpdateBase.mjs";

export default class Update_240309_1 extends FalloutUpdateBase {

	static version = 240309.1;

	async updateItem(itemData, actorData) {
		if (itemData.type !== "weapon") {
			return;
		}
		if (itemData.system.ammo === "") {
			return;
		}

		const ammo = await fallout.compendiums.ammo();

		const ammoUuid = ammo.find(
			a => a.name === itemData.system.ammo
		)?.uuid ?? "";

		if (ammoUuid === "") {
			const updateData = {};

			const suffix = `is configured with ammo type '${itemData.system.ammo}' which doesn't exist within a compendium.`;

			let message;
			if (actorData) {
				message = `Weapon '${itemData.name}' belonging to '${actorData.name}' ${suffix}`;
			}
			else {
				message = `Weapon '${itemData.name}' ${suffix}`;
			}

			ui.notifications.warn(message, {permanent: true});

			updateData["system.ammo"] = "";

			return updateData;
		}
	}
}
