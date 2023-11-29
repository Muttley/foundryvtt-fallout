import { createItemMacro } from "../system/FalloutMacros.mjs";

export const hotbarDropHook = {
	attach: () => {
		game.fallout.logger.debug("Hook Attach: hotbarDrop");

		Hooks.on("hotbarDrop", async (bar, data, slot) => {
			game.fallout.logger.debug("Hook Running: hotbarDrop");

			if (data.type === "Item") {
				return await createItemMacro(data, slot);
			}
		});
	},
};
