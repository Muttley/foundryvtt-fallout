import { APTracker } from "../ap/ap-tracker.mjs";

export const readyHook = {
	attach: () => {
		fallout.logger.debug("Attaching ready hook");

		Hooks.once("ready", () => {
			fallout.logger.debug("Running ready hook");

			// Load tooltips
			//
			fallout.logger.debug("Loading tooltips");
			fallout.FOHovers.loadList();

			// Initialise the AP Tracker
			//
			fallout.logger.debug("Initialising APTracker");

			if (APTracker._instance) return;

			new APTracker();

			APTracker.renderApTracker();
			APTracker.registerSocketEvents();
		});
	},
};
