import { FalloutUpdateBase } from "../FalloutUpdateBase.mjs";

export default class Update_250501_1 extends FalloutUpdateBase {

	static version = 250501.1;

	async updateItem(itemData, actorData) {
		if (itemData.type !== "weapon") {
			return;
		}

		const weaponQualities = itemData.system?.damage?.weaponQuality ?? {};
		const isGatling = weaponQualities.gatling?.value > 0;

		if (!isGatling) {
			return;
		}

		const updateData = {
			"system.ammoPerShot": 10,
		};

		return updateData;
	}

}
