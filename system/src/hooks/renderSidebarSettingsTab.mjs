export const renderSidebarSettingsTab = {
	attach: () => {
		fallout.debug("Attaching renderSidebarTab hook");

		Hooks.on("renderSidebarTab", async (object, html) => {
			fallout.debug("Running renderSidebarTab hook");

			if (object instanceof Settings) {
				const gameDetails = html.find("#game-details");

				const template = "systems/fallout/templates/ui/system-details.hbs";
				const rendered = await renderTemplate(template);

				gameDetails.find(".system").append(rendered);
			}
		});
	},
};
