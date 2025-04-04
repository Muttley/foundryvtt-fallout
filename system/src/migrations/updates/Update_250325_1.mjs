import { FalloutUpdateBase } from "../FalloutUpdateBase.mjs";

export default class Update_250325_1 extends FalloutUpdateBase {

	static version = 250325.1;

	async updateItem(itemData, actorData) {

		const updateData = {};
		if (itemData.type !== "apparel_mod") {


			let modType = itemData.system.modType ?? "material";
			if (modType === "") {
				modType = "material";
			}

			updateData["system.modType"] = modType;


			let shadowed = itemData.system.shadowed ?? false;
			updateData["system.shadowed"] = shadowed;

			return updateData;

		}
		else if (itemData.type !== "apparel") {

			let shadowed = itemData.system.shadowed ?? false;
			updateData["system.shadowed"] = shadowed;

			return updateData;
		}

	}
}
