import { FalloutUpdateBase } from "../FalloutUpdateBase.mjs";

export default class Update_240425_1 extends FalloutUpdateBase {

	static version = 240425.1;

	async updateItem(itemData, actorData) {
		if (itemData.type !== "weapon") return;
		if (itemData.system.weaponType !== "creatureAttack") return;

		const updateData = {
			"system.attribute": "",
			"system.creatureAttribute": itemData.system.attribute,
			"system.creatureSkill": itemData.system.skill,
			"system.skill": "",
			"system.weaponType": "",
		};

		return updateData;
	}
}
