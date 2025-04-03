import { FalloutUpdateBase } from "../FalloutUpdateBase.mjs";

export default class Update_240217_4 extends FalloutUpdateBase {

	static version = 240217.4;

	async updateItem(itemData, actorData) {
		if (itemData.type !== "weapon") {
			return;
		}

		const badQualities = [
			"arc",
			"breaking",
			"burst",
			"freeze",
			"persistent",
			"piercing_x",
			"radioactive",
			"spread",
			"stun",
			"vicious",
		];

		const updateData = {};

		for (const key of badQualities) {
			updateData[`system.damage.weaponQuality.-=${key}`] = null;
		}

		return updateData;
	}
}
