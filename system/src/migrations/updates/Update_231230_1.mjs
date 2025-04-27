import { FalloutUpdateBase } from "../FalloutUpdateBase.mjs";

export default class Update_231230_1 extends FalloutUpdateBase {

	static version = 231230.1;

	async updateItem(itemData, actorData) {
		if (itemData.type !== "consumable") {
			return;
		}

		let newAddictive = itemData.system.addictive !== ""
			? parseInt(itemData.system.addictive)
			: 0;

		if (isNaN(newAddictive)) {
			newAddictive = 0;

			let message;
			if (actorData) {
				message = game.i18n.format(
					"Failed to update addictive value '{value}' for Item '{itemName}' owned by Actor '{actorName}'. You will need to update this item manually.",
					{
						value: itemData.system.addictive,
						itemName: itemData.name,
						actorName: actorData.name,
					}
				);
			}
			else {
				message = game.i18n.format(
					"Failed to update addictive value '{value}' for Item '{itemName}'. You will need to update this item manually.",
					{
						value: itemData.system.addictive,
						itemName: itemData.name,
					}
				);
			}

			ui.notifications.warn(message, {permanent: true});
		}

		const updateData = {
			"system.addictive": newAddictive,
		};

		return updateData;
	}
}
