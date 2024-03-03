import { FalloutUpdateBase } from "../FalloutUpdateBase.mjs";

export default class Update_240302_1 extends FalloutUpdateBase {

	static version = 240302.1;

	async updateActor(actorData) {
		if (actorData.type !== "character") return;

		const currentWorldTime = game.time.worldTime;

		const updateData = {
			"system.conditions.lastChanged.hunger": currentWorldTime,
			"system.conditions.lastChanged.sleep": currentWorldTime,
			"system.conditions.lastChanged.thirst": currentWorldTime,
		};

		return updateData;
	}
}
