import FalloutMigrationRunner from "../migrations/FalloutMigrationRunner";

export const readyHook = {
	attach: () => {
		fallout.logger.debug("Attaching ready hook");

		Hooks.once("ready", async () => {
			fallout.logger.debug("Running ready hook");

			if (game.user.isGM) {
				await new FalloutMigrationRunner().run();
			}

			fallout.APTracker.initialise();
			fallout.FalloutHovers.loadList();
		});
	},
};
