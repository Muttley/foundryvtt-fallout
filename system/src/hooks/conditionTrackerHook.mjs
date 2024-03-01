export const conditionTrackerHook = {
	attach: () => {
		fallout.logger.debug("Condition Tracker: attaching updateWorldTime hook");
		const tracker = fallout.conditionTracker;

		Hooks.on("updateWorldTime", tracker.onUpdateWorldTime.bind(tracker));
	},
};
