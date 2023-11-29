import { hotbarDropHook } from "../hooks/hotbarDropHook.mjs";
import { preCreateItemHook } from "../hooks/preCreateItemHook.mjs";
import { readyHook } from "../hooks/readyHook.mjs";
import { renderChatMessageHook } from "../hooks/renderChatMessageHook.mjs";
import { renderActorSheetHook } from "../hooks/renderActorSheetHook.mjs";
import { renderItemSheetHook } from "../hooks/renderItemSheetHook.mjs";

export const FalloutHooks = {
	attach: () => {
		fallout.logger.debug("Attaching hooks");

		const listeners = [
			hotbarDropHook,
			preCreateItemHook,
			readyHook,
			renderActorSheetHook,
			renderChatMessageHook,
			renderItemSheetHook,
		];

		for (const listener of listeners) {
			listener.attach();
		}
	},
};
