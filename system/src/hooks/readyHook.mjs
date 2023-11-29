export const readyHook = {
	attach: () => {
		fallout.logger.debug("Attaching ready hook");

		Hooks.once("ready", () => {
			fallout.logger.debug("Running ready hook");

			// Load tooltips
			//
			fallout.logger.debug("Loading tooltips");
			fallout.FalloutHovers.loadList();

			// Initialise the AP Tracker
			//
			fallout.logger.debug("Initialising APTracker");

			if (fallout.APTracker._instance) return;

			new APTracker();

			fallout.APTracker.renderApTracker();
			fallout.APTracker.registerSocketEvents();
		});
	},
};
