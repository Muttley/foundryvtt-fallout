import { FalloutUpdateBase } from "../FalloutUpdateBase.mjs";

export default class Update_260111_1 extends FalloutUpdateBase {

	static version = 260111.1;

	async updateItem(itemData, actorData) {
		if (itemData.type !== "ammo") {
			return;
		}

		const updateData = {};

		updateData["system.charges.current"] =
			Number.isInteger(itemData?.system?.charges?.current ?? undefined)
				? itemData.system.charges.current
				: 0;

		updateData["system.charges.max"] =
			Number.isInteger(itemData?.system?.charges?.max ?? undefined)
				? itemData.system.charges.max
				: 0;

		updateData["system.shots.current"] =
			Number.isInteger(itemData?.system?.shots?.current ?? undefined)
				? itemData.system.shots.current
				: 1;

		updateData["system.shots.max"] =
			Number.isInteger(itemData?.system?.shots?.max ?? undefined)
				? itemData.system.shots.max
				: 1;

		return updateData;
	}

}
