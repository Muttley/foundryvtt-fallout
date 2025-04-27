export const conditionTrackerHook = {
	attach: () => {
		fallout.debug("Condition Tracker: attaching updateWorldTime hook");
		const tracker = fallout.conditionTracker;

		Hooks.on("updateWorldTime", tracker.onUpdateWorldTime.bind(tracker));
	},
};
