import { hotbarDropHook } from "../hooks/hotbarDropHook.mjs";
import { initiativeHooks } from "../hooks/initiativeHooks.mjs";
import { preCreateItemHook } from "../hooks/preCreateItemHook.mjs";
import { readyHook } from "../hooks/readyHook.mjs";
import { renderActorSheetHook } from "../hooks/renderActorSheetHook.mjs";
import { renderChatMessageHook } from "../hooks/renderChatMessageHook.mjs";
import { renderItemSheetHook } from "../hooks/renderItemSheetHook.mjs";

export const FalloutHooks = {
	attach: () => {
		fallout.logger.debug("Attaching hooks");

		const listeners = [
			hotbarDropHook,
			initiativeHooks,
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
