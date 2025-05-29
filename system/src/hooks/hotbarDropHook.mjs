import { createItemMacro } from "../system/FalloutMacros.mjs";

export const hotbarDropHook = {
	attach: () => {
		fallout.debug("Attaching hotbarDrop hook");

		Hooks.on("hotbarDrop", (bar, data, slot) => {
			fallout.debug("Running hotbarDrop hook");

			if (data.type === "Item") {
				createItemMacro(data, slot);
				return false;
			}
		});
	},
};
