import { FalloutUpdateBase } from "../FalloutUpdateBase.mjs";

export default class Update_240302_1 extends FalloutUpdateBase {

	static version = 240302.1;

	async updateActor(actorData) {
		if (actorData.type !== "character") return;

		const currentWorldTime = game.time.worldTime;

		const hunger = parseInt(actorData.system.conditions.hunger) ?? 0;
		const sleep = parseInt(actorData.system.conditions.sleep) ?? 0;
		const thirst = parseInt(actorData.system.conditions.thirst) ?? 0;

		const updateData = {
			"system.conditions.hunger": hunger,
			"system.conditions.lastChanged.hunger": currentWorldTime,
			"system.conditions.lastChanged.sleep": currentWorldTime,
			"system.conditions.lastChanged.thirst": currentWorldTime,
			"system.conditions.sleep": sleep,
			"system.conditions.thirst": thirst,
		};

		return updateData;
	}
}
