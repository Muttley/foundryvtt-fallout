import FalloutActor from "../documents/FalloutActor.mjs";

export const settlementActorUpdateHooks = {

	attach: () => {
		fallout.debug("Attaching settlementActorUpdateHooks hook");

		Hooks.on("deleteActor", async (actor, options, userId) => {
			fallout.debug("Running settlementActorUpdateHooks::deleteActor hook");

			FalloutActor.updateLinkedSettlementSheets(actor, options, userId);
		});
	},
};
