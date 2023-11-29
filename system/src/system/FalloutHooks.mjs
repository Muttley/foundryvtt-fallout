import { renderChatMessageHook } from "../hooks/renderChatMessageHook.mjs";
import { preCreateItemHook } from "../hooks/preCreateItemHook.mjs";
import { hotbarDropHook } from "../hooks/hotbarDropHook.mjs";

export const FalloutHooks = {
	attach: () => {
		fallout.logger.debug("Attaching hooks");

		const listeners = [
			preCreateItemHook,
			hotbarDropHook,
			renderChatMessageHook,
		];

		for (const listener of listeners) {
			listener.attach();
		}
	},
};
