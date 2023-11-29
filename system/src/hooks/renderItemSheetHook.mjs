export const renderItemSheetHook = {
	attach: () => {
		fallout.logger.debug("Attaching renderItemSheet hook");

		Hooks.on("renderItemSheet", (app, html, options) => {
			fallout.logger.debug("Running renderItemSheet hook");

			html.find(".hover").each(function(i) {
				const title = fallout.FOHovers.LIST[$(this).data("key")];
				$(this).prop("title", title);
			});
		});
	},
};
