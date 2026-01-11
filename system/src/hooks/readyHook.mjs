import FalloutMigrationRunner from "../migrations/FalloutMigrationRunner.mjs";

export const readyHook = {
	attach: () => {
		fallout.debug("Attaching ready hook");

		Hooks.once("ready", async () => {
			fallout.debug("Running ready hook");

			if (game.user.isGM) {
				await new FalloutMigrationRunner().run();
			}

			fallout.APTrackerV2.initialise();
			fallout.utils.showNewReleaseNotes();
		});
	},
};
