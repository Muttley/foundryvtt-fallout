import {
	discoverAvailableAmmoTypes,
	generateEnrichedTooltips,
} from "../config.mjs";

export const setupHook = {
	attach: () => {
		Hooks.once("setup", () => {

			fallout.moduleArt.registerModuleArt();

			// Go through the CONFIG object and attempt to localize any Strings
			// up front
			for (const obj in CONFIG.FALLOUT) {
				if ({}.hasOwnProperty.call(CONFIG.FALLOUT, obj)) {
					for (const el in CONFIG.FALLOUT[obj]) {
						if ({}.hasOwnProperty.call(CONFIG.FALLOUT[obj], el)) {
							if (typeof CONFIG.FALLOUT[obj][el] === "string") {
								CONFIG.FALLOUT[obj][el] = game.i18n.localize(
									CONFIG.FALLOUT[obj][el]
								);
							}
						}
					}
				}
			}

			generateEnrichedTooltips();
			discoverAvailableAmmoTypes();
		});
	},
};
