import { FalloutUpdateBase } from "../FalloutUpdateBase.mjs";

export default class Update_241212_1 extends FalloutUpdateBase {

	static version = 241212.1;

	async updateItem(itemData, actorData) {
		if (itemData.type !== "perk") {
			return;
		}

		// Nothing needs doing
		if (itemData.system.requirements === "") {
			return;
		}

		const legacyRequirements =
			`\n<p><strong>Requirements</strong>: ${itemData.system.requirements}</p>`;

		const newDescription = itemData.system.description + legacyRequirements;

		const updateData = {
			"system.description": newDescription,
			"system.requirements": "",
		};

		return updateData;
	}
}
