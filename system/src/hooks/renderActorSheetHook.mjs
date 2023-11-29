export const renderActorSheetHook = {
	attach: () => {
		fallout.logger.debug("Attaching renderActorSheet hook");

		Hooks.on("renderActorSheet", (app, html, options) => {
			fallout.logger.debug("Running renderActorSheet hook");

			html.find(".hover").each(function(i) {
				const title = fallout.FalloutHovers.LIST[$(this).data("key")];
				$(this).prop("title", title);
			});
		});
	},
};
