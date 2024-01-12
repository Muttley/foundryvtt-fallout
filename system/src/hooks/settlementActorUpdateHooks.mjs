import FalloutActor from "../documents/FalloutActor.mjs";

export const settlementActorUpdateHooks = {

	attach: () => {
		fallout.logger.debug("Attaching settlementActorUpdateHooks hook");

		Hooks.on("deleteActor", async (actor, options, userId) => {
			fallout.logger.debug("Running settlementActorUpdateHooks::deleteActor hook");

			FalloutActor.updateLinkedSettlementSheets(actor, options, userId);
		});

		Hooks.on("updateActor", async (actor, options, userId) => {
			fallout.logger.debug("Running settlementActorUpdateHooks::deleteActor hook");

			FalloutActor.updateLinkedSettlementSheets(actor, options, userId);
		});
	},
};
