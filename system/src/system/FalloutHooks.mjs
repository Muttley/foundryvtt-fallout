import { renderChatMessageHook } from "../hooks/renderChatMessageHook.mjs";
import { preCreateItemHook } from "../hooks/preCreateItemHook.mjs";
import { hotbarDropHook } from "../hooks/readyHook.mjs";

export const FalloutHooks = {
	attach: () => {
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
