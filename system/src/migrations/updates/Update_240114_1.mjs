import { FalloutUpdateBase } from "../FalloutUpdateBase.mjs";

export default class Update_240114_1 extends FalloutUpdateBase {

	static version = 240114.1;

	async updateActor(actorData) {
		if (actorData.type !== "settlement") {
			return;
		}

		const settlement = game.actors.find(a => a._id === "Sqm5Z8qgg9y8iXZk");

		for (const settler of actorData.system.settlers) {
			const actorUuid = settler.actorUuid;
			const action = settler.action ?? "unnasigned";

			// Make sure the actor exists
			const actor = await fromUuid(actorUuid);

			if (actor) {
				actor.update({
					"system.settlement.action": action,
					"system.settlement.uuid": settlement.uuid,
				});
			}
			else {
				game.i18n.format("FALLOUT.Actor.Warnings.NpcMissing", {
					uuid: settler.actorUuid,
					settlementName: settlement.name,
				});
			}
		}

		const updateData = {
			"system.-=settlers": null,
		};

		return updateData;
	}

}
