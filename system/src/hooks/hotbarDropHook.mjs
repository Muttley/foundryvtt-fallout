import { createItemMacro } from "../system/FalloutMacros.mjs";

export const hotbarDropHook = {
	attach: () => {
		fallout.debug("Attaching hotbarDrop hook");

		Hooks.on("hotbarDrop", async (bar, data, slot) => {
			fallout.debug("Running hotbarDrop hook");

			if (data.type === "Item") {
				return await createItemMacro(data, slot);
			}
		});
	},
};
