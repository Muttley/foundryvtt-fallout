export default class FalloutLoading extends Application {

	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ["fallout"],
			resizable: false,
			width: "auto",
		});
	}

	get template() {
		return "systems/fallout/templates/apps/loading.hbs";
	}

	get title() {
		return game.i18n.localize("FALLOUT.APP.Loading.title");
	}

	async close(options={}) {
		// Occasionally the loading dialog will try to close before it has fully
		// rendered.
		//
		// If this happens Foundry will not remove the window correctly, so we
		// make sure to only try and properly close the window once it has
		// finished rendering.
		//
		while (!this.rendered) {
			await fallout.utils.sleep(100); // millisecs
		}

		super.close(options);
	}
}
